import api from '../api';
import { PROPERTY_TYPE_ENDPOINTS } from '../apiEndpoints';

// Fetch all property types
export const fetchPropertyTypes = async () => {
  try {
    const response = await api.get(PROPERTY_TYPE_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error) {
    console.error('propertyTypeService: Fetch property types error:', error);
    console.error('propertyTypeService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Create a new property type
export const createPropertyType = async (propertyTypeData) => {
  try {
    const response = await api.post(PROPERTY_TYPE_ENDPOINTS.CREATE, propertyTypeData);
    return response.data;
  } catch (error) {
    console.error('propertyTypeService: Create property type error:', error);
    console.error('propertyTypeService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Edit/Update property type
export const editPropertyType = async (id, propertyTypeData) => {
  try {
    const response = await api.put(PROPERTY_TYPE_ENDPOINTS.EDIT(id), propertyTypeData);
    return response.data;
  } catch (error) {
    console.error('propertyTypeService: Edit property type error:', error);
    console.error('propertyTypeService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Delete property type (soft delete)
export const deletePropertyType = async (id) => {
  try {
    const response = await api.delete(PROPERTY_TYPE_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error) {
    console.error('propertyTypeService: Delete property type error:', error);
    console.error('propertyTypeService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
}; 