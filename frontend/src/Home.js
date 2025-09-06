import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './home-new.css';

// Import images
import logoImg from './logo.png';

const Home = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const videoContainer = video?.parentElement;

    const handleVideoLoad = () => {
      setVideoLoaded(true);
      if (overlay) {
        overlay.classList.add('loaded');
      }
      if (videoContainer) {
        videoContainer.classList.add('loaded');
      }
    };

    if (video) {
      video.addEventListener('loadeddata', handleVideoLoad);
      video.addEventListener('canplay', handleVideoLoad);
      
      // Fallback: if video takes too long, show overlay anyway
      const timeout = setTimeout(() => {
        if (!videoLoaded) {
          setVideoLoaded(true);
          if (overlay) {
            overlay.classList.add('loaded');
          }
          if (videoContainer) {
            videoContainer.classList.add('loaded');
          }
        }
      }, 1500);

      return () => {
        video.removeEventListener('loadeddata', handleVideoLoad);
        video.removeEventListener('canplay', handleVideoLoad);
        clearTimeout(timeout);
      };
    }
  }, [videoLoaded]);

  return (
    <div className="rentora-home-root">
      {/* Background Video */}
      <div className="rentora-home-bg-video">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:0.3' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)' /%3E%3C/svg%3E"
        >
          <source src="https://cdn.pixabay.com/video/2015/08/25/569-137189528_large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div ref={overlayRef} className="rentora-home-video-overlay"></div>
      </div>
      <nav className="rentora-home-navbar">
        <div className="rentora-home-logo-group">
          <img src={logoImg} alt="Rentora Logo" className="rentora-home-logo-img" />
          <span className="rentora-home-logo-text">RENTORA</span>
        </div>
        <div className="rentora-home-nav-links">
          <Link to="/" className="rentora-home-nav-link active">Home</Link>
          <Link to="/bike" className="rentora-home-nav-link">Bikes</Link>
          <Link to="/car" className="rentora-home-nav-link">Cars</Link>
          <Link to="/contact" className="rentora-home-nav-link">Contact</Link>
        </div>
        <div className="rentora-home-nav-actions">
          <Link to="/login" className="rentora-home-btn rentora-home-btn-login">Login</Link>
          <Link to="/wishlist" className="rentora-home-btn rentora-home-btn-wishlist">Wishlist</Link>
          <Link to="/cart" className="rentora-home-btn rentora-home-btn-cart">Cart</Link>
        </div>
      </nav>

      <header className="rentora-home-hero">
        <div className="rentora-home-hero-content">
          <h1 className="rentora-home-hero-title">Discover Your Next Ride</h1>
          <p className="rentora-home-hero-desc">
            Rentora brings you the best selection of bikes and cars for every journey.  
            Experience hassle-free booking, AI-powered support, and smart damage detection.
          </p>
          <div className="rentora-home-hero-actions">
            <Link to="/bike" className="rentora-home-hero-btn">Explore Bikes</Link>
            <Link to="/car" className="rentora-home-hero-btn rentora-home-hero-btn-alt">Explore Cars</Link>
          </div>
        </div>

      </header>

      <section className="rentora-home-features">
        <h2 className="rentora-home-features-title">Why Choose Rentora?</h2>
        <div className="rentora-home-features-list">
          <div className="rentora-home-feature-card">
            <span className="rentora-home-feature-icon">🤖</span>
            <h3>AI Chatbot</h3>
            <p>Get instant answers and recommendations for your rental needs.</p>
          </div>
          <div className="rentora-home-feature-card">
            <span className="rentora-home-feature-icon">🔍</span>
            <h3>Damage Detection</h3>
            <p>Automated image analysis for transparent vehicle condition reporting.</p>
          </div>
          <div className="rentora-home-feature-card">
            <span className="rentora-home-feature-icon">🛡️</span>
            <h3>Secure Booking</h3>
            <p>Safe and easy booking with user management and admin controls.</p>
          </div>
          <div className="rentora-home-feature-card">
            <span className="rentora-home-feature-icon">🚗</span>
            <h3>Wide Selection</h3>
            <p>Choose from premium bikes and luxury cars for every occasion.</p>
          </div>
        </div>
      </section>

      <section className="rentora-home-testimonials">
        <h2 className="rentora-home-testimonials-title">What Our Customers Say</h2>
        <div className="rentora-home-testimonials-list">
          <div className="rentora-home-testimonial-card">
            <p>"Booking was super easy and the AI assistant helped me pick the perfect bike!"</p>
            <span>- Priya S.</span>
          </div>
          <div className="rentora-home-testimonial-card">
            <p>"Damage detection gave me peace of mind. Highly recommend Rentora!"</p>
            <span>- Arjun M.</span>
          </div>
          <div className="rentora-home-testimonial-card">
            <p>"Great selection of cars and excellent customer support."</p>
            <span>- Neha K.</span>
          </div>
        </div>
      </section>

      <footer className="rentora-home-footer">
        <div className="rentora-home-footer-content">
          <div>
            <h3>RENTORA</h3>
            <p>Your trusted partner for vehicle rentals.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/bike">Bikes</Link>
            <Link to="/car">Cars</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h4>Contact Us</h4>
            <p>📞 +1 (555) 123-4567</p>
            <p>✉️ info@rentora.com</p>
          </div>
        </div>
        <div className="rentora-home-footer-bottom">
          <p>© 2025 RENTORA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;