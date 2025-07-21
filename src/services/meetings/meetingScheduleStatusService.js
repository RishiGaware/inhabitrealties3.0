import api from '../api';
import { MEETING_SCHEDULE_STATUS_ENDPOINTS } from '../apiEndpoints';

// Fetch all meeting schedule statuses
export const fetchAllMeetingScheduleStatuses = async () => {
  try {
    console.log('meetingScheduleStatusService: Fetching all meeting schedule statuses');
    const response = await api.get(MEETING_SCHEDULE_STATUS_ENDPOINTS.GET_ALL);
    console.log('meetingScheduleStatusService: Fetch all response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleStatusService: Fetch all error:', error);
    throw error;
  }
};

// Get meeting schedule status by ID
export const getMeetingScheduleStatusById = async (id) => {
  try {
    console.log('meetingScheduleStatusService: Fetching meeting schedule status by ID:', id);
    const response = await api.get(MEETING_SCHEDULE_STATUS_ENDPOINTS.GET_BY_ID(id));
    console.log('meetingScheduleStatusService: Get by ID response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleStatusService: Get by ID error:', error);
    throw error;
  }
};

// Create a new meeting schedule status
export const createMeetingScheduleStatus = async (statusData) => {
  try {
    console.log('meetingScheduleStatusService: Creating meeting schedule status with data:', statusData);
    const response = await api.post(MEETING_SCHEDULE_STATUS_ENDPOINTS.CREATE, statusData);
    console.log('meetingScheduleStatusService: Create response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleStatusService: Create error:', error);
    throw error;
  }
};

// Update meeting schedule status
export const updateMeetingScheduleStatus = async (id, statusData) => {
  try {
    console.log('meetingScheduleStatusService: Updating meeting schedule status with ID:', id);
    console.log('meetingScheduleStatusService: Update data:', statusData);
    const response = await api.put(MEETING_SCHEDULE_STATUS_ENDPOINTS.UPDATE(id), statusData);
    console.log('meetingScheduleStatusService: Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleStatusService: Update error:', error);
    throw error;
  }
};

// Delete meeting schedule status (soft delete - sets published to false)
export const deleteMeetingScheduleStatus = async (id) => {
  try {
    console.log('meetingScheduleStatusService: Deleting meeting schedule status with ID:', id);
    const response = await api.delete(MEETING_SCHEDULE_STATUS_ENDPOINTS.DELETE(id));
    console.log('meetingScheduleStatusService: Delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('meetingScheduleStatusService: Delete error:', error);
    throw error;
  }
}; 