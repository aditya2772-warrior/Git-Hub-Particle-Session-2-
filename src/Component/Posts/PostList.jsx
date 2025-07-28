// src/Component/Posts/PostList.jsx
import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import { getAllPosts, updatePost, deletePost } from '../../api/postApi';

const PostList = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getAllPosts();
      console.log('Raw API Response:', response); // Debug log
      
      // Format posts to match PostItem expected structure
      const formattedPosts = response.data.map(post => {
        console.log('Processing post:', post); // Debug each post
        
        return {
          id: post.posts_id,
          userName: post.User ? post.User.users_name : 'Unknown User',
          // Try multiple possible user ID fields
          userId: post.posts_user_id || post.user_id || (post.User ? post.User.users_id : null),
          message: post.posts_message,
          createdAt: post.posts_created_at || new Date().toISOString(),
          updatedAt: post.posts_updated_at,
          userEmail: post.User ? post.User.users_email : null
        };
      });
      
      console.log('Formatted Posts:', formattedPosts); // Debug formatted posts
      setPosts(formattedPosts);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      throw err; // Re-throw to handle in PostItem
    }
  };

  const handleEditPost = async (id, newMessage) => {
    try {
      // Call the updatePost API function
      const response = await updatePost(id, { posts_message: newMessage });
      // Update the state with the edited post to reflect changes immediately
      setPosts(posts.map(post =>
        post.id === id ? { 
          ...post, 
          message: response.data.post ? response.data.post.posts_message : newMessage,
          updatedAt: new Date().toISOString()
        } : post
      ));
    } catch (err) {
      console.error('Error updating post:', err);
      throw err; // Re-throw to handle in PostItem component
    }
  };

  // Refresh posts function that can be called from parent
  const refreshPosts = () => {
    fetchPosts();
  };

  const listStyles = {
    marginTop: '20px'
  };

  const loadingStyles = {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#657786',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const errorStyles = {
    textAlign: 'center',
    padding: '20px',
    color: '#e0245e',
    backgroundColor: '#fff5f5',
    border: '1px solid #fed7d7',
    borderRadius: '10px',
    marginTop: '20px'
  };

  const emptyStyles = {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#657786',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginTop: '20px'
  };

  if (loading) {
    return <div style={loadingStyles}>Loading posts...</div>;
  }

  if (error) {
    return <div style={errorStyles}>Error: {error}</div>;
  }

  // Debug log to check currentUser and posts
  console.log('PostList - Current User:', currentUser);
  console.log('PostList - Posts:', posts);

  return (
    <div style={listStyles}>
      {posts.length === 0 ? (
        <div style={emptyStyles}>
          <p>No posts available.</p>
        </div>
      ) : (
        posts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            onDelete={handleDeletePost}
            onEdit={handleEditPost}
            currentUser={currentUser}
          />
        ))
      )}
    </div>
  );
};

export default PostList;