import api from '../api';
import { USER_ENDPOINTS } from '../apiEndpoints';

// Fetch all users
export const fetchUsers = async () => {
  try {
    console.log('userService: Fetching all users');
    const response = await api.get(USER_ENDPOINTS.GET_ALL);
    console.log('userService: Fetch users response:', response.data);
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
    console.log('userService: Registering user with data:', userData);
    const response = await api.post(USER_ENDPOINTS.REGISTER, userData);
    console.log('userService: Register user response:', response.data);
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

// Edit/Update user
export const editUser = async (id, userData) => {
  try {
    console.log('userService: Editing user with ID:', id);
    console.log('userService: Edit data:', userData);
    console.log('userService: Endpoint:', USER_ENDPOINTS.EDIT(id));
    
    const response = await api.put(USER_ENDPOINTS.EDIT(id), userData);
    console.log('userService: Edit response:', response.data);
    console.log('userService: Response status:', response.status);
    
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

// Delete user (soft delete)
export const deleteUser = async (id) => {
  try {
    console.log('userService: Deleting user with ID:', id);
    console.log('userService: Endpoint:', USER_ENDPOINTS.DELETE(id));
    
    const response = await api.delete(USER_ENDPOINTS.DELETE(id));
    console.log('userService: Delete response:', response.data);
    console.log('userService: Response status:', response.status);
    
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