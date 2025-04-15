// App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import './home.css';
import bikeImage from './p.jpeg';
import carImage from './car.jpeg';
import bgImage from './bg.jpg';
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
    const newItem = { ...item, id: item.id || Date.now() };
    const price = parseFloat(item.price.replace(/[^\d.-]/g, ''));
    setCartItems((prevItems) => [...prevItems, { ...newItem, price }]);
    alert(`${item.name} has been added to the cart.`);
  };

  const handleRemoveItem = (itemToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemToRemove.id)
    );
    alert(`${itemToRemove.name} has been removed from the cart.`);
  };

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div
      className="main-container"
      style={{
        backgroundImage: isHomePage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div id="main1">
                <div>RENTORA</div>
                <div id="description">
                  Your one-stop solution for convenient and flexible vehicle rentals.
                </div>
              </div>

              <div id="container">
                <div className="flex-container">
                  <div className="vehicle bike">
                    <Link to="/bike">
                      <img src={bikeImage} alt="Bike" />
                      <span>Bike</span>
                    </Link>
                  </div>
                  <div className="vehicle car">
                    <Link to="/car">
                      <img src={carImage} alt="Car" />
                      <span>Car</span>
                    </Link>
                  </div>
                </div>
              </div>
            </>
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

      <ContactUs />
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