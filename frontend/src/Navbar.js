import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import logo from './logo.png';

const Navbar = ({ cartCount }) => {
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
        <Link to="/registration" className="nav-button">Login</Link>
        <Link to="/cart" className="nav-button cart-button">
          Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;