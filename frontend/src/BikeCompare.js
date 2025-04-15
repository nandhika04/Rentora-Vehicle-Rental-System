// BikeCompare.js
import React from 'react';
import './BikeCompare.css';

const BikeCompare = ({ selectedBikes }) => {
  if (selectedBikes.length < 2) return null;

  return (
    <div className="comparison-container">
      <h2>Bike Comparison</h2>
      <div className="comparison-table">
        <div className="comparison-row header">
          <div>Feature</div>
          {selectedBikes.map((bike, index) => (
            <div key={index}>{bike.name}</div>
          ))}
        </div>
        <div className="comparison-row">
          <div>Price</div>
          {selectedBikes.map((bike, index) => (
            <div key={index}>{bike.price}</div>
          ))}
        </div>
        <div className="comparison-row">
          <div>Limit</div>
          {selectedBikes.map((bike, index) => (
            <div key={index}>{bike.limit}</div>
          ))}
        </div>
        <div className="comparison-row">
          <div>Seats</div>
          {selectedBikes.map((bike, index) => (
            <div key={index}>{bike.seats}</div>
          ))}
        </div>
        <div className="comparison-row">
          <div>Fuel</div>
          {selectedBikes.map((bike, index) => (
            <div key={index}>{bike.fuel}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BikeCompare;