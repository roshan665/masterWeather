import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

url = 'http://127.0.0.1:8000/api/v1/risks/evaluate'

scenarios = [
    {
        'title': 'Scenario A: Soybean Germination Heavy Rain (Waterlogging)',
        'payload': {
            'crop_id': 'soybean',
            'stage_id': 'soy_germination',
            'forecast_horizon_days': 2,
            'confidence_score': 88.0,
            'event_duration_hours': 48.0,
            'forecast_variables': {
                'rainfall_mm': 65.0,
                'temp_max_c': 30.0,
                'temp_min_c': 23.0,
                'relative_humidity_pct': 88.0,
                'wind_speed_kmh': 12.0,
                'soil_moisture_pct': 78.0,
                'consecutive_wet_days': 3
            }
        }
    },
    {
        'title': 'Scenario B: Chickpea Pod Development Humid Spell (Pod Borer)',
        'payload': {
            'crop_id': 'chickpea',
            'stage_id': 'chk_pod_dev',
            'forecast_horizon_days': 3,
            'confidence_score': 85.0,
            'event_duration_hours': 48.0,
            'forecast_variables': {
                'rainfall_mm': 0.0,
                'temp_max_c': 26.5,
                'temp_min_c': 14.0,
                'relative_humidity_pct': 76.0,
                'wind_speed_kmh': 8.0,
                'soil_moisture_pct': 42.0
            }
        }
    },
    {
        'title': 'Scenario C: High Wind Spray Hazard',
        'payload': {
            'crop_id': 'wheat',
            'stage_id': 'wht_cri',
            'forecast_horizon_days': 1,
            'confidence_score': 95.0,
            'event_duration_hours': 12.0,
            'forecast_variables': {
                'rainfall_mm': 0.0,
                'temp_max_c': 24.0,
                'temp_min_c': 11.0,
                'relative_humidity_pct': 50.0,
                'wind_speed_kmh': 24.0,
                'soil_moisture_pct': 55.0
            }
        }
    },
    {
        'title': 'Scenario D: Normal Favourable Conditions',
        'payload': {
            'crop_id': 'wheat',
            'stage_id': 'wht_cri',
            'forecast_horizon_days': 1,
            'confidence_score': 92.0,
            'event_duration_hours': 24.0,
            'forecast_variables': {
                'rainfall_mm': 0.0,
                'temp_max_c': 25.0,
                'temp_min_c': 12.0,
                'relative_humidity_pct': 55.0,
                'wind_speed_kmh': 8.0,
                'soil_moisture_pct': 50.0
            }
        }
    }
]

for sc in scenarios:
    print('\n' + '=' * 60)
    print(sc['title'])
    print('=' * 60)
    req = urllib.request.Request(
        url,
        data=json.dumps(sc['payload']).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print(f"Crop: {res['crop_name_en']} | Stage: {res['stage_name_en']}")
        print(f"Composite Score: {res['composite_risk_score']}/100 | Severity: {res['severity']} ({res['severity_label_en']})")
        print(f"Primary Category: {res['primary_risk_category']}")
        print(f"Rule Code: {res['rule_code']} ({res['rule_version']})")
        print(f"Source Org: {res['source_organization_en']}")
        print(f"Source Ref: {res['source_reference']}")
        print(f"Explanation (EN): {res['explanation_en']}")
        print(f"Explanation (HI): {res['explanation_hi']}")
        print(f"Recommended Action (EN):\n{res['recommended_action_en']}")
        print(f"Recommended Action (HI):\n{res['recommended_action_hi']}")
        print("\nSub-risks Breakdown:")
        for s in res['sub_risks']:
            flag = '[TRIGGERED]' if s['is_triggered'] else '[OK]'
            print(f"  {flag} {s['category_name_en']}: {s['score']}/100 ({s['severity']}) - {s['trigger_summary_en']}")
