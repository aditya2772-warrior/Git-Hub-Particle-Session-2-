// src/pages/Dashboard.jsx
import React from 'react';
import PostForm from '../Component/Posts/PostForm';
import PostList from '../Component/Posts/PostList';
import { getCurrentUser } from '../api/userApi';

const Dashboard = () => {
  const user = getCurrentUser();

  // Debug log to check user data
  console.log('Dashboard User:', user);

  const dashboardStyles = {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  };

  const containerStyles = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px 15px'
  };

  const headerStyles = {
    borderBottom: '1px solid #e1e8ed',
    paddingBottom: '15px',
    marginBottom: '20px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const welcomeStyles = {
    color: '#1da1f2',
    fontWeight: 'bold',
    fontSize: '24px',
    marginBottom: '5px'
  };

  const subtitleStyles = {
    color: '#657786',
    fontSize: '16px',
    margin: '0'
  };

  return (
    <div style={dashboardStyles}>
      <div style={containerStyles}>
        {/* Header Section */}
        <div style={headerStyles}>
          <div>
            <h1 style={welcomeStyles}>
              Welcome back, {user?.users_name || 'User'}!
            </h1>
            <p style={subtitleStyles}>What's happening?</p>
          </div>
        </div>

        {/* Post Form */}
        <PostForm />

        {/* Post List with Edit Functionality */}
        <PostList currentUser={user} />
      </div>
    </div>
  );
};

export default Dashboard;