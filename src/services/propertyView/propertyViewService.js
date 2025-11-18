import api from '../api';

const PROPERTY_VIEW_ENDPOINTS = {
  TRACK: '/property-view/track',
  GET_USER_COUNT: (userId) => `/property-view/user/${userId}/count`,
  GET_USER_VIEWS: (userId) => `/property-view/user/${userId}`,
};

/**
 * Track a property view
 * @param {string} propertyId - The ID of the property being viewed
 * @returns {Promise} API response
 */
export const trackPropertyView = async (propertyId) => {
  try {
    const response = await api.post(PROPERTY_VIEW_ENDPOINTS.TRACK, {
      propertyId
    });
    return response.data;
  } catch (error) {
    console.error('propertyViewService: Track view error:', error);
    // Don't throw error - tracking should not break the UI
    return null;
  }
};

/**
 * Get view count for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise} API response with count
 */
export const getUserViewCount = async (userId) => {
  try {
    const response = await api.get(PROPERTY_VIEW_ENDPOINTS.GET_USER_COUNT(userId));
    return response.data;
  } catch (error) {
    console.error('propertyViewService: Get view count error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get all views for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise} API response with views
 */
export const getUserViews = async (userId) => {
  try {
    const response = await api.get(PROPERTY_VIEW_ENDPOINTS.GET_USER_VIEWS(userId));
    return response.data;
  } catch (error) {
    console.error('propertyViewService: Get user views error:', error);
    throw error.response?.data || error;
  }
};

