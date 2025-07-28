// src/Component/Comments/CommentForm.jsx
import React, { useState, useEffect } from 'react';
import { createComment, updateComment } from '../../api/commentApi';

const CommentForm = ({ 
  postId, 
  onCommentAdded, 
  editMode = false, 
  commentToEdit = null, 
  onEditCancel = null,
  onCommentUpdated = null 
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  // Set initial message when in edit mode
  useEffect(() => {
    if (editMode && commentToEdit) {
      setMessage(commentToEdit.COMMENTS_MESSAGE || '');
    } else {
      setMessage('');
    }
  }, [editMode, commentToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to comment');
      return;
    }

    if (!message.trim()) {
      alert('Please enter a comment');
      return;
    }

    if (!editMode && !postId) {
      console.error('Post ID is missing');
      alert('Error: Post ID is missing');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (editMode && commentToEdit) {
        // Update existing comment
        const response = await updateComment(commentToEdit.COMMENTS_ID, message.trim());
        
        // Create updated comment object for UI
        const updatedComment = {
          ...commentToEdit,
          COMMENTS_MESSAGE: message.trim(),
          COMMENTS_UPDATED_AT: new Date().toISOString()
        };

        if (onCommentUpdated) {
          onCommentUpdated(updatedComment);
        }

        // Exit edit mode
        if (onEditCancel) {
          onEditCancel();
        }

        console.log('Comment updated successfully');
        
      } else {
        // Create new comment
        const commentData = {
          userId: user.users_id,
          postId: postId,
          message: message.trim()
        };

        console.log('Submitting comment:', commentData);
        
        const response = await createComment(commentData);
        
        // Create a formatted comment object for immediate UI update
        const newComment = {
          COMMENTS_ID: response.data.COMMENTS_ID || Date.now(),
          COMMENTS_MESSAGE: message.trim(),
          COMMENTS_USER_ID: user.users_id,
          COMMENTS_CREATED_AT: new Date().toISOString(),
          User: {
            users_name: user.users_name
          }
        };

        // Call the callback to update parent component
        if (onCommentAdded) {
          onCommentAdded(newComment);
        }

        setMessage('');
        console.log('Comment added successfully');
      }
      
    } catch (error) {
      console.error(`Failed to ${editMode ? 'update' : 'add'} comment:`, error);
      alert(`Failed to ${editMode ? 'update' : 'add'} comment. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (editMode && onEditCancel) {
      onEditCancel();
    } else {
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
    if (e.key === 'Escape' && editMode) {
      handleCancel();
    }
  };

  const styles = {
    form: {
      marginBottom: '16px',
      backgroundColor: editMode ? '#f7f9fa' : 'transparent',
      padding: editMode ? '12px' : '0',
      borderRadius: editMode ? '8px' : '0',
      border: editMode ? '1px solid #e1e8ed' : 'none'
    },
    inputContainer: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start'
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#1da1f2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold',
      flexShrink: 0
    },
    inputWrapper: {
      flex: 1
    },
    textarea: {
      width: '100%',
      minHeight: editMode ? '80px' : '60px',
      padding: '12px',
      border: '2px solid #e1e8ed',
      borderRadius: '12px',
      fontSize: '15px',
      fontFamily: 'inherit',
      resize: 'vertical',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    textareaFocused: {
      borderColor: '#1da1f2'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '8px'
    },
    characterCount: {
      fontSize: '13px',
      color: '#657786'
    },
    characterCountLimit: {
      color: '#e0245e'
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px'
    },
    submitButton: {
      backgroundColor: '#1da1f2',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      padding: '8px 20px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    cancelButton: {
      backgroundColor: 'transparent',
      color: '#657786',
      border: '1px solid #e1e8ed',
      borderRadius: '20px',
      padding: '8px 20px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    submitButtonDisabled: {
      backgroundColor: '#aab8c2',
      cursor: 'not-allowed'
    },
    editModeTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#1da1f2',
      marginBottom: '8px'
    }
  };

  const maxLength = 280;
  const remainingChars = maxLength - message.length;
  const isOverLimit = remainingChars < 0;
  const isDisabled = isSubmitting || !message.trim() || isOverLimit;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {editMode && (
        <div style={styles.editModeTitle}>
          Edit Comment
        </div>
      )}
      
      <div style={styles.inputContainer}>
        <div style={styles.avatar}>
          {user?.users_name?.charAt(0).toUpperCase() || '?'}
        </div>
        
        <div style={styles.inputWrapper}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={editMode ? "Edit your comment" : "Tweet your reply"}
            style={{
              ...styles.textarea,
              ...(message ? styles.textareaFocused : {})
            }}
            maxLength={maxLength + 50}
            disabled={isSubmitting}
            onFocus={(e) => {
              e.target.style.borderColor = '#1da1f2';
            }}
            onBlur={(e) => {
              if (!message) {
                e.target.style.borderColor = '#e1e8ed';
              }
            }}
            autoFocus={editMode}
          />
          
          <div style={styles.buttonContainer}>
            <span style={{
              ...styles.characterCount,
              ...(isOverLimit ? styles.characterCountLimit : {})
            }}>
              {remainingChars} characters remaining
            </span>
            
            <div style={styles.buttonGroup}>
              {editMode && (
                <button
                  type="button"
                  onClick={handleCancel}
                  style={styles.cancelButton}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f7f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancel
                </button>
              )}
              
              <button
                type="submit"
                disabled={isDisabled}
                style={{
                  ...styles.submitButton,
                  ...(isDisabled ? styles.submitButtonDisabled : {})
                }}
                onMouseEnter={(e) => {
                  if (!isDisabled) {
                    e.target.style.backgroundColor = '#1991db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDisabled) {
                    e.target.style.backgroundColor = '#1da1f2';
                  }
                }}
              >
                {isSubmitting 
                  ? (editMode ? 'Updating...' : 'Replying...') 
                  : (editMode ? 'Update' : 'Reply')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;