import React from 'react';
import './home.css';

const Home = () => {
  return (
    <div className="home">
      <header className="header">
        <h1 className="logo">RENTORA</h1>
        <p className="tagline">
          Your one-stop solution for convenient and flexible vehicle rentals, 
          tailored for every journey.
        </p>
      </header>

      <nav className="navbar">
        <a href="/" className="nav-item">HOME</a>
        <a href="/services" className="nav-item">SERVICES</a>
        <a href="/contact" className="nav-item">CONTACT</a>
        <a href="/about" className="nav-item">ABOUT US</a>
      </nav>

      <main className="vehicle-container">
        <div className="vehicle-card">
          <img 
            src="p.webp" 
            alt="Premium Bikes" 
            className="vehicle-image"
            loading="lazy"
          />
          <div className="vehicle-content">
            <a href="/bike" className="vehicle-link">Explore Bikes</a>
          </div>
        </div>

        <div className="vehicle-card">
          <img 
            src="car.jpeg" 
            alt="Luxury Cars" 
            className="vehicle-image"
            loading="lazy"
          />
          <div className="vehicle-content">
            <a href="/car" className="vehicle-link">Explore Cars</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;