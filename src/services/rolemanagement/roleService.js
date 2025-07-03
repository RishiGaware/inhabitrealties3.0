import api from '../api';
import { ROLE_ENDPOINTS } from '../apiEndpoints';

// Fetch all roles
export const fetchRoles = async () => {
  try {
    console.log('roleService: Fetching all roles');
    const response = await api.get(ROLE_ENDPOINTS.GET_ALL);
    console.log('roleService: Fetch roles response:', response.data);
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
    console.log('roleService: Creating role with data:', roleData);
    console.log('roleService: Using endpoint:', ROLE_ENDPOINTS.CREATE);
    console.log('roleService: Full URL will be:', 'https://insightwaveit-backend-p0cl.onrender.com/api' + ROLE_ENDPOINTS.CREATE);
    
    const response = await api.post(ROLE_ENDPOINTS.CREATE, roleData);
    console.log('roleService: Create role response:', response);
    console.log('roleService: Response data:', response.data);
    console.log('roleService: Response status:', response.status);
    
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
    console.log('roleService: Editing role with ID:', id);
    console.log('roleService: Edit data:', roleData);
    console.log('roleService: Endpoint:', ROLE_ENDPOINTS.EDIT(id));
    
    const response = await api.put(ROLE_ENDPOINTS.EDIT(id), roleData);
    console.log('roleService: Edit response:', response.data);
    console.log('roleService: Response status:', response.status);
    
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
    console.log('roleService: Deleting role with ID:', id);
    console.log('roleService: Endpoint:', ROLE_ENDPOINTS.DELETE(id));
    
    const response = await api.delete(ROLE_ENDPOINTS.DELETE(id));
    console.log('roleService: Delete response:', response.data);
    console.log('roleService: Response status:', response.status);
    
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