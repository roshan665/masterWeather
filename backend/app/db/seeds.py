import json
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from ..core.security import get_password_hash
from ..models.panchayat import PanchayatModel
from ..models.crop import CropModel, CropStageModel
from ..models.user import UserModel
from ..models.weather import WeatherReadingModel, HourlyForecastModel, DailyForecastModel
from ..models.risk import CropRiskAssessmentModel
from ..models.advisory import AdvisoryRuleModel, AgrometAdvisoryModel
from ..models.observation import FarmerObservationModel
from ..models.alert import WeatherAlertModel

def seed_database_if_empty(db: Session):
    # Check if already seeded
    if db.query(PanchayatModel).first():
        return

    print("[SEEDS] Seeding PanchayatMausam AI database with Phanda block initial dataset...")

    # 1. Panchayats
    panchayats_data = [
        {
            "id": "panchayat_acharpura",
            "name_en": "Acharpura",
            "name_hi": "आचारपुरा",
            "latitude": 23.3685,
            "longitude": 77.3712,
            "elevation_m": 512.0,
            "weather_station_id": "AWS-BPL-ACH-01",
            "soil_type_en": "Deep Vertisol Clay",
            "soil_type_hi": "गहरी काली मटियार मिट्टी",
            "bbox": [77.3512, 23.3485, 77.3912, 23.3885],
            "boundary": {
                "type": "Polygon",
                "coordinates": [[[77.3512, 23.3485], [77.3912, 23.3485], [77.3912, 23.3885], [77.3512, 23.3885], [77.3512, 23.3485]]]
            }
        },
        {
            "id": "panchayat_bangrasia",
            "name_en": "Bangrasia",
            "name_hi": "बंगरसिया",
            "latitude": 23.1845,
            "longitude": 77.5218,
            "elevation_m": 485.0,
            "weather_station_id": "AWS-BPL-BNG-02",
            "soil_type_en": "Medium Black Soil",
            "soil_type_hi": "मध्यम काली मिट्टी",
            "bbox": [77.5018, 23.1645, 77.5418, 23.2045],
            "boundary": {
                "type": "Polygon",
                "coordinates": [[[77.5018, 23.1645], [77.5418, 23.1645], [77.5418, 23.2045], [77.5018, 23.2045], [77.5018, 23.1645]]]
            }
        },
        {
            "id": "panchayat_ratibad",
            "name_en": "Ratibad",
            "name_hi": "रातीबड़",
            "latitude": 23.1628,
            "longitude": 77.3245,
            "elevation_m": 528.0,
            "weather_station_id": "AWS-BPL-RTB-03",
            "soil_type_en": "Clay Loam Vertisols",
            "soil_type_hi": "मटियार दोमट काली मिट्टी",
            "bbox": [77.3045, 23.1428, 77.3445, 23.1828],
            "boundary": {
                "type": "Polygon",
                "coordinates": [[[77.3045, 23.1428], [77.3445, 23.1428], [77.3445, 23.1828], [77.3045, 23.1828], [77.3045, 23.1428]]]
            }
        },
        {
            "id": "panchayat_samasgarh",
            "name_en": "Samasgarh",
            "name_hi": "समसगढ़",
            "latitude": 23.2185,
            "longitude": 77.2912,
            "elevation_m": 542.0,
            "weather_station_id": "AWS-BPL-SMS-04",
            "soil_type_en": "Shallow Gravelly Loam",
            "soil_type_hi": "उथली कंकरीली दोमट मिट्टी",
            "bbox": [77.2712, 23.1985, 77.3112, 23.2385],
            "boundary": {
                "type": "Polygon",
                "coordinates": [[[77.2712, 23.1985], [77.3112, 23.1985], [77.3112, 23.2385], [77.2712, 23.2385], [77.2712, 23.1985]]]
            }
        },
        {
            "id": "panchayat_sukhi_sewaniya",
            "name_en": "Sukhi Sewaniya",
            "name_hi": "सूखी सेवनिया",
            "latitude": 23.3245,
            "longitude": 77.4812,
            "elevation_m": 498.0,
            "weather_station_id": "AWS-BPL-SKH-05",
            "soil_type_en": "Deep Vertisol Clay",
            "soil_type_hi": "गहरी काली मटियार मिट्टी",
            "bbox": [77.4612, 23.3045, 77.5012, 23.3445],
            "boundary": {
                "type": "Polygon",
                "coordinates": [[[77.4612, 23.3045], [77.5012, 23.3045], [77.5012, 23.3445], [77.4612, 23.3445], [77.4612, 23.3045]]]
            }
        },
    ]

    for p in panchayats_data:
        m = PanchayatModel(
            id=p["id"],
            name_en=p["name_en"],
            name_hi=p["name_hi"],
            district_en="Bhopal",
            district_hi="भोपाल",
            block_en="Phanda",
            block_hi="फंदा",
            state_en="Madhya Pradesh",
            state_hi="मध्य प्रदेश",
            latitude=p["latitude"],
            longitude=p["longitude"],
            elevation_m=p["elevation_m"],
            weather_station_id=p["weather_station_id"],
            soil_type_en=p["soil_type_en"],
            soil_type_hi=p["soil_type_hi"],
            bbox_json=json.dumps(p["bbox"]),
            boundary_geojson=json.dumps(p["boundary"]),
        )
        db.add(m)

    # 2. Crops & Stages
    crops_data = [
        {
            "id": "soybean",
            "name_en": "Soybean (सोयाबीन)",
            "name_hi": "सोयाबीन (Soybean)",
            "botanical_name": "Glycine max",
            "season": "kharif",
            "season_name_en": "Kharif Season",
            "season_name_hi": "खरीफ मौसम",
            "typical_sowing_window_en": "15 June – 05 July",
            "typical_sowing_window_hi": "15 जून – 05 जुलाई",
            "total_duration_days": 95,
            "icon": "🌱",
            "primary_risks_en": ["Waterlogging during seedling & flowering", "Yellow mosaic virus & whitefly vector", "Semilooper and girdle beetle infestation"],
            "primary_risks_hi": ["अंकुरण व फूल अवस्था में जलभराव", "पीला मोजेक वायरस व सफेद मक्खी", "सेमीलूपर एवं गर्डल बीटल कीट"],
            "stages": [
                {"stage_id": "soy_sowing", "order": 1, "name_en": "Sowing", "name_hi": "बुवाई", "days": 5, "water": "moderate", "thermal": "moderate"},
                {"stage_id": "soy_germination", "order": 2, "name_en": "Germination & Emergence", "name_hi": "अंकुरण व फैलाव", "days": 8, "water": "high", "thermal": "moderate"},
                {"stage_id": "soy_vegetative", "order": 3, "name_en": "Vegetative Growth", "name_hi": "वानस्पतिक वृद्धि", "days": 25, "water": "moderate", "thermal": "low"},
                {"stage_id": "soy_flowering", "order": 4, "name_en": "Flowering", "name_hi": "फूल आने की अवस्था", "days": 18, "water": "critical", "thermal": "critical"},
                {"stage_id": "soy_pod_dev", "order": 5, "name_en": "Pod Development", "name_hi": "फली विकास", "days": 22, "water": "high", "thermal": "moderate"},
                {"stage_id": "soy_maturity", "order": 6, "name_en": "Maturity", "name_hi": "परिपक्वता", "days": 12, "water": "low", "thermal": "low"},
                {"stage_id": "soy_harvest", "order": 7, "name_en": "Harvesting", "name_hi": "कटाई व गहाई", "days": 5, "water": "critical", "thermal": "low"},
            ]
        },
        {
            "id": "wheat",
            "name_en": "Wheat (गेहूं)",
            "name_hi": "गेहूं (Wheat)",
            "botanical_name": "Triticum aestivum",
            "season": "rabi",
            "season_name_en": "Rabi Season",
            "season_name_hi": "रबी मौसम",
            "typical_sowing_window_en": "01 Nov – 25 Nov",
            "typical_sowing_window_hi": "01 नवंबर – 25 नवंबर",
            "total_duration_days": 125,
            "icon": "🌾",
            "primary_risks_en": ["Terminal heat stress during grain filling", "Rust (Puccinia) during cloudy spells", "Aphid infestation"],
            "primary_risks_hi": ["दाना भराव समय टर्मिनल हीट स्ट्रेस", "बादल व आर्द्रता में गेरुआ (रस्ट) रोग", "माहू (एफिड) कीट"],
            "stages": [
                {"stage_id": "wht_sowing", "order": 1, "name_en": "Sowing", "name_hi": "बुवाई", "days": 6, "water": "moderate", "thermal": "moderate"},
                {"stage_id": "wht_cri", "order": 2, "name_en": "Crown Root Initiation (CRI)", "name_hi": "ताज जड़ अवस्था (CRI)", "days": 18, "water": "critical", "thermal": "high"},
                {"stage_id": "wht_tillering", "order": 3, "name_en": "Tillering", "name_hi": "कल्ले फूटना", "days": 22, "water": "high", "thermal": "high"},
                {"stage_id": "wht_jointing", "order": 4, "name_en": "Stem Elongation (Jointing)", "name_hi": "तना वृद्धि", "days": 20, "water": "moderate", "thermal": "moderate"},
                {"stage_id": "wht_flowering", "order": 5, "name_en": "Flowering & Anthesis", "name_hi": "फूल व बालियां", "days": 15, "water": "critical", "thermal": "critical"},
                {"stage_id": "wht_grain_fill", "order": 6, "name_en": "Grain Filling", "name_hi": "दाना भराव", "days": 28, "water": "critical", "thermal": "critical"},
                {"stage_id": "wht_maturity", "order": 7, "name_en": "Maturity & Harvest", "name_hi": "परिपक्वता व कटाई", "days": 16, "water": "low", "thermal": "low"},
            ]
        },
        {
            "id": "chickpea",
            "name_en": "Chickpea / Gram (चना)",
            "name_hi": "चना (Chickpea / Gram)",
            "botanical_name": "Cicer arietinum",
            "season": "rabi",
            "season_name_en": "Rabi Season",
            "season_name_hi": "रबी मौसम",
            "typical_sowing_window_en": "15 Oct – 15 Nov",
            "typical_sowing_window_hi": "15 अक्टूबर – 15 नवंबर",
            "total_duration_days": 110,
            "icon": "🌿",
            "primary_risks_en": ["Helicoverpa armigera (Pod borer)", "Fusarium wilt in dry warm soils", "Frost damage at flowering"],
            "primary_risks_hi": ["घाटी छेदक इल्ली (हेलिकोवर्पा)", "उकठा (विल्ट) रोग", "फूल अवस्था पर पाला"],
            "stages": [
                {"stage_id": "chk_sowing", "order": 1, "name_en": "Sowing", "name_hi": "बुवाई", "days": 5, "water": "moderate", "thermal": "moderate"},
                {"stage_id": "chk_germination", "order": 2, "name_en": "Germination", "name_hi": "अंकुरण", "days": 10, "water": "moderate", "thermal": "low"},
                {"stage_id": "chk_vegetative", "order": 3, "name_en": "Vegetative & Branching", "name_hi": "वानस्पतिक शाखाएं", "days": 30, "water": "moderate", "thermal": "moderate"},
                {"stage_id": "chk_flowering", "order": 4, "name_en": "Flowering", "name_hi": "फूल आने की अवस्था", "days": 22, "water": "critical", "thermal": "critical"},
                {"stage_id": "chk_pod_dev", "order": 5, "name_en": "Pod Formation", "name_hi": "फलियां / घाटी बनना", "days": 20, "water": "high", "thermal": "high"},
                {"stage_id": "chk_maturity", "order": 6, "name_en": "Maturity & Harvest", "name_hi": "परिपक्वता व कटाई", "days": 23, "water": "low", "thermal": "low"},
            ]
        }
    ]

    for c in crops_data:
        crop_model = CropModel(
            id=c["id"],
            name_en=c["name_en"],
            name_hi=c["name_hi"],
            botanical_name=c["botanical_name"],
            season=c["season"],
            season_name_en=c["season_name_en"],
            season_name_hi=c["season_name_hi"],
            typical_sowing_window_en=c["typical_sowing_window_en"],
            typical_sowing_window_hi=c["typical_sowing_window_hi"],
            total_duration_days=c["total_duration_days"],
            icon=c["icon"],
            primary_risks_en_json=json.dumps(c["primary_risks_en"]),
            primary_risks_hi_json=json.dumps(c["primary_risks_hi"]),
        )
        db.add(crop_model)
        for st in c["stages"]:
            stage_model = CropStageModel(
                stage_id=st["stage_id"],
                crop_id=c["id"],
                stage_order=st["order"],
                name_en=st["name_en"],
                name_hi=st["name_hi"],
                typical_duration_days=st["days"],
                water_sensitivity=st["water"],
                thermal_sensitivity=st["thermal"],
            )
            db.add(stage_model)

    # 3. Users
    users_data = [
        {
            "id": "usr_farmer_01",
            "username": "farmer",
            "name_en": "Rameshwar Patidar",
            "name_hi": "रामेश्वर पाटीदार",
            "role": "farmer",
            "email": "rameshwar.farmer@phanda.mp.gov.in",
            "panchayat_id": "panchayat_acharpura",
            "panchayat_name_en": "Acharpura",
            "panchayat_name_hi": "आचारपुरा",
            "village_name_en": "Acharpura Kalan",
            "village_name_hi": "आचारपुरा कलां",
            "permissions": ["view_farmer_dashboard", "submit_observation"],
        },
        {
            "id": "usr_officer_01",
            "username": "officer",
            "name_en": "Dr. R. K. Sharma",
            "name_hi": "डॉ. आर. के. शर्मा",
            "role": "officer",
            "email": "rksharma.aeo@bhopal.mp.gov.in",
            "designation_en": "Senior Agromet Extension Officer",
            "designation_hi": "वरिष्ठ कृषि मौसम विस्तार अधिकारी",
            "organization_en": "Phanda Block Agromet Command, Department of Agriculture MP",
            "organization_hi": "कृषि विभाग मध्य प्रदेश",
            "permissions": ["view_farmer_dashboard", "submit_observation", "manage_advisories", "approve_advisories", "broadcast_alerts"],
        },
        {
            "id": "usr_admin_01",
            "username": "admin",
            "name_en": "Anand Verma",
            "name_hi": "आनंद वर्मा",
            "role": "admin",
            "email": "anand.verma@nic.in",
            "designation_en": "District Agromet Systems Administrator",
            "designation_hi": "जिला कृषि मौसम सिस्टम प्रशासक",
            "organization_en": "National Informatics Centre (NIC) Bhopal",
            "organization_hi": "एनआईसी भोपाल",
            "permissions": ["view_farmer_dashboard", "submit_observation", "manage_advisories", "approve_advisories", "broadcast_alerts", "manage_users", "edit_rules", "view_telemetry_audit", "run_models", "calibrate_benchmarks"],
        },
        {
            "id": "usr_researcher_01",
            "username": "researcher",
            "name_en": "Dr. Neha Deshmukh",
            "name_hi": "डॉ. नेहा देशमुख",
            "role": "researcher",
            "email": "neha.deshmukh@icar.gov.in",
            "designation_en": "Principal Agrometeorologist & Modeler",
            "designation_hi": "प्रधान कृषि मौसम वैज्ञानिक",
            "organization_en": "ICAR - Central Institute of Agricultural Engineering (CIAE) Bhopal",
            "organization_hi": "भाकृअनुप - सीआईएई भोपाल",
            "permissions": ["view_farmer_dashboard", "run_models", "calibrate_benchmarks", "view_telemetry_audit"],
        },
    ]

    for u in users_data:
        m = UserModel(
            id=u["id"],
            username=u["username"],
            password_hash=get_password_hash("demo123"),
            name_en=u["name_en"],
            name_hi=u["name_hi"],
            role=u["role"],
            email=u["email"],
            panchayat_id=u.get("panchayat_id"),
            panchayat_name_en=u.get("panchayat_name_en"),
            panchayat_name_hi=u.get("panchayat_name_hi"),
            village_name_en=u.get("village_name_en"),
            village_name_hi=u.get("village_name_hi"),
            designation_en=u.get("designation_en"),
            designation_hi=u.get("designation_hi"),
            organization_en=u.get("organization_en"),
            organization_hi=u.get("organization_hi"),
            permissions_json=json.dumps(u["permissions"]),
        )
        db.add(m)

    # 4. Weather Readings & Forecasts for Panchayats
    now = datetime.now(timezone.utc)
    for p in panchayats_data:
        w = WeatherReadingModel(
            id=f"wth_{p['id']}",
            panchayat_id=p["id"],
            station_id=p["weather_station_id"],
            timestamp=now,
            temp_c=29.4,
            temp_max_c=32.5,
            temp_min_c=23.8,
            feels_like_c=31.2,
            dew_point_c=22.1,
            rainfall_mm=14.0,
            rainfall_rate_mm_hr=0.0,
            humidity_pct=78.0,
            wind_speed_kmh=8.2,
            wind_direction_deg=220.0,
            wind_direction_cardinal="SW",
            pressure_hpa=1008.5,
            solar_radiation_wm2=620.0,
            et0_mm_day=4.2,
            leaf_wetness_pct=22.0,
            soil_moisture_pct=44.0,
            soil_temp_c=26.2,
            confidence_pct=95.0,
            data_source="AWS Sensor",
        )
        db.add(w)

        # 24 Hourly Forecasts
        for hr in range(24):
            f_time = now + timedelta(hours=hr)
            hf = HourlyForecastModel(
                id=f"hr_{p['id']}_{hr}",
                panchayat_id=p["id"],
                forecast_time=f_time,
                temp_c=round(24.0 + (8.0 if 10 <= hr <= 16 else 2.0), 1),
                rain_probability_pct=25.0 if hr > 14 else 10.0,
                rain_amount_mm=2.5 if hr > 16 else 0.0,
                rh_pct=70.0 + (10.0 if hr < 8 else -5.0),
                wind_speed_kmh=6.0 + hr * 0.4,
                spray_feasibility="optimal" if 6 <= hr <= 9 else ("marginal" if 10 <= hr <= 14 else "unfavourable"),
                spray_advice_en="Calm wind <10 km/h; ideal spray window" if 6 <= hr <= 9 else "High afternoon drift risk",
                spray_advice_hi="शांत हवा; छिड़काव हेतु उत्तम समय" if 6 <= hr <= 9 else "तेज हवा; छिड़काव से बचें",
            )
            db.add(hf)

        # 7 Daily Forecasts
        for day in range(7):
            d_date = (now + timedelta(days=day)).strftime("%Y-%m-%d")
            df = DailyForecastModel(
                id=f"df_{p['id']}_{day}",
                panchayat_id=p["id"],
                forecast_date=d_date,
                temp_max_c=32.0 + (day % 3),
                temp_min_c=23.5,
                rainfall_mm=12.0 if day in [1, 4] else 0.0,
                rain_probability_pct=65.0 if day in [1, 4] else 15.0,
                condition_code="rain" if day in [1, 4] else "partly_cloudy",
                condition_text_en="Thunderstorm & Light Rain" if day in [1, 4] else "Partly Sunny",
                condition_text_hi="गरज-चमक के साथ हल्की वर्षा" if day in [1, 4] else "धूप-छांव",
                wind_speed_kmh=12.0,
                rh_avg_pct=72.0,
                confidence_level="high",
                confidence_pct=92.0,
            )
            db.add(df)

    # 5. Advisory Rules (Knowledge Base)
    rules_data = [
        {
            "id": "rule_soy_001",
            "rule_code": "RULE-SOY-POD-001",
            "crop_id": "soybean",
            "crop_name_en": "Soybean",
            "crop_name_hi": "सोयाबीन",
            "stage_id": "soy_pod_dev",
            "stage_name_en": "Pod Development",
            "stage_name_hi": "फली विकास",
            "weather_trigger_en": "Continuous Relative Humidity >= 75% for >=48h with temperature between 28°C and 32°C.",
            "weather_trigger_hi": "लगातार 48 घंटे 75% से अधिक आर्द्रता और 28-32°C तापमान।",
            "thresholds": [{"parameter": "rh", "operator": ">=", "value": 75, "unit": "%"}, {"parameter": "temp_max", "operator": "between", "value": "28-32", "unit": "°C"}],
            "risk_category": "pest_disease",
            "severity": "warning",
            "short_summary_en": "High risk of Semilooper and Girdle beetle larval surge.",
            "short_summary_hi": "सेमीलूपर एवं गर्डल बीटल कीट प्रकोप की उच्च संभावना।",
            "recommended_action_en": "1. Install T-shaped wooden bird perches @ 40–50/ha across field.\n2. Scout 5 representative spots across vertisol plot.\n3. Follow approved ICAR-IISR biocontrol and pheromone trap monitoring protocols.",
            "recommended_action_hi": "1. खेत में 40-50 टी-आकार की चिड़िया खूंटियां लगाएं।\n2. खेत में 5 स्थानों पर 5-5 पौधों का निरीक्षण कर इल्ली घनत्व जांचें।\n3. भाकृअनुप-सोयाबीन अनुसंधान संस्थान द्वारा अनुशंसित फेरोमोन ट्रैप व जैविक निगरानी अपनाएं।",
            "source_org_en": "ICAR - Indian Institute of Soybean Research (IISR), Indore",
            "source_org_hi": "भाकृअनुप - भारतीय सोयाबीन अनुसंधान संस्थान (IISR), इंदौर",
            "source_ref_en": "ICAR-IISR Agromet Advisory Bulletin #42 (Kharif Season 2026, Section 3.2)",
            "source_ref_hi": "भाकृअनुप-आईआईएसआर कृषि मौसम बुलेटिन #42 (खरीफ 2026, खंड 3.2)",
            "version": "v1.2",
            "approval_status": "published",
            "effective_from": "2026-07-15",
            "effective_until": "2026-10-15",
            "created_by": "Dr. R. K. Sharma (Senior Agromet Officer)",
            "history": [{"version": "v1.0", "modified_by": "Dr. R. K. Sharma", "modified_at": "2026-07-10T10:30:00Z", "change_summary": "Initial draft", "status": "draft"}]
        },
        {
            "id": "rule_soy_002",
            "rule_code": "RULE-SOY-RAIN-002",
            "crop_id": "soybean",
            "crop_name_en": "Soybean",
            "crop_name_hi": "सोयाबीन",
            "stage_id": "soy_germination",
            "stage_name_en": "Germination & Emergence",
            "stage_name_hi": "अंकुरण व फैलाव",
            "weather_trigger_en": "Heavy precipitation >= 50mm causing waterlogging in deep black vertisols.",
            "weather_trigger_hi": "50 मिमी से अधिक भारी वर्षा से भारी काली मिट्टी में जलभराव।",
            "thresholds": [{"parameter": "rainfall", "operator": ">=", "value": 50, "unit": "mm"}, {"parameter": "soil_moisture", "operator": ">=", "value": 70, "unit": "%"}],
            "risk_category": "excess_water",
            "severity": "critical",
            "short_summary_en": "Severe waterlogging risk causing seedling collar rot and root asphyxiation.",
            "short_summary_hi": "अत्यधिक जलभराव से बीज सड़न व अंकुरण नष्ट होने का गंभीर संकट।",
            "recommended_action_en": "1. Open broad-bed furrows (BBF) or field boundary drainage trenches immediately.\n2. Ensure standing water is evacuated within 12-24 hours.\n3. Avoid heavy tractor movement in saturated soil.",
            "recommended_action_hi": "1. खेत की मेड़ों व नालियों को खोलकर तुरंत जल निकासी सुनिश्चित करें।\n2. 12-24 घंटे के भीतर खड़े पानी को बाहर निकालें।\n3. गीली मिट्टी में भारी कृषि यंत्र न चलाएं।",
            "source_org_en": "ICAR - Indian Institute of Soybean Research (IISR), Indore",
            "source_org_hi": "भाकृअनुप - भारतीय सोयाबीन अनुसंधान संस्थान, इंदौर",
            "source_ref_en": "ICAR-IISR Technical Bulletin #54 (Vertisol Drainage Best Practices)",
            "source_ref_hi": "भाकृअनुप-आईआईएसआर तकनीकी बुलेटिन #54 (जल निकास प्रबंधन)",
            "version": "v1.3",
            "approval_status": "published",
            "effective_from": "2026-06-15",
            "effective_until": "2026-09-30",
            "created_by": "Dr. R. K. Sharma",
            "history": [{"version": "v1.0", "modified_by": "Dr. R. K. Sharma", "modified_at": "2026-06-01T09:00:00Z", "change_summary": "Initial baseline", "status": "published"}]
        },
        {
            "id": "rule_soy_003",
            "rule_code": "RULE-SOY-HEAT-003",
            "crop_id": "soybean",
            "crop_name_en": "Soybean",
            "crop_name_hi": "सोयाबीन",
            "stage_id": "soy_flowering",
            "stage_name_en": "Flowering",
            "stage_name_hi": "फूल आने की अवस्था",
            "weather_trigger_en": "High daytime temperature >= 35°C during flowering causing pollen desiccation.",
            "weather_trigger_hi": "फूल खिलने के समय 35°C से अधिक उच्च तापमान।",
            "thresholds": [{"parameter": "temp_max", "operator": ">=", "value": 35, "unit": "°C"}],
            "risk_category": "thermal_stress",
            "severity": "warning",
            "short_summary_en": "Thermal stress during flowering accelerates flower drop and reduces pod set.",
            "short_summary_hi": "फूल अवस्था में तापमान वृद्धि से फूल झड़ने व फली न बनने का जोखिम।",
            "recommended_action_en": "1. Provide light sprinkler irrigation during early morning or late evening hours.\n2. Maintain soil moisture above 40% to mitigate canopy heat stress.",
            "recommended_action_hi": "1. सुबह या शाम के समय हल्की स्प्रिंकलर सिंचाई करें।\n2. खेत में नमी 40% से ऊपर बनाए रखें ताकि तापमान का असर कम हो।",
            "source_org_en": "ICAR - Indian Institute of Soybean Research (IISR), Indore",
            "source_org_hi": "भाकृअनुप - भारतीय सोयाबीन अनुसंधान संस्थान, इंदौर",
            "source_ref_en": "ICAR-IISR Crop Production Manual (Heat Abatement Guidelines)",
            "source_ref_hi": "भाकृअनुप-आईआईएसआर फसल उत्पादन मार्गदर्शिका",
            "version": "v1.1",
            "approval_status": "published",
            "effective_from": "2026-07-20",
            "effective_until": "2026-09-20",
            "created_by": "Dr. R. K. Sharma",
            "history": [{"version": "v1.0", "modified_by": "Dr. R. K. Sharma", "modified_at": "2026-07-15T11:00:00Z", "change_summary": "Initial draft", "status": "published"}]
        },
        {
            "id": "rule_wheat_001",
            "rule_code": "RULE-WHT-CRI-001",
            "crop_id": "wheat",
            "crop_name_en": "Wheat",
            "crop_name_hi": "गेहूं",
            "stage_id": "wht_cri",
            "stage_name_en": "Crown Root Initiation (CRI)",
            "stage_name_hi": "ताज जड़ अवस्था (CRI)",
            "weather_trigger_en": "Dry spell with no rain for >21 days post-sowing and soil moisture <= 35%.",
            "weather_trigger_hi": "बुवाई के 21 दिन बाद तक वर्षा का अभाव एवं मृदा नमी <= 35%।",
            "thresholds": [{"parameter": "soil_moisture", "operator": "<=", "value": 35, "unit": "%"}],
            "risk_category": "moisture_deficit",
            "severity": "critical",
            "short_summary_en": "CRI stage is most critical for crown root development; moisture stress reduces tillering.",
            "short_summary_hi": "ताज जड़ अवस्था सबसे संवेदनशील है; नमी की कमी से कल्ले फूटने में भारी कमी आती है।",
            "recommended_action_en": "1. Apply 1st light irrigation (5–6 cm depth) strictly between 20–25 DAS.\n2. Ensure uniform sprinkler distribution without flooding root crowns.",
            "recommended_action_hi": "1. बुवाई के 20 से 25 दिन के बीच पहली हल्की सिंचाई (5-6 सेमी) अवश्य करें।\n2. स्प्रिंकलर विधि से समान जल वितरण करें।",
            "source_org_en": "Krishi Vigyan Kendra (KVK), CIAE Bhopal",
            "source_org_hi": "कृषि विज्ञान केंद्र (KVK), सीआईएई भोपाल",
            "source_ref_en": "KVK Bhopal Rabi Package of Practices (Section 2.4)",
            "source_ref_hi": "केवीके भोपाल रबी मार्गदर्शिका (खंड 2.4)",
            "version": "v2.0",
            "approval_status": "published",
            "effective_from": "2026-11-01",
            "effective_until": "2026-12-15",
            "created_by": "Dr. Neha Deshmukh",
            "history": [{"version": "v1.0", "modified_by": "Dr. Neha Deshmukh", "modified_at": "2026-08-01T14:00:00Z", "change_summary": "Initial draft", "status": "published"}]
        },
        {
            "id": "rule_wheat_002",
            "rule_code": "RULE-WHT-HEAT-002",
            "crop_id": "wheat",
            "crop_name_en": "Wheat",
            "crop_name_hi": "गेहूं",
            "stage_id": "wht_grain_fill",
            "stage_name_en": "Grain Filling",
            "stage_name_hi": "दाना भराव",
            "weather_trigger_en": "Daytime maximum temperature >= 32°C during milking and grain fill.",
            "weather_trigger_hi": "दाना भराव के समय अधिकतम तापमान >= 32°C होना।",
            "thresholds": [{"parameter": "temp_max", "operator": ">=", "value": 32, "unit": "°C"}],
            "risk_category": "thermal_stress",
            "severity": "warning",
            "short_summary_en": "Terminal heat stress reduces starch synthesis causing shrivelled kernels.",
            "short_summary_hi": "टर्मिनल हीट स्ट्रेस से दाना सिकुड़ने और उपज में कमी का जोखिम।",
            "recommended_action_en": "1. Apply light micro-irrigation at evening hours to reduce canopy temperature.\n2. Avoid deep inter-cultivation that damages root systems.",
            "recommended_action_hi": "1. शाम के समय हल्की सिंचाई करें ताकि फसल का तापमान 2-3°C कम रहे।\n2. जड़ों को नुकसान पहुंचाने वाली गहरी जुताई न करें।",
            "source_org_en": "JNKVV Jabalpur / KVK Bhopal",
            "source_org_hi": "ज.ने.कृ.वि.वि. जबलपुर / केवीके भोपाल",
            "source_ref_en": "JNKVV Agromet Advisory Bulletin (Rabi Heat Stress Protocol)",
            "source_ref_hi": "जनेकृविवि कृषि मौसम बुलेटिन (हीट स्ट्रेस प्रबंधन)",
            "version": "v1.2",
            "approval_status": "published",
            "effective_from": "2026-02-01",
            "effective_until": "2026-03-31",
            "created_by": "Dr. Neha Deshmukh",
            "history": [{"version": "v1.0", "modified_by": "Dr. Neha Deshmukh", "modified_at": "2026-01-10T10:00:00Z", "change_summary": "Initial draft", "status": "published"}]
        },
        {
            "id": "rule_chk_001",
            "rule_code": "RULE-CHK-POD-001",
            "crop_id": "chickpea",
            "crop_name_en": "Chickpea / Gram",
            "crop_name_hi": "चना",
            "stage_id": "chk_pod_dev",
            "stage_name_en": "Pod Formation",
            "stage_name_hi": "फलियां / घाटी बनना",
            "weather_trigger_en": "Temperature 22-30°C and RH >= 70% creating optimal conditions for pod borer larval emergence.",
            "weather_trigger_hi": "22-30°C तापमान व 70% से अधिक आर्द्रता से इल्ली (घाटी छेदक) अनुकूलता।",
            "thresholds": [{"parameter": "rh", "operator": ">=", "value": 70, "unit": "%"}, {"parameter": "temp_max", "operator": "between", "value": "22-30", "unit": "°C"}],
            "risk_category": "pest_disease",
            "severity": "warning",
            "short_summary_en": "Gram Pod Borer (Helicoverpa armigera) surge risk during pod development.",
            "short_summary_hi": "चना फली विकास अवस्था में घाटी छेदक इल्ली (हेलिकोवर्पा) का प्रकोप।",
            "recommended_action_en": "1. Install 5–8 pheromone traps per hectare for pest monitoring.\n2. Install T-shaped wooden bird perches @ 40/ha for natural predation.\n3. Follow approved KVK biological monitoring protocols.",
            "recommended_action_hi": "1. 5-8 फेरोमोन ट्रैप प्रति हेक्टेयर निगरानी हेतु लगाएं।\n2. 40 टी-आकार की चिड़िया खूंटियां प्रति हेक्टेयर लगाएं ताकि पक्षी इल्लियों को खा सकें।\n3. केवीके द्वारा अनुशंसित जैविक व पर्यावरण अनुकूल उपाय अपनाएं।",
            "source_org_en": "Krishi Vigyan Kendra (KVK), CIAE Bhopal",
            "source_org_hi": "कृषि विज्ञान केंद्र (KVK), सीआईएई भोपाल",
            "source_ref_en": "ICAR-IIPR Kanpur / KVK Bhopal Chickpea Advisory #14",
            "source_ref_hi": "भाकृअनुप-आईआईपीआर कानपुर / केवीके भोपाल चना बुलेटिन #14",
            "version": "v1.4",
            "approval_status": "published",
            "effective_from": "2026-12-01",
            "effective_until": "2026-02-28",
            "created_by": "Dr. Neha Deshmukh",
            "history": [{"version": "v1.0", "modified_by": "Dr. Neha Deshmukh", "modified_at": "2026-11-15T09:00:00Z", "change_summary": "Initial draft", "status": "published"}]
        },
        {
            "id": "rule_chk_002",
            "rule_code": "RULE-CHK-FROST-002",
            "crop_id": "chickpea",
            "crop_name_en": "Chickpea / Gram",
            "crop_name_hi": "चना",
            "stage_id": "chk_flowering",
            "stage_name_en": "Flowering",
            "stage_name_hi": "फूल आने की अवस्था",
            "weather_trigger_en": "Minimum night temperature <= 4°C with calm wind leading to ground frost.",
            "weather_trigger_hi": "रात्रि तापमान <= 4°C एवं शांत हवा से पाला (Frost) गिरने का खतरा।",
            "thresholds": [{"parameter": "temp_min", "operator": "<=", "value": 4, "unit": "°C"}],
            "risk_category": "thermal_stress",
            "severity": "critical",
            "short_summary_en": "Severe frost damage risk causing flower drop and pod blackening.",
            "short_summary_hi": "पाला पड़ने से फूल झड़ने व फलियों के काले पड़ने का गंभीर खतरा।",
            "recommended_action_en": "1. Create smoke mulch using weed/crop residue on field borders along windward side during 3-6 AM.\n2. Provide light evening irrigation to retain ground warmth.",
            "recommended_action_hi": "1. सुबह 3 से 6 बजे के बीच खेत की उत्तरी-पश्चिमी मेड़ों पर कचरा जलाकर धुआं करें।\n2. शाम के समय हल्की सिंचाई करें ताकि मिट्टी में ऊष्मा बनी रहे।",
            "source_org_en": "JNKVV Jabalpur / KVK Bhopal",
            "source_org_hi": "ज.ने.कृ.वि.वि. जबलपुर / केवीके भोपाल",
            "source_ref_en": "MP State Agromet Cold Wave / Frost Contingency Plan",
            "source_ref_hi": "म.प्र. राज्य कृषि मौसम शीत लहर एवं पाला आकस्मिक योजना",
            "version": "v2.1",
            "approval_status": "published",
            "effective_from": "2026-12-15",
            "effective_until": "2026-02-15",
            "created_by": "Dr. Neha Deshmukh",
            "history": [{"version": "v1.0", "modified_by": "Dr. Neha Deshmukh", "modified_at": "2026-12-01T12:00:00Z", "change_summary": "Initial draft", "status": "published"}]
        }
    ]


    for r in rules_data:
        m = AdvisoryRuleModel(
            id=r["id"],
            rule_code=r["rule_code"],
            crop_id=r["crop_id"],
            crop_name_en=r["crop_name_en"],
            crop_name_hi=r["crop_name_hi"],
            stage_id=r["stage_id"],
            stage_name_en=r["stage_name_en"],
            stage_name_hi=r["stage_name_hi"],
            weather_trigger_en=r["weather_trigger_en"],
            weather_trigger_hi=r["weather_trigger_hi"],
            thresholds_json=json.dumps(r["thresholds"]),
            risk_category=r["risk_category"],
            severity=r["severity"],
            short_summary_en=r["short_summary_en"],
            short_summary_hi=r["short_summary_hi"],
            recommended_action_en=r["recommended_action_en"],
            recommended_action_hi=r["recommended_action_hi"],
            source_org_en=r["source_org_en"],
            source_org_hi=r["source_org_hi"],
            source_ref_en=r["source_ref_en"],
            source_ref_hi=r["source_ref_hi"],
            version=r["version"],
            approval_status=r["approval_status"],
            effective_from=r["effective_from"],
            effective_until=r["effective_until"],
            created_by=r["created_by"],
            version_history_json=json.dumps(r["history"]),
        )
        db.add(m)

    # 6. Agromet Advisories (Operational)
    adv_model = AgrometAdvisoryModel(
        id="adv_001",
        advisory_code="ADV-SOY-BPL-42",
        panchayat_id="panchayat_acharpura",
        panchayat_name_en="Acharpura",
        panchayat_name_hi="आचारपुरा",
        crop_id="soybean",
        crop_name_en="Soybean",
        crop_name_hi="सोयाबीन",
        stage_id="soy_pod_dev",
        stage_name_en="Pod Development",
        stage_name_hi="फली विकास",
        headline_en="Semilooper Monitoring & Bird Perch Installation",
        headline_hi="सेमीलूपर इल्ली निगरानी एवं टी-खूंटियां लगाना",
        detailed_advice_en="Relative humidity > 75% combined with cloudiness increases larval surge. Install T-shaped perches @ 40/ha to invite predatory insectivorous birds.",
        detailed_advice_hi="हवा में 75% से अधिक नमी एवं बदली से इल्ली प्रकोप का खतरा है। प्राकृतिक पक्षियों द्वारा नियंत्रण हेतु खेत में 40 टी-आकार की खूंटियां लगाएं।",
        action_type="pest_management",
        risk_category="pest_disease",
        severity="warning",
        approval_status="published",
        helpful_count=42,
        unhelpful_count=2,
        author_name="KVK Bhopal Agronomist",
        approved_by="Dr. R. K. Sharma",
        approved_at=now,
        source_citation_en="ICAR-IISR Bulletin #42",
        source_citation_hi="भाकृअनुप बुलेटिन #42",
    )
    db.add(adv_model)

    # 7. Weather Alerts
    alert_model = WeatherAlertModel(
        id="alt_001",
        alert_code="WARN-BPL-THUNDER-01",
        severity="warning",
        category="thunderstorm",
        headline_en="Orange Warning: Moderate Thunderstorm & Gusty Winds (35–45 km/h)",
        headline_hi="ऑरेंज चेतावनी: मध्यम गरज-चमक एवं 35-45 किमी/घंटा तेज हवाएं",
        detailed_instruction_en="Postpone all pesticide and foliar nutrition spraying. Secure irrigation pipes and clear natural drainage channels.",
        detailed_instruction_hi="सभी प्रकार के कीटनाशक एवं पर्णीय छिड़काव कार्य तुरंत स्थगित करें। जलनिकासी नालियों को साफ रखें।",
        target_panchayat_ids_json=json.dumps(["panchayat_acharpura", "panchayat_bangrasia", "panchayat_ratibad", "panchayat_samasgarh", "panchayat_sukhi_sewaniya"]),
        target_panchayat_names_en="All 5 Phanda Block Panchayats",
        target_panchayat_names_hi="फंदा विकासखंड की सभी 5 पंचायतें",
        is_active=True,
        issued_by="District Agromet Command, Bhopal",
        valid_from="2026-09-13 14:00",
        valid_until="2026-09-14 20:00",
        sms_delivery_status="99.2% (4,920 sent)",
        push_delivery_status="94.8% (3,150 delivered)",
    )
    db.add(alert_model)

    db.commit()
    print("[SEEDS] PanchayatMausam AI database successfully initialized with seeded data.")
