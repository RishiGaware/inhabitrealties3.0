import api from './api';
import { PROPERTY_TYPE_ENDPOINTS } from './apiEndpoints';

// Fetch all property types
export const getAllPropertyTypes = async () => {
  const response = await api.get(PROPERTY_TYPE_ENDPOINTS.GET_ALL);
  return response.data;
};

// Create a new property type
export const createPropertyType = async (propertyTypeData) => {
  const response = await api.post(PROPERTY_TYPE_ENDPOINTS.CREATE, propertyTypeData);
  return response.data;
};

// Edit/Update property type
export const editPropertyType = async (id, propertyTypeData) => {
  const response = await api.put(PROPERTY_TYPE_ENDPOINTS.EDIT(id), propertyTypeData);
  return response.data;
};

// Delete property type
export const deletePropertyType = async (id) => {
  const response = await api.delete(PROPERTY_TYPE_ENDPOINTS.DELETE(id));
  return response.data;
};

