import axios from "axios";

const URL = "http://localhost:3001";

const api = axios.create({
  baseURL: URL,
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const usuario = JSON.parse(localStorage.getItem("usuario-blog"));

    if (usuario?.token) {
      config.headers.Authorization = `Bearer ${usuario.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;