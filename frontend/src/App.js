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

// ✅ Make sure file names and cases match
import Home from './Home';
import Bike from './bike';
import Car from './Car';
import Cart from './Cart';
import Navbar from './Navbar';
import ContactUs from './ContactUs';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import AdminPage from './AdminPage';
import AdminPagecar from './CarAdminPage';
import AdminDashboard from './AdminDashboard';
import Bform from './Bform';
import { FavoritesProvider } from './context/FavoritesContext';
import Wishlist from './Wishlist';
import DamageCapture from './DamageCapture';
import DamageReview from './DamageReview';

const MainAppContent = () => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem('rentora_cart_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleAddToCart = (item) => {
    const price = typeof item.price === 'string'
      ? parseFloat(item.price.replace(/[^\d.-]/g, ''))
      : item.price;

    const newItem = {
      ...item,
      id: item.id || Date.now(),
      price: price,
    };

    setCartItems((prevItems) => [...prevItems, newItem]);
    alert(`${item.name} has been added to your cart!`);
  };

  const handleRemoveItem = (itemToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemToRemove.id)
    );
  };

  // Persist cart to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('rentora_cart_v1', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  return (
    <div className="app-container">
      {!isHomePage && <Navbar cartCount={cartItems.length} />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bike" element={<Bike onAddToCart={handleAddToCart} />} />
          <Route path="/car" element={<Car onAddToCart={handleAddToCart} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} onRemoveItem={handleRemoveItem} />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admincar" element={<AdminPagecar />} />
          <Route path="/booking" element={<Bform />} />
          <Route path="/damage/capture" element={<DamageCapture />} />
          <Route path="/damage/review" element={<DamageReview />} />
        </Routes>
      </main>

      {!isHomePage && <ContactUs />}
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

const App = () => (
  <Router>
    <FavoritesProvider>
      <MainAppContent />
    </FavoritesProvider>
  </Router>
);

export default App;
