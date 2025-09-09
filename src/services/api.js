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
    // Try to get token from cookies first
    let token = Cookies.get('AuthToken');
    
    // If not found in cookies, try localStorage as fallback
    if (!token) {
      const authData = localStorage.getItem('auth');
      if (authData) {
        try {
          const parsedAuth = JSON.parse(authData);
          token = parsedAuth.token;
        } catch (e) {
          console.error('Error parsing auth data from localStorage:', e);
        }
      }
    }
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('API Request: Token found and added to headers');
    } else {
      console.log('API Request: No token found');
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
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
