import api from '../api';

// Meeting endpoints - you'll need to add these to apiEndpoints.js
const MEETING_ENDPOINTS = {
  GET_ALL: '/meetings',
  GET_BY_ID: (id) => `/meetings/${id}`,
  CREATE: '/meetings',
  UPDATE: (id) => `/meetings/${id}`,
  DELETE: (id) => `/meetings/${id}`,
  GET_BY_CUSTOMER: (customerId) => `/meetings/customer/${customerId}`,
  GET_BY_SALES_PERSON: (salesPersonId) => `/meetings/sales-person/${salesPersonId}`,
  UPDATE_STATUS: (id) => `/meetings/${id}/status`,
};

// Fetch all meetings
export const fetchMeetings = async () => {
  try {
    console.log('meetingService: Fetching all meetings');
    const response = await api.get(MEETING_ENDPOINTS.GET_ALL);
    console.log('meetingService: Fetch meetings response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingService: Fetch meetings error:', error);
    throw error;
  }
};

// Get meeting by ID
export const getMeetingById = async (id) => {
  try {
    console.log('meetingService: Fetching meeting by ID:', id);
    const response = await api.get(MEETING_ENDPOINTS.GET_BY_ID(id));
    console.log('meetingService: Get by ID response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingService: Get by ID error:', error);
    throw error;
  }
};

// Get meetings by customer ID
export const getMeetingsByCustomer = async (customerId) => {
  try {
    console.log('meetingService: Fetching meetings for customer:', customerId);
    const response = await api.get(MEETING_ENDPOINTS.GET_BY_CUSTOMER(customerId));
    console.log('meetingService: Get by customer response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingService: Get by customer error:', error);
    throw error;
  }
};

// Get meetings by sales person ID
export const getMeetingsBySalesPerson = async (salesPersonId) => {
  try {
    console.log('meetingService: Fetching meetings for sales person:', salesPersonId);
    const response = await api.get(MEETING_ENDPOINTS.GET_BY_SALES_PERSON(salesPersonId));
    console.log('meetingService: Get by sales person response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingService: Get by sales person error:', error);
    throw error;
  }
};

// Create a new meeting
export const createMeeting = async (meetingData) => {
  try {
    console.log('meetingService: Creating meeting with data:', meetingData);
    const response = await api.post(MEETING_ENDPOINTS.CREATE, meetingData);
    console.log('meetingService: Create meeting response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingService: Create meeting error:', error);
    throw error;
  }
};

// Update meeting
export const updateMeeting = async (id, meetingData) => {
  try {
    console.log('meetingService: Updating meeting with ID:', id);
    console.log('meetingService: Update data:', meetingData);
    const response = await api.put(MEETING_ENDPOINTS.UPDATE(id), meetingData);
    console.log('meetingService: Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingService: Update meeting error:', error);
    throw error;
  }
};

// Update meeting status
export const updateMeetingStatus = async (id, status) => {
  try {
    console.log('meetingService: Updating meeting status:', id, status);
    const response = await api.patch(MEETING_ENDPOINTS.UPDATE_STATUS(id), { status });
    console.log('meetingService: Update status response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingService: Update status error:', error);
    throw error;
  }
};

// Delete meeting
export const deleteMeeting = async (id) => {
  try {
    console.log('meetingService: Deleting meeting with ID:', id);
    const response = await api.delete(MEETING_ENDPOINTS.DELETE(id));
    console.log('meetingService: Delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingService: Delete meeting error:', error);
    throw error;
  }
}; 