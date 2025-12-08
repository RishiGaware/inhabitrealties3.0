/**
 * Test script to verify role API is working
 * This can be run in browser console for testing
 */

import { fetchRoleById } from '../services/rolemanagement/roleService';

export const testRoleAPI = async (roleId = '68162f63ff2da55b40ca61b8') => {

  try {
    const response = await fetchRoleById(roleId);
    return response;
  } catch (error) {
    console.error('Role API test failed:', error);
    throw error;
  }
};

// Make it available globally for testing
if (typeof window !== 'undefined') {
  window.testRoleAPI = testRoleAPI;
}








