import axios from "axios";

const api = axios.create({
  baseURL: "https://learnify.rf.gd/public/proxy.php?endpoint=",
  paramsSerializer: params => new URLSearchParams(params).toString(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Remove starting slash from the request URL if it exists
  if (config.url.startsWith("/")) {
    config.url = config.url.substring(1);
  }

  return config;
});

export default api;
