
/**
 * Aviation Calculation Utilities
 */

// Constants
export const FUEL_DENSITY_AVGAS = 0.72; // kg/l
export const FUEL_DENSITY_JET_A1 = 0.804; // kg/l

/**
 * Calculate Great Circle Distance between two points
 * Defaulting to a simple mapping for major Indian airports if needed, 
 * or just a numerical calc if we have coordinates.
 */
export function calculateGreatCircleDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3440.065; // Earth radius in nautical miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Density Altitude Calculation
 */
export function calculateDensityAltitude(elevation: number, qnh: number, oat: number): number {
  const pressureAlt = elevation + (1013.25 - qnh) * 27.3;
  const standardTemp = 15 - (elevation / 1000) * 1.98;
  const densityAlt = pressureAlt + 120 * (oat - standardTemp);
  return Math.round(densityAlt);
}

/**
 * Wind Components Calculation
 */
export function calculateWindComponents(windDir: number, windSpeed: number, runwayHeading: number) {
  const angle = (windDir - runwayHeading) * Math.PI / 180;
  const headwind = windSpeed * Math.cos(angle);
  const crosswind = windSpeed * Math.sin(angle);
  return {
    headwind: Math.round(headwind),
    tailwind: headwind < 0 ? Math.abs(Math.round(headwind)) : 0,
    crosswind: Math.abs(Math.round(crosswind)),
    isTailwind: headwind < 0
  };
}

/**
 * Time conversion IST to UTC and vice versa
 */
export function istToUtc(istTime: string): string {
  if (!istTime) return '';
  const [h, m] = istTime.split(':').map(Number);
  let totalMinutes = h * 60 + m - 330; // -5h 30m
  if (totalMinutes < 0) totalMinutes += 1440;
  const utcM = totalMinutes % 60;
  const utcH = Math.floor(totalMinutes / 60) % 24;
  return `${utcH.toString().padStart(2, '0')}:${utcM.toString().padStart(2, '0')}`;
}

export function utcToIst(utcTime: string): string {
  if (!utcTime) return '';
  const [h, m] = utcTime.split(':').map(Number);
  const totalMinutes = h * 60 + m + 330; // +5h 30m
  const istM = totalMinutes % 60;
  const istH = Math.floor(totalMinutes / 60) % 24;
  return `${istH.toString().padStart(2, '0')}:${istM.toString().padStart(2, '0')}`;
}

/**
 * Fuel weight calculation
 */
export function calculateFuelWeight(litres: number, type: 'AVGAS' | 'JET A1'): number {
  const density = type === 'AVGAS' ? FUEL_DENSITY_AVGAS : FUEL_DENSITY_JET_A1;
  return litres * density;
}

/**
 * Simple performance scaling based on density altitude
 * Very rough approximation: 10% reduction per 1000ft DA above 0
 */
export function calculatePerformanceReduction(da: number): number {
  if (da <= 0) return 0;
  return Math.min(100, Math.round((da / 1000) * 10));
}

// Major Indian Airport Coordinates
export const AIRPORT_COORDS: Record<string, { lat: number, lon: number }> = {
  'VIDP': { lat: 28.5665, lon: 77.1031 }, // Delhi
  'VABB': { lat: 19.0896, lon: 72.8656 }, // Mumbai
  'VOBL': { lat: 13.1986, lon: 77.7066 }, // Bangalore
  'VOMM': { lat: 12.9941, lon: 80.1709 }, // Chennai
  'VECC': { lat: 22.6547, lon: 88.4467 }, // Kolkata
  'VOHS': { lat: 17.2403, lon: 78.4298 }, // Hyderabad
  'VAAH': { lat: 23.0772, lon: 72.6347 }, // Ahmedabad
  'VOCI': { lat: 10.1520, lon: 76.3910 }, // Kochi
  'VOGO': { lat: 15.3797, lon: 73.8315 }, // Goa
};
