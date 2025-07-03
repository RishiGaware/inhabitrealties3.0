import api from '../api';
import { FOLLOWUP_STATUS_ENDPOINTS } from '../apiEndpoints';

// Fetch all followup statuses
export const fetchFollowUpStatuses = async () => {
  try {
    console.log('followUpStatusService: Fetching all followup statuses');
    const response = await api.get(FOLLOWUP_STATUS_ENDPOINTS.GET_ALL);
    console.log('followUpStatusService: Fetch followup statuses response:', response.data);
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
    console.log('followUpStatusService: Fetching followup status by ID:', id);
    const response = await api.get(FOLLOWUP_STATUS_ENDPOINTS.GET_BY_ID(id));
    console.log('followUpStatusService: Fetch followup status by ID response:', response.data);
    return response.data;
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
    console.log('followUpStatusService: Creating followup status with data:', followUpStatusData);
    console.log('followUpStatusService: Using endpoint:', FOLLOWUP_STATUS_ENDPOINTS.CREATE);
    
    const response = await api.post(FOLLOWUP_STATUS_ENDPOINTS.CREATE, followUpStatusData);
    console.log('followUpStatusService: Create followup status response:', response);
    console.log('followUpStatusService: Response data:', response.data);
    console.log('followUpStatusService: Response status:', response.status);
    
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
    console.log('followUpStatusService: Editing followup status with ID:', id);
    console.log('followUpStatusService: Edit data:', followUpStatusData);
    console.log('followUpStatusService: Endpoint:', FOLLOWUP_STATUS_ENDPOINTS.EDIT(id));
    
    const response = await api.put(FOLLOWUP_STATUS_ENDPOINTS.EDIT(id), followUpStatusData);
    console.log('followUpStatusService: Edit response:', response.data);
    console.log('followUpStatusService: Response status:', response.status);
    
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
    console.log('followUpStatusService: Deleting followup status with ID:', id);
    console.log('followUpStatusService: Endpoint:', FOLLOWUP_STATUS_ENDPOINTS.DELETE(id));
    
    const response = await api.delete(FOLLOWUP_STATUS_ENDPOINTS.DELETE(id));
    console.log('followUpStatusService: Delete response:', response.data);
    console.log('followUpStatusService: Response status:', response.status);
    
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