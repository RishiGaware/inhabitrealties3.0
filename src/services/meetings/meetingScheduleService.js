import api from '../api';
import { MEETING_SCHEDULE_ENDPOINTS } from '../apiEndpoints';

// Fetch all meeting schedules (admin only)
export const fetchAllMeetingSchedules = async () => {
  try {
    console.log('meetingScheduleService: Fetching all meeting schedules');
    const response = await api.get(MEETING_SCHEDULE_ENDPOINTS.GET_ALL);
    console.log('meetingScheduleService: Fetch all response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Fetch all error:', error);
    throw error;
  }
};

// Get my meetings (for different user roles)
export const getMyMeetings = async (userId) => {
  try {
    console.log('meetingScheduleService: Fetching my meetings for user:', userId);
    const response = await api.get(MEETING_SCHEDULE_ENDPOINTS.GET_MY_MEETINGS(userId));
    console.log('meetingScheduleService: Get my meetings response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Get my meetings error:', error);
    throw error;
  }
};

// Get meeting schedule by ID
export const getMeetingScheduleById = async (id) => {
  try {
    console.log('meetingScheduleService: Fetching meeting schedule by ID:', id);
    const response = await api.get(MEETING_SCHEDULE_ENDPOINTS.GET_BY_ID(id));
    console.log('meetingScheduleService: Get by ID response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Get by ID error:', error);
    throw error;
  }
};

// Create a new meeting schedule
export const createMeetingSchedule = async (meetingData) => {
  try {
    console.log('meetingScheduleService: Creating meeting schedule with data:', meetingData);
    const response = await api.post(MEETING_SCHEDULE_ENDPOINTS.CREATE, meetingData);
    console.log('meetingScheduleService: Create response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Create error:', error);
    throw error;
  }
};

// Update meeting schedule
export const updateMeetingSchedule = async (id, meetingData) => {
  try {
    console.log('meetingScheduleService: Updating meeting schedule with ID:', id);
    console.log('meetingScheduleService: Update data:', meetingData);
    const response = await api.put(MEETING_SCHEDULE_ENDPOINTS.UPDATE(id), meetingData);
    console.log('meetingScheduleService: Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Update error:', error);
    throw error;
  }
};

// Delete meeting schedule (soft delete - sets published to false)
export const deleteMeetingSchedule = async (id) => {
  try {
    console.log('meetingScheduleService: Deleting meeting schedule with ID:', id);
    const response = await api.delete(MEETING_SCHEDULE_ENDPOINTS.DELETE(id));
    console.log('meetingScheduleService: Delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Delete error:', error);
    throw error;
  }
};

// Get not published meeting schedules (admin only)
export const getNotPublishedMeetingSchedules = async () => {
  try {
    console.log('meetingScheduleService: Fetching not published meeting schedules');
    const response = await api.get(MEETING_SCHEDULE_ENDPOINTS.GET_NOT_PUBLISHED);
    console.log('meetingScheduleService: Get not published response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Get not published error:', error);
    throw error;
  }
};

// Helper function to format meeting data for API
export const formatMeetingDataForAPI = (formData) => {
  return {
    title: formData.title || formData.propertyName,
    description: formData.description || '',
    meetingDate: formData.meetingDate || formData.scheduledDate,
    startTime: formData.startTime || formData.scheduledTime,
    endTime: formData.endTime || null,
    duration: formData.duration || 60,
    location: formData.location || formData.propertyLocation,
    status: formData.status || 'Scheduled',
    customerId: formData.customerId,
    propertyId: formData.propertyId || null,
    notes: formData.notes || ''
  };
};

// Helper function to format API response for frontend
export const formatMeetingDataForFrontend = (apiData) => {
  return {
    _id: apiData._id,
    title: apiData.title,
    propertyName: apiData.title, // For backward compatibility
    propertyLocation: apiData.location,
    scheduledDate: apiData.meetingDate,
    scheduledTime: apiData.startTime,
    duration: apiData.duration,
    status: apiData.status?.name || apiData.status,
    customerId: apiData.customerId?._id || apiData.customerId,
    customerName: apiData.customerId?.firstName && apiData.customerId?.lastName 
      ? `${apiData.customerId.firstName} ${apiData.customerId.lastName}`
      : apiData.customerId?.firstName || 'Unknown',
    customerEmail: apiData.customerId?.email || '',
    customerPhone: apiData.customerId?.phoneNumber || '',
    propertyId: apiData.propertyId?._id || apiData.propertyId,
    salesPersonId: apiData.scheduledByUserId?._id || apiData.scheduledByUserId,
    salesPersonName: apiData.scheduledByUserId?.firstName && apiData.scheduledByUserId?.lastName
      ? `${apiData.scheduledByUserId.firstName} ${apiData.scheduledByUserId.lastName}`
      : apiData.scheduledByUserId?.firstName || 'Unknown',
    salesPersonEmail: apiData.scheduledByUserId?.email || '',
    notes: apiData.notes || '',
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt
  };
};
