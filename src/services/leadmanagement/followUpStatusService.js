import api from '../api';
import { FOLLOWUP_STATUS_ENDPOINTS } from '../apiEndpoints';

// Fetch all followup statuses
export const fetchFollowUpStatuses = async () => {
  try {
    const response = await api.get(FOLLOWUP_STATUS_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error) {
    console.error('followUpStatusService: Fetch followup statuses error:', error);
    console.error('followUpStatusService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Get followup status by ID
export const fetchFollowUpStatusById = async (id) => {
  try {
    const response = await api.get(FOLLOWUP_STATUS_ENDPOINTS.GET_BY_ID(id));
  } catch (error) {
    console.error('followUpStatusService: Fetch followup status by ID error:', error);
    console.error('followUpStatusService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Create a new followup status
export const createFollowUpStatus = async (followUpStatusData) => {
  try {
    
    const response = await api.post(FOLLOWUP_STATUS_ENDPOINTS.CREATE, followUpStatusData);
    
    return response.data;
  } catch (error) {
    console.error('followUpStatusService: Create followup status error:', error);
    console.error('followUpStatusService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Edit/Update followup status
export const editFollowUpStatus = async (id, followUpStatusData) => {
  try {
    const response = await api.put(FOLLOWUP_STATUS_ENDPOINTS.EDIT(id), followUpStatusData);
    return response.data;
  } catch (error) {
    console.error('followUpStatusService: Edit followup status error:', error);
    console.error('followUpStatusService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Delete followup status (soft delete)
export const deleteFollowUpStatus = async (id) => {
  try {
    const response = await api.delete(FOLLOWUP_STATUS_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error) {
    console.error('followUpStatusService: Delete followup status error:', error);
    console.error('followUpStatusService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
}; 