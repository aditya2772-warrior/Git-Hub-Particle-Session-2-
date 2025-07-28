// Component/layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
 
const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
 
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };
 
  const styles = {
    navbar: {
      backgroundColor: '#1da1f2',
      padding: '1rem 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    brand: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white',
      textDecoration: 'none'
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      marginRight: '1rem',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      transition: 'background-color 0.2s'
    },
    navLinkHover: {
      backgroundColor: 'rgba(255,255,255,0.1)'
    },
    logoutBtn: {
      backgroundColor: 'transparent',
      border: '1px solid white',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    userInfo: {
      color: 'white',
      marginRight: '1rem'
    }
  };
 
  return (
<nav style={styles.navbar}>
<div className="container">
<div className="d-flex justify-content-between align-items-center">
<Link to="/" style={styles.brand}>
            Twitter
</Link>
<div className="d-flex align-items-center">
            {user ? (
<>
<span style={styles.userInfo}>Hello, {user.users_name}</span>
<Link 
                  to="/dashboard" 
                  style={styles.navLink}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
>
                  Dashboard
</Link>
<button 
                  onClick={handleLogout} 
                  style={styles.logoutBtn}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = '#1da1f2';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'white';
                  }}
>
                  Logout
</button>
</>
            ) : (
<>
<Link 
                  to="/login" 
                  style={styles.navLink}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
>
                  Login
</Link>
<Link 
                  to="/register" 
                  style={styles.navLink}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
>
                  Register
</Link>
</>
            )}
</div>
</div>
</div>
</nav>
  );
};
 
export default Navbar;