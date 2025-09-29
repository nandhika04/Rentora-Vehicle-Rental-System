import React, { useState, useEffect } from 'react';
import './bike.css';
import './Car.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CarCard from './CarCard';
import { scoreCar } from './utils/preferences';
import SmartAssistant from './components/SmartAssistant';

const CarsPage = ({ onAddToCart }) => {
  const [cars, setCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);
  const navigate = useNavigate();
  const back = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${back}/api/cars`);
        const carsWithNumericPrices = response.data

          .filter(car => car && car.transmission && car.type)
          .map(car => ({
          ...car,
          price: typeof car.price === 'string' ? parseFloat(car.price) : car.price
        }));
        setCars(carsWithNumericPrices);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    fetchCars();
  }, [back]);

  const handleCompare = (car) => {
    setSelectedCars(prev => {
      if (prev.find(c => c._id === car._id)) return prev;
      if (prev.length >= 2) {
        alert('You can compare only 2 cars at a time');
        return prev;
      }
      return [...prev, car];
    });
  };

  const handleClearComparison = () => {
    setSelectedCars([]);
  };

  const handleBookNow = (car) => {
    navigate('/booking', { state: { vehicle: car, type: 'car' } });
  };

  return (
    <div className="bike-page">
      <h1 className="page-title">Our Car Collection</h1>
      <p className="page-subtitle">Choose from our premium selection of cars</p>
      
      <div className="bike-grid">
        {(() => {
          const prices = cars.map(c => Number(c.price) || 0).filter(n => n > 0).sort((a, b) => a - b);
          const p25Index = Math.floor(prices.length * 0.25);
          const p25 = prices.length ? prices[p25Index] : Infinity;

          return cars
            .map(c => ({ ...c, __score: scoreCar(c) }))
            .sort((a, b) => b.__score - a.__score)
            .map((car) => (
              <CarCard
                key={car._id}
                car={car}
                onAddToCart={onAddToCart}
                onBookNow={handleBookNow}
                onCompare={handleCompare}
                smartDeal={(Number(car.price) || 0) <= p25}
              />
            ));
        })()}
      </div>

      {selectedCars.length > 0 && (
        <div className="comparison-section">
          <h2>Car Comparison</h2>
          <div className="comparison-grid">
            {selectedCars.map((car) => (
              <div key={car._id} className="comparison-card">
                <img src={car.image} alt={car.name} />
                <h3>{car.name}</h3>
                <div className="comparison-details">
                  <p><strong>Price:</strong> ₹{car.price}/day</p>
                  <p><strong>Daily Limit:</strong> {car.limit} km</p>
                  <p><strong>Seats:</strong> {car.seats}</p>
                  <p><strong>Fuel Type:</strong> {car.fuel}</p>
                  <p><strong>Transmission:</strong> {car.transmission}</p>
                  <p><strong>Type:</strong> {car.type}</p>
                  <p><strong>AC:</strong> {car.ac ? 'Yes' : 'No'}</p>
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
      <SmartAssistant items={cars} kind="car" onBook={handleBookNow} />
    </div>
  );
};

export default CarsPage;