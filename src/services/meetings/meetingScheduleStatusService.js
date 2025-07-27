import api from '../api';
import { MEETING_SCHEDULE_STATUS_ENDPOINTS } from '../apiEndpoints';

// Fetch all meeting schedule statuses
export const fetchAllMeetingScheduleStatuses = async () => {
  try {
    const response = await api.get(MEETING_SCHEDULE_STATUS_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleStatusService: Fetch all error:', error);
    throw error;
  }
};

// Get meeting schedule status by ID
export const getMeetingScheduleStatusById = async (id) => {
  try {
    const response = await api.get(MEETING_SCHEDULE_STATUS_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('meetingScheduleStatusService: Get by ID error:', error);
    throw error;
  }
};

// Create a new meeting schedule status
export const createMeetingScheduleStatus = async (statusData) => {
  try {
    const response = await api.post(MEETING_SCHEDULE_STATUS_ENDPOINTS.CREATE, statusData);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleStatusService: Create error:', error);
    throw error;
  }
};

// Update meeting schedule status
export const updateMeetingScheduleStatus = async (id, statusData) => {
  try {
    const response = await api.put(MEETING_SCHEDULE_STATUS_ENDPOINTS.UPDATE(id), statusData);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleStatusService: Update error:', error);
    throw error;
  }
};

// Delete meeting schedule status (soft delete - sets published to false)
export const deleteMeetingScheduleStatus = async (id) => {
  try {
    const response = await api.delete(MEETING_SCHEDULE_STATUS_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error) {
    console.error('meetingScheduleStatusService: Delete error:', error);
    throw error;
  }
}; 