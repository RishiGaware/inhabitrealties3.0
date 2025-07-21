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
  // For both create and edit, send only the required fields
  const apiData = {
    title: formData.title,
    description: formData.description || '',
    meetingDate: formData.meetingDate,
    startTime: formData.startTime,
    endTime: formData.endTime || null,
    duration: formData.duration || 60,
    location: formData.location,
    status: formData.status,
    customerId: formData.customerId,
    propertyId: formData.propertyId || null,
    notes: formData.notes || ''
  };

  console.log('API data being sent:', apiData);
  return apiData;
};

// Helper function to format meeting data for frontend display
export const formatMeetingDataForFrontend = (meeting) => {
  return {
    _id: meeting._id,
    title: meeting.title,
    description: meeting.description,
    meetingDate: meeting.meetingDate,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
    duration: meeting.duration,
    location: meeting.location,
    status: meeting.status?._id || meeting.status, // Handle both populated object and ObjectId
    statusName: meeting.status?.name || 'Unknown', // Add status name for display
    customerId: meeting.customerId?._id || meeting.customerId, // Handle both populated object and ObjectId
    customerName: meeting.customerId?.firstName && meeting.customerId?.lastName 
      ? `${meeting.customerId.firstName} ${meeting.customerId.lastName}` 
      : 'Unknown Customer',
    customerEmail: meeting.customerId?.email || '',
    customerPhone: meeting.customerId?.phoneNumber || '',
    propertyId: meeting.propertyId?._id || meeting.propertyId, // Handle both populated object and ObjectId
    propertyData: meeting.propertyId, // Store the full property object for display
    propertyName: meeting.propertyId?.name || 'Unknown Property',
    salesPersonId: meeting.scheduledByUserId?._id || meeting.scheduledByUserId, // Handle both populated object and ObjectId
    salesPersonName: meeting.scheduledByUserId?.firstName && meeting.scheduledByUserId?.lastName 
      ? `${meeting.scheduledByUserId.firstName} ${meeting.scheduledByUserId.lastName}` 
      : 'Unknown Sales Person',
    salesPersonEmail: meeting.scheduledByUserId?.email || '',
    salesPersonPhone: meeting.scheduledByUserId?.phoneNumber || '',
    scheduledDate: meeting.meetingDate,
    scheduledTime: meeting.startTime,
    notes: meeting.notes,
    createdByUserId: meeting.createdByUserId?._id || meeting.createdByUserId,
    updatedByUserId: meeting.updatedByUserId?._id || meeting.updatedByUserId,
    published: meeting.published,
    createdAt: meeting.createdAt,
    updatedAt: meeting.updatedAt
  };
};
