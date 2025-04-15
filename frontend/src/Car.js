import React, { useState } from 'react';
import './bike.css';
import yamaha from './tc.webp';
import bike from './md.webp';
import triumph from './ms.webp';
import Car from './Car';
import Bform from './Bform';

const Bike = () => {
  const [currentView, setCurrentView] = useState('bike');

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="bike-page">
      {currentView === 'car' && <Car />}
      {currentView === 'Bform' && <Bform />}

      {currentView === 'bike' && (
        <>
          <div className="grid-container">
            <div className="grid-item1">
              <img src={yamaha} height="100" width="200" alt="Yamaha MT 15" /><br />
              <span className="one">RIDE WITH NEW TATA CURVV</span><br />
              <span className="price">₹1880 per day</span><br />
              100km limit<br />
              3 Seater<br />
              Fuel Excluded<br />
              <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
            </div>

            <div className="grid-item">
              <img src={bike} height="100" width="200" alt="Royal Enfield Hunter 350" /><br />
              Maruti Dzire<br />
              <span className="price">₹1030 per day</span><br />
              100km limit<br />
              4 Seater<br />
              Fuel Excluded<br />
              <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
            </div>

            <div className="grid-item">
              <img src={triumph} height="100" width="200" alt="Triumph Tiger 1200" /><br />
              Maruti Swift<br />
              <span className="price">₹1400 per day</span><br />
              100km limit<br />
              4 Seater<br />
              Fuel Excluded<br />
              <button className="button" onClick={() => handleNavigate('Bform')}>Book Now!</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Bike;
