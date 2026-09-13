from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session
from app.schemas.ml_schemas import (
    MLTrainRequest,
    MLTrainResponse,
    ModelComparisonMatrixResponse,
    ModelBenchmarkMetric,
    MLPanchayatForecastResponse
)
from app.services.ml_service import MLService

router = APIRouter(prefix="/ml", tags=["Machine Learning Forecasting Pipeline"])

@router.post("/train", response_model=MLTrainResponse)
def train_ml_models(
    request: MLTrainRequest = MLTrainRequest(),
    db: Session = Depends(get_db_session)
):
    """
    Executes benchmark training across:
    1. Historical Climatological Average Baseline
    2. Persistence Baseline
    3. Ridge Linear Regression
    4. Random Forest Regressor
    5. Gradient Boosting Regressor
    Across all 5 meteorological targets with strict chronological train/val/test split.
    """
    service = MLService(db)
    result = service.train_models(version_tag=request.version_tag, force_retrain=request.force_retrain)
    return result


@router.get("/compare", response_model=ModelComparisonMatrixResponse)
def get_model_comparison_matrix(
    version: Optional[str] = Query("v1.0.0", description="Model version tag"),
    db: Session = Depends(get_db_session)
):
    """
    Returns side-by-side benchmark comparison matrix (MAE, RMSE, R², F1 score)
    highlighting the winning champion model per target.
    """
    service = MLService(db)
    return service.get_comparison_matrix(version_tag=version)


@router.get("/models", response_model=List[ModelBenchmarkMetric])
def list_registered_models(
    version: Optional[str] = Query(None, description="Filter by version tag"),
    db: Session = Depends(get_db_session)
):
    """
    List all trained models with validation scores and hyperparameters.
    """
    service = MLService(db)
    models = service.repo.get_all_models(version_tag=version)
    return models


@router.get("/forecast", response_model=MLPanchayatForecastResponse)
def get_ml_forecast(
    panchayatId: str = Query("panchayat_acharpura", alias="panchayatId", description="Gram Panchayat identifier"),
    db: Session = Depends(get_db_session)
):
    """
    Serves multi-day ML weather predictions with 90% confidence prediction intervals.
    """
    service = MLService(db)
    return service.get_forecast(panchayat_id=panchayatId)
