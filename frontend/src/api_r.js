import axios from 'axios';

const api = axios.create({
  baseURL: 'https://learnify-backend-q6he.onrender.com/public/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
