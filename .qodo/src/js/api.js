const GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeatherData(city) {
  const encodedCity = encodeURIComponent(city);

  try {
    // 1. Buscar coordenadas
    const geoUrl = `${GEO_API_URL}?name=${encodedCity}&count=1&language=pt&format=json`;
    console.log(`API Call 1 (Geo): ${geoUrl}`);

    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error(
        `Erro HTTP ao buscar coordenadas: Status ${geoResponse.status}`
      );
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`Não foi possível encontrar a cidade: ${city}.`);
    }

    const { latitude, longitude, name, country } = geoData.results[0]; // 2. Buscar dados do clima

    const weatherParams = new URLSearchParams({
      latitude,
      longitude,
      current:
        "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation,is_day",
      daily: "temperature_2m_max,temperature_2m_min,weather_code",
      forecast_days: 5,
      timezone: "auto",
      temperature_unit: "celsius",
      wind_speed_unit: "kmh",
    });

    const weatherUrl = `${WEATHER_API_URL}?${weatherParams.toString()}`;
    console.log(`API Call 2 (Weather): ${weatherUrl}`);

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(
        `Erro HTTP ao buscar clima: Status ${weatherResponse.status}`
      );
    }

    const weatherData = await weatherResponse.json();

    return {
      city: name,
      country: country,
      ...weatherData,
    };
  } catch (error) {
    console.error(
      `Erro na função fetchWeatherData para ${city}:`,
      error.message
    );
    throw new Error(`[API Error] ${error.message}`);
  }
}

/**
 * Mapeia os códigos WMO para descrição e ícones Font Awesome.
 * @param {number} code Código do clima WMO.
 * @param {number} isDay 1 se for dia, 0 se for noite.
 * @returns {object} Objeto com description e iconClass.
 */
export function getWeatherDetails(code, isDay) {
  let description = "Condição Desconhecida";
  let iconClass = "fa-solid fa-cloud"; // Ícone padrão // Mapeamento baseado nos códigos WMO da Open-Meteo (usando Font Awesome)

  if (code >= 0 && code <= 1) {
    // 0: Céu Limpo, 1: Principalmente limpo
    description = "Céu Limpo";
    iconClass = isDay === 1 ? "fa-solid fa-sun" : "fa-solid fa-moon";
  } else if (code >= 2 && code <= 3) {
    // 2: Parcialmente nublado, 3: Nublado
    description = "Nublado";
    iconClass = "fa-solid fa-cloud";
  } else if (code >= 45 && code <= 48) {
    // 45: Nevoeiro, 48: Névoa
    description = "Nevoeiro";
    iconClass = "fa-solid fa-smog";
  } else if (code >= 51 && code <= 55) {
    // Chuvisco
    description = "Chuvisco Fraco";
    iconClass = "fa-solid fa-cloud-drizzle";
  } else if (code >= 61 && code <= 65) {
    // Chuva
    description = "Chuva";
    iconClass = "fa-solid fa-cloud-showers-heavy";
  } else if (code >= 71 && code <= 75) {
    // Neve
    description = "Neve";
    iconClass = "fa-solid fa-snowflake";
  } else if (code >= 80 && code <= 82) {
    // Pancadas de Chuva
    description = "Pancadas de Chuva";
    iconClass = "fa-solid fa-cloud-showers-heavy";
  } else if (code >= 95 && code <= 99) {
    // Tempestade
    description = "Tempestade";
    iconClass = "fa-solid fa-cloud-bolt";
  }
  return { description, iconClass };
}
