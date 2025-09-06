import React from 'react';
import { useFavorites } from './context/FavoritesContext';
import './bike.css';

const Wishlist = () => {
  const { favorites } = useFavorites();

  return (
    <div className="bike-page">
      <h1 className="page-title">Your Wishlist</h1>
      <p className="page-subtitle">Saved bikes and cars</p>

      {favorites.length === 0 ? (
        <div className="no-bikes">No favorites yet. Tap the heart on any vehicle to save it here.</div>
      ) : (
        <div className="bike-grid">
          {favorites.map((v) => (
            <div key={v._id} className="bike-card">
              <div className="bike-image-container">
                <img src={v.image} alt={v.name} className="bike-image" />
                <div className="bike-price">₹{v.price}/day</div>
              </div>
              <div className="bike-details">
                <h3>{v.name}</h3>
                <div className="bike-specs">
                  {v.limit && <span>{v.limit} km/day</span>}
                  {v.seats && <span>{v.seats} seats</span>}
                  {v.fuel && <span>{v.fuel}</span>}
                  {v.transmission && <span>{v.transmission}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;


