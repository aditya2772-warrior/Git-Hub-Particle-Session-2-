// src/pages/HomePage.jsx - UPDATED (No edit/delete functionality)
import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../api/postApi'; // Removed updatePost, deletePost imports
import PostItem from '../Component/Posts/PostItem';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../api/userApi';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllPosts();
      
      console.log('HomePage - Raw API Response:', res);
      
      if (res.data && Array.isArray(res.data)) {
        const mappedPosts = res.data.map((post) => {
          console.log('HomePage - Processing post:', post);
          
          return {
            id: post.posts_id,
            message: post.posts_message,
            userId: post.posts_user_id || post.user_id || (post.User ? post.User.users_id : null),
            userName: post.User?.users_name || 'Unknown User',
            createdAt: post.posts_created_at,
            updatedAt: post.posts_updated_at
          };
        });
        
        console.log('HomePage - Mapped Posts:', mappedPosts);
        setPosts(mappedPosts);
      }
    } catch (err) {
      console.error('Failed to fetch posts', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Removed handleDelete and handleEdit functions

  console.log('HomePage - Current User:', user);

  const containerStyles = {
    minHeight: '100vh',
    backgroundColor: '#f7f9fa'
  };

  const mainContentStyles = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    minHeight: '100vh',
    borderLeft: '1px solid #e1e8ed',
    borderRight: '1px solid #e1e8ed'
  };

  const headerStyles = {
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #e1e8ed',
    padding: '16px 20px',
    zIndex: 1000
  };

  const titleStyles = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#14171a',
    margin: 0
  };

  const subtitleStyles = {
    fontSize: '13px',
    color: '#657786',
    margin: '2px 0 0 0'
  };

  const loadingStyles = {
    textAlign: 'center',
    padding: '40px',
    color: '#657786',
    fontSize: '16px'
  };

  const errorStyles = {
    backgroundColor: '#fee',
    color: '#c53030',
    padding: '20px',
    textAlign: 'center',
    margin: '20px'
  };

  const emptyStateStyles = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#657786'
  };

  const ctaButtonStyles = {
    backgroundColor: '#1da1f2',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '20px',
    transition: 'background-color 0.2s ease'
  };

  const retryButtonStyles = {
    backgroundColor: '#1da1f2',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 16px',
    cursor: 'pointer',
    marginTop: '10px'
  };

  return (
    <div style={containerStyles}>
      <div style={mainContentStyles}>
        <div style={headerStyles}>
          <h1 style={titleStyles}>Home</h1>
          <p style={subtitleStyles}>
            {posts.length > 0 ? `${posts.length} posts` : 'Welcome to Twitter Clone'}
          </p>
        </div>

        {loading && (
          <div style={loadingStyles}>
            <div>Loading posts...</div>
          </div>
        )}

        {error && (
          <div style={errorStyles}>
            {error}
            <br />
            <button style={retryButtonStyles} onClick={fetchPosts}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div style={emptyStateStyles}>
            <h2>Welcome to Twitter !</h2>
            <p>No posts to show yet. Be the first to share something!</p>
            {user ? (
              <Link to="/dashboard" style={ctaButtonStyles}>
                Create Your First Post
              </Link>
            ) : (
              <div>
                <Link to="/register" style={ctaButtonStyles}>
                  Sign Up
                </Link>
                <br />
                <Link 
                  to="/login" 
                  style={{
                    ...ctaButtonStyles,
                    backgroundColor: 'transparent',
                    color: '#1da1f2',
                    border: '1px solid #1da1f2',
                    marginTop: '10px'
                  }}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div>
            {posts.map((post) => (
              <PostItem 
                key={post.id} 
                post={post} 
                // Removed onDelete and onEdit props
                currentUser={user}
                showActions={false} // Add this prop to control visibility of edit/delete buttons
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;