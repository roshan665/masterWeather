export const translations = {
  hi: {
    // App Header & Branding
    appTitle: 'पंचायत मौसम AI',
    appSubtitle: 'फंदा ब्लॉक, भोपाल - कृषि मौसम एवं फसल जोखिम निर्णय प्रणाली',
    pilotBanner: 'प्रायोगिक संस्करण: फंदा ब्लॉक की 5 ग्राम पंचायतें (प्रारंभिक परीक्षण डेटा)',

    // Roles
    roleFarmer: 'किसान',
    roleOfficer: 'कृषि अधिकारी',
    roleAdmin: 'प्रशासक',
    roleResearcher: 'शोधकर्ता',
    switchRole: 'भूमिका बदलें',

    // Navigation
    navHome: 'होम',
    navWeather: 'वर्तमान मौसम',
    navForecast: 'पूर्वानुमान',
    navRisks: 'फसल जोखिम',
    navAdvisories: 'कृषि सलाह',
    navAlerts: 'अलर्ट केंद्र',
    navObservations: 'खेत अवलोकन',
    navFeedback: 'प्रतिक्रिया',
    navSettings: 'सेटिंग्स',

    // Officer Nav
    navOfficerDashboard: 'अधिकारी डैशबोर्ड',
    navOfficerMap: 'पंचायत मानचित्र',
    navOfficerForecasts: 'मौसम विश्लेषण',
    navOfficerRisks: 'जोखिम समीक्षा',
    navOfficerAdvisories: 'सलाह अनुमोदन',
    navOfficerObservations: 'अवलोकन सत्यापन',
    navOfficerAlerts: 'अलर्ट प्रसारण',
    navOfficerAnalytics: 'प्रदर्शन व सटीकता',

    // Admin Nav
    navAdminUsers: 'उपयोगकर्ता प्रबंधन',
    navAdminPanchayats: 'पंचायत व स्टेशन',
    navAdminRules: 'सलाह नियम',
    navAdminDataSources: 'डेटा स्रोत स्थिति',
    navAdminAuditLogs: 'ऑडिट लॉग',

    // Research Nav
    navResearchModels: 'मॉडल बेंचमार्क',
    navResearchExperiments: 'माइक्रो-क्लाइमेट लैब',
    navResearchFeedback: 'सत्यापन सहसंबंध',

    // Panchayat & Location
    selectPanchayat: 'ग्राम पंचायत चुनें',
    useGpsLocation: 'जीपीएस से स्थान पता करें',
    gpsDetected: 'निकटतम पंचायत खोजी गई',
    blockName: 'विकासखंड: फंदा, जिला: भोपाल (म.प्र.)',
    stationLabel: 'संबद्ध एडब्ल्यूएस स्टेशन',
    stationStatusActive: 'सक्रिय (प्रत्यक्ष सेंसर)',
    stationStatusFallback: 'बैकअप / ग्रिडेड अनुमान',

    // Crop Selection
    selectCrop: 'फसल चुनें',
    sowingDate: 'बुवाई की तारीख',
    daysAfterSowing: 'बुवाई के दिन (DAS)',
    currentStageLabel: 'वर्तमान फसल अवस्था',
    estimatedHarvest: 'अनुमानित कटाई',
    updateSowingDate: 'बुवाई तिथि बदलें',

    // Weather Metrics
    temperature: 'तापमान',
    feelsLike: 'महसूस होने वाला',
    tempMax: 'अधिकतम तापमान',
    tempMin: 'न्यूनतम तापमान',
    rainfall24h: 'विगत 24 घंटे वर्षा',
    relativeHumidity: 'आपेक्षिक आर्द्रता',
    windSpeed: 'हवा की गति',
    windDirection: 'हवा की दिशा',
    solarRadiation: 'सौर विकिरण',
    et0Evapo: 'वाष्पोत्सर्जन (ET₀)',
    dewPoint: 'ओस बिंदु (Dew Point)',
    uvIndex: 'यूवी इंडेक्स',
    airPressure: 'वायुमंडलीय दबाव',
    lastUpdated: 'अंतिम अपडेट',
    dataSource: 'डेटा स्रोत',
    confidenceLevel: 'विश्वसनीयता स्तर',

    // Forecast Tabs & Headings
    forecastHourly: 'अगले 24 घंटे (प्रति घंटा)',
    forecast1to3d: '1 से 3 दिन का पूर्वानुमान',
    forecast4to7d: '4 से 7 दिन का दृष्टिकोण',
    popRainChance: 'बारिश की संभावना',
    expectedRainfall: 'अनुमानित वर्षा',
    spraySuitability: 'कीटनाशक छिड़काव अनुकूलता',
    sprayOptimal: 'अनुकूल (छिड़काव कर सकते हैं)',
    sprayMarginal: 'सावधानीपूर्वक करें',
    sprayUnfavourable: 'प्रतिकूल (छिड़काव न करें)',

    // Risk Levels & Cards
    riskLevelNormal: 'सामान्य (0-24)',
    riskLevelAdvisory: 'सलाह स्तर (25-49)',
    riskLevelWarning: 'चेतावनी स्तर (50-74)',
    riskLevelCritical: 'गंभीर जोखिम (75-100)',
    compositeRiskScore: 'समग्र फसल मौसम जोखिम स्कोर',
    riskPestDisease: 'कीट व रोग प्रकोप जोखिम',
    riskThermalStress: 'तापमान तनाव (गर्मी/पाला)',
    riskExcessWater: 'अत्यधिक जलभराव जोखिम',
    riskMoistureDeficit: 'नमी की कमी / सूखा तनाव',
    riskSprayDisruption: 'छिड़काव व कृषि कार्य बाधा',
    recommendedMitigation: 'अनुशंसित सुरक्षात्मक कदम',

    // Advisory Cards
    officialApprovedAdvisory: 'कृषि विभाग द्वारा अनुमोदित सलाह',
    approvedByOfficer: 'सत्यापित कर्ता: कृषि विस्तार अधिकारी',
    listenAdvisoryAudio: 'सलाह सुनें (ऑडियो)',
    playingAudio: 'चल रहा है...',
    stopAudio: 'रोकें',
    detailedGuidance: 'विस्तृत कृषि दिशा-निर्देश',
    weatherTrigger: 'मौसम ट्रिगर',
    wasThisHelpful: 'क्या यह सलाह आपके लिए उपयोगी थी?',
    helpfulYes: 'हाँ, उपयोगी थी',
    helpfulNo: 'नहीं',
    sourceLabel: 'स्रोत: कृषि विज्ञान केंद्र (KVK) एवं मौसम विभाग (IMD)',

    // Alerts
    activeAlertsTitle: 'सक्रिय मौसम चेतावनी एवं अलर्ट',
    noActiveAlerts: 'वर्तमान में कोई गंभीर मौसम चेतावनी सक्रिय नहीं है। मौसम अनुकूल है।',
    alertSeverity: 'तीव्रता',
    affectedPanchayats: 'प्रभावित पंचायतें',
    immediateAction: 'तत्काल आवश्यक कार्रवाई',

    // Farmer Observations Form
    observationTitle: 'खेत का मौसम एवं फसल अवलोकन दर्ज करें',
    observationSubtitle: 'आपके द्वारा साझा की गई जानकारी से क्षेत्र के अन्य किसानों और कृषि वैज्ञानिकों को सहायता मिलती है।',
    farmerNameLabel: 'आपका नाम',
    contactNumberLabel: 'मोबाइल नंबर (वैकल्पिक)',
    observedRainfallLabel: 'वर्षा की स्थिति',
    observedRainNone: 'कोई वर्षा नहीं',
    observedRainLight: 'हल्की बूंदाबांदी (<5 मिमी)',
    observedRainModerate: 'मध्यम वर्षा (5-20 मिमी)',
    observedRainHeavy: 'तेज/भारी वर्षा (>20 मिमी)',
    soilMoistureLabel: 'खेत में मिट्टी की नमी',
    soilDry: 'सूखी (सिंचाई आवश्यक)',
    soilOptimal: 'पर्याप्त नमी (वापसा स्थिति)',
    soilWet: 'अधिक गीली',
    soilWaterlogged: 'जलभराव (पानी भरा हुआ)',
    pestObservedLabel: 'कीट अथवा रोग के लक्षण (यदि दिखे हों)',
    cropStressNotesLabel: 'फसल की स्थिति या अन्य टिप्पणी',
    submitObservationBtn: 'अवलोकन सुरक्षित करें व भेजें',
    observationSuccess: 'धन्यवाद! आपका अवलोकन सफलतापूर्वक दर्ज हो गया है और समीक्षाधीन है।',
    recentCommunityObservations: 'क्षेत्रीय किसानों द्वारा हाल के अवलोकन',

    // Officer Workflow Actions
    officerOverview: 'फंदा ब्लॉक कृषि मौसम नियंत्रण कक्ष',
    totalPanchayatsMonitored: 'निगरानी अधीन ग्राम पंचायतें',
    highRiskPanchayatsCount: 'उच्च जोखिम क्षेत्र',
    pendingAdvisoriesCount: 'लंबित सलाह समीक्षा',
    pendingObservationsCount: 'नये किसान अवलोकन',
    btnApproveAdvisory: 'स्वीकृत करें व प्रकाशित करें',
    btnRejectAdvisory: 'अस्वीकृत करें',
    btnEditAdvisory: 'संशोधित करें',
    btnBroadcastAlert: 'नया आपातकालीन अलर्ट जारी करें',
    btnVerifyObservation: 'सत्यापित करें',
    btnFlagFieldVisit: 'खेत दौरे हेतु चिह्नित करें',

    // Research & Fallback
    dataFallbackNote: 'नोट: स्थानीय स्टेशन संचार बाधित होने पर 5 किमी ग्रिडेड अनुमान का उपयोग किया गया है।',
    confidenceHighDesc: 'स्थानीय ग्राउंड सेंसर व रडार द्वारा उच्च विश्वसनीयता',
    confidenceMediumDesc: 'ग्रिडेड मॉडल और उपग्रह डेटा आधारित मध्यम विश्वसनीयता',
    confidenceLowDesc: 'ऐतिहासिक मौसमी अनुमान पर आधारित (कृपया खेत अवलोकन से पुष्टि करें)',

    // Common Buttons
    refresh: 'ताज़ा करें',
    close: 'बंद करें',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    filter: 'फ़िल्टर',
    search: 'खोजें',
    details: 'विवरण देखें',
    demoNotice: 'डेमो मोड: सभी डेटा वास्तविक परिदृश्यों के आधार पर तैयार किए गए हैं।',
  },

  en: {
    // App Header & Branding
    appTitle: 'PanchayatMausam AI',
    appSubtitle: 'Phanda Block, Bhopal - Agromet & Crop Risk Decision Support System',
    pilotBanner: 'Pilot Release: 5 Gram Panchayats of Phanda Block (Evaluation Data)',

    // Roles
    roleFarmer: 'Farmer',
    roleOfficer: 'Agricultural Officer',
    roleAdmin: 'Administrator',
    roleResearcher: 'Researcher',
    switchRole: 'Switch Role',

    // Navigation
    navHome: 'Home',
    navWeather: 'Current Weather',
    navForecast: 'Forecast',
    navRisks: 'Crop Risks',
    navAdvisories: 'Advisories',
    navAlerts: 'Alert Center',
    navObservations: 'Field Observations',
    navFeedback: 'Feedback',
    navSettings: 'Settings',

    // Officer Nav
    navOfficerDashboard: 'Officer Dashboard',
    navOfficerMap: 'Panchayat Map',
    navOfficerForecasts: 'Weather Analysis',
    navOfficerRisks: 'Risk Review',
    navOfficerAdvisories: 'Advisory Approvals',
    navOfficerObservations: 'Observation Queue',
    navOfficerAlerts: 'Alert Broadcast',
    navOfficerAnalytics: 'Model Analytics',

    // Admin Nav
    navAdminUsers: 'User Management',
    navAdminPanchayats: 'Panchayats & AWS',
    navAdminRules: 'Advisory Rules',
    navAdminDataSources: 'Data Source Status',
    navAdminAuditLogs: 'Audit Logs',

    // Research Nav
    navResearchModels: 'Model Benchmarks',
    navResearchExperiments: 'Microclimate Lab',
    navResearchFeedback: 'Validation Analytics',

    // Panchayat & Location
    selectPanchayat: 'Select Gram Panchayat',
    useGpsLocation: 'Use GPS Location',
    gpsDetected: 'Nearest Panchayat Located',
    blockName: 'Block: Phanda, District: Bhopal (M.P.)',
    stationLabel: 'Linked AWS Station',
    stationStatusActive: 'Active (Direct Sensor)',
    stationStatusFallback: 'Fallback / Gridded Estimate',

    // Crop Selection
    selectCrop: 'Select Crop',
    sowingDate: 'Sowing Date',
    daysAfterSowing: 'Days After Sowing (DAS)',
    currentStageLabel: 'Current Crop Stage',
    estimatedHarvest: 'Estimated Harvest',
    updateSowingDate: 'Update Sowing Date',

    // Weather Metrics
    temperature: 'Temperature',
    feelsLike: 'Feels Like',
    tempMax: 'Max Temperature',
    tempMin: 'Min Temperature',
    rainfall24h: '24h Rainfall',
    relativeHumidity: 'Relative Humidity',
    windSpeed: 'Wind Speed',
    windDirection: 'Wind Direction',
    solarRadiation: 'Solar Radiation',
    et0Evapo: 'Evapotranspiration (ET₀)',
    dewPoint: 'Dew Point',
    uvIndex: 'UV Index',
    airPressure: 'Atmospheric Pressure',
    lastUpdated: 'Last Updated',
    dataSource: 'Data Source',
    confidenceLevel: 'Confidence Level',

    // Forecast Tabs & Headings
    forecastHourly: 'Next 24 Hours (Hourly)',
    forecast1to3d: '1 to 3 Day Forecast',
    forecast4to7d: '4 to 7 Day Outlook',
    popRainChance: 'Rain Probability',
    expectedRainfall: 'Expected Rain',
    spraySuitability: 'Agrochemical Spray Suitability',
    sprayOptimal: 'Optimal (Safe to Spray)',
    sprayMarginal: 'Marginal Caution',
    sprayUnfavourable: 'Unfavourable (Do Not Spray)',

    // Risk Levels & Cards
    riskLevelNormal: 'Normal (0-24)',
    riskLevelAdvisory: 'Advisory (25-49)',
    riskLevelWarning: 'Warning (50-74)',
    riskLevelCritical: 'Critical Risk (75-100)',
    compositeRiskScore: 'Composite Crop Weather Risk Score',
    riskPestDisease: 'Pest & Disease Outbreak Risk',
    riskThermalStress: 'Thermal Stress (Heat / Cold)',
    riskExcessWater: 'Excess Water / Waterlogging Risk',
    riskMoistureDeficit: 'Moisture Deficit / Drought Stress',
    riskSprayDisruption: 'Field Operation & Spray Disruption',
    recommendedMitigation: 'Recommended Protective Action',

    // Advisory Cards
    officialApprovedAdvisory: 'Officially Approved Agromet Advisory',
    approvedByOfficer: 'Validated by: Agricultural Extension Officer',
    listenAdvisoryAudio: 'Listen Advisory (Audio)',
    playingAudio: 'Playing audio...',
    stopAudio: 'Stop',
    detailedGuidance: 'Detailed Field Guidance',
    weatherTrigger: 'Weather Trigger',
    wasThisHelpful: 'Was this advisory helpful?',
    helpfulYes: 'Yes, helpful',
    helpfulNo: 'No',
    sourceLabel: 'Source: Krishi Vigyan Kendra (KVK) & IMD Agromet Cell',

    // Alerts
    activeAlertsTitle: 'Active Weather Warnings & Alerts',
    noActiveAlerts: 'No critical alerts active for this Panchayat. Weather conditions are within normal ranges.',
    alertSeverity: 'Severity',
    affectedPanchayats: 'Affected Panchayats',
    immediateAction: 'Immediate Action Required',

    // Farmer Observations Form
    observationTitle: 'Submit Field Weather & Crop Observation',
    observationSubtitle: 'Your ground truth reports help calibrate local weather models and support fellow farmers.',
    farmerNameLabel: 'Your Name',
    contactNumberLabel: 'Phone Number (Optional)',
    observedRainfallLabel: 'Observed Rainfall',
    observedRainNone: 'No Rain',
    observedRainLight: 'Light Drizzle (<5 mm)',
    observedRainModerate: 'Moderate Rain (5-20 mm)',
    observedRainHeavy: 'Heavy Rain (>20 mm)',
    soilMoistureLabel: 'Field Soil Moisture Condition',
    soilDry: 'Dry (Needs Irrigation)',
    soilOptimal: 'Optimal Moisture (Wapsa condition)',
    soilWet: 'Wet / Saturated',
    soilWaterlogged: 'Waterlogged / Standing Water',
    pestObservedLabel: 'Observed Pest or Disease Symptoms',
    cropStressNotesLabel: 'Crop Health / Other Observations',
    submitObservationBtn: 'Submit Observation Report',
    observationSuccess: 'Thank you! Your observation was logged successfully and sent to the agronomist queue.',
    recentCommunityObservations: 'Recent Ground Observations from Local Farmers',

    // Officer Workflow Actions
    officerOverview: 'Phanda Block Agromet Command Center',
    totalPanchayatsMonitored: 'Monitored Gram Panchayats',
    highRiskPanchayatsCount: 'High Risk Zones',
    pendingAdvisoriesCount: 'Advisories Pending Review',
    pendingObservationsCount: 'New Field Observations',
    btnApproveAdvisory: 'Approve & Broadcast',
    btnRejectAdvisory: 'Reject Draft',
    btnEditAdvisory: 'Edit Advisory',
    btnBroadcastAlert: 'Dispatch Emergency Alert',
    btnVerifyObservation: 'Verify Report',
    btnFlagFieldVisit: 'Flag for Field Visit',

    // Research & Fallback
    dataFallbackNote: 'Note: Local sensor in fallback mode; 5km numerical gridded model utilized.',
    confidenceHighDesc: 'High confidence based on direct local AWS sensor and radar',
    confidenceMediumDesc: 'Medium confidence based on gridded reanalysis and satellite',
    confidenceLowDesc: 'Low confidence based on seasonal climatology (verify with ground observations)',

    // Common Buttons
    refresh: 'Refresh',
    close: 'Close',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    filter: 'Filter',
    search: 'Search',
    details: 'View Details',
    demoNotice: 'Demo Mode: All data synthesized for demonstration and evaluation.',
  },
};
