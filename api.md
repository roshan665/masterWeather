# REST API Specification

## PanchayatMausam AI (पंचायत मौसम AI)
### Base URL: `http://localhost:8000/api/v1` (or `https://<your-host>/api/v1`)
**Interactive Swagger Docs**: `/api/v1/docs`  
**ReDoc Reference**: `/api/v1/redoc`  
**OpenAPI JSON**: `/api/v1/openapi.json`

---

## 1. Authentication & Security

All protected endpoints require a Bearer token in the `Authorization` header:
```http
Authorization: Bearer <access_token>
```

### 1.1 `POST /auth/login`
Authenticates user with username and password.

#### Request Body
```json
{
  "username": "officer",
  "password": "officer123"
}
```

#### Response (`200 OK`)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "usr_officer_01",
    "username": "officer",
    "role": "officer",
    "name_en": "Dr. Neha Deshmukh",
    "name_hi": "डॉ. नीहा देशमुख",
    "assigned_panchayats": ["panchayat_acharpura", "panchayat_bangrasia", "panchayat_ratibad", "panchayat_samasgarh", "panchayat_sukhi_sewaniya"]
  }
}
```

### 1.2 `POST /auth/demo-login`
Instant single-click demo login without credentials for field demonstrations.

---

## 2. Panchayats & Geospatial

### 2.1 `GET /panchayats`
Returns all 5 Gram Panchayats in Phanda block.

#### Response (`200 OK`)
```json
{
  "total": 5,
  "items": [
    {
      "id": "panchayat_acharpura",
      "name_en": "Acharpura",
      "name_hi": "आचारपुरा",
      "block": "Phanda",
      "district": "Bhopal",
      "state": "Madhya Pradesh",
      "latitude": 23.3685,
      "longitude": 77.3712,
      "elevation_m": 512.0,
      "weather_station_id": "AWS-BPL-ACH-01",
      "soil_type_en": "Deep Vertisol Clay",
      "soil_type_hi": "गहरी काली मटियार मिट्टी"
    }
  ]
}
```

### 2.2 `GET /panchayats/boundaries/geojson`
Returns GeoJSON FeatureCollection containing polygons of the 5 Gram Panchayats.

---

## 3. Crops & Phenology

### 3.1 `GET /crops`
Returns supported crops (Soybean, Wheat, Chickpea) with growth stages, calendar windows, and primary sensitivity factors.

### 3.2 `POST /crops/calculate-sowing-stage`
Calculates active growth stage based on sowing date and crop ID.

#### Request Body
```json
{
  "crop_id": "soybean",
  "sowing_date": "2026-07-01"
}
```

#### Response (`200 OK`)
```json
{
  "crop_id": "soybean",
  "sowing_date": "2026-07-01",
  "days_after_sowing": 74,
  "current_stage": {
    "stage_id": "soy_pod_dev",
    "name_en": "Pod Development",
    "name_hi": "फली विकास",
    "water_sensitivity": "high",
    "thermal_sensitivity": "moderate"
  },
  "progress_pct": 77.9,
  "estimated_harvest_date": "2026-10-04"
}
```

---

## 4. Hyperlocal Weather & Ingestion Pipeline

### 4.1 `GET /weather/current?panchayatId=panchayat_acharpura`
Returns current live weather telemetry, feels-like, leaf wetness, $ET_0$, and freshness timestamp.

### 4.2 `POST /weather/pipeline/ingest`
Manually triggers Open-Meteo ingestion and quality validation.

#### Request Body
```json
{
  "panchayat_id": "panchayat_acharpura",
  "force_refresh": true,
  "dry_run": false
}
```

### 4.3 `GET /weather/pipeline/quality-report`
Returns data quality report (duplicate suppression, physical bounds flags, missing values).

---

## 5. Machine Learning Forecasting

### 5.1 `POST /ml/train`
Executes multi-model benchmark training across 5 targets using strict chronological 70/15/15 split.

#### Request Body
```json
{
  "version_tag": "v1.0.0",
  "force_retrain": false
}
```

### 5.2 `GET /ml/compare?version=v1.0.0`
Returns side-by-side model comparison matrix (MAE, RMSE, $R^2$, F1) identifying the active champion per target.

### 5.3 `GET /ml/forecast?panchayatId=panchayat_acharpura`
Returns 7-day ML weather predictions with 90% empirical prediction intervals $[lower_{90}, upper_{90}]$.

---

## 6. Rule-Based Crop-Risk Engine

### 6.1 `POST /api/v1/risks/evaluate`
Evaluates custom meteorological parameters against Knowledge Base rules.

#### Request Body
```json
{
  "crop_id": "soybean",
  "stage_id": "soy_germination",
  "forecast_horizon_days": 2,
  "confidence_score": 88.0,
  "event_duration_hours": 48.0,
  "forecast_variables": {
    "rainfall_mm": 65.0,
    "temp_max_c": 30.0,
    "temp_min_c": 23.0,
    "relative_humidity_pct": 88.0,
    "wind_speed_kmh": 12.0,
    "soil_moisture_pct": 78.0,
    "consecutive_wet_days": 3
  }
}
```

#### Response (`200 OK`)
```json
{
  "crop_id": "soybean",
  "crop_name_en": "Soybean (सोयाबीन)",
  "crop_name_hi": "सोयाबीन (Soybean)",
  "stage_id": "soy_germination",
  "stage_name_en": "Germination & Emergence",
  "stage_name_hi": "अंकुरण व फैलाव",
  "composite_risk_score": 81,
  "severity": "critical",
  "severity_label_en": "Severe Emergency Risk",
  "severity_label_hi": "अति गंभीर जोखिम (आपातकालीन)",
  "primary_risk_category": "excess_water",
  "explanation_en": "Severe waterlogging risk causing seedling collar rot and root asphyxiation. (Trigger: rainfall (65.0) >= 50; soil_moisture (78.0) >= 70). Event duration: 48h.",
  "explanation_hi": "अत्यधिक जलभराव से बीज सड़न व अंकुरण नष्ट होने का गंभीर संकट। (ट्रिगर: 50 मिमी से अधिक भारी वर्षा से भारी काली मिट्टी में जलभराव।)। घटना अवधि: 48 घंटे।",
  "recommended_action_en": "1. Open broad-bed furrows (BBF) or field boundary drainage trenches immediately.\n2. Ensure standing water is evacuated within 12-24 hours.\n3. Avoid heavy tractor movement in saturated soil.",
  "recommended_action_hi": "1. खेत की मेड़ों व नालियों को खोलकर तुरंत जल निकासी सुनिश्चित करें।\n2. 12-24 घंटे के भीतर खड़े पानी को बाहर निकालें।\n3. गीली मिट्टी में भारी कृषि यंत्र न चलाएं।",
  "rule_code": "RULE-SOY-RAIN-002",
  "rule_version": "v1.3",
  "source_organization_en": "ICAR - Indian Institute of Soybean Research (IISR), Indore",
  "source_reference": "ICAR-IISR Technical Bulletin #54 (Vertisol Drainage Best Practices)",
  "sub_risks": [
    {
      "category_id": "excess_water",
      "category_name_en": "Excess Moisture / Drainage",
      "score": 100,
      "severity": "critical",
      "is_triggered": true,
      "trigger_summary_en": "Triggered by RULE-SOY-RAIN-002: rainfall (65.0) >= 50; soil_moisture (78.0) >= 70"
    }
  ]
}
```

---

## 7. Advisory Knowledge Base Management

### 7.1 `GET /rules`
Query advisory rules with optional filters (`cropId`, `stageId`, `status`).

### 7.2 `POST /rules` (Admin/Officer Only)
Creates a new draft advisory rule with JSON threshold conditions.

### 7.3 `POST /rules/{id}/review` (Admin/Officer Only)
Approves or rejects an advisory rule.

---

## 8. Research Analytics Dashboard

### 8.1 `GET /analytics/research?version=v1.0.0`
Returns full research payload including model comparison table, confusion matrices, horizon decay curves, Panchayat spatial error decomposition, ablation studies, and data-quality telemetry.
