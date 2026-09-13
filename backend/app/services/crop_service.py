import json
from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from ..repositories.crop_repo import CropRepository
from ..schemas.crop import CropResponse, CropStageResponse, SowingCalculationRequest, SowingCalculationResponse

class CropService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = CropRepository(db)

    def list_crops(self) -> List[CropResponse]:
        crop_models = self.repo.get_all()
        result = []
        for c in crop_models:
            stages = []
            for st in c.stages:
                triggers = json.loads(st.critical_triggers_json) if st.critical_triggers_json else []
                stages.append(
                    CropStageResponse(
                        stage_id=st.stage_id,
                        crop_id=st.crop_id,
                        stage_order=st.stage_order,
                        name_en=st.name_en,
                        name_hi=st.name_hi,
                        typical_duration_days=st.typical_duration_days,
                        water_sensitivity=st.water_sensitivity,
                        thermal_sensitivity=st.thermal_sensitivity,
                        critical_weather_triggers=triggers,
                        description_en=st.description_en,
                        description_hi=st.description_hi,
                    )
                )
            
            risks_en = json.loads(c.primary_risks_en_json) if c.primary_risks_en_json else []
            risks_hi = json.loads(c.primary_risks_hi_json) if c.primary_risks_hi_json else []

            result.append(
                CropResponse(
                    id=c.id,
                    name_en=c.name_en,
                    name_hi=c.name_hi,
                    botanical_name=c.botanical_name,
                    season=c.season,
                    season_name_en=c.season_name_en,
                    season_name_hi=c.season_name_hi,
                    typical_sowing_window_en=c.typical_sowing_window_en,
                    typical_sowing_window_hi=c.typical_sowing_window_hi,
                    total_duration_days=c.total_duration_days,
                    icon=c.icon or "🌱",
                    primary_risks_en=risks_en,
                    primary_risks_hi=risks_hi,
                    stages=stages,
                )
            )
        return result

    def calculate_sowing_stage(self, req: SowingCalculationRequest) -> Optional[SowingCalculationResponse]:
        crop = self.repo.get_by_id(req.crop_id)
        if not crop or not crop.stages:
            return None
        
        try:
            sowing_dt = datetime.strptime(req.sowing_date, "%Y-%m-%d")
        except ValueError:
            return None
        
        current_dt = datetime.strptime(req.current_date, "%Y-%m-%d") if req.current_date else datetime.now()
        das = max(0, (current_dt - sowing_dt).days)

        accumulated_days = 0
        current_stage = crop.stages[0]
        stage_progress = 0.0

        for stage in crop.stages:
            stage_end = accumulated_days + stage.typical_duration_days
            if das <= stage_end or stage == crop.stages[-1]:
                current_stage = stage
                days_in_stage = max(0, das - accumulated_days)
                stage_progress = min(100.0, (days_in_stage / max(1, stage.typical_duration_days)) * 100.0)
                break
            accumulated_days = stage_end

        total_progress = min(100.0, (das / max(1, crop.total_duration_days)) * 100.0)
        est_harvest = (sowing_dt + timedelta(days=crop.total_duration_days)).strftime("%Y-%m-%d")

        triggers = json.loads(current_stage.critical_triggers_json) if current_stage.critical_triggers_json else []

        stage_resp = CropStageResponse(
            stage_id=current_stage.stage_id,
            crop_id=current_stage.crop_id,
            stage_order=current_stage.stage_order,
            name_en=current_stage.name_en,
            name_hi=current_stage.name_hi,
            typical_duration_days=current_stage.typical_duration_days,
            water_sensitivity=current_stage.water_sensitivity,
            thermal_sensitivity=current_stage.thermal_sensitivity,
            critical_weather_triggers=triggers,
            description_en=current_stage.description_en,
            description_hi=current_stage.description_hi,
        )

        return SowingCalculationResponse(
            crop_id=crop.id,
            sowing_date=req.sowing_date,
            days_after_sowing=das,
            current_stage=stage_resp,
            stage_progress_pct=round(stage_progress, 1),
            total_crop_progress_pct=round(total_progress, 1),
            estimated_harvest_date=est_harvest,
        )
