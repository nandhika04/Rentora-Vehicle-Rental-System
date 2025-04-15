import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './bform.css';

const Bform = () => {
  const [formValues, setFormValues] = useState({
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(null);

  const RATE_PER_DAY = 1000;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formValues.pickupDate) {
      newErrors.pickupDate = 'Pick Up Date is required.';
      isValid = false;
    }

    if (!formValues.pickupTime) {
      newErrors.pickupTime = 'Pick Up Time is required.';
      isValid = false;
    }

    if (!formValues.dropoffDate) {
      newErrors.dropoffDate = 'Drop Off Date is required.';
      isValid = false;
    }

    if (!formValues.dropoffTime) {
      newErrors.dropoffTime = 'Drop Off Time is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateCost = () => {
    const pickupDateTime = new Date(`${formValues.pickupDate}T${formValues.pickupTime}`);
    const dropoffDateTime = new Date(`${formValues.dropoffDate}T${formValues.dropoffTime}`);

    if (pickupDateTime < dropoffDateTime) {
      const diffInMs = dropoffDateTime - pickupDateTime;
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      const cost = diffInDays * RATE_PER_DAY;
      setEstimatedCost(cost);
    } else {
      setEstimatedCost(null);
    }
  };

  useEffect(() => {
    if (
      formValues.pickupDate &&
      formValues.pickupTime &&
      formValues.dropoffDate &&
      formValues.dropoffTime
    ) {
      calculateCost();
    } else {
      setEstimatedCost(null);
    }
  }, [formValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    navigate('/bike');
  };

  return (
    <div className="bike-page">
      <div className="form-container">
        {isSubmitted ? (
          <div className="success-message">
            <h2>Booking Confirmed!</h2>
            <p>Your bike has been successfully booked. We've sent confirmation details to your email.</p>
            {estimatedCost && (
              <p className="estimated-cost">Total Cost: ₹{estimatedCost}</p>
            )}
            <button className="success-btn" onClick={handleReset}>
              Book Another Bike
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>Bike Booking Form</h2>

            <div className="form-group">
              <label htmlFor="pickupDate">Pick Up Date</label>
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                value={formValues.pickupDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.pickupDate && <div className="error-message">{errors.pickupDate}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="pickupTime">Pick Up Time</label>
              <input
                type="time"
                id="pickupTime"
                name="pickupTime"
                value={formValues.pickupTime}
                onChange={handleChange}
              />
              {errors.pickupTime && <div className="error-message">{errors.pickupTime}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="dropoffDate">Drop Off Date</label>
              <input
                type="date"
                id="dropoffDate"
                name="dropoffDate"
                value={formValues.dropoffDate}
                onChange={handleChange}
                min={formValues.pickupDate || new Date().toISOString().split('T')[0]}
              />
              {errors.dropoffDate && <div className="error-message">{errors.dropoffDate}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="dropoffTime">Drop Off Time</label>
              <input
                type="time"
                id="dropoffTime"
                name="dropoffTime"
                value={formValues.dropoffTime}
                onChange={handleChange}
              />
              {errors.dropoffTime && <div className="error-message">{errors.dropoffTime}</div>}
            </div>

            {estimatedCost !== null && (
              <div className="estimated-cost">
                Estimated Cost: ₹{estimatedCost}
              </div>
            )}

            <button type="submit" className="submit-btn">
              Confirm Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Bform;