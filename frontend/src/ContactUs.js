import React from 'react';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <footer className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h3>Contact Us</h3>
          <p><i className="fas fa-map-marker-alt"></i> Coimbatore,Tamil Nadu</p>
          <p><i className="fas fa-phone"></i> +91 8787424266</p>
          <p><i className="fas fa-envelope"></i> rent@rentora.com</p>
        </div>
        
        <div className="quick-links">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/bike">Bikes</a>
          <a href="/car">Cars</a>
          <a href="/contact">Contact</a>
        </div>
        
        <div className="social-links">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
      
      <div className="copyright">
        <p>&copy; {new Date().getFullYear()} Rentora. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default ContactUs;