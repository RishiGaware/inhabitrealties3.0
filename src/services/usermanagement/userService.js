import api from '../api';
import { USER_ENDPOINTS } from '../apiEndpoints';

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

// Edit/Update user
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