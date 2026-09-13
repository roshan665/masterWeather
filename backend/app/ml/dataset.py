import math
import datetime
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any, List

# Phanda block coordinates & elevation metadata
PHANDA_PANCHAYAT_METADATA = [
    {"id": "panchayat_acharpura", "name": "Acharpura", "lat": 23.3333, "lon": 77.3417, "elevation_m": 512.0, "soil_type": "deep_black"},
    {"id": "panchayat_bangrasia", "name": "Bangrasia", "lat": 23.1610, "lon": 77.4920, "elevation_m": 498.0, "soil_type": "medium_black"},
    {"id": "panchayat_ratibad", "name": "Ratibad", "lat": 23.1840, "lon": 77.3110, "elevation_m": 505.0, "soil_type": "medium_black"},
    {"id": "panchayat_samasgarh", "name": "Samasgarh", "lat": 23.2120, "lon": 77.2650, "elevation_m": 520.0, "soil_type": "gravelly_clay"},
    {"id": "panchayat_sukhi_sewaniya", "name": "Sukhi Sewaniya", "lat": 23.3240, "lon": 77.4720, "elevation_m": 502.0, "soil_type": "deep_black"},
]

def generate_phanda_historical_timeseries(
    start_date: str = "2024-09-15",
    days: int = 730,
    seed: int = 42
) -> pd.DataFrame:
    """
    Generates realistic daily time-series records for the 5 Phanda Panchayats
    covering multiple Kharif (monsoon) and Rabi (winter) seasons.
    """
    np.random.seed(seed)
    base_dt = datetime.datetime.strptime(start_date, "%Y-%m-%d")
    records = []

    for day_idx in range(days):
        curr_dt = base_dt + datetime.timedelta(days=day_idx)
        doy = curr_dt.timetuple().tm_yday
        month = curr_dt.month

        # Monsoon Seasonality in Bhopal (June-September: DOY 152 to 273)
        is_monsoon = 6 <= month <= 9
        is_winter = month in (11, 12, 1, 2)
        is_summer = 3 <= month <= 5

        # Base temperature curves
        if is_summer:
            base_tmax = 38.0 + 4.0 * math.sin((doy - 60) * math.pi / 90)
            base_tmin = 24.0 + 3.0 * math.sin((doy - 60) * math.pi / 90)
            base_rh = 32.0 + 8.0 * np.random.randn()
            rain_prob = 0.05
        elif is_monsoon:
            base_tmax = 30.5 + 2.5 * math.sin((doy - 150) * math.pi / 120)
            base_tmin = 23.0 + 1.5 * math.sin((doy - 150) * math.pi / 120)
            base_rh = 78.0 + 10.0 * np.random.randn()
            rain_prob = 0.65
        else: # Winter / post-monsoon
            base_tmax = 27.0 - 5.0 * math.sin((doy - 300) * math.pi / 90)
            base_tmin = 13.0 - 5.0 * math.sin((doy - 300) * math.pi / 90)
            base_rh = 55.0 + 10.0 * np.random.randn()
            rain_prob = 0.08

        # Generate per-panchayat daily readings with local spatial variability
        for p in PHANDA_PANCHAYAT_METADATA:
            p_id = p["id"]
            # Spatial elevation / coordinate perturbation
            elev_offset = (p["elevation_m"] - 505.0) * -0.0065  # Lapse rate ~0.65°C / 100m
            lat_offset = (p["lat"] - 23.25) * 0.5
            
            tmax = base_tmax + elev_offset + lat_offset + np.random.normal(0, 1.2)
            tmin = base_tmin + elev_offset + lat_offset + np.random.normal(0, 1.0)
            if tmin > tmax - 2.0:
                tmin = tmax - 2.5
            
            rh = np.clip(base_rh + np.random.normal(0, 4.0), 15.0, 98.0)
            
            # Rainfall (gamma distribution for monsoon events)
            if np.random.rand() < rain_prob:
                rain_amount = np.random.gamma(shape=1.8, scale=7.5) if is_monsoon else np.random.gamma(shape=1.1, scale=3.0)
                rain_amount = round(float(rain_amount), 1)
            else:
                rain_amount = 0.0

            wind_speed = np.clip(8.0 + (5.0 if is_monsoon else 2.0) + np.random.normal(0, 2.5), 1.0, 45.0)
            wind_dir = (260.0 + np.random.normal(0, 25.0)) % 360.0 if is_monsoon else (45.0 + np.random.normal(0, 30.0)) % 360.0
            pressure = np.clip(1013.0 - (p["elevation_m"] / 8.3) + np.random.normal(0, 1.5), 940.0, 975.0)

            records.append({
                "date": curr_dt.strftime("%Y-%m-%d"),
                "doy": doy,
                "month": month,
                "year": curr_dt.year,
                "panchayat_id": p_id,
                "panchayat_name": p["name"],
                "latitude": p["lat"],
                "longitude": p["lon"],
                "elevation_m": p["elevation_m"],
                "temp_max_c": round(float(tmax), 1),
                "temp_min_c": round(float(tmin), 1),
                "humidity_pct": round(float(rh), 1),
                "rainfall_mm": float(rain_amount),
                "wind_speed_kmh": round(float(wind_speed), 1),
                "wind_direction_deg": round(float(wind_dir), 1),
                "pressure_hpa": round(float(pressure), 1),
            })

    df = pd.DataFrame(records)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(by=["date", "panchayat_id"]).reset_index(drop=True)
    return df


def split_timeseries_chronologically(
    df: pd.DataFrame,
    train_ratio: float = 0.70,
    val_ratio: float = 0.15
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Strictly splits time-series dataset chronologically to prevent any future data leakage.
    Train: [t_0 ... t_train]
    Val:   [t_train+1 ... t_val]
    Test:  [t_val+1 ... t_end]
    """
    unique_dates = np.sort(df["date"].unique())
    n_dates = len(unique_dates)
    
    n_train = int(n_dates * train_ratio)
    n_val = int(n_dates * val_ratio)
    
    train_dates = set(unique_dates[:n_train])
    val_dates = set(unique_dates[n_train:n_train + n_val])
    test_dates = set(unique_dates[n_train + n_val:])
    
    train_df = df[df["date"].isin(train_dates)].copy().reset_index(drop=True)
    val_df = df[df["date"].isin(val_dates)].copy().reset_index(drop=True)
    test_df = df[df["date"].isin(test_dates)].copy().reset_index(drop=True)

    # Verification: Assert no overlap
    assert max(train_df["date"]) < min(val_df["date"]), "Data leakage detected: Train and Val overlap!"
    assert max(val_df["date"]) < min(test_df["date"]), "Data leakage detected: Val and Test overlap!"

    return train_df, val_df, test_df
