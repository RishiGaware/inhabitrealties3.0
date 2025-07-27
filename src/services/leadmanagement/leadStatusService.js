import api from '../api';
import { LEAD_STATUS_ENDPOINTS } from '../apiEndpoints';

// Fetch all lead statuses
export const fetchLeadStatuses = async () => {
  try {
    const response = await api.get(LEAD_STATUS_ENDPOINTS.GET_ALL);
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
    const response = await api.get(LEAD_STATUS_ENDPOINTS.GET_BY_ID(id));
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
    const response = await api.post(LEAD_STATUS_ENDPOINTS.CREATE, leadStatusData);
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
    const response = await api.put(LEAD_STATUS_ENDPOINTS.EDIT(id), leadStatusData);
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
    const response = await api.delete(LEAD_STATUS_ENDPOINTS.DELETE(id));
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