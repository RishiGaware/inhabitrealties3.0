import api from './api';
import { showErrorToast } from '../utils/toastUtils';

const BASE = '/file/userprofilepicture';

export const fetchUserProfilePictures = async () => {
  try {
    const response = await api.get(`${BASE}/`);
    return response.data;
  } catch (error) {
    console.error('userProfilePictureService: Fetch profile pictures error:', error);
    showErrorToast(
      error?.response?.data?.message || 'Failed to fetch profile pictures'
    );
    throw error;
  }
};

export const fetchUserProfilePicturesWithParams = async (params) => {
  try {
    const response = await api.post(`${BASE}/withparams`, params);
    return response.data;
  } catch (error) {
    console.error('userProfilePictureService: Fetch with params error:', error);
    showErrorToast(
      error?.response?.data?.message || 'Failed to fetch profile pictures'
    );
    throw error;
  }
};

export const fetchUserProfilePictureById = async (userId) => {
  try {
    const response = await api.get(`${BASE}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('userProfilePictureService: Fetch by ID error:', error);
    showErrorToast(
      error?.response?.data?.message || 'Failed to fetch profile picture'
    );
    throw error;
  }
};

export const createUserProfilePicture = async (formData) => {
  try {
    const response = await api.post(`${BASE}/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('userProfilePictureService: Create profile picture error:', error);
    showErrorToast(
      error?.response?.data?.message || 'Failed to upload profile picture'
    );
    throw error;
  }
};

export const updateUserProfilePicture = async (id, formData) => {
  try {
    const response = await api.put(`${BASE}/edit/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('userProfilePictureService: Update profile picture error:', error);
    showErrorToast(
      error?.response?.data?.message || 'Failed to update profile picture'
    );
    throw error;
  }
};

export const deleteUserProfilePicture = async (id) => {
  try {
    const response = await api.delete(`${BASE}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('userProfilePictureService: Delete profile picture error:', error);
    showErrorToast(
      error?.response?.data?.message || 'Failed to delete profile picture'
    );
    throw error;
  }
}; 