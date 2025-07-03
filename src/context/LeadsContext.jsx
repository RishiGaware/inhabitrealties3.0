import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchLeads, fetchLeadById, createLead, editLead, deleteLead, fetchLeadsWithParams } from '../services/leadmanagement/leadsService';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

// Default context value
const defaultContextValue = {
  leads: [],
  loading: false,
  getAllLeads: () => {},
  getLeadById: () => {},
  addLead: () => {},
  updateLead: () => {},
  removeLead: () => {},
  getLeadsWithParams: () => {},
};

const LeadsContext = createContext(defaultContextValue);

export const LeadsProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchLeads();
      console.log('LeadsContext: Fetch leads response:', res);
      setLeads(res.data || []);
    } catch (err) {
      console.error('LeadsContext: Fetch leads error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to fetch leads';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view leads';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Internal server error - Please try again later';
      } else if (err?.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error - Please check your connection';
      } else if (err?.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - Please try again';
      }
      
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getLeadById = async (id) => {
    setLoading(true);
    try {
      const response = await fetchLeadById(id);
      console.log('LeadsContext: Get lead by ID response:', response);
      return response.data || response;
    } catch (err) {
      console.error('LeadsContext: Get lead by ID error:', err);
      
      let errorMessage = 'Failed to fetch lead';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Lead not found';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view this lead';
      }
      
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (leadData) => {
    setLoading(true);
    try {
      const response = await createLead(leadData);
      console.log('LeadsContext: Add lead response:', response);
      
      // Add the new lead to local state directly
      const newLead = {
        ...leadData,
        _id: response.data?._id || Date.now().toString(),
        createdAt: response.data?.createdAt || new Date().toISOString(),
        published: response.data?.published !== undefined ? response.data.published : true,
      };
      
      setLeads(prevLeads => [...prevLeads, newLead]);
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Lead added successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('LeadsContext: Add lead error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to add lead';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 409) {
        errorMessage = 'Lead with this information already exists';
      } else if (err?.response?.status === 422) {
        errorMessage = 'Validation error - Please check your input data';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Internal server error - Please try again later';
      }
      
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (id, leadData) => {
    setLoading(true);
    try {
      console.log('LeadsContext: Updating lead with ID:', id);
      console.log('LeadsContext: Update data:', leadData);
      
      const response = await editLead(id, leadData);
      console.log('LeadsContext: Update response:', response);
      
      // Update the local state directly instead of fetching all leads again
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead._id === id 
            ? { 
                ...lead, 
                ...leadData,
                updatedAt: new Date().toISOString() 
              }
            : lead
        )
      );
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Lead updated successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('LeadsContext: Update lead error:', err);
      console.error('LeadsContext: Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        statusText: err?.response?.statusText
      });
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to update lead';
      
      if (err?.response?.data?.message) {
        // Use the actual error message from the backend
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        // Some backends return error in 'error' field
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Lead not found';
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to update this lead';
      } else if (err?.response?.status === 422) {
        errorMessage = 'Validation error - Please check your input data';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Internal server error - Please try again later';
      } else if (err?.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error - Please check your connection';
      } else if (err?.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - Please try again';
      }
      
      showErrorToast(errorMessage);
      throw err; // Re-throw to let the component handle it
    } finally {
      setLoading(false);
    }
  };

  const removeLead = async (id) => {
    setLoading(true);
    try {
      const response = await deleteLead(id);
      console.log('LeadsContext: Delete lead response:', response);
      
      // Remove the lead from local state directly (soft delete)
      setLeads(prevLeads => prevLeads.filter(lead => lead._id !== id));
      
      // Show the actual success message from the backend
      const successMessage = response?.message || 'Lead deleted successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('LeadsContext: Delete lead error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to delete lead';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Lead not found';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to delete this lead';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Internal server error - Please try again later';
      }
      
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLeadsWithParams = async (params) => {
    setLoading(true);
    try {
      const res = await fetchLeadsWithParams(params);
      console.log('LeadsContext: Fetch leads with params response:', res);
      setLeads(res.data || []);
    } catch (err) {
      console.error('LeadsContext: Fetch leads with params error:', err);
      
      // Show more specific error messages based on backend response
      let errorMessage = 'Failed to fetch leads with parameters';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view leads';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Internal server error - Please try again later';
      } else if (err?.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error - Please check your connection';
      } else if (err?.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - Please try again';
      }
      
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    leads,
    loading,
    getAllLeads,
    getLeadById,
    addLead,
    updateLead,
    removeLead,
    getLeadsWithParams,
  };

  return (
    <LeadsContext.Provider value={contextValue}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeadsContext = () => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeadsContext must be used within a LeadsProvider');
  }
  return context;
}; 