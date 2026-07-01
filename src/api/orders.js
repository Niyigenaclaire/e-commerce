// src/api/orders.js
// All order-related API calls — uses FakeStoreAPI cart endpoints as orders
import apiClient from './client';

export const placeOrder = async (orderData) => {
  // FakeStoreAPI: POST /carts creates a "cart" (used as an order in this app)
  const { data } = await apiClient.post('/carts', orderData);
  return data;
};

export const fetchOrders = async (userId = 1) => {
  const { data } = await apiClient.get(`/carts/user/${userId}`);
  return data;
};
