import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth/authService';
import { registerNormalUser } from '../services/auth/authService';
import { fetchRoleById } from '../services/rolemanagement/roleService';
import { fetchUserById } from '../services/usermanagement/userService';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);  

// Register Context for Registration Page
const RegisterContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // stores complete login response: { message, token, data }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track initial auth check

  // Function to refresh role from database (useful when role is updated)
  const refreshRole = async () => {
    try {
      const savedAuth = localStorage.getItem('auth');
      if (!savedAuth) return;
      
      const parsedAuth = JSON.parse(savedAuth);
      if (!parsedAuth.data?._id) return;
      
      // Fetch current user from database to get updated role
      const userResponse = await fetchUserById(parsedAuth.data._id);
      const currentUser = userResponse.data;
      
      if (!currentUser?.role) return;
      
      // Fetch current role details from database
      const roleResponse = await fetchRoleById(currentUser.role);
      const enhancedAuth = {
        ...parsedAuth,
        data: {
          ...parsedAuth.data,
          ...currentUser, // Update with current user data (including updated role)
          roleDetails: roleResponse.data
        }
      };
      
      setAuth(enhancedAuth);
      localStorage.setItem('auth', JSON.stringify(enhancedAuth));
      
      // Update role storage
      if (currentUser.role) {
        localStorage.setItem('userRole', currentUser.role);
      }
      if (roleResponse.data?.name) {
        localStorage.setItem('userRoleName', roleResponse.data.name);
      }
      if (roleResponse.data) {
        localStorage.setItem('userRoleDetails', JSON.stringify(roleResponse.data));
      }
    } catch (error) {
      console.error('Error refreshing role:', error);
    }
  };

  useEffect(() => {
    // Load auth data from localStorage on app start
    const savedAuth = localStorage.getItem('auth');

    const initializeAuth = async () => {
      try {
        if (savedAuth) {
          const parsedAuth = JSON.parse(savedAuth);
          
          // Always restore token to cookies from localStorage to ensure sync
          if (parsedAuth.token) {
            Cookies.set('AuthToken', parsedAuth.token, { expires: 1, secure: true, sameSite: 'strict' });
          }
          
          // Always fetch current user and role from database to ensure it's up-to-date
          if (parsedAuth.data?._id) {
            try {
              // Fetch current user from database to get updated role
              const userResponse = await fetchUserById(parsedAuth.data._id);
              const currentUser = userResponse.data;
              
              if (currentUser?.role) {
                // Fetch current role details from database
                const roleResponse = await fetchRoleById(currentUser.role);
                const enhancedAuth = {
                  ...parsedAuth,
                  data: {
                    ...parsedAuth.data,
                    ...currentUser, // Update with current user data (including updated role)
                    roleDetails: roleResponse.data
                  }
                };
                setAuth(enhancedAuth);
                localStorage.setItem('auth', JSON.stringify(enhancedAuth));
                
                // Update role storage
                localStorage.setItem('userRole', currentUser.role);
                if (roleResponse.data) {
                  localStorage.setItem('userRoleDetails', JSON.stringify(roleResponse.data));
                  if (roleResponse.data.name) {
                    localStorage.setItem('userRoleName', roleResponse.data.name);
                  }
                }
                setIsAuthenticated(true);
              } else {
                // Fallback if role not found
                setAuth(parsedAuth);
                setIsAuthenticated(true);
              }
            } catch (error) {
              console.error('Error fetching user/role details on app start:', error);
              // Continue with existing auth data even if fetch fails
              setAuth(parsedAuth);
              setIsAuthenticated(true);
            }
          } else {
            setAuth(parsedAuth);
            setIsAuthenticated(true);
          }
        } else {
          // If no saved auth, make sure cookies are also cleared
          Cookies.remove('AuthToken');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('auth');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userRoleName');
        localStorage.removeItem('userRoleDetails');
        Cookies.remove('AuthToken');
        setIsAuthenticated(false);
      } finally {
        // Mark initial auth check as complete
        setIsLoading(false);
      }
    };

    initializeAuth();
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
        } catch (roleError) {
          console.error('Error fetching role details:', roleError);
          console.error('Role fetch error details:', {
            message: roleError?.message,
            status: roleError?.response?.status,
            data: roleError?.response?.data
          });
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
      
      // Store role separately in localStorage for easy access
      if (response.data?.role) {
        localStorage.setItem('userRole', response.data.role);
      }
      
      // Store role name separately if available
      if (roleDetails?.name) {
        localStorage.setItem('userRoleName', roleDetails.name);
      }
      
      // Store role details separately if available
      if (roleDetails) {
        localStorage.setItem('userRoleDetails', JSON.stringify(roleDetails));
      }
      
      return enhancedAuth;
    } catch (error) {
      console.error('Login error:', error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAuth(null);
    setIsAuthenticated(false);
    // Clear all localStorage
    localStorage.clear();
    // Clear all sessionStorage
    sessionStorage.clear();
    // Clear from cookies
    Cookies.remove('AuthToken');
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
  const getUserRole = () => auth?.data?.role || localStorage.getItem('userRole') || null;
  const getUserRoleDetails = () => {
    if (auth?.data?.roleDetails) return auth.data.roleDetails;
    const savedRoleDetails = localStorage.getItem('userRoleDetails');
    return savedRoleDetails ? JSON.parse(savedRoleDetails) : null;
  };
  const getUserRoleName = () => {
    const roleDetails = getUserRoleDetails();
    return roleDetails?.name || null;
  };
  const getUserRoleDescription = () => {
    const roleDetails = getUserRoleDetails();
    return roleDetails?.description || null;
  };
  
  // Helper functions to access role directly from localStorage
  const getRoleFromStorage = () => localStorage.getItem('userRole');
  const getRoleNameFromStorage = () => localStorage.getItem('userRoleName');
  const getRoleDetailsFromStorage = () => {
    const saved = localStorage.getItem('userRoleDetails');
    return saved ? JSON.parse(saved) : null;
  };
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
      isLoading, // Expose loading state
      login, 
      logout,
      refreshRole, // Expose refresh role function
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
      getRoleFromStorage,
      getRoleNameFromStorage,
      getRoleDetailsFromStorage,
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
