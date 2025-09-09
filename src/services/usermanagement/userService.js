import api from '../api';
import { USER_ENDPOINTS, ROLE_ENDPOINTS } from '../apiEndpoints';

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await api.get(USER_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error) {
    console.error('userService: Fetch users error:', error);
    console.error('userService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Register a new user (admin creates user)
export const registerUser = async (userData) => {
  try {
    const response = await api.post(USER_ENDPOINTS.REGISTER, userData);
    return response.data;
  } catch (error) {
    console.error('userService: Register user error:', error);
    console.error('userService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Edit/Update uxser
export const editUser = async (id, userData) => {
  try {
    const response = await api.put(USER_ENDPOINTS.EDIT(id), userData);
    return response.data;
  } catch (error) {
    console.error('userService: Edit user error:', error);
    console.error('userService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Fetch user by ID
export const fetchUserById = async (id) => {
  try {
    const response = await api.get(USER_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('userService: Fetch user by ID error:', error);
    console.error('userService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Delete user (soft delete)
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(USER_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error) {
    console.error('userService: Delete user error:', error);
    console.error('userService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Fetch users with parameters (for admin only)
export const fetchUsersWithParams = async (params) => {
  try {
    const response = await api.post(USER_ENDPOINTS.GET_ALL_WITH_PARAMS, params);
    return response.data;
  } catch (error) {
    console.error('userService: Fetch users with params error:', error);
    console.error('userService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Fetch users by role (e.g., salespersons)
export const fetchUsersByRole = async (roleName) => {
  try {
    // First get all users
    const allUsersResponse = await api.get(USER_ENDPOINTS.GET_ALL);
    const allUsers = allUsersResponse.data.data || [];
    
    // Get all roles to find the role ID for the given role name
    const rolesResponse = await api.get(ROLE_ENDPOINTS.GET_ALL);
    const allRoles = rolesResponse.data.data || [];
    
    // Find the role ID for the given role name
    const targetRole = allRoles.find(role => role.name === roleName);
    if (!targetRole) {
      console.warn(`Role '${roleName}' not found`);
      return {
        success: true,
        data: [],
        count: 0
      };
    }
    
    // Filter users by role ID
    const filteredUsers = allUsers.filter(user => {
      // Handle both populated and non-populated role fields
      if (typeof user.role === 'object' && user.role !== null) {
        // If role is populated, check by name
        return user.role.name === roleName;
      } else if (typeof user.role === 'string') {
        // If role is ObjectId string, check by ID
        return user.role === targetRole._id;
      }
      return false;
    });
    
    return {
      success: true,
      data: filteredUsers,
      count: filteredUsers.length
    };
  } catch (error) {
    console.error('userService: Fetch users by role error:', error);
    console.error('userService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};