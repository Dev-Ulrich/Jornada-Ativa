import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// --- prioridade 1: JWT salvo no localStorage ---
const usuarioLogadoRaw = localStorage.getItem("usuarioLogado");
try {
  const usuarioLogado = usuarioLogadoRaw ? JSON.parse(usuarioLogadoRaw) : null;
  const jwt = usuarioLogado?.token || usuarioLogado?.accessToken; // ajuste se o seu campo tiver outro nome
  if (jwt) {
    api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
  }
} catch { /* ignore */ }

// --- prioridade 2 (dev): HTTP Basic via .env (apenas para testes) ---
if (!api.defaults.headers.common["Authorization"]) {
  const email = import.meta.env.VITE_DEV_BASIC_EMAIL;
  const pass  = import.meta.env.VITE_DEV_BASIC_PASSWORD;
  if (email && pass) {
    const token = btoa(`${email}:${pass}`);
    api.defaults.headers.common["Authorization"] = `Basic ${token}`;
  }
}

// interceptador (opcional): se 401, você pode redirecionar para login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("Não autorizado (401). Verifique o Authorization.");
    }
    return Promise.reject(err);
  }
);

export default api;
