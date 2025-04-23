import React, { useState, useEffect } from 'react';
import './bike.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BikeCard = ({ bike, onAddToCart, onBookNow, onCompare }) => {
  const price = typeof bike.price === 'string' ? parseFloat(bike.price) : bike.price;

  return (
    <div className="bike-card">
      <div className="bike-image-container">
        <img src={bike.image} alt={bike.name} className="bike-image" />
        <div className="bike-price">₹{price}/day</div>
      </div>
      <div className="bike-details">
        <h3>{bike.name}</h3>
        <div className="bike-specs">
          <span><i className="fas fa-tachometer-alt"></i> {bike.limit} km/day</span>
          <span><i className="fas fa-chair"></i> {bike.seats} seats</span>
          <span><i className="fas fa-gas-pump"></i> {bike.fuel}</span>
        </div>
        <div className="bike-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => onBookNow(bike)}
          >
            Book Now
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => onAddToCart({...bike, price})}
          >
            Add to Cart
          </button>
          <button className="btn btn-compare" onClick={() => onCompare(bike)}>
            Compare
          </button>
        </div>
      </div>
    </div>
  );
};

const Bike = ({ onAddToCart }) => {
  const [bikes, setBikes] = useState([]);
  const [selectedBikes, setSelectedBikes] = useState([]);
  const navigate = useNavigate();
  const back = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await axios.get(`${back}/api/bikes`);
        const bikesWithNumericPrices = response.data.map(bike => ({
          ...bike,
          price: typeof bike.price === 'string' ? parseFloat(bike.price) : bike.price
        }));
        setBikes(bikesWithNumericPrices);
      } catch (error) {
        console.error('Error fetching bikes:', error);
      }
    };
    fetchBikes();
  }, [back]);

  const handleCompare = (bike) => {
    setSelectedBikes(prev => {
      if (prev.find(b => b._id === bike._id)) return prev;
      if (prev.length >= 2) {
        alert('You can compare only 2 bikes at a time');
        return prev;
      }
      return [...prev, bike];
    });
  };

  const handleClearComparison = () => {
    setSelectedBikes([]);
  };

  const handleBookNow = (bike) => {
    navigate('/booking', { state: { bike } });
  };

  return (
    <div className="bike-page">
      <h1 className="page-title">Our Bike Collection</h1>
      <p className="page-subtitle">Choose from our premium selection of bikes</p>
      
      <div className="bike-grid">
        {bikes.map((bike) => (
          <BikeCard
            key={bike._id}
            bike={bike}
            onAddToCart={onAddToCart}
            onBookNow={handleBookNow}
            onCompare={handleCompare}
          />
        ))}
      </div>

      {selectedBikes.length > 0 && (
        <div className="comparison-section">
          <h2>Bike Comparison</h2>
          <div className="comparison-grid">
            {selectedBikes.map((bike) => (
              <div key={bike._id} className="comparison-card">
                <img src={bike.image} alt={bike.name} />
                <h3>{bike.name}</h3>
                <div className="comparison-details">
                  <p><strong>Price:</strong> ₹{bike.price}/day</p>
                  <p><strong>Daily Limit:</strong> {bike.limit} km</p>
                  <p><strong>Seats:</strong> {bike.seats}</p>
                  <p><strong>Fuel Type:</strong> {bike.fuel}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="btn btn-clear" 
            onClick={handleClearComparison}
          >
            Clear Comparison
          </button>
        </div>
      )}
    </div>
  );
};

export default Bike;