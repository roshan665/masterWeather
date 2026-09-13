import datetime
from typing import Dict, Any, List, Tuple, Optional

class WeatherDataQualityValidator:
    """
    Validates meteorological readings against physical bounds, temporal consistency,
    rate-of-change outlier thresholds, and data completeness.
    """

    # Physical Climatological & Meteorological Bounds for Central India (Malwa/Bhopal region)
    PHYSICAL_BOUNDS = {
        "temp_c": (-5.0, 52.0),                # Extreme min/max recorded in MP
        "temp_max_c": (-5.0, 55.0),
        "temp_min_c": (-5.0, 45.0),
        "humidity_pct": (0.0, 100.0),
        "dew_point_c": (-15.0, 35.0),
        "rainfall_mm": (0.0, 300.0),           # Max daily/hourly extreme
        "rainfall_rate_mm_hr": (0.0, 200.0),
        "wind_speed_kmh": (0.0, 150.0),        # Max squall/gale speed
        "wind_gusts_kmh": (0.0, 180.0),
        "wind_direction_deg": (0.0, 360.0),
        "pressure_hpa": (900.0, 1060.0),       # Elevation ~500m MSL in Bhopal
        "solar_radiation_wm2": (0.0, 1350.0),
        "et0_mm_day": (0.0, 20.0),
        "soil_moisture_0_7cm_pct": (0.0, 100.0),
        "soil_temp_0cm_c": (-5.0, 65.0),
    }

    # Hourly rate-of-change spike thresholds
    RATE_OF_CHANGE_THRESHOLDS = {
        "temp_c": 9.0,          # >9°C change in 1 hour is suspect
        "pressure_hpa": 12.0,   # >12 hPa change in 1 hour is suspect
        "humidity_pct": 50.0,   # >50% RH swing in 1 hour
    }

    @classmethod
    def validate_timestamp(cls, ts: Any) -> Tuple[bool, Optional[datetime.datetime], str]:
        """
        Validates ISO-8601 timestamp string or datetime object.
        """
        if isinstance(ts, datetime.datetime):
            dt = ts
        elif isinstance(ts, str):
            try:
                # Handle ISO formats
                clean_ts = ts.replace("Z", "+00:00")
                dt = datetime.datetime.fromisoformat(clean_ts)
            except Exception as e:
                return False, None, f"Invalid timestamp format: {ts} ({str(e)})"
        else:
            return False, None, f"Unsupported timestamp type: {type(ts)}"

        # Validate reasonable time horizon (between year 2020 and 2030)
        if dt.year < 2020 or dt.year > 2030:
            return False, dt, f"Timestamp year {dt.year} outside valid operational envelope [2020-2030]"

        return True, dt, "Timestamp valid"

    @classmethod
    def validate_record(
        cls,
        record_data: Dict[str, Any],
        prev_record: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Performs full validation on a normalized weather record.
        Returns validation metadata, quality score, flags, and outlier flags.
        """
        flags: List[str] = ["PROVISIONAL_GRIDDED"]
        outlier_notes: List[str] = []
        is_outlier = False
        is_valid = True
        quality_score = 100.0
        missing_fields: List[str] = []

        # 1. Bounds Validation
        for param, (min_val, max_val) in cls.PHYSICAL_BOUNDS.items():
            val = record_data.get(param)
            if val is not None:
                try:
                    num_val = float(val)
                    if num_val < min_val or num_val > max_val:
                        is_outlier = True
                        is_valid = False
                        flags.append(f"OUT_OF_BOUNDS_{param.upper()}")
                        outlier_notes.append(f"{param}={num_val} outside physical bounds [{min_val}, {max_val}]")
                        quality_score -= 25.0
                except (ValueError, TypeError):
                    is_valid = False
                    flags.append(f"TYPE_ERROR_{param.upper()}")
                    quality_score -= 10.0

        # 2. Key Required Fields Completeness Check
        required_params = ["temp_c", "humidity_pct", "wind_speed_kmh", "rainfall_mm"]
        for req in required_params:
            if record_data.get(req) is None:
                missing_fields.append(req)
                quality_score -= 10.0

        if missing_fields:
            flags.append("MISSING_KEY_PARAMETERS")
            outlier_notes.append(f"Missing parameters: {', '.join(missing_fields)}")

        # 3. Rate-of-Change Spike Check against previous consecutive record
        if prev_record and not is_outlier:
            for param, max_delta in cls.RATE_OF_CHANGE_THRESHOLDS.items():
                curr_val = record_data.get(param)
                prev_val = prev_record.get(param)
                if curr_val is not None and prev_val is not None:
                    try:
                        delta = abs(float(curr_val) - float(prev_val))
                        if delta > max_delta:
                            is_outlier = True
                            flags.append(f"SUSPECT_SPIKE_{param.upper()}")
                            outlier_notes.append(f"{param} delta of {delta:.1f} exceeds threshold {max_delta}")
                            quality_score -= 15.0
                    except (ValueError, TypeError):
                        pass

        # 4. Consistency Checks (e.g. Min Temp <= Max Temp, Dew Point <= Temp)
        temp_min = record_data.get("temp_min_c")
        temp_max = record_data.get("temp_max_c")
        if temp_min is not None and temp_max is not None:
            if float(temp_min) > float(temp_max):
                is_valid = False
                flags.append("INCONSISTENT_TEMP_MIN_MAX")
                outlier_notes.append(f"temp_min ({temp_min}) > temp_max ({temp_max})")
                quality_score -= 20.0

        temp = record_data.get("temp_c")
        dew_point = record_data.get("dew_point_c")
        if temp is not None and dew_point is not None:
            if float(dew_point) > float(temp) + 1.5:  # Tolerance margin
                flags.append("SUSPECT_DEW_POINT")
                outlier_notes.append(f"dew_point ({dew_point}) > ambient temp ({temp})")
                quality_score -= 10.0

        # Quality score clamping
        final_score = max(0.0, min(100.0, quality_score))

        if is_valid and not is_outlier and not missing_fields:
            flags.insert(0, "VALID")

        return {
            "is_valid": is_valid,
            "is_outlier": is_outlier,
            "quality_score_pct": round(final_score, 1),
            "data_quality_flags": ",".join(flags),
            "validation_notes": "; ".join(outlier_notes) if outlier_notes else "Passed all bounds and consistency checks.",
            "missing_fields": missing_fields,
        }
