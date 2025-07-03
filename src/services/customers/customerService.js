import api from '../api';
import { CUSTOMER_ENDPOINTS } from '../apiEndpoints';

// Fetch all customers
export const fetchCustomers = async () => {
  const response = await api.get(CUSTOMER_ENDPOINTS.GET_ALL);
  return response.data;
};

// Register a new customer
export const registerCustomer = async (customerData) => {
  const response = await api.post(CUSTOMER_ENDPOINTS.REGISTER, customerData);
  return response.data;
};

// Edit/Update customer
export const editCustomer = async (id, customerData) => {
  const response = await api.put(CUSTOMER_ENDPOINTS.EDIT(id), customerData);
  return response.data;
};

// Delete customer
export const deleteCustomer = async (id) => {
  const response = await api.delete(CUSTOMER_ENDPOINTS.DELETE(id));
  return response.data;
}; 