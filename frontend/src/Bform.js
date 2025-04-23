import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './bform.css';

const Bform = () => {
  const location = useLocation();
  const bikeFromLocation = location.state?.bike;
  
  const [formValues, setFormValues] = useState({
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [bikeDetails, setBikeDetails] = useState(
    bikeFromLocation || {
      name: 'Royal Enfield Classic 350',
      price: 1500,
      image: 'https://example.com/bike.jpg'
    }
  );

  const RATE_PER_DAY = bikeDetails.price;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formValues.pickupDate) {
      newErrors.pickupDate = 'Pickup date is required';
      isValid = false;
    }

    if (!formValues.pickupTime) {
      newErrors.pickupTime = 'Pickup time is required';
      isValid = false;
    }

    if (!formValues.dropoffDate) {
      newErrors.dropoffDate = 'Dropoff date is required';
      isValid = false;
    }

    if (!formValues.dropoffTime) {
      newErrors.dropoffTime = 'Dropoff time is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateCost = () => {
    const pickupDateTime = new Date(`${formValues.pickupDate}T${formValues.pickupTime}`);
    const dropoffDateTime = new Date(`${formValues.dropoffDate}T${formValues.dropoffTime}`);

    if (pickupDateTime >= dropoffDateTime) {
      setEstimatedCost(null);
      return;
    }

    const diffInMs = dropoffDateTime - pickupDateTime;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    const cost = diffInDays * RATE_PER_DAY;
    setEstimatedCost(cost);
  };

  useEffect(() => {
    if (formValues.pickupDate && formValues.pickupTime && 
        formValues.dropoffDate && formValues.dropoffTime) {
      calculateCost();
    } else {
      setEstimatedCost(null);
    }
  }, [formValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    navigate('/bike');
  };

  return (
    <div className="booking-page">
      {isSubmitted ? (
        <div className="booking-success">
          <div className="success-card">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Booking Confirmed!</h2>
            <p>Your booking for {bikeDetails.name} has been confirmed.</p>
            
            <div className="bike-summary">
              <img src={bikeDetails.image} alt={bikeDetails.name} />
              <div className="bike-info">
                <h3>{bikeDetails.name}</h3>
                <p>₹{bikeDetails.price}/day</p>
              </div>
            </div>
            
            <div className="booking-details">
              <div className="detail-item">
                <span>Pickup:</span>
                <span>{formValues.pickupDate} at {formValues.pickupTime}</span>
              </div>
              <div className="detail-item">
                <span>Dropoff:</span>
                <span>{formValues.dropoffDate} at {formValues.dropoffTime}</span>
              </div>
              <div className="detail-item total">
                <span>Total Cost:</span>
                <span>₹{estimatedCost}</span>
              </div>
            </div>
            
            <p className="confirmation-message">
              We've sent the confirmation details to your email. 
              Please arrive 15 minutes before pickup time with your ID and driving license.
            </p>
            
            <button className="btn btn-primary" onClick={handleReset}>
              Book Another Bike
            </button>
          </div>
        </div>
      ) : (
        <div className="booking-form-container">
          <div className="bike-selection-card">
            <img src={bikeDetails.image} alt={bikeDetails.name} />
            <div className="bike-selection-info">
              <h3>You're booking:</h3>
              <h2>{bikeDetails.name}</h2>
              <p>₹{bikeDetails.price}/day</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="booking-form">
            <h2>Booking Details</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="pickupDate">Pickup Date</label>
                <input
                  type="date"
                  id="pickupDate"
                  name="pickupDate"
                  value={formValues.pickupDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.pickupDate ? 'error' : ''}
                />
                {errors.pickupDate && <div className="error-message">{errors.pickupDate}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="pickupTime">Pickup Time</label>
                <input
                  type="time"
                  id="pickupTime"
                  name="pickupTime"
                  value={formValues.pickupTime}
                  onChange={handleChange}
                  className={errors.pickupTime ? 'error' : ''}
                />
                {errors.pickupTime && <div className="error-message">{errors.pickupTime}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="dropoffDate">Dropoff Date</label>
                <input
                  type="date"
                  id="dropoffDate"
                  name="dropoffDate"
                  value={formValues.dropoffDate}
                  onChange={handleChange}
                  min={formValues.pickupDate || new Date().toISOString().split('T')[0]}
                  className={errors.dropoffDate ? 'error' : ''}
                />
                {errors.dropoffDate && <div className="error-message">{errors.dropoffDate}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="dropoffTime">Dropoff Time</label>
                <input
                  type="time"
                  id="dropoffTime"
                  name="dropoffTime"
                  value={formValues.dropoffTime}
                  onChange={handleChange}
                  className={errors.dropoffTime ? 'error' : ''}
                />
                {errors.dropoffTime && <div className="error-message">{errors.dropoffTime}</div>}
              </div>
            </div>
            
            {estimatedCost !== null && (
              <div className="cost-summary">
                <div className="cost-item">
                  <span>Daily Rate:</span>
                  <span>₹{RATE_PER_DAY}</span>
                </div>
                <div className="cost-item">
                  <span>Estimated Total:</span>
                  <span className="total-cost">₹{estimatedCost}</span>
                </div>
              </div>
            )}
            
            <button type="submit" className="btn btn-primary btn-block">
              Confirm Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Bform;