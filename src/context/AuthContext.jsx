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
    const savedRole = localStorage.getItem('userRole');
    const savedRoleName = localStorage.getItem('userRoleName');
    const savedRoleDetails = localStorage.getItem('userRoleDetails');
    
    console.log('Loading auth data from localStorage:');
    console.log('Saved auth:', savedAuth);
    console.log('Saved role:', savedRole);
    console.log('Saved role name:', savedRoleName);
    console.log('Saved role details:', savedRoleDetails);
    
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
              
              // Also store role separately if not already stored
              if (!savedRole) {
                localStorage.setItem('userRole', parsedAuth.data.role);
              }
              if (!savedRoleDetails) {
                localStorage.setItem('userRoleDetails', JSON.stringify(roleResponse.data));
              }
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
        console.log('Auth data loaded successfully');
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('auth');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userRoleName');
        localStorage.removeItem('userRoleDetails');
      }
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      console.log('Login response:', response);
      console.log('User data:', response.data);
      console.log('User role:', response.data?.role);
      
      // Fetch complete role information if role ID exists
      let roleDetails = null;
      if (response.data?.role) {
        try {
          console.log('Fetching role details for role ID:', response.data.role);
          const roleResponse = await fetchRoleById(response.data.role);
          roleDetails = roleResponse.data;
          console.log('Role details fetched successfully:', roleDetails);
        } catch (roleError) {
          console.error('Error fetching role details:', roleError);
          console.error('Role fetch error details:', {
            message: roleError?.message,
            status: roleError?.response?.status,
            data: roleError?.response?.data
          });
          // Continue with login even if role fetch fails
        }
      } else {
        console.log('No role found in user data');
      }
      
      // Create enhanced auth object with role details
      const enhancedAuth = {
        ...response,
        data: {
          ...response.data,
          roleDetails: roleDetails
        }
      };
      
      console.log('Enhanced auth object:', enhancedAuth);
      
      // Store the enhanced response object
      setAuth(enhancedAuth);
      setIsAuthenticated(true);
      
      // Save to localStorage for persistence
      localStorage.setItem('auth', JSON.stringify(enhancedAuth));
      
      // Store role separately in localStorage for easy access
      if (response.data?.role) {
        localStorage.setItem('userRole', response.data.role);
        console.log('Role ID stored separately:', response.data.role);
      }
      
      // Store role name separately if available
      if (roleDetails?.name) {
        localStorage.setItem('userRoleName', roleDetails.name);
        console.log('Role name stored separately:', roleDetails.name);
      }
      
      // Store role details separately if available
      if (roleDetails) {
        localStorage.setItem('userRoleDetails', JSON.stringify(roleDetails));
        console.log('Role details stored separately:', roleDetails);
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
    // Clear from localStorage
    localStorage.removeItem('auth');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRoleName');
    localStorage.removeItem('userRoleDetails');
    console.log('All auth data cleared from localStorage');
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
    console.log('effectiveRole', effectiveRole);
    
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
