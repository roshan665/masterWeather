"""
Crop Risk Engine Scenario Test Suite
Validates ICAR/KVK multi-factor agronomic risk evaluation engine across realistic weather anomalies.
"""
import sys
import os

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding='utf-8')

from app.core.database import SessionLocal
from app.schemas.risk_engine import CropRiskEvaluationInput, ForecastVariablesInput
from app.services.crop_risk_engine import CropRiskEngine

scenarios = [
    {
        'title': 'Scenario A: Soybean Germination Heavy Rain (Waterlogging)',
        'payload': CropRiskEvaluationInput(
            crop_id='crop-soybean',
            stage_id='stage-soy-veg',
            forecast_horizon_days=2,
            confidence_score=88.0,
            event_duration_hours=48.0,
            forecast_variables=ForecastVariablesInput(
                rainfall_mm=65.0,
                temp_max_c=30.0,
                temp_min_c=23.0,
                relative_humidity_pct=88.0,
                wind_speed_kmh=12.0,
                soil_moisture_pct=78.0,
                consecutive_wet_days=3
            )
        )
    },
    {
        'title': 'Scenario B: Chickpea Pod Development Humid Spell (Pod Borer)',
        'payload': CropRiskEvaluationInput(
            crop_id='crop-chickpea',
            stage_id='stage-chk-pod',
            forecast_horizon_days=3,
            confidence_score=85.0,
            event_duration_hours=48.0,
            forecast_variables=ForecastVariablesInput(
                rainfall_mm=0.0,
                temp_max_c=26.5,
                temp_min_c=14.0,
                relative_humidity_pct=76.0,
                wind_speed_kmh=8.0,
                soil_moisture_pct=42.0
            )
        )
    },
    {
        'title': 'Scenario C: High Wind Spray Hazard',
        'payload': CropRiskEvaluationInput(
            crop_id='crop-wheat',
            stage_id='stage-wht-cri',
            forecast_horizon_days=1,
            confidence_score=95.0,
            event_duration_hours=12.0,
            forecast_variables=ForecastVariablesInput(
                rainfall_mm=0.0,
                temp_max_c=24.0,
                temp_min_c=11.0,
                relative_humidity_pct=50.0,
                wind_speed_kmh=24.0,
                soil_moisture_pct=55.0
            )
        )
    },
    {
        'title': 'Scenario D: Normal Favourable Conditions',
        'payload': CropRiskEvaluationInput(
            crop_id='crop-wheat',
            stage_id='stage-wht-cri',
            forecast_horizon_days=1,
            confidence_score=92.0,
            event_duration_hours=24.0,
            forecast_variables=ForecastVariablesInput(
                rainfall_mm=0.0,
                temp_max_c=25.0,
                temp_min_c=12.0,
                relative_humidity_pct=55.0,
                wind_speed_kmh=8.0,
                soil_moisture_pct=50.0
            )
        )
    }
]

def run_tests():
    print("=" * 60)
    print("PANCHAYAT MAUSAM AI - CROP RISK ENGINE TEST SUITE")
    print("=" * 60)

    db = SessionLocal()
    try:
        engine = CropRiskEngine(db)
        for sc in scenarios:
            print('\n' + '=' * 60)
            print(sc['title'])
            print('=' * 60)
            res = engine.evaluate_risk(sc['payload'])
            print(f"Crop: {res.crop_name_en} | Stage: {res.stage_name_en}")
            print(f"Composite Score: {res.composite_risk_score}/100 | Severity: {res.severity} ({res.severity_label_en})")
            print(f"Primary Category: {res.primary_risk_category}")
            print(f"Rule Code: {res.rule_code} ({res.rule_version})")
            print(f"Source Org: {res.source_organization_en}")
            print(f"Source Ref: {res.source_reference}")
            print(f"Explanation (EN): {res.explanation_en}")
            print(f"Recommended Action (EN):\n{res.recommended_action_en}")
            print("\nSub-risks Breakdown:")
            for s in res.sub_risks:
                flag = '[TRIGGERED]' if s.is_triggered else '[OK]'
                print(f"  {flag} {s.category_name_en}: {s.score}/100 ({s.severity}) - {s.trigger_summary_en}")
            
        print("\n" + "=" * 60)
        print("ALL SCENARIO STRESS TESTS COMPLETED SUCCESSFULLY")
        print("=" * 60)
    finally:
        db.close()

if __name__ == '__main__':
    run_tests()
