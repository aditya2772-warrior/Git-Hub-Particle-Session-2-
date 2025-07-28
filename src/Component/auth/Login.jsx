// Component/auth/Login.js
import React, { useState } from 'react';
import { loginUser } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
 
const Login = ({ setUser }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };
 
  const styles = {
    loginContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    loginCard: {
      background: '#fff',
      borderRadius: '20px',
      padding: '40px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 10px 40px rgba(29, 161, 242, 0.3)',
      border: 'none'
    },
    brandSection: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    logo: {
      fontSize: '48px',
      color: '#1da1f2',
      marginBottom: '10px'
    },
    brandTitle: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#14171a',
      marginBottom: '8px'
    },
    brandSubtitle: {
      fontSize: '16px',
      color: '#5b7083',
      fontWeight: '400'
    },
    formGroup: {
      marginBottom: '20px'
    },
    formControl: {
      width: '100%',
      padding: '16px 20px',
      fontSize: '16px',
      border: '2px solid #e1e8ed',
      borderRadius: '50px',
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: '#fff',
      fontFamily: 'inherit'
    },
    formControlFocus: {
      borderColor: '#1da1f2',
      boxShadow: '0 0 0 3px rgba(29, 161, 242, 0.1)'
    },
    submitBtn: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#1da1f2',
      color: '#fff',
      border: 'none',
      borderRadius: '50px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '20px',
      fontFamily: 'inherit'
    },
    submitBtnHover: {
      backgroundColor: '#0d8bd9',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(29, 161, 242, 0.4)'
    },
    submitBtnDisabled: {
      backgroundColor: '#aab8c2',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    },
    linkText: {
      textAlign: 'center',
      fontSize: '15px',
      color: '#5b7083'
    },
    link: {
      color: '#1da1f2',
      textDecoration: 'none',
      fontWeight: '600'
    },
    linkHover: {
      textDecoration: 'underline'
    }
  };
 
  return (
<div style={styles.loginContainer}>
<div style={styles.loginCard}>
<div style={styles.brandSection}>
<div style={styles.logo}>🐦</div>
<h1 style={styles.brandTitle}>Welcome back</h1>
<p style={styles.brandSubtitle}>Sign in to your account</p>
</div>
<form onSubmit={handleSubmit}>
<div style={styles.formGroup}>
<input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              style={styles.formControl}
              onFocus={(e) => e.target.style.borderColor = '#1da1f2'}
              onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
              required
            />
</div>
<div style={styles.formGroup}>
<input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={styles.formControl}
              onFocus={(e) => e.target.style.borderColor = '#1da1f2'}
              onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
              required
            />
</div>
<button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                Object.assign(e.target.style, styles.submitBtnHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#1da1f2';
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }
            }}
>
            {loading ? 'Signing in...' : 'Sign in'}
</button>
</form>
<div style={styles.linkText}>
          Don't have an account?{' '}
<a 
            href="/register" 
            style={styles.link}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
>
            Sign up
</a>
</div>
</div>
</div>
  );
};
 
export default Login;