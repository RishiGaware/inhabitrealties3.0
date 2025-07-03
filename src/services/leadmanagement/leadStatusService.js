import api from '../api';
import { LEAD_STATUS_ENDPOINTS } from '../apiEndpoints';

// Fetch all lead statuses
export const fetchLeadStatuses = async () => {
  try {
    console.log('leadStatusService: Fetching all lead statuses');
    const response = await api.get(LEAD_STATUS_ENDPOINTS.GET_ALL);
    console.log('leadStatusService: Fetch lead statuses response:', response.data);
    return response.data;
  } catch (error) {
    console.error('leadStatusService: Fetch lead statuses error:', error);
    console.error('leadStatusService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Get lead status by ID
export const fetchLeadStatusById = async (id) => {
  try {
    console.log('leadStatusService: Fetching lead status with ID:', id);
    const response = await api.get(LEAD_STATUS_ENDPOINTS.GET_BY_ID(id));
    console.log('leadStatusService: Fetch lead status by ID response:', response.data);
    return response.data;
  } catch (error) {
    console.error('leadStatusService: Fetch lead status by ID error:', error);
    console.error('leadStatusService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Create a new lead status
export const createLeadStatus = async (leadStatusData) => {
  try {
    console.log('leadStatusService: Creating lead status with data:', leadStatusData);
    console.log('leadStatusService: Using endpoint:', LEAD_STATUS_ENDPOINTS.CREATE);
    
    const response = await api.post(LEAD_STATUS_ENDPOINTS.CREATE, leadStatusData);
    console.log('leadStatusService: Create lead status response:', response);
    console.log('leadStatusService: Response data:', response.data);
    console.log('leadStatusService: Response status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('leadStatusService: Create lead status error:', error);
    console.error('leadStatusService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Edit/Update lead status
export const editLeadStatus = async (id, leadStatusData) => {
  try {
    console.log('leadStatusService: Editing lead status with ID:', id);
    console.log('leadStatusService: Edit data:', leadStatusData);
    console.log('leadStatusService: Endpoint:', LEAD_STATUS_ENDPOINTS.EDIT(id));
    
    const response = await api.put(LEAD_STATUS_ENDPOINTS.EDIT(id), leadStatusData);
    console.log('leadStatusService: Edit response:', response.data);
    console.log('leadStatusService: Response status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('leadStatusService: Edit lead status error:', error);
    console.error('leadStatusService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Delete lead status (soft delete)
export const deleteLeadStatus = async (id) => {
  try {
    console.log('leadStatusService: Deleting lead status with ID:', id);
    console.log('leadStatusService: Endpoint:', LEAD_STATUS_ENDPOINTS.DELETE(id));
    
    const response = await api.delete(LEAD_STATUS_ENDPOINTS.DELETE(id));
    console.log('leadStatusService: Delete response:', response.data);
    console.log('leadStatusService: Response status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('leadStatusService: Delete lead status error:', error);
    console.error('leadStatusService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
}; 