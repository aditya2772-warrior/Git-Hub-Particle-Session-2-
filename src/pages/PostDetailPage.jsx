// src/pages/PostDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../api/postApi';
import CommentList from '../Component/Comments/CommentList';
import CommentForm from '../Component/Comments/CommentForm';

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostById(id);
        setPost(res.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentAdded = (newComment) => {
    setCommentCount(prev => prev + 1);
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f7f9fa',
      minHeight: '100vh'
    },
    postCard: {
      backgroundColor: '#fff',
      border: '1px solid #e1e8ed',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    postHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      gap: '12px'
    },
    userAvatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: '#1da1f2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '18px',
      fontWeight: 'bold'
    },
    userInfo: {
      flex: 1
    },
    userName: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#14171a',
      margin: '0 0 4px 0'
    },
    postDate: {
      color: '#657786',
      fontSize: '14px'
    },
    postContent: {
      fontSize: '20px',
      lineHeight: '1.6',
      marginBottom: '20px',
      color: '#14171a'
    },
    postStats: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #e1e8ed',
      color: '#657786',
      fontSize: '14px'
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    backButton: {
      backgroundColor: '#1da1f2',
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      padding: '12px 20px',
      marginBottom: '20px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(29, 161, 242, 0.2)'
    },
    commentsSection: {
      backgroundColor: '#fff',
      border: '1px solid #e1e8ed',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    commentFormSection: {
      backgroundColor: '#fff',
      border: '1px solid #e1e8ed',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1da1f2',
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: '2px solid #e1e8ed'
    },
    loading: {
      textAlign: 'center',
      padding: '50px',
      fontSize: '18px',
      color: '#657786'
    },
    error: {
      textAlign: 'center',
      padding: '50px',
      fontSize: '18px',
      color: '#e0245e'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Post not found</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button 
        style={styles.backButton}
        onClick={() => window.history.back()}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#1991db';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#1da1f2';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        <span>←</span> Back to Feed
      </button>
           
      <div style={styles.postCard}>
        <div style={styles.postHeader}>
          <div style={styles.userAvatar}>
            {post.User?.users_name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div style={styles.userInfo}>
            <h3 style={styles.userName}>
              {post.User?.users_name || 'Unknown User'}
            </h3>
            <div style={styles.postDate}>
              {new Date(post.posts_created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
        
        <div style={styles.postContent}>
          {post.posts_message}
        </div>
        
        <div style={styles.postStats}>
          <div style={styles.statItem}>
            <span>💬</span>
            <span>{commentCount} Comments</span>
          </div>
          <div style={styles.statItem}>
            <span>👍</span>
            <span>0 Likes</span>
          </div>
          <div style={styles.statItem}>
            <span>🔄</span>
            <span>0 Retweets</span>
          </div>
        </div>
      </div>

      <div style={styles.commentFormSection}>
        <h3 style={styles.sectionTitle}>Add a Comment</h3>
        <CommentForm 
          postId={parseInt(id)} 
          onCommentAdded={handleCommentAdded}
        />
      </div>

      <div style={styles.commentsSection}>
        <CommentList 
          postId={parseInt(id)} 
          onCommentAdded={handleCommentAdded}
        />
      </div>
    </div>
  );
};

export default PostDetailPage;