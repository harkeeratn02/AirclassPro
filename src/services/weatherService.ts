export interface WeatherData {
  metar: string;
  taf: string | null;
  icao: string;
  timestamp: string;
  parsed?: {
    temp: number | null;
    dewp: number | null;
    windDir: number | string | null;
    windSpeed: number | null;
    windGust: number | null;
    visibility: string | null;
    altimeter: number | null;
    name: string | null;
    obsTime: number | null;
  }
}

async function fetchMETAR(icao: string): Promise<any> {
  const response = await fetch(`/api/metar?icao=${icao}`);
  if (!response.ok) {
    throw new Error("Please check your internet connection and try again.");
  }
  return await response.json();
}

async function fetchTAF(icao: string): Promise<any | null> {
  try {
    const response = await fetch(`/api/taf?icao=${icao}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn("TAF fetch failed:", e);
  }
  return null;
}

export const weatherService = {
  fetchWeather: async (icao: string): Promise<WeatherData> => {
    const cleanIcao = icao.toUpperCase().trim();
    if (!cleanIcao || cleanIcao.length < 3) {
      throw new Error('Please enter a valid ICAO code.');
    }

    try {
      const metarData = await fetchMETAR(cleanIcao);
      const tafData = await fetchTAF(cleanIcao);

      const metarRecord = Array.isArray(metarData) ? metarData[0] : null;

      if (!metarRecord) {
        throw new Error(`Airport not found. Please check ICAO code.`);
      }

      const tafRecord = Array.isArray(tafData) ? tafData[0] : null;

      return {
        metar: metarRecord.rawOb,
        taf: tafRecord?.rawTAF || tafRecord?.rawTaf || null,
        icao: cleanIcao,
        timestamp: new Date().toISOString(),
        parsed: {
          temp: metarRecord.temp ?? null,
          dewp: metarRecord.dewp ?? null,
          windDir: metarRecord.wdir ?? null,
          windSpeed: metarRecord.wspd ?? null,
          windGust: metarRecord.wgst ?? null,
          visibility: metarRecord.visib ?? null,
          altimeter: metarRecord.altim ?? null,
          name: metarRecord.name ?? null,
          obsTime: metarRecord.obsTime ?? null
        }
      };
    } catch (error: any) {
      console.error('Weather Fetch Error:', error);
      throw error;
    }
  },

  fetchMultipleWeather: async (icaos: string[]): Promise<WeatherData[]> => {
    const results = await Promise.allSettled(icaos.map(icao => weatherService.fetchWeather(icao)));
    return results
      .filter((r): r is PromiseFulfilledResult<WeatherData> => r.status === 'fulfilled')
      .map(r => r.value);
  }
};
