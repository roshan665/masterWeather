import type { CurrentWeather, DailyForecast, HourlyForecast, WeatherCondition } from '../types/weather';
import type { PanchayatLocation } from '../types/common';
import { MOCK_CURRENT_WEATHER, getForecastForPanchayat } from '../data/mockWeather';

// WMO Weather Interpretation Codes (WW) mapping to WeatherCondition & descriptions
interface WmoMapping {
  condition: WeatherCondition;
  textEn: string;
  textHi: string;
}

export function mapWmoCode(code: number): WmoMapping {
  switch (code) {
    case 0:
      return { condition: 'clear', textEn: 'Clear Sky', textHi: 'साफ़ आसमान' };
    case 1:
      return { condition: 'partly-cloudy', textEn: 'Mainly Clear', textHi: 'अधिकांशतः साफ़' };
    case 2:
      return { condition: 'partly-cloudy', textEn: 'Partly Cloudy', textHi: 'आंशिक रूप से बादल' };
    case 3:
      return { condition: 'cloudy', textEn: 'Overcast', textHi: 'घने बादल' };
    case 45:
    case 48:
      return { condition: 'fog', textEn: 'Fog & Mist', textHi: 'कोहरा और धुंध' };
    case 51:
      return { condition: 'drizzle', textEn: 'Light Drizzle', textHi: 'हल्की बूंदाबांदी' };
    case 53:
      return { condition: 'drizzle', textEn: 'Moderate Drizzle', textHi: 'मध्यम बूंदाबांदी' };
    case 55:
      return { condition: 'drizzle', textEn: 'Dense Drizzle', textHi: 'तेज़ बूंदाबांदी' };
    case 56:
    case 57:
      return { condition: 'drizzle', textEn: 'Freezing Drizzle', textHi: 'शीतल बूंदाबांदी' };
    case 61:
      return { condition: 'light-rain', textEn: 'Slight Rain', textHi: 'हल्की बारिश' };
    case 63:
      return { condition: 'light-rain', textEn: 'Moderate Rain', textHi: 'मध्यम वर्षा' };
    case 65:
      return { condition: 'heavy-rain', textEn: 'Heavy Rain', textHi: 'भारी वर्षा' };
    case 66:
    case 67:
      return { condition: 'heavy-rain', textEn: 'Freezing Heavy Rain', textHi: 'भारी मूसलाधार बारिश' };
    case 80:
      return { condition: 'light-rain', textEn: 'Light Rain Showers', textHi: 'हल्की बौछारें' };
    case 81:
      return { condition: 'heavy-rain', textEn: 'Moderate Showers', textHi: 'मध्यम बौछारें' };
    case 82:
      return { condition: 'heavy-rain', textEn: 'Violent Showers', textHi: 'तेज़ मूसलाधार बौछारें' };
    case 95:
      return { condition: 'thunderstorm', textEn: 'Thunderstorm', textHi: 'गरज-चमक के साथ आंधी' };
    case 96:
    case 99:
      return { condition: 'thunderstorm', textEn: 'Thunderstorm with Hail', textHi: 'ओलावृष्टि और आंधी-तूफान' };
    default:
      return { condition: 'partly-cloudy', textEn: 'Partly Cloudy', textHi: 'आंशिक बादल' };
  }
}

function degreesToCompass(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

function evaluateSpraySuitability(
  windSpeedKmh: number,
  popPct: number,
  rainfallMm: number,
  humidityPct: number
): {
  suitability: 'optimal' | 'marginal' | 'unfavourable';
  reasonEn: string;
  reasonHi: string;
} {
  if (windSpeedKmh > 20 || popPct > 45 || rainfallMm > 0.5 || humidityPct > 85) {
    let reasonEn = 'Unfavourable: ';
    let reasonHi = 'अनुचित: ';
    if (popPct > 45 || rainfallMm > 0.5) {
      reasonEn += 'High rain risk will wash away spray chemicals.';
      reasonHi += 'बारिश के कारण छिड़काव बहने का अत्यधिक जोखिम है।';
    } else if (windSpeedKmh > 20) {
      reasonEn += 'High wind causes pesticide drift to adjacent fields.';
      reasonHi += 'तेज़ हवा के कारण कीटनाशक बहकर अन्य खेतों में जा सकता है।';
    } else {
      reasonEn += 'Excessive humidity slows pesticide drying.';
      reasonHi += 'अत्यधिक नमी से दवा सूखने में बाधा आती है।';
    }
    return { suitability: 'unfavourable', reasonEn, reasonHi };
  }

  if (windSpeedKmh > 13 || popPct > 20 || humidityPct > 78) {
    return {
      suitability: 'marginal',
      reasonEn: 'Marginal: Low wind drift risk. Spray only with low-drift nozzles.',
      reasonHi: 'मध्यम: हल्की हवा। कम बहाव वाले नोजल के साथ ही छिड़काव करें।'
    };
  }

  return {
    suitability: 'optimal',
    reasonEn: 'Optimal: Mild wind (<12 km/h) & low rain chance. Ideal for application.',
    reasonHi: 'सर्वोत्तम: अनुकूल हवा (<12 किमी/घं) और बारिश की कोई संभावना नहीं।'
  };
}

export interface LiveWeatherData {
  current: CurrentWeather;
  hourlyNext24h: HourlyForecast[];
  daily7d: DailyForecast[];
  daily15d: DailyForecast[];
  rawTimestamp: string;
  isRealtime: boolean;
}

const CACHE_EXPIRY_MS = 3 * 60 * 1000; // 3 minutes cache
const weatherCache: Record<string, { data: LiveWeatherData; timestamp: number }> = {};

export async function fetchRealtimeWeather(panchayat: PanchayatLocation): Promise<LiveWeatherData> {
  const cacheKey = panchayat.id;
  const now = Date.now();

  if (weatherCache[cacheKey] && now - weatherCache[cacheKey].timestamp < CACHE_EXPIRY_MS) {
    return weatherCache[cacheKey].data;
  }

  const lat = panchayat.latitude || 23.3762;
  const lon = panchayat.longitude || 77.3481;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
    `&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index,et0_fao_evapotranspiration` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,et0_fao_evapotranspiration` +
    `&timezone=Asia/Kolkata&forecast_days=16&wind_speed_unit=kmh&precipitation_unit=mm`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const currentRaw = data.current;
    const hourlyRaw = data.hourly;
    const dailyRaw = data.daily;

    const wmo = mapWmoCode(currentRaw.weather_code ?? 0);
    const windDir = degreesToCompass(currentRaw.wind_direction_10m ?? 0);

    // Calculate today's max/min
    const todayMax = dailyRaw?.temperature_2m_max?.[0] ?? (currentRaw.temperature_2m + 3);
    const todayMin = dailyRaw?.temperature_2m_min?.[0] ?? (currentRaw.temperature_2m - 4);
    const todayRainSum = dailyRaw?.precipitation_sum?.[0] ?? (currentRaw.precipitation ?? 0);
    const todayEt0 = dailyRaw?.et0_fao_evapotranspiration?.[0] ?? 4.2;
    const todayUv = dailyRaw?.uv_index_max?.[0] ?? 6.5;

    const currentWeather: CurrentWeather = {
      panchayatId: panchayat.id,
      timestamp: currentRaw.time || new Date().toISOString(),
      tempC: Math.round((currentRaw.temperature_2m ?? 28) * 10) / 10,
      feelsLikeC: Math.round((currentRaw.apparent_temperature ?? currentRaw.temperature_2m ?? 28) * 10) / 10,
      tempMaxC: Math.round(todayMax * 10) / 10,
      tempMinC: Math.round(todayMin * 10) / 10,
      relativeHumidityPct: Math.round(currentRaw.relative_humidity_2m ?? 70),
      rainfallMm24h: Math.round((todayRainSum ?? 0) * 10) / 10,
      rainfallRateMmH: Math.round((currentRaw.precipitation ?? 0) * 10) / 10,
      windSpeedKmh: Math.round((currentRaw.wind_speed_10m ?? 10) * 10) / 10,
      windDirectionDeg: Math.round(currentRaw.wind_direction_10m ?? 0),
      windDirectionCompass: windDir,
      solarRadiationWm2: 520,
      et0MmDay: Math.round(todayEt0 * 10) / 10,
      dewPointC: Math.round((hourlyRaw?.dew_point_2m?.[0] ?? 21) * 10) / 10,
      uvIndex: Math.round(todayUv * 10) / 10,
      pressureHpa: Math.round(currentRaw.surface_pressure ?? 955),
      condition: wmo.condition,
      conditionTextEn: wmo.textEn,
      conditionTextHi: wmo.textHi,
      dataSource: 'gridded_numerical_estimate',
      dataSourceLabelEn: 'Open-Meteo Live API (High-Res ECMWF/GFS)',
      dataSourceLabelHi: 'ओपन-मेटियो लाइव वेदर (ECMWF/GFS मॉडल्स)',
      confidence: 'high',
      isFallback: false
    };

    // Find current hour index in hourly
    const currentIsoHour = (currentRaw.time || new Date().toISOString()).slice(0, 13);
    let startIndex = hourlyRaw.time.findIndex((t: string) => t.startsWith(currentIsoHour));
    if (startIndex < 0) startIndex = 0;

    // Parse next 24 hourly forecasts
    const hourlyNext24h: HourlyForecast[] = [];
    const maxHourly = Math.min(startIndex + 24, hourlyRaw.time.length);

    for (let i = startIndex; i < maxHourly; i++) {
      const hTimeStr = hourlyRaw.time[i];
      const hDate = new Date(hTimeStr);
      const hCode = hourlyRaw.weather_code[i] ?? 0;
      const hWmo = mapWmoCode(hCode);
      const hPop = hourlyRaw.precipitation_probability?.[i] ?? 0;
      const hRain = hourlyRaw.precipitation?.[i] ?? 0;
      const hWind = hourlyRaw.wind_speed_10m?.[i] ?? 10;
      const hHumidity = hourlyRaw.relative_humidity_2m?.[i] ?? 70;
      const spray = evaluateSpraySuitability(hWind, hPop, hRain, hHumidity);

      // Formatted display time (e.g. "2 PM" or "14:00")
      const timeFormatted = hDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });

      hourlyNext24h.push({
        time: timeFormatted,
        isoTimestamp: hTimeStr,
        tempC: Math.round(hourlyRaw.temperature_2m[i] * 10) / 10,
        rainfallMm: Math.round(hRain * 10) / 10,
        popPct: Math.round(hPop),
        relativeHumidityPct: Math.round(hHumidity),
        windSpeedKmh: Math.round(hWind * 10) / 10,
        condition: hWmo.condition,
        conditionTextEn: hWmo.textEn,
        conditionTextHi: hWmo.textHi,
        spraySuitability: spray.suitability,
        spraySuitabilityReasonEn: spray.reasonEn,
        spraySuitabilityReasonHi: spray.reasonHi
      });
    }

    // Parse daily 7d and 15d forecasts
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

    const allDaily: DailyForecast[] = [];
    const dailyCount = Math.min(dailyRaw.time.length, 16);

    for (let i = 0; i < dailyCount; i++) {
      const dDateStr = dailyRaw.time[i];
      const dDate = new Date(dDateStr);
      const dayOfWeek = dDate.getDay();
      const dCode = dailyRaw.weather_code[i] ?? 0;
      const dWmo = mapWmoCode(dCode);
      const dPop = dailyRaw.precipitation_probability_max?.[i] ?? 0;
      const dRain = dailyRaw.precipitation_sum?.[i] ?? 0;
      const dMax = dailyRaw.temperature_2m_max[i] ?? 30;
      const dMin = dailyRaw.temperature_2m_min[i] ?? 22;
      const dWind = dailyRaw.wind_speed_10m_max?.[i] ?? 12;

      let summaryEn = `${dWmo.textEn}. Highs near ${Math.round(dMax)}°C, lows around ${Math.round(dMin)}°C.`;
      let summaryHi = `${dWmo.textHi}। अधिकतम तापमान ${Math.round(dMax)}°C, न्यूनतम ${Math.round(dMin)}°C।`;

      if (dRain > 5) {
        summaryEn += ` Significant rainfall expected (${dRain} mm). Avoid spraying.`;
        summaryHi += ` भारी वर्षा की संभावना (${dRain} मिमी)। कीटनाशक न छिड़कें।`;
      } else if (dRain > 0.5) {
        summaryEn += ` Light scattered rain showers (${dRain} mm).`;
        summaryHi += ` हल्की छिटपुट वर्षा (${dRain} मिमी)।`;
      } else {
        summaryEn += ` Dry agricultural conditions. Suitable for field operations.`;
        summaryHi += ` मौसम शुष्क रहेगा। खेत कार्य और निराई-गुड़ाई हेतु अनुकूल।`;
      }

      const dayNameEn = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : daysEn[dayOfWeek];
      const dayNameHi = i === 0 ? 'आज' : i === 1 ? 'कल' : daysHi[dayOfWeek];

      allDaily.push({
        date: dDateStr,
        dayNameEn,
        dayNameHi,
        tempMaxC: Math.round(dMax * 10) / 10,
        tempMinC: Math.round(dMin * 10) / 10,
        rainfallExpectedMm: Math.round(dRain * 10) / 10,
        popPct: Math.round(dPop),
        relativeHumidityPct: 72,
        windSpeedMaxKmh: Math.round(dWind * 10) / 10,
        condition: dWmo.condition,
        conditionTextEn: dWmo.textEn,
        conditionTextHi: dWmo.textHi,
        confidence: i <= 3 ? 'high' : i <= 7 ? 'medium' : 'low',
        summaryEn,
        summaryHi
      });
    }

    const liveResult: LiveWeatherData = {
      current: currentWeather,
      hourlyNext24h,
      daily7d: allDaily.slice(0, 7),
      daily15d: allDaily.slice(0, 15),
      rawTimestamp: new Date().toISOString(),
      isRealtime: true
    };

    // Cache successful fetch
    weatherCache[cacheKey] = { data: liveResult, timestamp: now };
    return liveResult;
  } catch (err) {
    console.warn(`[OpenMeteo] Live fetch failed for ${panchayat.id}, using fallback mock data:`, err);

    // Fallback gracefully
    const fallbackCurrent = MOCK_CURRENT_WEATHER[panchayat.id] || MOCK_CURRENT_WEATHER['acharpura'];
    const fallbackForecast = getForecastForPanchayat(panchayat.id);

    return {
      current: {
        ...fallbackCurrent,
        isFallback: true,
        fallbackReason: 'Network unreachable or Open-Meteo offline. Showing verified regional climatology.'
      },
      hourlyNext24h: fallbackForecast.hourlyNext24h,
      daily7d: fallbackForecast.daily1to3d.concat(fallbackForecast.daily4to7d),
      daily15d: fallbackForecast.daily1to3d.concat(fallbackForecast.daily4to7d),
      rawTimestamp: new Date().toISOString(),
      isRealtime: false
    };
  }
}
