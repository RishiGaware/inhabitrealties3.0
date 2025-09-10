import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth/authService';
import { registerNormalUser } from '../services/auth/authService';
import { fetchRoleById } from '../services/rolemanagement/roleService';

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
        
        // If role details are missing, try to fetch them
        if (parsedAuth.data?.role && !parsedAuth.data?.roleDetails) {
          fetchRoleById(parsedAuth.data.role)
            .then(roleResponse => {
              const enhancedAuth = {
                ...parsedAuth,
                data: {
                  ...parsedAuth.data,
                  roleDetails: roleResponse.data
                }
              };
              setAuth(enhancedAuth);
              localStorage.setItem('auth', JSON.stringify(enhancedAuth));
            })
            .catch(roleError => {
              console.error('Error fetching role details on app start:', roleError);
              // Continue with existing auth data even if role fetch fails
              setAuth(parsedAuth);
            });
        } else {
          setAuth(parsedAuth);
        }
        
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
      
      // Fetch complete role information if role ID exists
      let roleDetails = null;
      if (response.data?.role) {
        try {
          const roleResponse = await fetchRoleById(response.data.role);
          roleDetails = roleResponse.data;
          console.log('Role details fetched:', roleDetails);
        } catch (roleError) {
          console.error('Error fetching role details:', roleError);
          // Continue with login even if role fetch fails
        }
      }
      
      // Create enhanced auth object with role details
      const enhancedAuth = {
        ...response,
        data: {
          ...response.data,
          roleDetails: roleDetails
        }
      };
      
      // Store the enhanced response object
      setAuth(enhancedAuth);
      setIsAuthenticated(true);
      // Save to localStorage for persistence
      localStorage.setItem('auth', JSON.stringify(enhancedAuth));
      return enhancedAuth;
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
  const getUserRoleDetails = () => auth?.data?.roleDetails || null;
  const getUserRoleName = () => auth?.data?.roleDetails?.name || null;
  const getUserRoleDescription = () => auth?.data?.roleDetails?.description || null;
  const isAdmin = () => auth?.data?.role === 'ADMIN' || auth?.data?.role === '68162f63ff2da55b40ca61b8' || auth?.data?.roleDetails?.name === 'ADMIN';
  const isSales = () => auth?.data?.role === 'SALES' || auth?.data?.roleDetails?.name === 'SALES';
  const isExecutive = () => auth?.data?.role === 'EXECUTIVE' || auth?.data?.roleDetails?.name === 'EXECUTIVE';
  const isClient = () => auth?.data?.role === 'CLIENT' || auth?.data?.roleDetails?.name === 'CLIENT';
  
  // Check if user has access to a specific module
  const hasAccess = (module) => {
    const role = getUserRole();
    const roleName = getUserRoleName();
    if (!role && !roleName) return false;
    
    // Use role name from roleDetails if available, otherwise fallback to role ID
    const effectiveRole = roleName || role;
    
    const rolePermissions = {
      'ADMIN': ['dashboard', 'admin', 'property', 'displayProperties', 'leads', 'customers', 'scheduleMeetings', 'sales', 'bookings', 'purchaseBookings', 'rentalBookings', 'payments', 'rent', 'postSale', 'client', 'settings'],
      'SALES': ['dashboard', 'property', 'displayProperties', 'leads', 'customers', 'scheduleMeetings', 'bookings', 'purchaseBookings', 'rentalBookings', 'payments', 'postSale', 'client', 'settings'],
      'EXECUTIVE': ['dashboard', 'property', 'displayProperties', 'leads', 'customers', 'scheduleMeetings', 'sales', 'bookings', 'purchaseBookings', 'rentalBookings', 'payments', 'rent', 'postSale', 'client', 'settings'],
      'CLIENT': ['dashboard', 'client', 'settings']
    };
    
    return rolePermissions[effectiveRole]?.includes(module) || false;
  };

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
      getUserRoleDetails,
      getUserRoleName,
      getUserRoleDescription,
      isAdmin,
      isSales,
      isExecutive,
      isClient,
      hasAccess
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
