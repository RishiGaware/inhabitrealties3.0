import api from '../api';
import { MEETING_SCHEDULE_ENDPOINTS } from '../apiEndpoints';

// Fetch all meeting schedules (admin, executive only)
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

// Get meeting schedule by ID (scheduled by user ID)
export const getMeetingScheduleById = async (userId) => {
  try {
    console.log('meetingScheduleService: Fetching meeting schedule by user ID:', userId);
    const response = await api.get(MEETING_SCHEDULE_ENDPOINTS.GET_BY_SCHEDULED_USER_ID(userId));
    console.log('meetingScheduleService: Get by scheduled user ID response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Get by scheduled user ID error:', error);
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
  // Extract customerId from customerIds array or use customerId directly
  const customerId = formData.customerIds && formData.customerIds.length > 0 
    ? formData.customerIds[0] 
    : formData.customerId;
  
  return {
    title: formData.title,
    description: formData.description || "",
    meetingDate: formData.meetingDate,
    startTime: formData.startTime,
    endTime: formData.endTime || null,
    duration: formData.duration || null,
    status: formData.status,
    customerId: customerId,
    propertyId: formData.propertyId || null,
    notes: formData.notes || ""
  };
};

// Helper function to format meeting data for frontend
export const formatMeetingDataForFrontend = (meeting) => {
  return {
    id: meeting._id,
    title: meeting.title,
    description: meeting.description,
    meetingDate: meeting.meetingDate,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
    duration: meeting.duration,
    status: meeting.status,
    scheduledByUserId: meeting.scheduledByUserId,
    customerId: meeting.customerId,
    propertyId: meeting.propertyId,
    notes: meeting.notes,
    createdByUserId: meeting.createdByUserId,
    updatedByUserId: meeting.updatedByUserId,
    published: meeting.published,
    createdAt: meeting.createdAt,
    updatedAt: meeting.updatedAt
  };
};

// Helper function to calculate duration between start and end time
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 'No duration';
  
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  const diffMs = end - start;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHrs > 0 && diffMins > 0) {
    return `${diffHrs}h ${diffMins}m`;
  } else if (diffHrs > 0) {
    return `${diffHrs}h`;
  } else if (diffMins > 0) {
    return `${diffMins}m`;
  } else {
    return '0m';
  }
};

// Helper function to get status color
export const getStatusColor = (statusName) => {
  const status = statusName?.toLowerCase();
  if (status?.includes('scheduled')) return 'blue';
  if (status?.includes('completed')) return 'green';
  if (status?.includes('cancelled') || status?.includes('canceled')) return 'red';
  if (status?.includes('rescheduled')) return 'orange';
  return 'gray';
};

// Helper function to get status icon
export const getStatusIcon = (statusName) => {
  const status = statusName?.toLowerCase();
  if (status?.includes('scheduled')) return '📅';
  if (status?.includes('completed')) return '✅';
  if (status?.includes('cancelled') || status?.includes('canceled')) return '❌';
  if (status?.includes('rescheduled')) return '🔄';
  return '📋';
}; 