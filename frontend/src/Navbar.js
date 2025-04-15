import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './navbar.css'; // Import your CSS for styling the navbar
import logo from './logo.png'; // Adjust the path to your logo image

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-button">Home</Link>
        <Link to="/bike" className="nav-button">Bikes</Link>
        <Link to="/car" className="nav-button">Cars</Link>
      </div>
      <div className="navbar-actions">
        <Link to="/registration" className="nav-button">Login</Link>
        <Link to="/cart" className="nav-button">Cart</Link> {/* New Cart button */}
      </div>
    </nav>
  );
};

export default Navbar;