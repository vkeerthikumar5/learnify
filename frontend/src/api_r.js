import axios from "axios";

const api = axios.create({
  baseURL: "https://learnify.rf.gd/public/proxy.php?endpoint=",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
