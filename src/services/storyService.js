// src/services/storyService.js
// Handles all story CRUD API calls
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get auth headers from localStorage token
 */
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Fetch all stories */
export const getStories = async () => {
  const response = await axios.get(`${API_URL}/stories`, {
    headers: authHeaders(),
  });
  return response.data;
};

/** Fetch a single story by id */
export const getStoryById = async (id) => {
  const response = await axios.get(`${API_URL}/stories/${id}`, {
    headers: authHeaders(),
  });
  return response.data;
};

/** Create a new story */
export const createStory = async (storyData) => {
  const response = await axios.post(`${API_URL}/stories`, storyData, {
    headers: authHeaders(),
  });
  return response.data;
};

/** Update an existing story */
export const updateStory = async ({ id, ...storyData }) => {
  const response = await axios.put(`${API_URL}/stories/${id}`, storyData, {
    headers: authHeaders(),
  });
  return response.data;
};

/** Delete a story */
export const deleteStory = async (id) => {
  const response = await axios.delete(`${API_URL}/stories/${id}`, {
    headers: authHeaders(),
  });
  return response.data;
};
