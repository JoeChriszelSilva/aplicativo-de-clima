// src/js/main.js

import { fetchWeatherData } from "./api.js";
import {
  updateWeatherDisplay,
  displayError,
  showLoading,
  hideLoading,
} from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const cityInput = document.getElementById("city-input");

  if (!searchForm || !cityInput) {
    console.error(
      "ERRO FATAL: Elementos do formulário não encontrados no DOM."
    );
    const resultsContainer = document.getElementById("weather-results");
    if (resultsContainer) {
      resultsContainer.innerHTML =
        '<p class="error">Erro de inicialização: Recarregue a página.</p>';
    }
    return;
  }

  searchForm.addEventListener("submit", handleSearchSubmit);
});

async function handleSearchSubmit(e) {
  e.preventDefault();

  const rawInput = document.getElementById("city-input").value.trim();

  const cities = rawInput
    .split(",")
    .map((city) => city.trim())
    .filter((city) => city.length > 0);

  if (cities.length === 0) {
    displayError(
      "Por favor, digite uma ou mais cidades separadas por vírgula."
    );
    return;
  }

  showLoading();

  try {
    const weatherPromises = cities.map((city) => fetchWeatherData(city));
    const results = await Promise.allSettled(weatherPromises);

    const successfulResults = [];
    let errorCount = 0;

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        successfulResults.push(result.value);
      } else {
        errorCount++;
        console.error(`Falha na busca da cidade. Motivo:`, result.reason);
      }
    });

    if (successfulResults.length > 0) {
      updateWeatherDisplay(successfulResults);

      if (errorCount > 0) {
        console.warn(
          `${errorCount} cidade(s) não puderam ser carregadas. Verifique o nome.`
        );
      }
    } else if (errorCount > 0) {
      displayError(
        `Falha total: Nenhuma cidade foi carregada. ${errorCount} erro(s) de busca.`
      );
    } else {
      displayError(
        "Nenhum resultado encontrado (entrada vazia ou erro inesperado)."
      );
    }
  } catch (error) {
    displayError(
      "Ocorreu um erro inesperado durante o processo de busca/exibição."
    );
    console.error("Erro fatal no handleSearchSubmit:", error);
  } finally {
    hideLoading();
  }
}
