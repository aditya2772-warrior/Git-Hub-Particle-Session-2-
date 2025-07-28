// src/Component/Comments/CommentList.jsx
import React, { useState, useEffect } from 'react';
import { getCommentsByPostId, deleteComment } from '../../api/commentApi';
import CommentForm from './CommentForm';

const CommentList = ({ postId, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getCommentsByPostId(postId);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments(prev => [...prev, newComment]);
    if (onCommentAdded) {
      onCommentAdded(newComment);
    }
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments(prev => 
      prev.map(comment => 
        comment.COMMENTS_ID === updatedComment.COMMENTS_ID 
          ? updatedComment 
          : comment
      )
    );
    setEditingCommentId(null);
  };

  const handleEditComment = (commentId) => {
    setEditingCommentId(commentId);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.COMMENTS_ID !== commentId));
      console.log('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const canEditOrDelete = (comment) => {
    return user && user.users_id === comment.COMMENTS_USER_ID;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const styles = {
    container: {
      marginTop: '20px'
    },
    header: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#1da1f2'
    },
    commentCard: {
      backgroundColor: '#fff',
      border: '1px solid #e1e8ed',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      transition: 'box-shadow 0.2s ease'
    },
    commentHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
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
      fontWeight: 'bold'
    },
    userName: {
      fontWeight: 'bold',
      color: '#1da1f2',
      fontSize: '14px'
    },
    timestamp: {
      color: '#657786',
      fontSize: '12px',
      marginLeft: '8px'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      background: 'none',
      border: 'none',
      color: '#657786',
      cursor: 'pointer',
      fontSize: '12px',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'all 0.2s ease'
    },
    editButton: {
      color: '#1da1f2'
    },
    deleteButton: {
      color: '#e0245e'
    },
    commentMessage: {
      fontSize: '15px',
      lineHeight: '1.4',
      color: '#14171a',
      marginBottom: '0'
    },
    noComments: {
      textAlign: 'center',
      color: '#657786',
      fontStyle: 'italic',
      padding: '20px'
    },
    loading: {
      textAlign: 'center',
      color: '#657786',
      padding: '20px'
    },
    editFormContainer: {
      marginTop: '12px',
      border: '1px solid #e1e8ed',
      borderRadius: '8px',
      padding: '8px'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading comments...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>
        Comments ({comments.length})
      </h3>
      
      {comments.length === 0 ? (
        <div style={styles.noComments}>
          No comments yet. Be the first to comment!
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment.COMMENTS_ID} style={styles.commentCard}>
            <div style={styles.commentHeader}>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>
                  {comment.User?.users_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <span style={styles.userName}>
                    {comment.User?.users_name || 'Unknown User'}
                  </span>
                  <span style={styles.timestamp}>
                    · {formatDate(comment.COMMENTS_CREATED_AT)}
                    {comment.COMMENTS_UPDATED_AT && 
                     comment.COMMENTS_UPDATED_AT !== comment.COMMENTS_CREATED_AT && 
                     ' (edited)'}
                  </span>
                </div>
              </div>
              
              {canEditOrDelete(comment) && (
                <div style={styles.actionButtons}>
                  <button
                    onClick={() => handleEditComment(comment.COMMENTS_ID)}
                    style={{
                      ...styles.actionButton,
                      ...styles.editButton
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e8f5fe';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.COMMENTS_ID)}
                    style={{
                      ...styles.actionButton,
                      ...styles.deleteButton
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fdf2f2';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            {editingCommentId === comment.COMMENTS_ID ? (
              <div style={styles.editFormContainer}>
                <CommentForm
                  editMode={true}
                  commentToEdit={comment}
                  onEditCancel={handleCancelEdit}
                  onCommentUpdated={handleCommentUpdated}
                />
              </div>
            ) : (
              <p style={styles.commentMessage}>
                {comment.COMMENTS_MESSAGE}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;