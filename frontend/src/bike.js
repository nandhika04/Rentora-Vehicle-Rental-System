import React, { useState, useEffect } from 'react';
import './bike.css';
import axios from 'axios';
import Car from './Car';
import Bform from './Bform';
import Navbar from './Navbar';

const BikeCard = ({ bike, onAddToCart, onBookNow, onCompare }) => {
  return (
    <div className="grid-item">
      <img src={bike.image} alt={bike.name} />
      <h3>{bike.name}</h3>
      <span className="price">₹{bike.price}</span>
      <p>Daily Limit: {bike.limit} km</p>
      <p>Seats: {bike.seats}</p>
      <p>Fuel Type: {bike.fuel}</p>
      <div className="button-container">
        <button className="button" onClick={onBookNow}>Book Now</button>
        <button className="button cart-button" onClick={() => onAddToCart(bike)}>
          Add to Cart
        </button>
        <button className="button compare-button" onClick={() => onCompare(bike)}>
          Compare
        </button>
      </div>
    </div>
  );
};

const Bike = ({ onAddToCart }) => {
  const [currentView, setCurrentView] = useState('bike');
  const [dbBikes, setDbBikes] = useState([]);
  const [selectedBikes, setSelectedBikes] = useState([]);

  const back = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await axios.get(back + '/api/bikes');
        setDbBikes(response.data);
      } catch (error) {
        console.error('Error fetching bikes:', error);
      }
    };

    fetchBikes();
  }, [back]);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

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

  return (
    <>
      <Navbar />
      <div className="bike-page">
        {currentView === 'car' && <Car />}
        {currentView === 'Bform' && <Bform />}
        {currentView === 'bike' && (
          <>
            <div className="grid-container">
              {dbBikes.map((bike) => (
                <BikeCard
                  key={bike._id}
                  bike={bike}
                  onAddToCart={onAddToCart}
                  onBookNow={() => handleNavigate('Bform')}
                  onCompare={handleCompare}
                />
              ))}
            </div>

            {selectedBikes.length > 0 && (
              <div className="comparison-container">
                <h3>Bike Comparison</h3>
                <div className="comparison-grid">
                  {selectedBikes.map((bike) => (
                    <div key={bike._id} className="comparison-box">
                      <img src={bike.image} alt={bike.name} />
                      <h4>{bike.name}</h4>
                      <p><strong>Price:</strong> ₹{bike.price}</p>
                      <p><strong>Daily Limit:</strong> {bike.limit} km</p>
                      <p><strong>Seats:</strong> {bike.seats}</p>
                      <p><strong>Fuel Type:</strong> {bike.fuel}</p>
                    </div>
                  ))}
                </div>
                {selectedBikes.length === 2 && (
                  <button className="clear-button" onClick={handleClearComparison}>
                    Clear Comparison
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Bike;