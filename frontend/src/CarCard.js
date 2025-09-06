import React from 'react';
import './bike.css';
import { updatePreferences } from './utils/preferences';
import { useFavorites } from './context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

const CarCard = ({ car, onAddToCart, onBookNow, onCompare, smartDeal }) => {
  const price = typeof car.price === 'string' ? parseFloat(car.price) : car.price;
  const navigate = useNavigate();
  const { isFavorited, toggleFavorite } = useFavorites();

  const handleBookNow = () => {
    updatePreferences({
      fuel: car.fuel,
      transmission: car.transmission,
      type: car.type,
      seats: String(car.seats)
    });
    if (onBookNow) {
      onBookNow(car);
    } else {
      navigate('/booking', { state: { vehicle: car, type: 'car' } });
    }
  };

  return (
    <div className="bike-card">
      <div className="bike-image-container">
        <img src={car.image} alt={car.name} className="bike-image" />
        <div className="bike-price">₹{price}/day</div>
        {smartDeal && <div className="smart-deal-badge">Smart Deal</div>}
        <button
          className={`fav-button ${isFavorited(car._id) ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleFavorite({ ...car, price }); }}
          aria-label="Toggle favorite"
          title={isFavorited(car._id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isFavorited(car._id) ? '♥' : '♡'}
        </button>
      </div>
      <div className="bike-details">
        <h3>{car.name}</h3>
        <div className="bike-specs">
          <span><i className="fas fa-tachometer-alt"></i> {car.limit} km/day</span>
          <span><i className="fas fa-chair"></i> {car.seats} seats</span>
          <span><i className="fas fa-gas-pump"></i> {car.fuel}</span>
          <span><i className="fas fa-cog"></i> {car.transmission}</span>
          <span><i className="fas fa-car"></i> {car.type}</span>
          <span><i className="fas fa-snowflake"></i> {car.ac ? 'AC' : 'Non-AC'}</span>
        </div>
        <div className="bike-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleBookNow}
          >
            Book Now
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => onAddToCart({ ...car, price, type: 'car' })}
          >
            Add to Cart
          </button>
          <button className="btn btn-compare" onClick={() => onCompare(car)}>
            Compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;