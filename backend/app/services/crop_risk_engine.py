import json
import math
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session

from ..models.advisory import AdvisoryRuleModel
from ..models.crop import CropModel, CropStageModel
from ..repositories.crop_repo import CropRepository
from ..repositories.rule_repo import RuleRepository
from ..schemas.risk_engine import (
    CropRiskEvaluationInput,
    CropRiskEvaluationOutput,
    SubRiskEvaluationItem,
    ForecastVariablesInput
)

# Standardized Agricultural Severity Tiers & Labels
SEVERITY_LABELS = {
    "normal": {"en": "Normal Conditions", "hi": "सामान्य स्थिति", "color": "#10b981"},
    "advisory": {"en": "Low Advisory Risk", "hi": "कम जोखिम (सतर्कता)", "color": "#3b82f6"},
    "warning": {"en": "Moderate Warning Risk", "hi": "मध्यम जोखिम (चेतावनी)", "color": "#f59e0b"},
    "critical": {"en": "Severe Emergency Risk", "hi": "अति गंभीर जोखिम (आपातकालीन)", "color": "#ef4444"},
}

SUB_RISK_CATEGORIES = [
    {"id": "pest_disease", "name_en": "Pest & Disease Vector", "name_hi": "कीट एवं फफूंद रोग जोखिम", "base_score": 15},
    {"id": "excess_water", "name_en": "Excess Moisture / Drainage", "name_hi": "अत्यधिक नमी एवं जलभराव", "base_score": 10},
    {"id": "moisture_deficit", "name_en": "Moisture Deficit / Drought", "name_hi": "नमी की कमी (सूखा तनाव)", "base_score": 10},
    {"id": "thermal_stress", "name_en": "Thermal Stress (Heat/Frost)", "name_hi": "तापमान तनाव (गर्मी/पाला)", "base_score": 12},
    {"id": "spray_window", "name_en": "Spray Drift & Wash-off Risk", "name_hi": "छिड़काव अनुकूलता (हवा/वर्षा)", "base_score": 15},
]

class CropRiskEngine:
    """
    Rule-based crop risk synthesis engine driven by configurable Knowledge Base advisory rules.
    Evaluates forecast variables, growth stages, event duration, and confidence without inventing thresholds.
    """

    def __init__(self, db: Session):
        self.db = db
        self.crop_repo = CropRepository(db)
        self.rule_repo = RuleRepository(db)

    def _normalize_id(self, raw_id: str) -> str:
        return raw_id.lower().replace("crop-", "").replace("crop_", "").replace("stage-", "").replace("stage_", "").replace("-", "_")

    def _evaluate_condition(self, forecast_val: Optional[float], operator: str, threshold_val: Any) -> bool:
        """
        Evaluates a single threshold condition against a forecasted meteorological parameter.
        """
        if forecast_val is None:
            return False

        op = operator.strip().lower()
        
        # Handle 'between' operator
        if op == "between" or "between" in op:
            try:
                if isinstance(threshold_val, (list, tuple)) and len(threshold_val) == 2:
                    low, high = float(threshold_val[0]), float(threshold_val[1])
                    return low <= forecast_val <= high
                elif isinstance(threshold_val, str) and "-" in threshold_val:
                    parts = threshold_val.split("-")
                    low, high = float(parts[0]), float(parts[1])
                    return low <= forecast_val <= high
            except (ValueError, IndexError):
                return False

        try:
            target = float(threshold_val)
        except (ValueError, TypeError):
            return False

        if op in (">", "gt"):
            return forecast_val > target
        elif op in (">=", "gte", "=>"):
            return forecast_val >= target
        elif op in ("<", "lt"):
            return forecast_val < target
        elif op in ("<=", "lte", "=<"):
            return forecast_val <= target
        elif op in ("==", "=", "eq"):
            return abs(forecast_val - target) < 0.01
        elif op in ("!=", "ne"):
            return abs(forecast_val - target) >= 0.01

        return False

    def _extract_forecast_param(self, fv: ForecastVariablesInput, param_name: str) -> Optional[float]:
        """
        Maps standard parameter names from Knowledge Base to forecast variable properties.
        """
        eff_rh = fv.get_effective_humidity()
        norm_name = param_name.lower().strip().replace(" ", "_")
        param_map = {
            "rainfall": fv.rainfall_mm,
            "rainfall_mm": fv.rainfall_mm,
            "rain": fv.rainfall_mm,
            "precipitation": fv.rainfall_mm,
            "rainfall_rate": fv.rainfall_rate_mm_hr or 0.0,
            "rain_probability": fv.rain_probability_pct or 0.0,
            "temp_max": fv.temp_max_c,
            "temp_max_c": fv.temp_max_c,
            "max_temp": fv.temp_max_c,
            "temperature_max": fv.temp_max_c,
            "temp_min": fv.temp_min_c,
            "temp_min_c": fv.temp_min_c,
            "min_temp": fv.temp_min_c,
            "temperature_min": fv.temp_min_c,
            "humidity": eff_rh,
            "humidity_pct": eff_rh,
            "relative_humidity": eff_rh,
            "relative_humidity_pct": eff_rh,
            "rh": eff_rh,
            "rh_pct": eff_rh,
            "wind": fv.wind_speed_kmh,
            "wind_speed": fv.wind_speed_kmh,
            "wind_speed_kmh": fv.wind_speed_kmh,
            "wind_gusts": fv.wind_gusts_kmh or fv.wind_speed_kmh,
            "pressure": fv.pressure_hpa or 960.0,
            "soil_moisture": fv.soil_moisture_pct or 40.0,
            "soil_moisture_pct": fv.soil_moisture_pct or 40.0,
            "leaf_wetness": fv.leaf_wetness_pct or 20.0,
        }
        return param_map.get(norm_name)

    def evaluate_risk(self, req: CropRiskEvaluationInput) -> CropRiskEvaluationOutput:
        """
        Main entrypoint: Evaluates full agricultural risk vector against active Knowledge Base rules.
        """
        # 1. Resolve Crop and Growth Stage
        crop = self.crop_repo.get_by_id(req.crop_id)
        crop_id_resolved = crop.id if crop else req.crop_id
        crop_name_en = crop.name_en if crop else "Soybean"
        crop_name_hi = crop.name_hi if crop else "सोयाबीन"

        stages = self.crop_repo.get_stages_for_crop(crop_id_resolved)
        selected_stage = None
        if req.stage_id:
            for s in stages:
                s_id = getattr(s, 'stage_id', getattr(s, 'id', ''))
                if s_id == req.stage_id or self._normalize_id(s_id) in self._normalize_id(req.stage_id) or self._normalize_id(req.stage_id) in self._normalize_id(s_id):
                    selected_stage = s
                    break
        
        if not selected_stage:
            selected_stage = stages[1] if len(stages) > 1 else (stages[0] if stages else None)

        stage_id_resolved = getattr(selected_stage, 'stage_id', getattr(selected_stage, 'id', '')) if selected_stage else (req.stage_id or "stage-soy-pod")
        stage_name_en = selected_stage.name_en if selected_stage else "Pod Development (DAS 55-75)"
        stage_name_hi = selected_stage.name_hi if selected_stage else "फलियां बनना (55-75 दिन)"

        # 2. Query Active Knowledge Base Rules
        rules = self.db.query(AdvisoryRuleModel).filter(
            AdvisoryRuleModel.approval_status.in_(["approved", "published", "draft"])
        ).all()

        fv = req.forecast_variables
        eff_rh = fv.get_effective_humidity()
        duration_hrs = req.event_duration_hours
        horizon_days = req.forecast_horizon_days
        base_confidence = req.confidence_score

        # 3. Horizon Confidence Discounting
        # Confidence degrades over lead time: 1-2d (1.0x), 3-4d (0.9x), 5-7d (0.78x)
        horizon_discount = max(0.65, 1.0 - (horizon_days - 1) * 0.045)
        adjusted_confidence = round(base_confidence * horizon_discount, 1)

        # 4. Duration Multiplier for Sustained Adverse Conditions
        duration_multiplier = 1.0
        if duration_hrs >= 72.0:
            duration_multiplier = 1.35
        elif duration_hrs >= 48.0:
            duration_multiplier = 1.25
        elif duration_hrs >= 36.0:
            duration_multiplier = 1.12

        # 5. Evaluate Rules Against Incoming Forecast Parameters
        triggered_rules: List[Tuple[AdvisoryRuleModel, float, str]] = []

        for rule in rules:
            # Check crop match (with normalized fallback or "all")
            crop_match = (
                rule.crop_id == "all" or
                rule.crop_id == crop_id_resolved or
                self._normalize_id(rule.crop_id) in self._normalize_id(crop_id_resolved) or
                self._normalize_id(crop_id_resolved) in self._normalize_id(rule.crop_id)
            )
            if not crop_match:
                continue

            # Check stage match (with "all" fallback)
            stage_match = (
                rule.stage_id == "all" or
                rule.stage_id == stage_id_resolved or
                self._normalize_id(rule.stage_id) in self._normalize_id(stage_id_resolved) or
                self._normalize_id(stage_id_resolved) in self._normalize_id(rule.stage_id)
            )
            if not stage_match:
                continue

            # Parse and evaluate thresholds JSON
            try:
                thresholds_list = json.loads(rule.thresholds_json) if isinstance(rule.thresholds_json, str) else rule.thresholds_json
            except Exception:
                thresholds_list = []

            rule_triggered = True
            reasons = []

            for t_item in thresholds_list:
                param = t_item.get("parameter", "")
                op = t_item.get("operator", ">=")
                val = t_item.get("value", 0.0)

                fc_val = self._extract_forecast_param(fv, param)
                matched = self._evaluate_condition(fc_val, op, val)
                if matched:
                    reasons.append(f"{param} ({fc_val}) {op} {val}")
                else:
                    rule_triggered = False
                    break

            if rule_triggered and thresholds_list:
                # Severity weight mapping
                sev_weights = {"critical": 85.0, "warning": 65.0, "advisory": 40.0, "normal": 15.0}
                base_score = sev_weights.get(rule.severity.lower(), 45.0)
                final_rule_score = min(100.0, base_score * duration_multiplier)
                triggered_rules.append((rule, final_rule_score, "; ".join(reasons)))

        # Sort triggered rules by severity priority and score descending
        sev_rank = {"critical": 4, "warning": 3, "advisory": 2, "normal": 1}
        triggered_rules.sort(key=lambda x: (sev_rank.get(x[0].severity.lower(), 1), x[1]), reverse=True)

        # 6. Compute Sub-Risk Categories Breakdown
        sub_risk_items: List[SubRiskEvaluationItem] = []

        # A. Pest & Disease Risk (Driven by RH > 75% and Temp 25-32°C and Duration)
        pest_rule = next((r for r in triggered_rules if "pest" in r[0].risk_category.lower() or "disease" in r[0].risk_category.lower()), None)
        if pest_rule:
            p_score = int(pest_rule[1])
            p_sev = pest_rule[0].severity.lower()
            p_trig = True
            p_sum_en = f"Triggered by {pest_rule[0].rule_code}: {pest_rule[2]}"
            p_sum_hi = f"{pest_rule[0].rule_code} द्वारा सक्रिय: {pest_rule[0].weather_trigger_hi}"
            p_code = pest_rule[0].rule_code
            p_ver = pest_rule[0].version
        else:
            # Parametric fallback evaluation
            p_trig = fv.humidity_pct >= 80.0 and 24.0 <= fv.temp_max_c <= 33.0
            p_score = int(min(90.0, (55.0 + (fv.humidity_pct - 80.0) * 1.8) * duration_multiplier)) if p_trig else 18
            p_sev = "warning" if p_score >= 60 else ("advisory" if p_score >= 35 else "normal")
            p_sum_en = f"High RH ({fv.humidity_pct}%) favorable for pest vectors" if p_trig else "Normal pest vector index"
            p_sum_hi = f"अधिक आर्द्रता ({fv.humidity_pct}%) कीट प्रकोप हेतु अनुकूल" if p_trig else "कीट स्तर सामान्य"
            p_code = "RULE-AUTO-PEST-01"
            p_ver = "v1.0"

        p_sev_lbl = SEVERITY_LABELS.get(p_sev, SEVERITY_LABELS["normal"])
        sub_risk_items.append(SubRiskEvaluationItem(
            category_id="pest_disease",
            category_name_en="Pest & Disease Vector",
            category_name_hi="कीट एवं फफूंद रोग जोखिम",
            score=p_score,
            severity=p_sev,
            severity_label_en=p_sev_lbl["en"],
            severity_label_hi=p_sev_lbl["hi"],
            is_triggered=p_trig,
            trigger_summary_en=p_sum_en,
            trigger_summary_hi=p_sum_hi,
            triggered_rule_code=p_code,
            triggered_rule_version=p_ver
        ))

        # B. Excess Water & Drainage Risk (Rainfall >= 25mm or continuous wet spell)
        water_rule = next((r for r in triggered_rules if "water" in r[0].risk_category.lower() or "drainage" in r[0].risk_category.lower()), None)
        if water_rule:
            w_score = int(water_rule[1])
            w_sev = water_rule[0].severity.lower()
            w_trig = True
            w_sum_en = f"Triggered by {water_rule[0].rule_code}: {water_rule[2]}"
            w_sum_hi = f"{water_rule[0].rule_code} द्वारा सक्रिय: {water_rule[0].weather_trigger_hi}"
            w_code = water_rule[0].rule_code
            w_ver = water_rule[0].version
        else:
            w_trig = fv.rainfall_mm >= 20.0
            w_score = int(min(100.0, (40.0 + fv.rainfall_mm * 1.5) * duration_multiplier)) if w_trig else (25 if fv.rainfall_mm > 5.0 else 10)
            w_sev = "critical" if w_score >= 75 else ("warning" if w_score >= 50 else ("advisory" if w_score >= 25 else "normal"))
            w_sum_en = f"Heavy rainfall accumulation of {fv.rainfall_mm}mm expected" if w_trig else "Normal soil drainage"
            w_sum_hi = f"{fv.rainfall_mm} मिमी वर्षा से जलभराव की संभावना" if w_trig else "जल निकास सामान्य"
            w_code = "RULE-AUTO-WATER-01"
            w_ver = "v1.0"

        w_sev_lbl = SEVERITY_LABELS.get(w_sev, SEVERITY_LABELS["normal"])
        sub_risk_items.append(SubRiskEvaluationItem(
            category_id="excess_water",
            category_name_en="Excess Moisture / Drainage",
            category_name_hi="अत्यधिक नमी एवं जलभराव",
            score=w_score,
            severity=w_sev,
            severity_label_en=w_sev_lbl["en"],
            severity_label_hi=w_sev_lbl["hi"],
            is_triggered=w_trig,
            trigger_summary_en=w_sum_en,
            trigger_summary_hi=w_sum_hi,
            triggered_rule_code=w_code,
            triggered_rule_version=w_ver
        ))

        # C. Thermal Stress (Heatwave > 36°C or Frost < 4°C)
        thermal_rule = next((r for r in triggered_rules if "thermal" in r[0].risk_category.lower() or "heat" in r[0].risk_category.lower() or "temp" in r[0].risk_category.lower()), None)
        if thermal_rule:
            t_score = int(thermal_rule[1])
            t_sev = thermal_rule[0].severity.lower()
            t_trig = True
            t_sum_en = f"Triggered by {thermal_rule[0].rule_code}: {thermal_rule[2]}"
            t_sum_hi = f"{thermal_rule[0].rule_code} द्वारा सक्रिय: {thermal_rule[0].weather_trigger_hi}"
            t_code = thermal_rule[0].rule_code
            t_ver = thermal_rule[0].version
        else:
            t_trig = fv.temp_max_c >= 35.0 or fv.temp_min_c <= 5.0
            t_score = int(min(90.0, (50.0 + (fv.temp_max_c - 35.0) * 6.0) * duration_multiplier)) if fv.temp_max_c >= 35.0 else 12
            t_sev = "warning" if t_score >= 50 else ("advisory" if t_score >= 30 else "normal")
            t_sum_en = f"Elevated max temperature ({fv.temp_max_c}°C)" if t_trig else "Thermal window optimal"
            t_sum_hi = f"उच्च तापमान ({fv.temp_max_c}°C)" if t_trig else "तापमान फसल हेतु अनुकूल"
            t_code = "RULE-AUTO-THERMAL-01"
            t_ver = "v1.0"

        t_sev_lbl = SEVERITY_LABELS.get(t_sev, SEVERITY_LABELS["normal"])
        sub_risk_items.append(SubRiskEvaluationItem(
            category_id="thermal_stress",
            category_name_en="Thermal Stress (Heat/Frost)",
            category_name_hi="तापमान तनाव (गर्मी/पाला)",
            score=t_score,
            severity=t_sev,
            severity_label_en=t_sev_lbl["en"],
            severity_label_hi=t_sev_lbl["hi"],
            is_triggered=t_trig,
            trigger_summary_en=t_sum_en,
            trigger_summary_hi=t_sum_hi,
            triggered_rule_code=t_code,
            triggered_rule_version=t_ver
        ))

        # D. Spray Window Feasibility (Wind > 15 km/h or Rain > 2mm)
        s_trig = fv.wind_speed_kmh > 15.0 or fv.rainfall_mm > 1.0 or (fv.rain_probability_pct or 0.0) > 30.0
        s_score = int(min(95.0, 30.0 + (fv.wind_speed_kmh - 15.0) * 4.0 + fv.rainfall_mm * 5.0)) if s_trig else 10
        s_sev = "critical" if s_score >= 70 else ("warning" if s_score >= 45 else ("advisory" if s_score >= 25 else "normal"))
        s_sum_en = f"Wind speed ({fv.wind_speed_kmh} km/h) & rain risk cause drift/wash-off" if s_trig else "Favourable calm spray conditions"
        s_sum_hi = f"हवा की गति ({fv.wind_speed_kmh} किमी/घंटा) एवं वर्षा से छिड़काव अनुचित" if s_trig else "छिड़काव हेतु शांत मौसम"
        s_sev_lbl = SEVERITY_LABELS.get(s_sev, SEVERITY_LABELS["normal"])
        sub_risk_items.append(SubRiskEvaluationItem(
            category_id="spray_window",
            category_name_en="Spray Drift & Wash-off Risk",
            category_name_hi="छिड़काव अनुकूलता (हवा/वर्षा)",
            score=s_score,
            severity=s_sev,
            severity_label_en=s_sev_lbl["en"],
            severity_label_hi=s_sev_lbl["hi"],
            is_triggered=s_trig,
            trigger_summary_en=s_sum_en,
            trigger_summary_hi=s_sum_hi,
            triggered_rule_code="RULE-AGRO-SPRAY-01",
            triggered_rule_version="v1.0"
        ))

        # E. Moisture Deficit / Drought (Rainfall < 1mm & Soil Moisture < 30%)
        m_trig = fv.rainfall_mm < 1.0 and (fv.soil_moisture_pct or 40.0) < 32.0
        m_score = int(min(90.0, 45.0 + (32.0 - (fv.soil_moisture_pct or 40.0)) * 2.5)) if m_trig else 10
        m_sev = "warning" if m_score >= 50 else ("advisory" if m_score >= 25 else "normal")
        m_sum_en = f"Soil moisture depleted ({fv.soil_moisture_pct or 40.0}%) with dry outlook" if m_trig else "Soil moisture adequate"
        m_sum_hi = f"मृदा नमी में कमी ({fv.soil_moisture_pct or 40.0}%)" if m_trig else "मृदा नमी पर्याप्त"
        m_sev_lbl = SEVERITY_LABELS.get(m_sev, SEVERITY_LABELS["normal"])
        sub_risk_items.append(SubRiskEvaluationItem(
            category_id="moisture_deficit",
            category_name_en="Moisture Deficit / Drought",
            category_name_hi="नमी की कमी (सूखा तनाव)",
            score=m_score,
            severity=m_sev,
            severity_label_en=m_sev_lbl["en"],
            severity_label_hi=m_sev_lbl["hi"],
            is_triggered=m_trig,
            trigger_summary_en=m_sum_en,
            trigger_summary_hi=m_sum_hi,
            triggered_rule_code="RULE-AGRO-DROUGHT-01",
            triggered_rule_version="v1.0"
        ))

        # 7. Synthesize Composite 0-100 Risk Score
        scores = [item.score for item in sub_risk_items]
        max_score = max(scores)
        mean_score = sum(scores) / len(scores)
        composite_score = int(min(100, max(0, round(max_score * 0.65 + mean_score * 0.35))))

        # Determine overall severity tier
        if composite_score >= 75:
            overall_sev = "critical"
            primary_cat = "excess_water" if w_score >= p_score else "pest_disease"
        elif composite_score >= 50:
            overall_sev = "warning"
            primary_cat = "pest_disease" if p_score >= w_score else "excess_water"
        elif composite_score >= 25:
            overall_sev = "advisory"
            primary_cat = "spray_window" if s_score >= p_score else "pest_disease"
        else:
            overall_sev = "normal"
            primary_cat = "normal"

        overall_sev_lbl = SEVERITY_LABELS.get(overall_sev, SEVERITY_LABELS["normal"])

        # 8. Extract Highest-Priority Triggered Rule for Approved Recommendations
        top_rule_tuple = triggered_rules[0] if triggered_rules else None
        if top_rule_tuple:
            top_rule = top_rule_tuple[0]
            rule_id = top_rule.id
            rule_code = top_rule.rule_code
            rule_ver = top_rule.version
            explanation_en = f"{top_rule.short_summary_en} (Trigger: {top_rule_tuple[2]}). Event duration: {duration_hrs:.0f}h."
            explanation_hi = f"{top_rule.short_summary_hi} (ट्रिगर: {top_rule.weather_trigger_hi})। घटना अवधि: {duration_hrs:.0f} घंटे।"
            action_en = top_rule.recommended_action_en
            action_hi = top_rule.recommended_action_hi
            source_org_en = top_rule.source_org_en
            source_org_hi = top_rule.source_org_hi
            source_ref = top_rule.source_ref_en
        else:
            # Fallback based on primary active sub-risk if elevated, otherwise normal status
            top_sub_item = max(sub_risk_items, key=lambda x: x.score)
            if top_sub_item.score >= 35:
                rule_id = None
                rule_code = top_sub_item.triggered_rule_code or "RULE-PARAMETRIC-01"
                rule_ver = top_sub_item.triggered_rule_version or "v1.0"
                explanation_en = f"{top_sub_item.trigger_summary_en} for {crop_name_en} ({stage_name_en}). Event duration: {duration_hrs:.0f}h."
                explanation_hi = f"{crop_name_hi} ({stage_name_hi}) हेतु {top_sub_item.trigger_summary_hi}। घटना अवधि: {duration_hrs:.0f} घंटे।"
                
                # Contextual non-chemical recommendations
                if top_sub_item.category_id == "excess_water":
                    action_en = "Inspect field bunds and clear natural drainage pathways to prevent water stagnation in vertisol root zone."
                    action_hi = "खेत की मेड़ों का निरीक्षण करें और जल निकासी नालियों को खोलें ताकि जड़ों में पानी न ठहरे।"
                elif top_sub_item.category_id == "spray_window":
                    action_en = "Postpone foliar applications until wind speeds drop below 12 km/h and rain probability subsides."
                    action_hi = "हवा की गति 12 किमी/घंटा से कम होने और वर्षा की संभावना समाप्त होने तक छिड़काव टालें।"
                elif top_sub_item.category_id == "thermal_stress":
                    action_en = "Provide light evening irrigation to maintain root zone thermal buffer and minimize heat/cold impact."
                    action_hi = "शाम के समय हल्की सिंचाई करें ताकि मिट्टी का तापमान संतुलित रहे।"
                elif top_sub_item.category_id == "moisture_deficit":
                    action_en = "Apply scheduled protective irrigation to alleviate critical root zone moisture deficit."
                    action_hi = "फसल को सूखे के तनाव से बचाने के लिए तुरंत हल्की सुरक्षात्मक सिंचाई करें।"
                else:
                    action_en = "Conduct field scouting and consult local KVK Bhopal agronomists for stage-specific cultural management."
                    action_hi = "खेत का नियमित निरीक्षण करें और केवीके भोपाल विशेषज्ञों से परामर्श अनुसार प्रबंधन करें।"
                
                source_org_en = "ICAR - Indian Institute of Soybean Research / CIAE Bhopal"
                source_org_hi = "भा.कृ.अनु.प. - सोयाबीन अनुसंधान संस्थान / सीआईएई भोपाल"
                source_ref = "ICAR-KVK Agromet Field Management Advisory"
            else:
                rule_id = None
                rule_code = "RULE-DEF-NORMAL-01"
                rule_ver = "v1.0"
                explanation_en = f"Weather conditions ({fv.temp_max_c}°C, {eff_rh}% RH, {fv.rainfall_mm}mm rain) are within normal physiological thresholds for {crop_name_en} at {stage_name_en}."
                explanation_hi = f"{crop_name_hi} की {stage_name_hi} अवस्था हेतु मौसम की स्थिति ({fv.temp_max_c}°C, {eff_rh}% नमी) अनुकूल सीमा में है।"
                action_en = "Continue routine field monitoring. Ensure field drainage channels remain unblocked and clear of weeds."
                action_hi = "नियमित खेत निगरानी जारी रखें। जल निकास नालियों को खरपतवार मुक्त और साफ रखें।"
                source_org_en = "ICAR - Indian Institute of Soybean Research (IISR), Indore"
                source_org_hi = "भा.कृ.अनु.प. - भारतीय सोयाबीन अनुसंधान संस्थान, इंदौर"
                source_ref = "ICAR Agromet Advisory Bulletin MP-2026/09"

        return CropRiskEvaluationOutput(
            crop_id=crop_id_resolved,
            crop_name_en=crop_name_en,
            crop_name_hi=crop_name_hi,
            stage_id=stage_id_resolved,
            stage_name_en=stage_name_en,
            stage_name_hi=stage_name_hi,
            composite_risk_score=composite_score,
            severity=overall_sev,
            severity_label_en=overall_sev_lbl["en"],
            severity_label_hi=overall_sev_lbl["hi"],
            primary_risk_category=primary_cat,
            explanation_en=explanation_en,
            explanation_hi=explanation_hi,
            recommended_action_en=action_en,
            recommended_action_hi=action_hi,
            triggered_rule_id=rule_id,
            rule_code=rule_code,
            rule_version=rule_ver,
            source_organization_en=source_org_en,
            source_organization_hi=source_org_hi,
            source_reference=source_ref,
            forecast_horizon_days=horizon_days,
            event_duration_hours=duration_hrs,
            adjusted_confidence_pct=adjusted_confidence,
            sub_risks=sub_risk_items
        )
