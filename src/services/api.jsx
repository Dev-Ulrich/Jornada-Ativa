import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/usuario",
  timeout: 10000,
});

export default api;
