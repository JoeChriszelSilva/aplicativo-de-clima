// src/js/cache.js

// Define o tempo de expiração do cache em milissegundos (Ex: 15 minutos)
const CACHE_EXPIRATION_TIME = 15 * 60 * 1000;

/**
 * Tenta recuperar dados do cache.
 * @param {string} key A chave de busca (ex: nome da cidade).
 * @returns {object | null} O dado armazenado se for válido, ou null.
 */
export function getCache(key) {
  try {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) {
      return null;
    }

    const data = JSON.parse(cachedItem);
    const now = new Date().getTime();

    // Verifica se o cache expirou
    if (now > data.expirationTime) {
      console.log(`Cache expirado para a chave: ${key}`);
      localStorage.removeItem(key);
      return null;
    }

    console.log(`Dados recuperados do cache para a chave: ${key}`);
    return data.value;
  } catch (e) {
    console.error("Erro ao recuperar cache:", e);
    // Se houver erro, apenas ignora e força a nova busca
    return null;
  }
}

/**
 * Armazena dados no cache com um tempo de expiração.
 * @param {string} key A chave de busca (ex: nome da cidade).
 * @param {object} value O dado a ser armazenado.
 */
export function setCache(key, value) {
  try {
    const now = new Date().getTime();
    const itemToStore = {
      value: value,
      expirationTime: now + CACHE_EXPIRATION_TIME,
    };
    localStorage.setItem(key, JSON.stringify(itemToStore));
    console.log(
      `Dados armazenados em cache para a chave: ${key}. Expira em: ${new Date(
        itemToStore.expirationTime
      ).toLocaleTimeString()}`
    );
  } catch (e) {
    console.error("Erro ao armazenar cache:", e);
    // Ignora erros de armazenamento (ex: armazenamento cheio)
  }
}
