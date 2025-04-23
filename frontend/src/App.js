import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import './App.css';
import bikeImage from './bm.jpg';
import carImage from './car.jpeg';
import bgImage from './h.jpg';
import Bike from './bike';
import Car from './Car';
import Cart from './Cart';
import Navbar from './Navbar';
import ContactUs from './ContactUs';
import RegistrationForm from './RegistrationForm';
import AdminPage from './AdminPage';
import Bform from './Bform';

const MainApp = () => {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (item) => {
    // Ensure price is always a number
    const price = typeof item.price === 'string' ? 
      parseFloat(item.price.replace(/[^\d.-]/g, '')) : 
      item.price;
    
    const newItem = { 
      ...item, 
      id: item.id || Date.now(),
      price: price
    };
    
    setCartItems((prevItems) => [...prevItems, newItem]);
    alert(`${item.name} has been added to your cart!`);
  };

  const handleRemoveItem = (itemToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemToRemove.id)
    );
  };

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`app-container ${isHomePage ? 'home-bg' : ''}`}>
      <Navbar cartCount={cartItems.length} />
      
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <div className="hero-section">
                <div className="hero-content">
                  <h1>RENTORA</h1>
                  <p className="hero-subtitle">
                    Your premium vehicle rental experience
                  </p>
                  <div className="vehicle-selection">
                    <div className="vehicle-card">
                      <img src={bikeImage} alt="Bike" />
                      <a href="/bike" className="vehicle-link">Explore Bikes</a>
                    </div>
                    <div className="vehicle-card">
                      <img src={carImage} alt="Car" />
                      <a href="/car" className="vehicle-link">Explore Cars</a>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/bike" element={<Bike onAddToCart={handleAddToCart} />} />
          <Route path="/car" element={<Car onAddToCart={handleAddToCart} />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/booking" element={<Bform />} />
          <Route
            path="/cart"
            element={<Cart cartItems={cartItems} onRemoveItem={handleRemoveItem} />}
          />
        </Routes>
      </main>

      <ContactUs />
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}