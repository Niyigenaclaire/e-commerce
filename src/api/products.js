// src/api/products.js
// All product-related API calls
import apiClient from './client';

export const fetchProducts = async ({ category, sort, limit } = {}) => {
  const params = {};
  if (limit) params.limit = limit;
  if (sort) params.sort = sort;

  const url = category
    ? `/products/category/${encodeURIComponent(category)}`
    : '/products';

  const { data } = await apiClient.get(url, { params });
  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await apiClient.get('/products/categories');
  return data;
};
