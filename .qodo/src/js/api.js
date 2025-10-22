// A API do Open-Meteo é um bom ponto de partida, pois é gratuita e não requer chave.
const BASE_URL = "https://api.open-meteo.com/v1/forecast";

// Uma função para buscar as coordenadas (latitude e longitude) primeiro
// para depois buscar os dados do clima.
export async function getWeatherData(city) {
  try {
    // Passo 1: Buscar coordenadas (usando uma API de geocodificação, ex: OpenCage ou Nominatim)
    // Como alternativa simples e direta, vamos fingir que já temos lat/lon de uma cidade conhecida
    // Para um projeto real, você precisará de uma API de Geocodificação!

    // Exemplo Open-Meteo: Buscando dados para São Paulo (Lat: -23.55, Lon: -46.63)
    // ******************************************************************************
    // ATENÇÃO: Se for usar entrada do usuário, você DEVE usar uma API de geocodificação.
    // ******************************************************************************

    // Para simplificar, vou usar uma busca de geocodificação do Open-Meteo se a cidade for "São Paulo"
    // (Isso é uma simplificação didática; para *qualquer* cidade, use uma Geocoding API).
    let latitude = -23.55;
    let longitude = -46.63;

    // Se você quiser testar com um valor do usuário
    if (city.toLowerCase().includes("são paulo")) {
      latitude = -23.55;
      longitude = -46.63;
    } else if (city.toLowerCase().includes("rio de janeiro")) {
      latitude = -22.91;
      longitude = -43.2;
    } else {
      // Lançar um erro se a cidade não for reconhecida na sua simplificação
      throw new Error("Cidade não suportada neste exemplo simples.");
    }

    // Passo 2: Buscar os dados do clima com as coordenadas
    const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=America%2FSao_Paulo&forecast_days=1`;

    const response = await fetch(url);

    if (!response.ok) {
      // Se o status HTTP não for 200 (OK)
      throw new Error(`Erro de rede: ${response.statusText}`);
    }

    const data = await response.json();

    // Você pode retornar os dados brutos ou formatá-los aqui
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados do clima:", error.message);
    throw new Error(
      `Não foi possível obter os dados do clima: ${error.message}`
    );
  }
}
