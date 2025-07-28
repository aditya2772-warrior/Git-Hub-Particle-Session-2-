// src/Component/Posts/PostItem.jsx 
import React, { useState } from 'react';
import CommentForm from '../Comments/CommentForm';
import CommentList from '../Comments/CommentList';

const PostItem = ({ post, onDelete, onEdit, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState(post.message);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState(null);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewMessage(post.message);
  };

  const handleSaveClick = async () => {
    if (newMessage.trim() === '') {
      alert('Message cannot be empty!');
      return;
    }
    
    if (newMessage.trim() === post.message.trim()) {
      setIsEditing(false);
      return;
    }
    
    setIsLoading(true);
    try {
      await onEdit(post.id, newMessage.trim());
      setIsEditing(false);
      alert('Post updated successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNewMessage(post.message);
  };

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await onDelete(post.id);
        alert('Post deleted successfully!');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const handleCommentToggle = () => {
    setShowComments(!showComments);
  };

  const handleNewComment = (comment) => {
    setNewComment(comment);
    setCommentCount(prev => prev + 1);
    // Clear the new comment after a brief moment to avoid duplication
    setTimeout(() => setNewComment(null), 100);
  };

  const handleCommentCountUpdate = (count) => {
    setCommentCount(count);
  };

  // More flexible user ID checking
  const canModify = currentUser && (
    post.userId === currentUser.users_id ||
    post.userId === currentUser.id ||
    post.user_id === currentUser.users_id ||
    post.user_id === currentUser.id ||
    currentUser.users_id || currentUser.id
  );

  // Styles
  const postStyles = {
    backgroundColor: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.2s ease'
  };

  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  };

  const avatarStyles = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#1da1f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    marginRight: '12px',
    fontSize: '16px'
  };

  const userInfoStyles = {
    flex: 1
  };

  const userNameStyles = {
    fontWeight: 'bold',
    color: '#14171a',
    fontSize: '16px',
    margin: '0 0 2px 0'
  };

  const dateStyles = {
    color: '#657786',
    fontSize: '14px',
    margin: 0
  };

  const messageStyles = {
    color: '#14171a',
    fontSize: '16px',
    lineHeight: '1.4',
    marginBottom: '15px',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word'
  };

  const editTextareaStyles = {
    width: '100%',
    minHeight: '80px',
    padding: '12px',
    border: '2px solid #1da1f2',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    marginBottom: '12px'
  };

  const buttonContainerStyles = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    paddingTop: '10px',
    borderTop: '1px solid #e1e8ed'
  };

  const editButtonContainerStyles = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const buttonStyles = {
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const editButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#e8f5fe',
    color: '#1da1f2',
    border: '1px solid #1da1f2'
  };

  const deleteButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#fdf2f2',
    color: '#e0245e',
    border: '1px solid #e0245e'
  };

  const commentButtonStyles = {
    ...buttonStyles,
    backgroundColor: showComments ? '#e8f5fe' : '#f7f9fa',
    color: showComments ? '#1da1f2' : '#657786',
    border: `1px solid ${showComments ? '#1da1f2' : '#e1e8ed'}`
  };

  const saveButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#1da1f2',
    color: 'white'
  };

  const cancelButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#f7f9fa',
    color: '#657786',
    border: '1px solid #e1e8ed'
  };

  const disabledButtonStyles = {
    opacity: '0.5',
    cursor: 'not-allowed'
  };

  const characterCountStyles = {
    fontSize: '14px',
    color: newMessage.length > 280 ? '#e0245e' : '#657786'
  };

  const commentsContainerStyles = {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e1e8ed'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div style={postStyles}>
      {/* Post Header */}
      <div style={headerStyles}>
        <div style={avatarStyles}>
          {post.userName.charAt(0).toUpperCase()}
        </div>
        <div style={userInfoStyles}>
          <p style={userNameStyles}>{post.userName}</p>
          <p style={dateStyles}>{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={editTextareaStyles}
            maxLength="280"
            disabled={isLoading}
            placeholder="What's happening?"
          />
          <div style={editButtonContainerStyles}>
            <span style={characterCountStyles}>
              {280 - newMessage.length} characters remaining
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleSaveClick}
                disabled={isLoading || newMessage.trim() === '' || newMessage.length > 280}
                style={{
                  ...saveButtonStyles,
                  ...(isLoading || newMessage.trim() === '' || newMessage.length > 280 ? disabledButtonStyles : {})
                }}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelClick}
                disabled={isLoading}
                style={{
                  ...cancelButtonStyles,
                  ...(isLoading ? disabledButtonStyles : {})
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p style={messageStyles}>{post.message}</p>
          
          {/* Action Buttons */}
          <div style={buttonContainerStyles}>
            {/* Comment Button - Always visible */}
            <button
              onClick={handleCommentToggle}
              style={commentButtonStyles}
              onMouseEnter={(e) => {
                if (!showComments) {
                  e.target.style.backgroundColor = '#e8f5fe';
                  e.target.style.color = '#1da1f2';
                }
              }}
              onMouseLeave={(e) => {
                if (!showComments) {
                  e.target.style.backgroundColor = '#f7f9fa';
                  e.target.style.color = '#657786';
                }
              }}
            >
              <span>💬</span> 
              {showComments ? 'Hide Comments' : `Comment${commentCount > 0 ? ` (${commentCount})` : ''}`}
            </button>

            {/* Edit/Delete buttons for post owner */}
            {currentUser && (
              <>
                <button
                  onClick={handleEditClick}
                  style={editButtonStyles}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#d6f0ff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#e8f5fe';
                  }}
                >
                  <span>✏️</span> Edit
                </button>
                
                <button
                  onClick={handleDeleteClick}
                  style={deleteButtonStyles}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#ffe6e6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#fdf2f2';
                  }}
                >
                  <span>🗑️</span> Delete
                </button>
              </>
            )}
          </div>

          {/* Comments Section */}
          {showComments && (
            <div style={commentsContainerStyles}>
              {currentUser && (
                <CommentForm 
                  postId={post.id} 
                  onCommentAdded={handleNewComment}
                />
              )}
              <CommentList 
                postId={post.id} 
                newComment={newComment}
                onCommentCountUpdate={handleCommentCountUpdate}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostItem;