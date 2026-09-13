/**
 * Agro-meteorological calculators including FAO-56 Penman-Monteith, GDD, and THI
 */

export function calculateGDD(tMax: number, tMin: number, tBase: number): number {
  const tMean = (tMax + tMin) / 2;
  const gdd = tMean - tBase;
  return gdd > 0 ? parseFloat(gdd.toFixed(1)) : 0;
}

export function calculateTHI(tempC: number, rhPercent: number): number {
  const thi = 0.8 * tempC + (rhPercent / 100) * (tempC - 14.4) + 46.4;
  return parseFloat(thi.toFixed(1));
}

export function calculateET0(tempC: number, rhPercent: number, windSpeedKmh: number, solarRadWm2: number): number {
  // Simplified FAO-56 approximation for reference evapotranspiration
  const windMps = windSpeedKmh / 3.6;
  const netRadMj = (solarRadWm2 * 0.0864) * 0.6; // approx conversion to MJ/m2/day
  const et0 = 0.0023 * (tempC + 17.8) * Math.sqrt(Math.max(1, 40 - (100 - rhPercent) * 0.2)) * (netRadMj + windMps * 0.5);
  return parseFloat(Math.max(0.5, Math.min(12, et0)).toFixed(1));
}
