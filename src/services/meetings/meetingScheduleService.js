import api from '../api';
import { MEETING_SCHEDULE_ENDPOINTS } from '../apiEndpoints';

// Fetch all meeting schedules (admin, executive only)
export const fetchAllMeetingSchedules = async () => {
  try {
    const response = await api.get(MEETING_SCHEDULE_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Fetch all error:', error);
    throw error;
  }
};

// Get my meetings (for different user roles)
export const getMyMeetings = async (userId) => {
  try {
    const response = await api.get(MEETING_SCHEDULE_ENDPOINTS.GET_MY_MEETINGS(userId));
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Get my meetings error:', error);
    throw error;
  }
};

// Get meeting schedule by ID (scheduled by user ID)
export const getMeetingScheduleById = async (userId) => {
  try {
    const response = await api.get(MEETING_SCHEDULE_ENDPOINTS.GET_BY_SCHEDULED_USER_ID(userId));
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Get by scheduled user ID error:', error);
    throw error;
  }
};

// Create a new meeting schedule
export const createMeetingSchedule = async (meetingData) => {
  try {
    const response = await api.post(MEETING_SCHEDULE_ENDPOINTS.CREATE, meetingData);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Create error:', error);
    throw error;
  }
};

// Update meeting schedule
export const updateMeetingSchedule = async (id, meetingData) => {
  try {
    const response = await api.put(MEETING_SCHEDULE_ENDPOINTS.UPDATE(id), meetingData);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Update error:', error);
    throw error;
  }
};

// Delete meeting schedule (soft delete - sets published to false)
export const deleteMeetingSchedule = async (id) => {
  try {
    const response = await api.delete(MEETING_SCHEDULE_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Delete error:', error);
    throw error;
  }
};

// Get not published meeting schedules (admin only)
export const getNotPublishedMeetingSchedules = async () => {
  try {
    const response = await api.get(MEETING_SCHEDULE_ENDPOINTS.GET_NOT_PUBLISHED);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Get not published error:', error);
    throw error;
  }
};

// Mark meeting as done by sales person
export const markMeetingDoneBySales = async (id) => {
  try {
    const response = await api.put(MEETING_SCHEDULE_ENDPOINTS.MARK_DONE_SALES(id));
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Mark done by sales error:', error);
    throw error;
  }
};

// Mark meeting as done by executive
export const markMeetingDoneByExecutive = async (id) => {
  try {
    const response = await api.put(MEETING_SCHEDULE_ENDPOINTS.MARK_DONE_EXECUTIVE(id));
    return response.data;
  } catch (error) {
    console.error('meetingScheduleService: Mark done by executive error:', error);
    throw error;
  }
};

// Helper function to format meeting data for API
export const formatMeetingDataForAPI = (formData) => {
  // Handle both single customer ID (edit mode) and multiple customer IDs (add mode)
  let customerData;
  
  if (Array.isArray(formData.customerIds)) {
    // Add mode - multiple customers
    customerData = { customerIds: formData.customerIds };
  } else if (formData.customerIds) {
    // Edit mode - single customer
    customerData = { customerId: formData.customerIds };
  } else if (formData.customerId) {
    // Fallback for backward compatibility
    customerData = { customerId: formData.customerId };
  } else {
    customerData = { customerId: '' };
  }
  
  return {
    title: formData.title,
    description: formData.description || "",
    meetingDate: formData.meetingDate,
    startTime: formData.startTime,
    endTime: formData.endTime || null,
    duration: formData.duration || null,
    status: formData.status,
    ...customerData, // Spread the appropriate customer field
    propertyId: formData.propertyId || null,
    notes: formData.notes || "",
    salesPersonId: formData.salesPersonId || null,
    executiveId: formData.executiveId || null
  };
};

// Helper function to format meeting data for frontend
export const formatMeetingDataForFrontend = (meeting) => {
  return {
    salesPersonId: meeting.salesPersonId?._id || meeting.salesPersonId || '',
    executiveId: meeting.executiveId?._id || meeting.executiveId || '',
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