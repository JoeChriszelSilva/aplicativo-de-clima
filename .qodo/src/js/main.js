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
      "ERRO FATAL: Elementos do formulário (search-form ou city-input) não encontrados no DOM."
    );
    const resultsContainer = document.getElementById("weather-results");
    if (resultsContainer) {
      resultsContainer.innerHTML =
        '<p class="error">Erro de inicialização: Recarregue a página e verifique se o index.html tem os IDs corretos.</p>';
    }
    return;
  }

  searchForm.addEventListener("submit", handleSearchSubmit);
  console.log("App Inicializado: Event Listener do formulário configurado.");
});

async function handleSearchSubmit(e) {
  e.preventDefault(); // IMPEDE O RECARREGAMENTO DA PÁGINA

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

  console.log("Cidades a buscar:", cities);
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
      console.log("Resultados exibidos com sucesso.", successfulResults);

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
