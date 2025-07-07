import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  fetchMeetings, 
  createMeeting, 
  updateMeeting as updateMeetingService, 
  deleteMeeting,
  updateMeetingStatus
} from '../services/meetings/meetingService';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

// Default context value
const defaultContextValue = {
  meetings: [],
  loading: false,
  getAllMeetings: () => {},
  addMeeting: () => {},
  updateMeeting: () => {},
  removeMeeting: () => {},
  updateStatus: () => {},
  getMeetingById: () => {},
  getMeetingsByCustomer: () => {},
  getMeetingsBySalesPerson: () => {},
};

const MeetingContext = createContext(defaultContextValue);

export const MeetingProvider = ({ children }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchMeetings();
      console.log('MeetingContext: Fetch meetings response:', res);
      setMeetings(res.data || []);
    } catch (err) {
      console.error('MeetingContext: Fetch meetings error:', err);
      
      let errorMessage = 'Failed to fetch meetings';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to view meetings';
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

  const getMeetingById = useCallback(async (id) => {
    try {
      const res = await fetchMeetings();
      const meeting = res.data?.find(m => m._id === id);
      console.log('MeetingContext: Get by ID response:', meeting);
      return meeting;
    } catch (err) {
      console.error('MeetingContext: Get by ID error:', err);
      showErrorToast('Failed to fetch meeting');
      throw err;
    }
  }, []);

  const getMeetingsByCustomer = useCallback(async (customerId) => {
    setLoading(true);
    try {
      const res = await fetchMeetings();
      const customerMeetings = res.data?.filter(m => m.customerId === customerId) || [];
      console.log('MeetingContext: Get by customer response:', customerMeetings);
      return customerMeetings;
    } catch (err) {
      console.error('MeetingContext: Get by customer error:', err);
      showErrorToast('Failed to fetch customer meetings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMeetingsBySalesPerson = useCallback(async (salesPersonId) => {
    setLoading(true);
    try {
      const res = await fetchMeetings();
      const salesPersonMeetings = res.data?.filter(m => m.salesPersonId === salesPersonId) || [];
      console.log('MeetingContext: Get by sales person response:', salesPersonMeetings);
      return salesPersonMeetings;
    } catch (err) {
      console.error('MeetingContext: Get by sales person error:', err);
      showErrorToast('Failed to fetch sales person meetings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addMeeting = async (meetingData) => {
    setLoading(true);
    try {
      const response = await createMeeting(meetingData);
      console.log('MeetingContext: Add meeting response:', response);
      
      const newMeeting = {
        ...meetingData,
        _id: response.data?._id || Date.now().toString(),
        createdAt: response.data?.createdAt || new Date().toISOString(),
        updatedAt: response.data?.updatedAt || new Date().toISOString(),
      };
      
      setMeetings(prevMeetings => [...prevMeetings, newMeeting]);
      
      const successMessage = response?.message || 'Meeting scheduled successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('MeetingContext: Add meeting error:', err);
      
      let errorMessage = 'Failed to schedule meeting';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 409) {
        errorMessage = 'Meeting with this schedule already exists';
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

  const updateMeeting = async (id, meetingData) => {
    setLoading(true);
    try {
      console.log('MeetingContext: Updating meeting with ID:', id);
      console.log('MeetingContext: Update data:', meetingData);
      
      const response = await updateMeetingService(id, meetingData);
      console.log('MeetingContext: Update response:', response);
      
      setMeetings(prevMeetings => 
        prevMeetings.map(meeting => 
          meeting._id === id 
            ? { 
                ...meeting, 
                ...meetingData,
                updatedAt: new Date().toISOString() 
              }
            : meeting
        )
      );
      
      const successMessage = response?.message || 'Meeting updated successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('MeetingContext: Update meeting error:', err);
      
      let errorMessage = 'Failed to update meeting';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Meeting not found';
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Internal server error - Please try again later';
      }
      
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      console.log('MeetingContext: Updating meeting status:', id, status);
      
      const response = await updateMeetingStatus(id, status);
      console.log('MeetingContext: Update status response:', response);
      
      setMeetings(prevMeetings => 
        prevMeetings.map(meeting => 
          meeting._id === id 
            ? { 
                ...meeting, 
                status,
                updatedAt: new Date().toISOString() 
              }
            : meeting
        )
      );
      
      const successMessage = response?.message || 'Meeting status updated successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('MeetingContext: Update status error:', err);
      
      let errorMessage = 'Failed to update meeting status';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Meeting not found';
      } else if (err?.response?.status === 400) {
        errorMessage = 'Bad request - Please check your input data';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Internal server error - Please try again later';
      }
      
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMeeting = async (id) => {
    setLoading(true);
    try {
      console.log('MeetingContext: Deleting meeting with ID:', id);
      
      const response = await deleteMeeting(id);
      console.log('MeetingContext: Delete response:', response);
      
      setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting._id !== id));
      
      const successMessage = response?.message || 'Meeting deleted successfully';
      showSuccessToast(successMessage);
      
    } catch (err) {
      console.error('MeetingContext: Delete meeting error:', err);
      
      let errorMessage = 'Failed to delete meeting';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Meeting not found';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Forbidden - You do not have permission to delete meetings';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Internal server error - Please try again later';
      }
      
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    meetings,
    loading,
    getAllMeetings,
    addMeeting,
    updateMeeting,
    removeMeeting,
    updateStatus,
    getMeetingById,
    getMeetingsByCustomer,
    getMeetingsBySalesPerson,
  };

  return (
    <MeetingContext.Provider value={contextValue}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeetingContext = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeetingContext must be used within a MeetingProvider');
  }
  return context;
}; 