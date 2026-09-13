# Production Deployment Guide

## PanchayatMausam AI (पंचायत मौसम AI)
### Multi-Environment Deployment (Docker, Docker Compose, Render, VPS & Kubernetes)

---

## 1. Prerequisites & Environment Matrix

| Requirement | Minimum | Recommended |
| :--- | :--- | :--- |
| **CPU** | 2 vCPUs | 4 vCPUs |
| **RAM** | 2 GB | 4 GB |
| **Storage** | 20 GB SSD | 50 GB NVMe |
| **OS** | Ubuntu 22.04 LTS / Debian 12 / Alpine | Ubuntu 24.04 LTS |
| **Docker** | Docker 24.0+ | Docker 26.0+ |
| **Compose** | Docker Compose v2.20+ | Docker Compose v2.27+ |

---

## 2. Option A: Docker Compose Deployment (Recommended for On-Prem / VPS)

Deploy the entire full-stack application (PostgreSQL + PostGIS, FastAPI Backend, React Nginx Frontend) on any Linux VPS or server.

### Step 1: Clone Repository
```bash
git clone https://github.com/roshan665/masterWeather.git
cd masterWeather
```

### Step 2: Configure Environment Variables
Copy and customize `.env.example`:
```bash
cp .env.example .env
nano .env
```
Ensure you generate a strong secret key:
```bash
# Generate secure SECRET_KEY
openssl rand -hex 32
```

### Step 3: Launch Containers
```bash
docker compose up --build -d
```

### Step 4: Verify Health & Service Status
```bash
docker compose ps
docker compose logs -f backend
```

Access points:
- **Web Application**: `http://<your-server-ip>`
- **FastAPI REST API**: `http://<your-server-ip>:8000/api/v1`
- **Interactive Swagger Docs**: `http://<your-server-ip>:8000/api/v1/docs`

---

## 3. Option B: Render Cloud Deployment

Render offers managed hosting with zero-config TLS/SSL certificates and automatic branch synchronization.

### 3.1 1-Click Blueprint Instance (Fastest)
1. Go to [dashboard.render.com](https://dashboard.render.com/) $\rightarrow$ Click **New +** $\rightarrow$ **Blueprint**.
2. Connect `https://github.com/roshan665/masterWeather.git`.
3. Render reads [`render.yaml`](./render.yaml) and automatically creates:
   - **`panchayatmausam-backend`**: Python 3.11 Web Service running `python run.py`.
   - **`panchayatmausam-frontend`**: Static Site publishing `dist` with SPA rewrite rules.
4. Click **Apply**.

### 3.2 Manual Render Setup
If creating services manually:
- **Backend (Web Service)**:
  - Root Dir: `backend` | Runtime: `Python 3`
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `python run.py`
  - Environment: `ENVIRONMENT=production`, `PORT=8000`, `CORS_ORIGINS=*`, `SECRET_KEY=<generate>`
- **Frontend (Static Site)**:
  - Root Dir: `.` | Build Command: `npm install && npm run build`
  - Publish Directory: `dist`
  - Rewrites: `/*` $\rightarrow$ `/index.html` (Rewrite)
  - Environment: `VITE_API_BASE_URL=https://<backend-service>.onrender.com/api/v1`, `VITE_USE_BACKEND_API=true`

---

## 4. Option C: Bare-Metal Linux VPS Deployment (Systemd + Nginx + SSL)

### 4.1 Backend Systemd Service (`/etc/systemd/system/panchayatmausam.service`)
```ini
[Unit]
Description=PanchayatMausam AI FastAPI Backend
After=network.target postgresql.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/masterWeather/backend
Environment="PATH=/var/www/masterWeather/backend/.venv/bin"
EnvironmentFile=/var/www/masterWeather/.env
ExecStart=/var/www/masterWeather/backend/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4

Restart=always
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now panchayatmausam
```

### 4.2 Nginx Reverse Proxy Configuration (`/etc/nginx/sites-available/panchayatmausam`)
```nginx
server {
    listen 80;
    server_name weather.example.com;

    # Frontend Static Assets
    root /var/www/masterWeather/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;

    # SPA Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Gateway Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4.3 Free SSL Certificate via Let's Encrypt (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d weather.example.com
```

---

## 5. Adding New Weather Data Sources & Sensors

To add a new AWS physical station or external API provider:
1. Open [`backend/app/services/weather_ingestion_service.py`](./backend/app/services/weather_ingestion_service.py).
2. Register the new station identifier and coordinate in `PHANDA_PANCHAYAT_COORDINATES`:
   ```python
   "panchayat_custom_gp": {
       "name": "Custom GP",
       "lat": 23.2500,
       "lon": 77.4000,
       "grid_id": "GRID-PHANDA-23.25-77.40"
   }
   ```
3. In [`backend/app/db/seeds.py`](./backend/app/db/seeds.py), add the corresponding row to `PanchayatModel`.
4. Run `python seed.py` to sync the database.

---

## 6. Backup & Disaster Recovery

### Automated Database Backup Cron
```bash
# Backup PostgreSQL daily at 02:00 UTC
0 2 * * * pg_dump -U postgres panchayatmausam | gzip > /var/backups/panchayatmausam_$(date +\%Y\%m\%d).sql.gz
```

### Restore Database
```bash
gunzip < /var/backups/panchayatmausam_20260913.sql.gz | psql -U postgres -d panchayatmausam
```
