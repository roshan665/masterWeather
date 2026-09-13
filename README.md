# PanchayatMausam AI (पंचायत मौसम AI)

> **Hyperlocal Agrometeorological & Crop-Risk Decision Support System for Gram Panchayats in Phanda Block, Bhopal, Madhya Pradesh.**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/Frontend-React_19_|_Vite-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_5.5-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python)](https://python.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)

---

## 🌾 Overview

**PanchayatMausam AI** is a decision-support and agromet forecasting platform designed to deliver hyper-localized, actionable, and scientifically grounded agricultural advisories to smallholder farmers and agricultural extension officers across five Gram Panchayats in **Phanda block**, Bhopal district, Madhya Pradesh:
- **Acharpura (आचारपुरा)**
- **Bangrasia (बंगरसिया)**
- **Ratibad (रातीबड़)**
- **Samasgarh (समसगढ़)**
- **Sukhi Sewaniya (सूखी सेवनिया)**

Supporting three staple regional crops—**Soybean (सोयाबीन)**, **Wheat (गेहूं)**, and **Chickpea (चना)**—the platform combines Numerical Weather Prediction (NWP), Machine Learning forecasting, and an agronomic rule-based crop-risk engine verified by **ICAR-IISR Indore**, **KVK CIAE Bhopal**, and **JNKVV Jabalpur**.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 📱 **Mobile-First Farmer Experience** | Native-feeling responsive UI with Hindi-first bilingual support, audio TTS advisory playback, GPS auto-panchayat locator, and crop growth stage tracking. |
| 🛡️ **Agricultural Officer Command Center** | Interactive GIS Panchayat risk map, multi-station weather comparison matrix, observation review queue, and broadcast emergency alert composer. |
| 🤖 **Multi-Model ML Forecasting** | 5-model benchmark hierarchy (*Historical DOY Baseline*, *Persistence*, *Ridge Linear*, *Random Forest*, *Gradient Boosting*) with strict chronological 70/15/15 train/val/test splits and 90% confidence prediction intervals. |
| ⚡ **Rule-Based Crop-Risk Engine** | Translates weather variables, multi-day horizon decay, and weather event duration ($\ge 48\text{h}$) into composite 0–100 risk scores with 100% rule provenance. |
| 📚 **Advisory Knowledge Base** | Configurable administrative rulebook allowing agronomists to author, review, approve, and version agricultural triggers without code changes. |
| 🌐 **Automated Weather Pipeline** | Real-time Open-Meteo ingestion with SHA-256 duplicate suppression, physical bounds validation, and provisional gridded estimates. |
| 🔬 **Research Analytics Lab** | Model comparison tables (MAE, RMSE, $R^2$, F1), empirical confusion matrices, lead-time horizon decay curves, spatial error decomposition, and ablation studies. |
| 🔐 **Role-Based Access Control** | Pre-configured authentication roles (`farmer`, `officer`, `admin`, `researcher`) with fine-grained route and action permissions. |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PanchayatMausam AI Platform                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────────┐                         ┌───────────────────────┐
│   React 19 + TypeScript   │ ◄─── REST APIs / JSON ─►│    FastAPI Backend    │
│  (Tailwind v4, Recharts)  │                         │ (Python 3.11, Uvicorn)│
└───────────────────────────┘                         └───────────────────────┘
            │                                                     │
    ┌───────┴───────┐                                     ┌───────┴───────┐
    ▼               ▼                                     ▼               ▼
┌────────┐    ┌───────────┐                         ┌───────────┐   ┌─────────┐
│ Farmer │    │  Officer  │                         │ ML Models │   │ PostGIS │
│ Mobile │    │ Dashboard │                         │ & Risk Eng│   │/ SQLite │
└────────┘    └───────────┘                         └───────────┘   └─────────┘
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Python**: `v3.11.x` or higher
- **Git**: `v2.x`

### 1. Clone the Repository
```bash
git clone https://github.com/roshan665/masterWeather.git
cd masterWeather
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize and seed database
python seed.py --force

# Start FastAPI dev server
python run.py
```
*Backend runs on: `http://localhost:8000` (API docs: `http://localhost:8000/api/v1/docs`)*

### 3. Frontend Setup
In a new terminal window:
```bash
# In the root directory:
npm install

# Start Vite development server
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 🐳 Docker Deployment

Run the complete full-stack environment (PostgreSQL/PostGIS, FastAPI, Nginx React) with one command:

```bash
docker compose up --build -d
```

| Service | URL | Container Name |
| :--- | :--- | :--- |
| **Frontend Application** | `http://localhost` | `panchayatmausam-frontend` |
| **FastAPI REST API** | `http://localhost:8000` | `panchayatmausam-backend` |
| **API Swagger Documentation** | `http://localhost:8000/api/v1/docs` | `panchayatmausam-backend` |
| **PostgreSQL / PostGIS DB** | `localhost:5432` | `panchayatmausam-db` |

---

## 🔑 Pre-Configured Demo Accounts

| Role | Username | Password | Default Home | Key Permissions |
| :--- | :--- | :--- | :--- | :--- |
| 🧑‍🌾 **Farmer** | `farmer` | `farmer123` | `/` | View weather, risks, TTS advisories, log observations, submit feedback |
| 👮 **Agri Officer** | `officer` | `officer123` | `/officer` | Map command center, approve advisories, verify observations, broadcast alerts |
| ⚙️ **Administrator** | `admin` | `admin123` | `/admin` | Knowledge base rule approval, user management, telemetry audit |
| 🔬 **Researcher** | `researcher` | `researcher123` | `/research` | Model benchmarks, confusion matrices, ablation lab, ET₀ simulator |

---

## 📖 Technical Documentation Suite

| Document | Description |
| :--- | :--- |
| 📋 [**SRS.md**](./SRS.md) | Software Requirements Specification, functional/non-functional constraints, and user personas. |
| 🏛️ [**architecture.md**](./architecture.md) | In-depth architectural blueprint, C4 diagrams, data ingestion lifecycle, and ML pipeline. |
| 🔌 [**api.md**](./api.md) | Comprehensive REST API specification with 12 modules, request schemas, and examples. |
| 🗄️ [**database.md**](./database.md) | Relational database schema, ER diagrams, PostGIS geospatial tables, indices, and migrations. |
| 🚀 [**deployment.md**](./deployment.md) | Production deployment guide for Docker Compose, Render, VPS, Kubernetes, and SSL. |
| 📜 [**advisory-rules.md**](./advisory-rules.md) | Agronomic Knowledge Base rulebook, verified ICAR/KVK thresholds, and mathematical schemas. |
| 🧪 [**testing.md**](./testing.md) | Testing framework, unit/integration suites, ML validation tests, and test execution commands. |

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
