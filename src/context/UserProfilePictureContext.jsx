import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  fetchUserProfilePictures, 
  fetchUserProfilePictureById,
  createUserProfilePicture, 
  updateUserProfilePicture, 
  deleteUserProfilePicture 
} from '../services/userProfilePictureService';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const UserProfilePictureContext = createContext();

export const UserProfilePictureProvider = ({ children }) => {
  const [userProfilePictures, setUserProfilePictures] = useState([]);
  const [currentUserProfilePicture, setCurrentUserProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAllUserProfilePictures = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUserProfilePictures();
      setUserProfilePictures(res.data || []);
    } catch (err) {
      console.error('UserProfilePictureContext: Fetch error:', err);
      showErrorToast('Failed to fetch profile pictures');
      setUserProfilePictures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserProfilePictureById = useCallback(async (userId) => {
    setLoading(true);
    try {
      const res = await fetchUserProfilePictureById(userId);
      setCurrentUserProfilePicture(res.data);
      return res.data;
    } catch (err) {
      console.error('UserProfilePictureContext: Get by ID error:', err);
      setCurrentUserProfilePicture(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addUserProfilePicture = async (formData) => {
    setLoading(true);
    try {
      const res = await createUserProfilePicture(formData);
      const newProfilePicture = res.data;
      setUserProfilePictures(prev => [...prev, newProfilePicture]);
      setCurrentUserProfilePicture(newProfilePicture);
      
      showSuccessToast(res.message || 'Profile picture uploaded successfully');
      return newProfilePicture;
    } catch (err) {
      console.error('UserProfilePictureContext: Add error:', err);
      showErrorToast('Failed to upload profile picture');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfilePictureById = async (id, formData) => {
    setLoading(true);
    try {
      
      const res = await updateUserProfilePicture(id, formData);
      
      const updatedProfilePicture = res.data;
      setUserProfilePictures(prev => prev.map(pic => 
        pic._id === id ? updatedProfilePicture : pic
      ));
      setCurrentUserProfilePicture(updatedProfilePicture);
      
      showSuccessToast(res.message || 'Profile picture updated successfully');
      return updatedProfilePicture;
    } catch (err) {
      console.error('UserProfilePictureContext: Update error:', err);
      showErrorToast('Failed to update profile picture');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeUserProfilePicture = async (id) => {
    setLoading(true);
    try {
      
      const res = await deleteUserProfilePicture(id);
      
      setUserProfilePictures(prev => prev.filter(pic => pic._id !== id));
      setCurrentUserProfilePicture(null);
      
      showSuccessToast(res.message || 'Profile picture deleted successfully');
    } catch (err) {
      console.error('UserProfilePictureContext: Delete error:', err);
      showErrorToast('Failed to delete profile picture');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserProfilePictureContext.Provider value={{
      userProfilePictures,
      currentUserProfilePicture,
      loading,
      setCurrentUserProfilePicture,
      getAllUserProfilePictures,
      getUserProfilePictureById,
      addUserProfilePicture,
      updateUserProfilePictureById,
      removeUserProfilePicture
    }}>
      {children}
    </UserProfilePictureContext.Provider>
  );
};

export const useUserProfilePictureContext = () => useContext(UserProfilePictureContext); 