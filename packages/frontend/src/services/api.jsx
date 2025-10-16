import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// injeta Bearer em toda request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ja_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;
  return config;
});

// trata 401/403 globalmente (limpa token quebrado)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("ja_token");
      // opcional: redirecionar pro login
      // window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

export default api;
