// src/api/userApi.js
import api from './index';

// Add this if your backend has a route like: GET /api/auth/me or /api/users/me
export const getCurrentUser = () => api.get('/auth/me'); // or '/users/me' depending on your backend

// Register user
export const registerUser = (data) => api.post('/auth/register', data);

// Login user
export const loginUser = (data) => api.post('/auth/login', data);

// Get user profile
export const getUserProfile = (id) => api.get(`/users/${id}`);

// Update user profile
export const updateUserProfile = (id, data) => api.put(`/users/${id}`, data);

// Get user posts
export const getUserPosts = (id) => api.get(`/users/${id}/posts`);

export default {
  getCurrentUser, // ✅ add this to default export too
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserPosts,
};
