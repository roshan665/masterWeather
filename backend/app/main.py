from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import engine, Base, SessionLocal
from .api.v1.router import api_v1_router
from .db.seeds import seed_database_if_empty
from .services.weather_scheduler import WeatherPipelineScheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    # Seed initial mock data if empty
    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()
    
    # Start background weather ingestion scheduler
    await WeatherPipelineScheduler.start()
    yield
    # Stop scheduler gracefully on shutdown
    await WeatherPipelineScheduler.stop()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="FastAPI Backend for PanchayatMausam AI (पंचायत मौसम AI) — Agricultural agromet & crop-risk decision support system for Phanda block, Bhopal, Madhya Pradesh.",
    lifespan=lifespan,
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 routes
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": "connected",
        "block": "Phanda (Bhopal, MP)",
        "active_panchayats_count": 5,
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to PanchayatMausam AI Backend API",
        "docs_url": "/api/v1/docs",
        "health_check": "/health",
        "version": settings.APP_VERSION,
    }
