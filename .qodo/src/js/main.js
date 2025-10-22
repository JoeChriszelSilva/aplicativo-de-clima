// Importa as funções dos outros módulos
import { getWeatherData } from "./api.js";
import { renderWeather, displayError } from "./ui.js";

// Seleciona os elementos do DOM
const form = document.getElementById("city-form");
const cityInput = document.getElementById("city-input");

// Define a função que será executada ao enviar o formulário
async function handleFormSubmit(event) {
  event.preventDefault(); // Impede o recarregamento da página

  const cityName = cityInput.value.trim();

  if (cityName === "") {
    displayError("Por favor, digite o nome de uma cidade.");
    return;
  }

  try {
    // 1. Lógica para buscar os dados (chama o módulo api.js)
    const weatherData = await getWeatherData(cityName);

    // 2. Lógica para exibir os dados (chama o módulo ui.js)
    renderWeather(weatherData, cityName);
  } catch (error) {
    // 3. Lógica para tratar e exibir erros
    displayError(error.message);
  }
}

// Adiciona o 'ouvinte' (listener) de evento ao formulário
form.addEventListener("submit", handleFormSubmit);

// Dica: Chame uma função de inicialização se precisar de algo ao carregar
// console.log("Aplicação de clima iniciada.");
