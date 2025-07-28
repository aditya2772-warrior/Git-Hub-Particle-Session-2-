import api from './index';

/**
 * Gets all comments for a specific post.
 * @param {string|number} postId - The ID of the post.
 * @returns {Promise} - A promise that resolves with the list of comments.
 */
export const getCommentsByPostId = (postId) => api.get(`/comments/post/${postId}`);

/**
 * Creates a new comment.
 * @param {object} data - The comment data.
 * @param {string|number} data.userId - The ID of the user creating the comment.
 * @param {string|number} data.postId - The ID of the post being commented on.
 * @param {string} data.message - The content of the comment.
 * @returns {Promise} - A promise that resolves with the newly created comment data.
 */
export const createComment = (data) => api.post('/comments', data);

/**
 * Updates an existing comment.
 * @param {string|number} id - The ID of the comment to update.
 * @param {string} message - The new message for the comment.
 * @returns {Promise} - A promise that resolves with the updated comment data.
 */
export const updateComment = (id, message) => api.put(`/comments/${id}`, { message });

/**
 * Deletes a comment (soft delete).
 * @param {string|number} id - The ID of the comment to delete.
 * @returns {Promise} - A promise that resolves with a success message.
 */
export const deleteComment = (id) => api.delete(`/comments/${id}`);

// Export all functions as a default object
export default {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment
};