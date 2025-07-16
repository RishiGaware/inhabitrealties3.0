import api from '../api';
import { FAVORITE_PROPERTY_ENDPOINTS } from '../apiEndpoints';

// Create a new favorite property
export const createFavoriteProperty = async (userId, propertyId) => {
  try {
    console.log('favoritePropertyService: Creating favorite property');
    const response = await api.post(FAVORITE_PROPERTY_ENDPOINTS.CREATE, {
      userId,
      propertyId
    });
    console.log('favoritePropertyService: Create favorite property response:', response.data);
    return response.data;
  } catch (error) {
    console.error('favoritePropertyService: Create favorite property error:', error);
    throw error;
  }
};

// Get all favorite properties
export const getAllFavoriteProperties = async () => {
  try {
    console.log('favoritePropertyService: Fetching all favorite properties');
    const response = await api.get(FAVORITE_PROPERTY_ENDPOINTS.GET_ALL);
    console.log('favoritePropertyService: Get all favorite properties response:', response.data);
    return response.data;
  } catch (error) {
    console.error('favoritePropertyService: Get all favorite properties error:', error);
    throw error;
  }
};

// Get favorite properties by user ID
export const getFavoritePropertiesByUserId = async (userId) => {
  try {
    console.log('favoritePropertyService: Fetching favorite properties for user:', userId);
    const response = await api.get(FAVORITE_PROPERTY_ENDPOINTS.GET_BY_USER_ID(userId));
    console.log('favoritePropertyService: Get favorite properties by user ID response:', response.data);
    return response.data;
  } catch (error) {
    console.error('favoritePropertyService: Get favorite properties by user ID error:', error);
    throw error;
  }
};

// Get favorite properties with parameters
export const getFavoritePropertiesWithParams = async (params) => {
  try {
    console.log('favoritePropertyService: Fetching favorite properties with params:', params);
    const response = await api.post(FAVORITE_PROPERTY_ENDPOINTS.GET_WITH_PARAMS, params);
    console.log('favoritePropertyService: Get favorite properties with params response:', response.data);
    return response.data;
  } catch (error) {
    console.error('favoritePropertyService: Get favorite properties with params error:', error);
    throw error;
  }
};

// Get favorite property by ID
export const getFavoritePropertyById = async (id) => {
  try {
    console.log('favoritePropertyService: Fetching favorite property by ID:', id);
    const response = await api.get(FAVORITE_PROPERTY_ENDPOINTS.GET_BY_ID(id));
    console.log('favoritePropertyService: Get favorite property by ID response:', response.data);
    return response.data;
  } catch (error) {
    console.error('favoritePropertyService: Get favorite property by ID error:', error);
    throw error;
  }
};

// Delete favorite property by ID
export const deleteFavoriteProperty = async (id) => {
  try {
    console.log('favoritePropertyService: Deleting favorite property with ID:', id);
    const response = await api.delete(FAVORITE_PROPERTY_ENDPOINTS.DELETE(id));
    console.log('favoritePropertyService: Delete favorite property response:', response.data);
    return response.data;
  } catch (error) {
    console.error('favoritePropertyService: Delete favorite property error:', error);
    throw error;
  }
};

// Check if a property is favorited by a user
export const checkIfPropertyIsFavorited = async (userId, propertyId) => {
  try {
    console.log('favoritePropertyService: Checking if property is favorited');
    const response = await api.post(FAVORITE_PROPERTY_ENDPOINTS.GET_WITH_PARAMS, {
      userId,
      propertyId
    });
    console.log('favoritePropertyService: Check if property is favorited response:', response.data);
    return response.data.data && response.data.data.length > 0;
  } catch (error) {
    console.error('favoritePropertyService: Check if property is favorited error:', error);
    return false;
  }
}; 