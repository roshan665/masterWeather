from fastapi import APIRouter
from .auth import router as auth_router
from .panchayats import router as panchayats_router
from .crops import router as crops_router
from .weather import router as weather_router
from .forecasts import router as forecasts_router
from .risks import router as risks_router
from .advisories import router as advisories_router
from .rules import router as rules_router
from .observations import router as observations_router
from .alerts import router as alerts_router
from .feedback import router as feedback_router
from .analytics import router as analytics_router
from .weather_pipeline import router as weather_pipeline_router
from .ml import router as ml_router

api_v1_router = APIRouter()

api_v1_router.include_router(auth_router)
api_v1_router.include_router(panchayats_router)
api_v1_router.include_router(crops_router)
api_v1_router.include_router(weather_router)
api_v1_router.include_router(weather_pipeline_router)
api_v1_router.include_router(ml_router)
api_v1_router.include_router(forecasts_router)
api_v1_router.include_router(risks_router)
api_v1_router.include_router(advisories_router)
api_v1_router.include_router(rules_router)
api_v1_router.include_router(observations_router)
api_v1_router.include_router(alerts_router)
api_v1_router.include_router(feedback_router)
api_v1_router.include_router(analytics_router)
