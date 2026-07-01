// src/services/authService.js
// Handles authentication (Mocked for testing purposes so you don't need to verify email)

/**
 * loginUser - MOCK: returns a fake token so you can login with any fake email
 * @param {{ email: string, password: string }} credentials
 */
export const loginUser = async (credentials) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Accept any email/password and return a mock token!
  return { accessToken: "mock-jwt-token-12345" };
};

/**
 * registerUser - MOCK: simulates successful registration
 * @param {{ email: string, password: string }} credentials
 */
export const registerUser = async (credentials) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return { message: "Mock registration successful" };
};
