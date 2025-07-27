import api from '../api';
import { ROLE_ENDPOINTS } from '../apiEndpoints';

// Fetch all roles
export const fetchRoles = async () => {
  try {
    const response = await api.get(ROLE_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error) {
    console.error('roleService: Fetch roles error:', error);
    console.error('roleService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Create a new role
export const createRole = async (roleData) => {
  try {
    const response = await api.post(ROLE_ENDPOINTS.CREATE, roleData);
    return response.data;
  } catch (error) {
    console.error('roleService: Create role error:', error);
    console.error('roleService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Edit/Update role
export const editRole = async (id, roleData) => {
  try {
    const response = await api.put(ROLE_ENDPOINTS.EDIT(id), roleData);
    return response.data;
  } catch (error) {
    console.error('roleService: Edit role error:', error);
    console.error('roleService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Delete role (soft delete)
export const deleteRole = async (id) => {
  try {
    const response = await api.delete(ROLE_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error) {
    console.error('roleService: Delete role error:', error);
    console.error('roleService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Add more role management functions as needed 