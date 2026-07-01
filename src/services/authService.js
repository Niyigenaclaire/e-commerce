// src/services/authService.js
// Handles all authentication API calls
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * loginUser - sends credentials to the backend and returns { accessToken }
 * @param {{ email: string, password: string }} credentials
 */
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
  return response.data;
};

/**
 * registerUser - creates a new user account
 * @param {{ email: string, password: string }} credentials
 */
export const registerUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, credentials);
  return response.data;
};
