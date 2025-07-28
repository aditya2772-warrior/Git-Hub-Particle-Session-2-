// Component/Posts/PostForm.js
import React, { useState } from 'react';
import { createPost } from '../../api/postApi';
 
const PostForm = () => {
  const [message, setMessage] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login first');
    setIsPosting(true);
    try {
      await createPost({
        posts_message: message,
        posts_user_id: user.users_id,
      });
      setMessage('');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to post');
    } finally {
      setIsPosting(false);
    }
  };
 
  const styles = {
    container: {
      backgroundColor: 'white',
      border: '1px solid #e1e8ed',
      borderRadius: '10px',
      padding: '1rem',
      marginBottom: '1rem'
    },
    textarea: {
      border: 'none',
      outline: 'none',
      resize: 'none',
      fontSize: '1.2rem',
      width: '100%',
      minHeight: '80px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    tweetButton: {
      backgroundColor: '#1da1f2',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      padding: '0.5rem 1.5rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      float: 'right'
    },
    tweetButtonDisabled: {
      backgroundColor: '#aab8c2',
      cursor: 'not-allowed'
    },
    characterCount: {
      color: message.length > 280 ? '#e0245e' : '#657786',
      fontSize: '0.9rem',
      marginRight: '1rem'
    },
    bottomBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e1e8ed'
    }
  };
 
  const isDisabled = !message.trim() || message.length > 280 || isPosting;
 
  return (
<div style={styles.container}>
<form onSubmit={handleSubmit}>
<textarea
          style={styles.textarea}
          placeholder="What's happening?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={300}
          required
        />
<div style={styles.bottomBar}>
<span style={styles.characterCount}>
            {280 - message.length} characters remaining
</span>
<button
            type="submit"
            style={{
              ...styles.tweetButton,
              ...(isDisabled ? styles.tweetButtonDisabled : {})
            }}
            disabled={isDisabled}
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
            {isPosting ? 'Posting...' : 'Tweet'}
</button>
</div>
</form>
</div>
  );
};
 
export default PostForm;