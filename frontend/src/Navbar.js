import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './navbar.css';
import logo from './logo.png';

const Navbar = ({ cartCount }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Rentora Logo" />
        <span>RENTORA</span>
      </Link>
      
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/bike" className="nav-link">Bikes</Link>
        <Link to="/car" className="nav-link">Cars</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>
      
      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            {(user?.role === 'admin' || user?.role === 'staff') && (
              <Link to="/staff-dashboard" className="nav-button">Dashboard</Link>
            )}
            <Link to="/wishlist" className="nav-button">Wishlist</Link>
            <Link to="/cart" className="nav-button cart-button">
              Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user?.username || 'User'} ▼
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user?.username}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/registration" className="nav-button">Sign Up</Link>
            <Link to="/wishlist" className="nav-button">Wishlist</Link>
            <Link to="/cart" className="nav-button cart-button">
              Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;