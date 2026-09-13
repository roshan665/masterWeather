import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime, ForeignKey
from ..core.database import Base

class MLModelRegistryModel(Base):
    """
    Stores trained model metadata, algorithm types, hyperparameter configurations,
    and benchmark evaluation metrics (MAE, RMSE, R2, Risk F1).
    """
    __tablename__ = "ml_model_registry"

    id = Column(String(64), primary_key=True, index=True)
    model_name = Column(String(128), nullable=False, index=True)  # e.g., 'RandomForest-Rainfall-Phanda'
    target_variable = Column(String(64), nullable=False, index=True)  # 'rainfall_mm', 'temp_max_c', 'temp_min_c', 'humidity_pct', 'wind_speed_kmh'
    algorithm_type = Column(String(64), nullable=False)  # 'historical_baseline', 'persistence_baseline', 'linear_regression', 'random_forest', 'gradient_boosting'
    version_tag = Column(String(32), default="v1.0.0", index=True)
    is_active_champion = Column(Boolean, default=False)
    
    # Dataset Metadata
    train_samples_count = Column(Integer, default=0)
    val_samples_count = Column(Integer, default=0)
    test_samples_count = Column(Integer, default=0)
    train_start_date = Column(String(16), nullable=False)
    train_end_date = Column(String(16), nullable=False)
    test_start_date = Column(String(16), nullable=False)
    test_end_date = Column(String(16), nullable=False)
    
    # Benchmark Evaluation Metrics on Test Set
    mae = Column(Float, nullable=False)
    rmse = Column(Float, nullable=False)
    r2_score = Column(Float, nullable=False)
    risk_classification_f1 = Column(Float, default=0.0)  # Macro F1 for agricultural risk category
    risk_precision = Column(Float, default=0.0)
    risk_recall = Column(Float, default=0.0)

    hyperparameters_json = Column(Text, nullable=False)  # JSON string
    feature_names_json = Column(Text, nullable=False)    # JSON string
    artifact_path = Column(String(256), nullable=True)   # Serialized model path
    trained_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, nullable=False)


class MLForecastPredictionModel(Base):
    """
    Stores historical and multi-day horizon forecast predictions with empirical confidence intervals.
    """
    __tablename__ = "ml_forecast_predictions"

    id = Column(String(64), primary_key=True, index=True)
    panchayat_id = Column(String(64), ForeignKey("panchayats.id"), nullable=False, index=True)
    model_id = Column(String(64), ForeignKey("ml_model_registry.id"), nullable=False)
    target_variable = Column(String(64), nullable=False, index=True)
    forecast_generated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, nullable=False)
    target_date = Column(String(16), nullable=False, index=True)  # '2026-09-14'
    horizon_day = Column(Integer, default=1)  # 1 to 7 days ahead

    predicted_value = Column(Float, nullable=False)
    observed_value = Column(Float, nullable=True)  # Filled post-hoc for verification
    residual_error = Column(Float, nullable=True)  # observed - predicted
    
    # Confidence Estimation & 90% Prediction Intervals
    lower_bound_90 = Column(Float, nullable=False)
    upper_bound_90 = Column(Float, nullable=False)
    confidence_pct = Column(Float, default=85.0)   # 0.0 to 100.0%
    risk_category = Column(String(32), default="normal")  # 'normal', 'advisory', 'warning', 'critical'
