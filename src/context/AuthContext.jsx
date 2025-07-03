import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth/authService';
import { registerNormalUser } from '../services/auth/authService';

const AuthContext = createContext(null);

// Register Context for Registration Page
const RegisterContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // stores complete login response: { message, token, data }
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load auth data from localStorage on app start
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setAuth(parsedAuth);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      // Store the complete response object
      setAuth(response);
      setIsAuthenticated(true);
      // Save to localStorage for persistence
      localStorage.setItem('auth', JSON.stringify(response));
      return response;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAuth(null);
    setIsAuthenticated(false);
    // Clear from localStorage
    localStorage.removeItem('auth');
  };

  // Helper functions to access specific parts of the auth data
  const getUser = () => auth?.data || null;
  const getToken = () => auth?.token || null;
  const getMessage = () => auth?.message || '';
  const getUserId = () => auth?.data?._id || null;
  const getUserEmail = () => auth?.data?.email || '';
  const getUserName = () => {
    if (!auth?.data) return '';
    return `${auth.data.firstName || ''} ${auth.data.lastName || ''}`.trim();
  };
  const getUserRole = () => auth?.data?.role || null;
  const isAdmin = () => auth?.data?.role === 'ADMIN' || auth?.data?.role === '68162f63ff2da55b40ca61b8';

  return (
    <AuthContext.Provider value={{ 
      auth, 
      isAuthenticated, 
      login, 
      logout,
      // Helper functions
      getUser,
      getToken,
      getMessage,
      getUserId,
      getUserEmail,
      getUserName,
      getUserRole,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const RegisterProvider = ({ children }) => {
  const [registerState, setRegisterState] = useState({ loading: false, error: null, success: false });

  const register = async (userData) => {
    setRegisterState({ loading: true, error: null, success: false });
    try {
      const response = await registerNormalUser(userData);
      setRegisterState({ loading: false, error: null, success: true });
      return response;
    } catch (error) {
      setRegisterState({ loading: false, error: error?.message || 'Registration failed', success: false });
      throw error;
    }
  };

  const resetRegisterState = () => setRegisterState({ loading: false, error: null, success: false });

  return (
    <RegisterContext.Provider value={{
      ...registerState,
      register,
      resetRegisterState
    }}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => useContext(RegisterContext);
