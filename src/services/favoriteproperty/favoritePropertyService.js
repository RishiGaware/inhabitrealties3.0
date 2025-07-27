import api from '../api';
import { FAVORITE_PROPERTY_ENDPOINTS } from '../apiEndpoints';

// Create a new favorite property
export const createFavoriteProperty = async (userId, propertyId) => {
  try {
    const response = await api.post(FAVORITE_PROPERTY_ENDPOINTS.CREATE, {
      userId,
      propertyId
    });
    return response.data;
  } catch (error) {
    console.error('favoritePropertyService: Create favorite property error:', error);
    throw error;
  }
};

// Get all favorite properties
export const getAllFavoriteProperties = async () => {
  try {
    const response = await api.get(FAVORITE_PROPERTY_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error) {
    console.error('favoritePropertyService: Get all favorite properties error:', error);
    throw error;
  }
};

// Get favorite properties by user ID
export const getFavoritePropertiesByUserId = async (userId) => {
  try {
    const response = await api.get(FAVORITE_PROPERTY_ENDPOINTS.GET_BY_USER_ID(userId));
    return response.data;
  } catch (error) {
    console.error('favoritePropertyService: Get favorite properties by user ID error:', error);
    throw error;
  }
};

// Get favorite properties with parameters
export const getFavoritePropertiesWithParams = async (params) => {
  try {
    const response = await api.post(FAVORITE_PROPERTY_ENDPOINTS.GET_WITH_PARAMS, params);
    return response.data;
  } catch (error) {
    console.error('favoritePropertyService: Get favorite properties with params error:', error);
    throw error;
  }
};

// Get favorite property by ID
export const getFavoritePropertyById = async (id) => {
  try {
    const response = await api.get(FAVORITE_PROPERTY_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('favoritePropertyService: Get favorite property by ID error:', error);
    throw error;
  }
};

// Delete favorite property by ID
export const deleteFavoriteProperty = async (id) => {
  try {
    const response = await api.delete(FAVORITE_PROPERTY_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error) {
    console.error('favoritePropertyService: Delete favorite property error:', error);
    throw error;
  }
};

// Check if a property is favorited by a user
export const checkIfPropertyIsFavorited = async (userId, propertyId) => {
  try {
    const response = await api.post(FAVORITE_PROPERTY_ENDPOINTS.GET_WITH_PARAMS, {
      userId,
      propertyId
    });
    return response.data.data && response.data.data.length > 0;
  } catch (error) {
    console.error('favoritePropertyService: Check if property is favorited error:', error);
    return false;
  }
}; 