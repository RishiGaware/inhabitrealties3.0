import api from './api';
import { PROPERTY_ENDPOINTS } from './apiEndpoints';

// Fetch all properties (published)
export const fetchProperties = async () => {
  const response = await api.get(PROPERTY_ENDPOINTS.GET_ALL);
  return response.data;
};

// Fetch properties with filters
export const fetchPropertiesWithParams = async (params) => {
  const response = await api.post(PROPERTY_ENDPOINTS.GET_WITH_PARAMS, params);
  return response.data;
};

// Create a new property
export const createProperty = async (propertyData) => {
  const response = await api.post(PROPERTY_ENDPOINTS.CREATE, propertyData);
  return response.data;
};

// Edit/Update property
export const editProperty = async (id, propertyData) => {
  const response = await api.put(PROPERTY_ENDPOINTS.EDIT(id), propertyData);
  return response.data;
};

// Delete (unpublish) property
export const deleteProperty = async (id) => {
  const response = await api.delete(PROPERTY_ENDPOINTS.DELETE(id));
  return response.data;
};

// Upload property image (multipart/form-data)
export const uploadPropertyImage = async (propertyId, imageFile) => {
  const formData = new FormData();
  formData.append('propertyId', propertyId);
  formData.append('image', imageFile);
  const response = await api.post(PROPERTY_ENDPOINTS.UPLOAD_IMAGE(propertyId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Get all images by property ID
export const fetchPropertyImages = async (propertyId) => {
  const response = await api.get(PROPERTY_ENDPOINTS.GET_IMAGES(propertyId));
  return response.data;
};

// Delete property image by image ID
export const deletePropertyImage = async (imageId) => {
  const response = await api.delete(PROPERTY_ENDPOINTS.DELETE_IMAGE(imageId));
  return response.data;
};

// Delete all property images by property ID
export const deleteAllPropertyImages = async (propertyId) => {
  const response = await api.delete(PROPERTY_ENDPOINTS.DELETE_ALL_IMAGES(propertyId), {
    data: { propertyId },
  });
  return response.data;
}; 