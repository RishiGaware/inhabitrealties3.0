import api from '../api';
import { LEADS_ENDPOINTS } from '../apiEndpoints';

// Fetch all leads
export const fetchLeads = async () => {
  try {
    const response = await api.get(LEADS_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error) {
    console.error('leadsService: Fetch leads error:', error);
    console.error('leadsService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Get lead by ID
export const fetchLeadById = async (id) => {
  try {
    const response = await api.get(LEADS_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('leadsService: Fetch lead by ID error:', error);
    console.error('leadsService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    throw error;
  }
};

// Create a new lead
export const createLead = async (leadData) => {
  try {
    
    const response = await api.post(LEADS_ENDPOINTS.CREATE, leadData);
    
    return response.data;
  } catch (error) {
    console.error('leadsService: Create lead error:', error);
    console.error('leadsService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Edit/Update lead
export const editLead = async (id, leadData) => {
  try {
    
    const response = await api.put(LEADS_ENDPOINTS.EDIT(id), leadData);
    
    return response.data;
  } catch (error) {
    console.error('leadsService: Edit lead error:', error);
    console.error('leadsService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Delete lead (soft delete)
export const deleteLead = async (id) => {
  try {
    
    const response = await api.delete(LEADS_ENDPOINTS.DELETE(id));
    
    return response.data;
  } catch (error) {
    console.error('leadsService: Delete lead error:', error);
    console.error('leadsService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
};

// Get all leads with parameters
export const fetchLeadsWithParams = async (params) => {
  try {
    const response = await api.post(LEADS_ENDPOINTS.GET_ALL_WITH_PARAMS, params);
    
    return response.data;
  } catch (error) {
    console.error('leadsService: Fetch leads with params error:', error);
    console.error('leadsService: Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      statusText: error?.response?.statusText
    });
    throw error;
  }
}; 