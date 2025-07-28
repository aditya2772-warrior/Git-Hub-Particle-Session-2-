// src/api/postApi.js
import api from './index';

// Get all posts - use the consistent api instance
export const getAllPosts = () => api.get('/posts');

// Get a single post by ID
export const getPostById = (id) => api.get(`/posts/${id}`);

// Create a new post
export const createPost = (data) => api.post('/posts', data);

// Update a post - Enhanced with better error handling
export const updatePost = async (id, data) => {
  try {
    const response = await api.put(`/posts/${id}`, data);
    return response;
  } catch (error) {
    console.error('API Error - Update Post:', error);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error('Post not found');
    } else if (error.response?.status === 400) {
      throw new Error('Invalid post data');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to edit this post');
    } else {
      throw new Error('Failed to update post. Please try again.');
    }
  }
};

// Delete a post (soft delete) - Enhanced with better error handling
export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/posts/${id}`);
    return response;
  } catch (error) {
    console.error('API Error - Delete Post:', error);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error('Post not found');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to delete this post');
    } else {
      throw new Error('Failed to delete post. Please try again.');
    }
  }
};

// Reshare a post
export const resharePost = (id, data) => api.post(`/posts/${id}/reshare`, data);

// Additional utility functions that might be useful

// Get posts by user ID
export const getPostsByUserId = (userId) => api.get(`/posts?userId=${userId}`);

// Like a post (if you plan to implement this feature)
export const likePost = (id) => api.post(`/posts/${id}/like`);

// Unlike a post (if you plan to implement this feature)
export const unlikePost = (id) => api.delete(`/posts/${id}/like`);

// Get post with comments (if you plan to implement comments)
export const getPostWithComments = (id) => api.get(`/posts/${id}/comments`);

// Search posts (if you plan to implement search)
export const searchPosts = (query) => api.get(`/posts/search?q=${encodeURIComponent(query)}`);

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  resharePost,
  getPostsByUserId,
  likePost,
  unlikePost,
  getPostWithComments,
  searchPosts
};