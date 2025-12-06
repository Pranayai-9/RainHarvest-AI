export const fetchRainfallForCity = async (city: string): Promise<number | null> => {
  try {
    // 1. Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return null;
    }

    const { latitude, longitude } = geoData.results[0];

    // 2. Climate Data
    // We fetch the 'precipitation_sum' from the climate model for a full year approximation.
    // The Open-Meteo Climate API requires start/end dates or specific models.
    // For simplicity and reliability in this demo, we use the archive API to get the last complete year (2023).
    const start = '2023-01-01';
    const end = '2023-12-31';
    
    const weatherUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${start}&end_date=${end}&daily=precipitation_sum&timezone=auto`;
    
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (!weatherData.daily || !weatherData.daily.precipitation_sum) {
      return null;
    }

    // Sum up daily precipitation for the year
    const precipArray: number[] = weatherData.daily.precipitation_sum;
    const totalRainfall = precipArray.reduce((acc, curr) => acc + (curr || 0), 0);

    return Math.round(totalRainfall);

  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return null;
  }
};
