import axios from 'axios';
import Cookies from 'js-cookie';
import { Cookie } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';
// const API_URL = 'https://insightwaveit-backend-p0cl.onrender.com/api';
// const API_URL = 'https://backend-hyoy.onrender.com/api';
// const API_URL = 'https://updatedbackend-bqg8.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('AuthToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('AuthToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
