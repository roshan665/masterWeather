import type { WeatherAlert } from '../types';

/**
 * DEMO ALERTS DATA
 * Priority weather alerts and severe agromet advisories issued by District Met Office / Agriculture Dept.
 */

export const MOCK_ALERTS: WeatherAlert[] = [
  {
    id: 'alt-001',
    category: 'heavy_rainfall',
    level: 'warning',
    headlineEn: 'Yellow Alert: Moderate to Heavy Thunderstorms Expected',
    headlineHi: 'येलो अलर्ट: तेज गरज-चमक के साथ मध्यम से भारी बारिश की चेतावनी',
    descriptionEn: 'IMD Doppler Radar indicates convective cloud build-up moving towards Phanda block. Gusty winds (35-45 km/h) and moderate rainfall likely in Ratibad and Samasgarh Panchayats over the next 6-12 hours.',
    descriptionHi: 'मौसम विभाग भोपाल के अनुसार फंदा ब्लॉक में अगले 6-12 घंटों में तेज हवाओं (35-45 किमी/घंटा) एवं गरज-चमक के साथ बारिश की संभावना है। विशेषकर रातीबड़ एवं समसगढ़ में सतर्क रहें।',
    issuedAt: '2026-09-12T13:00:00+05:30',
    effectiveFrom: '2026-09-12T13:00:00+05:30',
    expiresAt: '2026-09-13T06:00:00+05:30',
    panchayatIds: ['acharpura', 'bangrasia', 'ratibad', 'samasgarh', 'sukhi_sewaniya'],
    panchayatsAffectedEn: ['Acharpura', 'Bangrasia', 'Ratibad', 'Samasgarh', 'Sukhi Sewaniya'],
    panchayatsAffectedHi: ['अचारपुरा', 'बंगरसिया', 'रातीबड़', 'समसगढ़', 'सूखी सेवनिया'],
    cropsAffected: ['soybean'],
    recommendedActionEn: 'Postpone chemical spraying and open drainage channels in low-lying soybean fields.',
    recommendedActionHi: 'कीटनाशक छिड़काव स्थगित करें एवं निचले खेतों में जल निकासी की व्यवस्था करें।',
    issuedBy: 'State Agromet Advisory Centre, Bhopal',
    isActive: true,
    channel: 'in_app'
  },
  {
    id: 'alt-002',
    category: 'pest_outbreak',
    level: 'advisory',
    headlineEn: 'Special Advisory: Whitefly Vector Surveillance in Soybean',
    headlineHi: 'विशेष सलाह: सोयाबीन में सफेद मक्खी की सघन निगरानी',
    descriptionEn: 'Elevated trap counts reported in neighbouring blocks. Farmers are advised to inspect underside of leaves early in the morning.',
    descriptionHi: 'समीपवर्ती क्षेत्रों में कीट की संख्या बढ़ी है। किसान सुबह के समय पत्तियों के निचले हिस्से का निरीक्षण करें।',
    issuedAt: '2026-09-11T10:00:00+05:30',
    effectiveFrom: '2026-09-11T10:00:00+05:30',
    expiresAt: '2026-09-15T18:00:00+05:30',
    panchayatIds: ['acharpura', 'sukhi_sewaniya'],
    panchayatsAffectedEn: ['Acharpura', 'Sukhi Sewaniya'],
    panchayatsAffectedHi: ['अचारपुरा', 'सूखी सेवनिया'],
    cropsAffected: ['soybean'],
    recommendedActionEn: 'Install 15-20 yellow sticky traps per acre.',
    recommendedActionHi: 'प्रति एकड़ 15-20 पीले चिपचिपे ट्रैप लगाएं।',
    issuedBy: 'Krishi Vigyan Kendra (KVK), Bhopal',
    isActive: true,
    channel: 'in_app'
  }
];
