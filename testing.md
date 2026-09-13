# PanchayatMausam AI — Testing Guide & Quality Assurance

Comprehensive testing guide for **PanchayatMausam AI (पंचायत मौसम AI)**, covering automated testing, machine learning model validation, data quality assertion, crop-risk rule verification, and end-to-end integration tests.

---

## 1. Testing Strategy & Architecture

PanchayatMausam AI uses a multi-layered testing pyramid designed for agrometeorological reliability:

```
                  ┌──────────────────────┐
                  │   End-to-End Tests   │  (Playwright / Cypress SPA flows)
                  ├──────────────────────┤
                  │   API & DB Tests     │  (FastAPI TestClient + PostGIS SQLite/Postgres)
                  ├──────────────────────┤
                  │  Crop-Risk Engine    │  (7 Agronomic Scenario Stress Tests)
                  ├──────────────────────┤
                  │ ML Pipeline & Metric │  (MAE/RMSE/R² Assertion & No-Leakage Verification)
                  ├──────────────────────┤
                  │ Data Pipeline QA     │  (Outlier, Duplicate & Missing Value Flags)
                  ├──────────────────────┤
                  │ Unit Tests / Linting │  (TypeScript TSC, Pytest, Pydantic, ESLint)
                  └──────────────────────┘
```

---

## 2. Test Suites Overview

| Suite | File Location | Scope | Execution Command |
|---|---|---|---|
| **Crop Risk Engine** | `backend/test_risk_scenarios.py` | Validates ICAR/KVK rule triggers, severity ranking & explanations | `pytest backend/test_risk_scenarios.py` |
| **Backend Unit & API** | `backend/tests/` | Pydantic validation, Auth JWT, PostGIS endpoints, Ingestion API | `pytest backend/tests/` |
| **ML Model Evaluation** | `backend/app/ml/evaluate.py` | Baseline comparisons, no-leakage verification, metric thresholds | `python -m app.ml.evaluate` |
| **Database Verification** | `backend/seed.py --check` | Validates table counts, foreign keys, and seed integrity | `python backend/seed.py --check` |
| **Frontend TypeScript Build**| `src/` | Type safety, zero unresolved symbols, Vite build | `npm run build` |

---

## 3. Running Backend Tests

### 3.1 Prerequisites & Virtual Environment

Ensure your Python virtual environment is activated:

```bash
# Windows PowerShell
.\backend\.venv\Scripts\Activate.ps1

# Linux / macOS
source backend/venv/bin/activate
```

Install test dependencies:

```bash
pip install pytest pytest-asyncio pytest-cov httpx
```

### 3.2 Running the Crop-Risk Scenario Engine

The crop-risk suite validates all 7 ICAR-IISR and KVK Bhopal rules across diverse weather anomalies (heavy rain during harvesting, dry spells during flowering, high humidity during pod development):

```bash
cd backend
python test_risk_scenarios.py
```

Expected output:
```text
============================================================
PANCHAYAT MAUSAM AI - CROP RISK ENGINE TEST SUITE
============================================================

[TEST 1] Soybean (Flowering Stage) + 12-day Dry Spell (Rain=0.0mm, MaxT=36.5°C)
 -> Matched Rule: RULE-SOY-002
 -> Severity: HIGH (Score: 78.0/100)
 -> PASS: Successfully flagged Moisture Stress during reproductive stage.

[TEST 2] Soybean (Maturity/Harvesting) + Heavy Rainfall (Rain=72.0mm)
 -> Matched Rule: RULE-SOY-003
 -> Severity: CRITICAL (Score: 92.0/100)
 -> PASS: Triggered harvest postponement & water drainage advisory.

[TEST 3] Wheat (Crown Root Initiation) + Extreme Heat Wave (MaxT=34.0°C)
 -> Matched Rule: RULE-WHT-001
 -> Severity: HIGH (Score: 75.0/100)
 -> PASS: Triggered light irrigation recommendation.

[TEST 4] Chickpea (Vegetative/Podding) + Overcast & High Humidity (RH=88%, Rain=5mm)
 -> Matched Rule: RULE-CHK-001
 -> Severity: MEDIUM (Score: 65.0/100)
 -> PASS: Triggered Ascochyta Blight & Pod Borer alert.

------------------------------------------------------------
SUMMARY: 7/7 Scenarios Passed (100% Accuracy)
============================================================
```

### 3.3 Running Pytest with Coverage

To run the entire automated backend test suite with code coverage:

```bash
cd backend
pytest -v --cov=app --cov-report=term-missing
```

---

## 4. Machine Learning Model Validation

The ML validation suite enforces critical agrometeorological constraints:
1. **Temporal Train/Validation/Test Split**: Enforces zero future-data leakage (Test period: `2024-01-01` to `2024-12-31`).
2. **Benchmark Superiority**: Random Forest & Linear Regression models must beat the Historical Average & Persistence baselines on MAE/RMSE.
3. **Panchayat Generalization**: Validates error metrics across all 5 Gram Panchayats.

### Running ML Model Evaluation

```bash
cd backend
python -m app.ml.evaluate
```

Sample Benchmark Matrix Assertions:

```text
Evaluating models across 5 weather targets...

Target: max_temp (°C)
  - Historical Baseline : MAE = 2.45°C, RMSE = 3.12°C, R² = 0.58
  - Persistence Baseline: MAE = 2.18°C, RMSE = 2.89°C, R² = 0.64
  - Linear Regression   : MAE = 1.62°C, RMSE = 2.11°C, R² = 0.81
  - Random Forest Reg   : MAE = 1.34°C, RMSE = 1.78°C, R² = 0.87 (SELECTED)

Target: rainfall (mm)
  - Persistence Baseline: MAE = 4.82mm, Precision = 0.54, Recall = 0.51
  - Random Forest Reg   : MAE = 2.15mm, Precision = 0.82, Recall = 0.79 (SELECTED)

Model Evaluation Successful. Metrics written to model_registry.
```

---

## 5. Weather Data Quality & Pipeline Testing

The automated weather ingestion pipeline (`backend/app/services/weather_ingest_service.py`) tests and validates data quality flags on every incoming record:

### Quality Checks Executed

1. **Range & Outlier Bounds Check**:
   - `temperature`: $-5.0\text{°C} \le T \le 55.0\text{°C}$
   - `relative_humidity`: $0\% \le RH \le 100\%$
   - `rainfall`: $0.0\text{mm} \le R \le 500.0\text{mm}$
   - `wind_speed`: $0.0\text{ km/h} \le W \le 180.0\text{ km/h}$
2. **Missing Value Imputation Check**:
   - Flag `MISSING_ESTIMATED` if variable interpolated from neighboring panchayat grid.
3. **Duplicate Timestamp Prevention**:
   - Enforces unique constraint on `(panchayat_id, timestamp, source)`.

### Testing Pipeline Ingestion Manually

Execute an on-demand trigger to test API ingestion:

```bash
curl -X POST "http://localhost:8000/api/v1/weather/fetch-latest?panchayat_id=1" \
     -H "Authorization: Bearer <OFFICER_JWT_TOKEN>"
```

Response verification:
```json
{
  "status": "success",
  "records_ingested": 24,
  "data_quality_summary": {
    "valid_records": 24,
    "outliers_detected": 0,
    "interpolated": 0
  }
}
```

---

## 6. Database Health & Seed Verification

Verify that all tables, foreign keys, PostGIS coordinates, and pre-populated research datasets exist and are valid:

```bash
cd backend
python seed.py --check
```

Sample output:
```text
Connecting to: sqlite+aiosqlite:///./panchayat_mausam.db
============================================================
DATABASE HEALTH AND SEED CHECK
============================================================
[PASS] panchayats           : 5 rows
[PASS] crops                : 3 rows
[PASS] crop_stages          : 20 rows
[PASS] users                : 4 rows
[PASS] weather_observations : 10 rows
[PASS] advisory_rules       : 7 rows
[PASS] advisories           : 1 rows
[PASS] ml_model_registry    : 25 rows
[PASS] weather_alerts       : 1 rows
------------------------------------------------------------
TOTAL RECORDS FOUND: 76
STATUS: ALL TABLES HEALTHY AND POPULATED
============================================================
```

---

## 7. Frontend Quality Assurance & Type Checking

Ensure that the React + TypeScript frontend compiles cleanly with 0 type errors, missing modules, or broken imports:

```bash
# In the root project directory:
npm run build
```

Expected output:
```text
> panchayat-mausam-ai@1.0.0 build
> vite build

vite v6.2.0 building for production...
transforming...
✓ 189 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.42 kB │ gzip:  0.68 kB
dist/assets/index-D8gH_31d.css   26.45 kB │ gzip:  5.12 kB
dist/assets/index-Bf6_Kx1a.js   342.18 kB │ gzip: 98.44 kB
✓ built in 480ms
```

---

## 8. Continuous Integration (GitHub Actions)

The CI workflow in `.github/workflows/ci.yml` runs on every push and pull request to `main`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  frontend-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build

  backend-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: |
          python -m pip install --upgrade pip
          pip install -r backend/requirements.txt
          pip install pytest httpx
      - run: |
          cd backend
          python seed.py
          python seed.py --check
          python test_risk_scenarios.py
```

---

## 9. Troubleshooting & Debugging

| Symptom | Probable Cause | Fix |
|---|---|---|
| `ModuleNotFoundError: No module named 'app'` | Python path not set to `backend` directory | Run commands with `PYTHONPATH=.` or from inside `backend/` |
| `sqlite3.OperationalError: no such table` | Database has not been seeded | Run `python backend/seed.py` |
| `PostGIS ST_GeomFromText not found` | SQLite lacks SpatiaLite extension | The system gracefully falls back to JSON float lat/lng in SQLite mode. In production, use PostgreSQL + PostGIS |
| `Vite build fails on missing Lucide icons` | Missing npm dependency | Run `npm install` |

---

*For detailed architectural explanations, consult [architecture.md](file:///d:/msi/PanchayatMausam%20AI/architecture.md). For rule verification guidelines, see [advisory-rules.md](file:///d:/msi/PanchayatMausam%20AI/advisory-rules.md).*
