// src/js/ui.js

import { getWeatherDetails } from "./api.js";

const resultsContainer = document.getElementById("weather-results");
const loadingIndicator = document.getElementById("loading");

export function showLoading() {
  resultsContainer.innerHTML = "";
  loadingIndicator.classList.remove("hidden");
}

export function hideLoading() {
  loadingIndicator.classList.add("hidden");
}

export function updateWeatherDisplay(weatherResults) {
  resultsContainer.innerHTML = "";

  if (weatherResults.length === 0) {
    resultsContainer.innerHTML =
      '<p class="error">Nenhum resultado de clima para exibir.</p>';
    return;
  }

  weatherResults.forEach((result) => {
    const card = createCityCard(result);
    resultsContainer.appendChild(card);
  });
}

function createCityCard(data) {
  const card = document.createElement("div");
  card.className = "city-card"; // Dados atuais

  const currentTemp = data.current.temperature_2m;
  const humidity = data.current.relative_humidity_2m;
  const windSpeed = data.current.wind_speed_10m;
  const weatherCode = data.current.weather_code;
  const isDay = data.current.is_day; // Obtém detalhes do clima e o ícone

  const { description, iconClass } = getWeatherDetails(weatherCode, isDay); // HTML para o clima atual

  let htmlContent = `
        <h2>${data.city}, ${data.country}</h2>
        
        <div class="current-details">
            <p>
                                <i class="${iconClass}" style="font-size: 2em; margin-right: 15px; vertical-align: middle;"></i>
                <strong>${currentTemp}°C</strong>
            </p>
            <p><strong>Condição:</strong> ${description}</p>
            <p><strong>Umidade:</strong> ${humidity}%</p>
            <p><strong>Vento:</strong> ${windSpeed} km/h</p>
            <p><strong>Precipitação:</strong> ${data.current.precipitation} mm</p>
        </div>
    `; // Previsão de 5 dias

  if (data.daily && data.daily.time && data.daily.time.length > 0) {
    htmlContent += '<div class="forecast"><h4>Previsão Diária (5 Dias):</h4>'; // Limita o loop aos dias disponíveis

    const forecastDays = Math.min(5, data.daily.time.length);

    for (let i = 0; i < forecastDays; i++) {
      const dateStr = data.daily.time[i];
      const maxTemp = data.daily.temperature_2m_max[i];
      const minTemp = data.daily.temperature_2m_min[i];
      const dayCode = data.daily.weather_code[i]; // Ícones da previsão usam isDay=1 (diurno)

      const { description: dayDescription, iconClass: dayIcon } =
        getWeatherDetails(dayCode, 1); // Formata a data (ex: '2025-10-22' -> 'Ter')

      const date = new Date(dateStr);
      const dayOfWeek = date.toLocaleDateString("pt-BR", { weekday: "short" });

      htmlContent += `
                <div class="forecast-day">
                    <span>${dayOfWeek}</span>
                    <span><i class="${dayIcon}"></i> ${dayDescription}</span>
                    <span>${minTemp}°C / ${maxTemp}°C</span>
                </div>
            `;
    }
    htmlContent += "</div>";
  }

  card.innerHTML = htmlContent;
  return card;
}

export function displayError(message) {
  resultsContainer.innerHTML = `<p class="error">${message}</p>`;
  hideLoading();
}
