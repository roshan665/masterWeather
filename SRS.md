# Software Requirements Specification (SRS)

## PanchayatMausam AI (पंचायत मौसम AI)
### Hyperlocal Agrometeorological & Crop-Risk Decision Support System
**Version**: 1.0.0  
**Target Geographic Scope**: Phanda Block, Bhopal District, Madhya Pradesh, India (Acharpura, Bangrasia, Ratibad, Samasgarh, Sukhi Sewaniya)  
**Target Crops**: Soybean (*Glycine max*), Wheat (*Triticum aestivum*), Chickpea (*Cicer arietinum*)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document details the functional and non-functional requirements for the **PanchayatMausam AI** platform. It provides a formal contract for system developers, agricultural extension officers, agronomists, data scientists, and administrative stakeholders.

### 1.2 Scope
PanchayatMausam AI bridges the critical last-mile gap between high-level Numerical Weather Prediction (NWP) models and village-level agricultural field decisions. The system ingests public weather data, processes multi-target machine learning forecasts, assesses stage-specific crop vulnerabilities, manages bilingual agricultural advisories, and facilitates two-way ground-truth validation between farmers and extension officers.

### 1.3 Definitions, Acronyms, and Abbreviations
- **AWS**: Automatic Weather Station
- **BBF**: Broad-Bed Furrow (drainage methodology for Vertisols)
- **CRI**: Crown Root Initiation (critical phenological stage in wheat)
- **DAS**: Days After Sowing
- **$ET_0$**: Reference Crop Evapotranspiration (mm/day)
- **GDD**: Growing Degree Days (°C-day)
- **GP**: Gram Panchayat
- **ICAR**: Indian Council of Agricultural Research
- **IISR**: Indian Institute of Soybean Research (Indore, MP)
- **KVK**: Krishi Vigyan Kendra (Bhopal, MP)
- **JNKVV**: Jawaharlal Nehru Krishi Vishwavidyalaya (Jabalpur, MP)
- **MAE**: Mean Absolute Error
- **NWP**: Numerical Weather Prediction
- **RH**: Relative Humidity (%)
- **RMSE**: Root Mean Squared Error
- **THI**: Temperature-Humidity Index
- **TTS**: Text-to-Speech

---

## 2. User Personas & Roles

```
┌─────────────────┐   ┌──────────────────────┐   ┌───────────────────┐   ┌──────────────────────┐
│  1. Farmer      │   │  2. Agri Officer     │   │  3. Administrator │   │  4. Research Sci.    │
│  (किसान)        │   │  (कृषि अधिकारी)      │   │  (प्रशासक)        │   │  (शोधकर्ता)          │
├─────────────────┤   ├──────────────────────┤   ├───────────────────┤   ├──────────────────────┤
│ • Hindi-First   │   │ • GIS Map View       │   │ • Rule Approval   │   │ • Model Benchmarks   │
│ • Audio TTS     │   │ • Weather Matrix     │   │ • User Roles      │   │ • Error Decay Curves │
│ • Sowing Tracker│   │ • Alert Composer     │   │ • Audit Logs      │   │ • Ablation Studies   │
│ • Simple Badges │   │ • Obs Review Queue   │   │ • System Settings │   │ • ET₀ / GDD Sandbox  │
└─────────────────┘   └──────────────────────┘   └───────────────────┘   └──────────────────────┘
```

### Persona 1: Smallholder Farmer (कमलेश पाटीदार, आचारपुरा)
- **Profile**: Manages 3.5 acres of deep Vertisol land primarily cultivating soybean (Kharif) and wheat/chickpea (Rabi).
- **Needs**: Voice-guided weather outlook in Hindi, simple color-coded risk alerts, actionable cultural advice (no complex chemical jargon), spray feasibility indicators.

### Persona 2: Block Agricultural Extension Officer (डॉ. नीहा देशमुख, भोपाल)
- **Profile**: Senior extension officer overseeing 5 Gram Panchayats in Phanda block.
- **Needs**: Multi-village comparison dashboard, observation verification workflow, emergency broadcast alert composer, advisory approval authority.

### Persona 3: System Administrator (प्रशासक)
- **Profile**: Manages system security, Knowledge Base rules lifecycle, user onboarding, and telemetry pipeline health.
- **Needs**: Rule authoring/versioning UI, role permissions editor, audit trail inspector.

### Persona 4: Agricultural Meteorologist / Data Scientist (डॉ. आर. के. शर्मा, JNKVV)
- **Profile**: Researches microclimatic weather prediction and crop phenology models.
- **Needs**: Side-by-side ML benchmark tables (MAE, RMSE, $R^2$, F1), empirical confusion matrices, feature ablation attribution, data-quality telemetry.

---

## 3. Functional Requirements (FR)

### Module 1: Hyperlocal Weather Ingestion & Telemetry (FR-WTH)
- **FR-WTH-01**: The system shall ingest public weather forecast data from Open-Meteo for the 5 Phanda Gram Panchayat coordinates at hourly intervals.
- **FR-WTH-02**: The system shall compute SHA-256 cryptographic payload hashes to prevent duplicate ingestion records.
- **FR-WTH-03**: The system shall execute physical bounds validation ($ -10^\circ\text{C} \le \text{Temp} \le 55^\circ\text{C}$, $0 \le \text{RH} \le 100\%$, $\text{Wind} \le 150\text{ km/h}$) and flag sensor spikes.
- **FR-WTH-04**: The system shall explicitly tag all Open-Meteo predictions as `provisional_gridded_estimate` until in-situ AWS station calibration.
- **FR-WTH-05**: The system shall calculate reference evapotranspiration ($ET_0$) using the FAO-56 Penman-Monteith equation and Growing Degree Days (GDD).

### Module 2: Machine Learning Forecasting Pipeline (FR-ML)
- **FR-ML-01**: The system shall train and benchmark 5 forecasting models (*Historical Average DOY Baseline*, *Persistence Baseline*, *Ridge Linear Regression*, *Random Forest*, *Gradient Boosting*) across 5 targets: Rainfall, Max Temp, Min Temp, Relative Humidity, Wind Speed.
- **FR-ML-02**: Training shall enforce a strict chronological 70% Train / 15% Validation / 15% Test split with zero future-data leakage.
- **FR-ML-03**: The system shall compute and persist continuous error metrics (MAE, RMSE, $R^2$) and risk classification metrics (Precision, Recall, Macro F1) on the test set.
- **FR-ML-04**: The system shall automatically select the algorithm with the lowest validation MAE as the active `is_active_champion` per target variable.
- **FR-ML-05**: Multi-day forecast endpoints shall serve 90% empirical confidence prediction intervals $[lower_{90}, upper_{90}]$ based on test residual standard deviations.

### Module 3: Rule-Based Crop-Risk Engine (FR-RSK)
- **FR-RSK-01**: The system shall evaluate crop-specific risk using 6 mandatory inputs: Forecast Variables, `crop_id`, `stage_id`, Forecast Horizon (days), Confidence Rating (%), and Event Duration (hours).
- **FR-RSK-02**: The engine shall dynamically load active approved rules from the database (`AdvisoryRuleModel`) and parse JSON threshold conditions (`>`, `<`, `>=`, `<=`, `==`, `between`).
- **FR-RSK-03**: Sustained adverse conditions shall apply a Duration Multiplier: $1.12\times$ for $\ge 36\text{h}$, $1.25\times$ for $\ge 48\text{h}$, and $1.35\times$ for $\ge 72\text{h}$.
- **FR-RSK-04**: Lead-time horizon decay shall apply a confidence discount factor from $1.0\times$ (Day 1) down to $0.65\times$ (Day 7).
- **FR-RSK-05**: Output shall deliver a 0–100 composite risk score, severity tier (`normal`, `advisory`, `warning`, `critical`), bilingual scientific explanations, and approved cultural management recommendations.

### Module 4: Advisory Knowledge Base Lifecycle (FR-KB)
- **FR-KB-01**: The system shall provide full CRUD workflows for advisory rules with state transitions: `draft` $\rightarrow$ `pending_review` $\rightarrow$ `approved` $\rightarrow$ `published` (or `rejected`).
- **FR-KB-02**: Each rule shall maintain an immutable JSON version history capturing author, reviewer, review notes, and modification timestamp.
- **FR-KB-03**: Advisory rules must cite official source authorities (ICAR-IISR, KVK Bhopal, JNKVV Jabalpur) and published bulletin reference codes.

### Module 5: Officer Command Center & Alert Dispatch (FR-OFF)
- **FR-OFF-01**: The officer portal shall render an interactive Leaflet GIS map displaying the 5 Panchayat polygons color-coded by current composite risk level.
- **FR-OFF-02**: The portal shall provide a cross-panchayat weather comparison matrix highlighting maximum temperature, 24h rain accumulation, and sensor freshness.
- **FR-OFF-03**: Agricultural officers shall have an observation review queue to verify or reject field reports submitted by farmers.
- **FR-OFF-04**: Officers shall possess authority to compose and broadcast priority emergency alerts targeting specific Panchayats and crops.

### Module 6: Research Analytics Module (FR-RES)
- **FR-RES-01**: The research lab shall present a side-by-side model comparison matrix across all targets and benchmark algorithms.
- **FR-RES-02**: The system shall display empirical 2x2 confusion matrices for rain occurrence ($\ge 2.5\text{ mm}$), heavy waterlogging ($\ge 15.0\text{ mm}$), and thermal stress ($\ge 35.0^\circ\text{C}$).
- **FR-RES-03**: The module shall provide lead-time horizon error decay curves (Day 1 to Day 7) and spatial error breakdowns per Panchayat.
- **FR-RES-04**: The system shall display controlled feature ablation benchmarks and research roadmap experiment placeholders.
- **FR-RES-05**: Every research metric shall display an explicit provenance badge: 🟢 **Real Measured**, 🟡 **Demonstration/Mock**, or 🟣 **Future Placeholder**.

---

## 4. Non-Functional Requirements (NFR)

### 4.1 Performance & Latency
- **NFR-PERF-01**: REST API response times for cached weather and risk assessments shall not exceed 150 ms under 100 concurrent requests.
- **NFR-PERF-02**: The rule-based crop-risk evaluation endpoint (`POST /api/v1/risks/evaluate`) shall return evaluation results in under 50 ms.
- **NFR-PERF-03**: The React client bundle size shall remain under 350 KB gzipped.

### 4.2 Accessibility & Usability
- **NFR-ACC-01**: Mobile views must be fully responsive down to 320px screen width.
- **NFR-ACC-02**: The user interface shall provide complete Hindi and English parity.
- **NFR-ACC-03**: Text-to-Speech audio reader must synthesize speech with native browser Web Speech API with fallback support.

### 4.3 Reliability & Fault Tolerance
- **NFR-REL-01**: If upstream weather API ingestion fails, the backend shall automatically serve the latest cached telemetry with a freshness flag.
- **NFR-REL-02**: If the live FastAPI backend is offline, the frontend shall seamlessly fall back to local mock data without crashing.

### 4.4 Security & Privacy
- **NFR-SEC-01**: Passwords must be hashed using `bcrypt` (work factor $\ge 12$).
- **NFR-SEC-02**: Authentication tokens must use signed JWTs (`HS256`) with configurable expiration.
- **NFR-SEC-03**: Role-based access control must be enforced at both UI route gates and backend API dependency resolvers.
