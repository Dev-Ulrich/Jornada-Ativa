// src/services/api.jsx
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// Interceptor de REQUEST: injeta o Bearer em toda chamada
api.interceptors.request.use((config) => {
  // usamos a mesma chave que o Login.jsx grava
  const token = localStorage.getItem("ja_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // garante que não fica lixo antigo
    delete config.headers.Authorization;
  }
  return config;
});

// Interceptor de RESPONSE (opcional): trata 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // aqui você pode redirecionar pro /login se quiser
      // window.location.assign("/login");
      console.warn("401 não autorizado — verifique o token.");
    }
    return Promise.reject(err);
  }
);

export default api;
