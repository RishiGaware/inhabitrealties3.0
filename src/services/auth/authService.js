import api from '../api';
import { AUTH_ENDPOINTS } from '../apiEndpoints';
import Cookies from 'js-cookie';

const login = async (credentials) => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    if (response.data.token) {
      Cookies.set('AuthToken', response.data.token, { expires: 1, secure: true, sameSite: 'strict' });
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
//comment
export const registerNormalUser = async (userData) => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const logout = () => {
  Cookies.remove('AuthToken');
};

const getToken = () => {
  return Cookies.get('AuthToken');
};

const authService = {
  login,
  logout,
  getToken,
};

export default authService;