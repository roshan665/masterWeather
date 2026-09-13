# Agricultural Advisory Knowledge Base Rulebook

## PanchayatMausam AI (पंचायत मौसम AI)
### Agronomic Thresholds, Rule Schemas, and Verification Provenance
**Grounded in Official Guidelines from**:
- **ICAR-IISR**: Indian Institute of Soybean Research, Indore, Madhya Pradesh
- **KVK CIAE**: Krishi Vigyan Kendra, Central Institute of Agricultural Engineering, Bhopal
- **JNKVV**: Jawaharlal Nehru Krishi Vishwavidyalaya, Jabalpur, Madhya Pradesh

---

## 1. Advisory Rule Condition Architecture

Every rule in the Knowledge Base is stored as an `AdvisoryRuleModel` row in the database, with dynamic, JSON-encoded meteorological conditions:

```json
{
  "rule_code": "RULE-SOY-RAIN-002",
  "crop_id": "soybean",
  "stage_id": "soy_germination",
  "weather_trigger_en": "Heavy precipitation >= 50mm causing waterlogging in deep black vertisols.",
  "weather_trigger_hi": "50 मिमी से अधिक भारी वर्षा से भारी काली मिट्टी में जलभराव।",
  "thresholds": [
    {
      "parameter": "rainfall",
      "operator": ">=",
      "value": 50.0,
      "unit": "mm"
    },
    {
      "parameter": "soil_moisture",
      "operator": ">=",
      "value": 70.0,
      "unit": "%"
    }
  ],
  "risk_category": "excess_water",
  "severity": "critical",
  "short_summary_en": "Severe waterlogging risk causing seedling collar rot and root asphyxiation.",
  "short_summary_hi": "अत्यधिक जलभराव से बीज सड़न व अंकुरण नष्ट होने का गंभीर संकट।",
  "recommended_action_en": "1. Open broad-bed furrows (BBF) or field boundary drainage trenches immediately.\n2. Ensure standing water is evacuated within 12-24 hours.\n3. Avoid heavy tractor movement in saturated soil.",
  "recommended_action_hi": "1. खेत की मेड़ों व नालियों को खोलकर तुरंत जल निकासी सुनिश्चित करें।\n2. 12-24 घंटे के भीतर खड़े पानी को बाहर निकालें।\n3. गीली मिट्टी में भारी कृषि यंत्र न चलाएं।",
  "source_org_en": "ICAR - Indian Institute of Soybean Research (IISR), Indore",
  "source_ref_en": "ICAR-IISR Technical Bulletin #54 (Vertisol Drainage Best Practices)",
  "version": "v1.3",
  "approval_status": "published"
}
```

---

## 2. Active Verified Agronomic Rulebook

### 2.1 Soybean (सोयाबीन — *Glycine max*)

#### `RULE-SOY-RAIN-002` — Vertisol Waterlogging & Collar Rot (Critical)
- **Applicable Stages**: `soy_germination` (Germination & Emergence), `soy_vegetative`
- **Meteorological Trigger**: Expected Rainfall $\ge 50\text{ mm}$ with Soil Moisture $\ge 70\%$ for $\ge 36\text{h}$.
- **Physiological Threat**: Vertisols in Phanda block have high montmorillonite clay content ($\sim 50\%$) which expands and seals drainage pores, causing seedling asphyxiation and collar rot within 24 hours of standing water.
- **Approved Action**: Open broad-bed furrows (BBF) or field boundary drainage trenches immediately. Evacuate standing water within 12–24 hours. Do not apply nitrogen top-dressing while soil is saturated.
- **Citation**: *ICAR-IISR Technical Bulletin #54 (Vertisol Drainage Best Practices)*

#### `RULE-SOY-POD-001` — Semilooper & Girdle Beetle Larval Surge (Warning)
- **Applicable Stages**: `soy_pod_dev` (Pod Development, 55–75 DAS), `soy_flowering`
- **Meteorological Trigger**: Relative Humidity $\ge 75\%$ for $\ge 48\text{h}$ with Daytime Temperature between $28^\circ\text{C}$ and $32^\circ\text{C}$.
- **Physiological Threat**: High atmospheric moisture combined with warm canopy microclimate triggers rapid egg hatch and leaf defoliation by Semilooper (*Chrysodeixis acuta*) and stem girdling by *Obereopsis brevis*.
- **Approved Action**: Install T-shaped wooden bird perches @ 40–50/ha across field. Scout 5 representative spots across vertisol plot. Deploy pheromone traps for pest monitoring.
- **Citation**: *ICAR-IISR Agromet Advisory Bulletin #42 (Kharif Season, Section 3.2)*

#### `RULE-SOY-HEAT-003` — Flowering Heat Stress & Pollen Desiccation (Warning)
- **Applicable Stages**: `soy_flowering` (Flowering & Anthesis)
- **Meteorological Trigger**: Maximum Daytime Temperature $\ge 35^\circ\text{C}$ with Soil Moisture $\le 35\%$.
- **Physiological Threat**: High temperatures during anthesis cause pollen sterility, flower abortion, and failed pod set.
- **Approved Action**: Provide light micro-sprinkler irrigation in early morning or late evening hours to maintain canopy thermal buffer.
- **Citation**: *ICAR-IISR Crop Production Manual (Heat Abatement Guidelines)*

---

### 2.2 Wheat (गेहूं — *Triticum aestivum*)

#### `RULE-WHT-CRI-001` — Crown Root Moisture Deficit Stress (Critical)
- **Applicable Stages**: `wht_cri` (Crown Root Initiation, strictly 20–25 DAS)
- **Meteorological Trigger**: Soil Moisture $\le 35\%$ with dry spell $> 21\text{ days}$ post-sowing.
- **Physiological Threat**: The CRI stage is the most critical moisture-sensitive window; water deficit permanently reduces tillering and root anchoring.
- **Approved Action**: Apply 1st light irrigation (5–6 cm depth) strictly between 20–25 DAS. Ensure uniform sprinkler distribution without flooding root crowns.
- **Citation**: *KVK CIAE Bhopal Package of Practices (Section 2.4)*

#### `RULE-WHT-HEAT-002` — Terminal Heat Stress during Grain Filling (Warning)
- **Applicable Stages**: `wht_grain_fill` (Milking & Grain Filling, February–March)
- **Meteorological Trigger**: Maximum Temperature $\ge 32^\circ\text{C}$ during grain filling.
- **Physiological Threat**: Forces premature maturity, reducing starch accumulation and causing shrivelled kernels with low test weight.
- **Approved Action**: Apply light micro-irrigation at evening hours to reduce canopy microclimate temperature by 2–3°C.
- **Citation**: *JNKVV Jabalpur Agromet Advisory Bulletin (Rabi Heat Stress Protocol)*

---

### 2.3 Chickpea / Gram (चना — *Cicer arietinum*)

#### `RULE-CHK-POD-001` — Gram Pod Borer Larval Surge (Warning)
- **Applicable Stages**: `chk_pod_dev` (Pod Formation & Development)
- **Meteorological Trigger**: Temperature between $22^\circ\text{C}$ and $30^\circ\text{C}$ with Relative Humidity $\ge 70\%$.
- **Physiological Threat**: Optimal microclimate for *Helicoverpa armigera* egg laying, pod penetration, and seed destruction.
- **Approved Action**: Install 5–8 pheromone traps per hectare. Install 40 T-shaped bird perches per hectare for natural insect predation.
- **Citation**: *ICAR-IIPR Kanpur / KVK Bhopal Chickpea Advisory #14*

#### `RULE-CHK-FROST-002` — Cold Wave & Ground Frost Hazard (Critical)
- **Applicable Stages**: `chk_flowering` (Flowering & Early Podding, December–January)
- **Meteorological Trigger**: Night Minimum Temperature $\le 4^\circ\text{C}$ with calm wind ($\le 5\text{ km/h}$).
- **Physiological Threat**: Radiational cooling freezes cell sap, causing flower drop, blackened pods, and irreversible vegetative dieback.
- **Approved Action**: Create light smoky residue fires on northern and western field borders during dawn (3–6 AM). Apply light surface irrigation in evening to increase soil thermal mass.
- **Citation**: *MP State Agromet Cold Wave / Frost Contingency Plan*

---

### 2.4 Universal Agrochemical Spray Feasibility

#### `RULE-AGRO-SPRAY-01` — Spray Drift & Wash-off Hazard (Warning)
- **Applicable Crops**: All (`soybean`, `wheat`, `chickpea`)
- **Meteorological Trigger**: Wind Speed $> 15\text{ km/h}$ OR Rainfall $> 1\text{ mm}$ OR Rain Probability $> 25\%$.
- **Threat**: Wind speeds $>15\text{ km/h}$ cause droplet drift away from the target canopy; precipitation within 4 hours washes off active foliar agents.
- **Approved Action**: Postpone all foliar spraying until wind drops below 12 km/h and rain probability clears. Early morning hours (6–9 AM) provide optimal calm windows.
- **Citation**: *ICAR-CIAE Bhopal Agrochemical Application Guidelines*

---

## 3. How to Author & Add New Rules via API

To add a new rule through the API:
```bash
curl -X POST http://localhost:8000/api/v1/rules \
  -H "Authorization: Bearer <officer_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "rule_code": "RULE-SOY-RUST-004",
    "crop_id": "soybean",
    "crop_name_en": "Soybean",
    "crop_name_hi": "सोयाबीन",
    "stage_id": "soy_pod_dev",
    "stage_name_en": "Pod Development",
    "stage_name_hi": "फली विकास",
    "weather_trigger_en": "Cloudy overcast days with RH >= 85% and Temp 22-28°C.",
    "weather_trigger_hi": "लगातार बादल व 85% से अधिक आर्द्रता।",
    "thresholds": [
      {"parameter": "rh", "operator": ">=", "value": 85, "unit": "%"},
      {"parameter": "temp_max", "operator": "between", "value": "22-28", "unit": "°C"}
    ],
    "risk_category": "pest_disease",
    "severity": "warning",
    "short_summary_en": "Rust spore germination risk in dense canopy.",
    "short_summary_hi": "सोयाबीन में गेरुआ रोग का खतरा।",
    "recommended_action_en": "Scout lower leaves for reddish-brown pustules. Consult KVK agronomist.",
    "recommended_action_hi": "निचली पत्तियों पर भूरे धब्बों की जांच करें।",
    "source_org_en": "ICAR - Indian Institute of Soybean Research (IISR), Indore",
    "source_org_hi": "भाकृअनुप - भारतीय सोयाबीन अनुसंधान संस्थान, इंदौर",
    "source_ref_en": "ICAR-IISR Disease Management Manual",
    "source_ref_hi": "आईआईएसआर रोग प्रबंधन मार्गदर्शिका",
    "version": "v1.0",
    "effective_from": "2026-07-01",
    "effective_until": "2026-10-31"
  }'
```
