const resultsDiv = document.getElementById("weather-results");
const errorDiv = document.getElementById("error-message");

export function renderWeather(data, cityName) {
  // 1. Esconder a mensagem de erro
  errorDiv.classList.add("hidden");

  // 2. Extrair os dados relevantes (Open-Meteo tem uma estrutura complexa)
  const current = data.current;
  const temp = current.temperature_2m;
  const wind = current.wind_speed_10m;
  // weather_code (WMO) precisaria de um mapeamento para um texto amigável
  // Para simplicidade, apenas mostrarei a temperatura e o vento.

  // 3. Criar o HTML para exibição
  const html = `
        <h2>${cityName}</h2>
        <p>Temperatura: <strong>${temp} °C</strong></p>
        <p>Vento: <strong>${wind} km/h</strong></p>
        `;

  // 4. Inserir o HTML na div de resultados
  resultsDiv.innerHTML = html;
}

export function displayError(message) {
  // 1. Limpar os resultados anteriores
  resultsDiv.innerHTML = "";

  // 2. Mostrar a mensagem de erro
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}
