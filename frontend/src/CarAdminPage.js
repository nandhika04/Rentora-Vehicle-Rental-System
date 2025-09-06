import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import axios from 'axios';

const CarAdminPage = () => {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    price: '',
    image: '',
    limit: '',
    seats: '',
    fuel: '',
    transmission: '',
    type: '',
    ac: true
  });
  const [editing, setEditing] = useState(false);
  const back = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  // Fetch cars on mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${back}/api/cars`);
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    fetchCars();
  }, [back]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${back}/api/cars`, formData);
      setCars([...cars, response.data]);
      resetForm();
    } catch (error) {
      console.error('Error adding car:', error);
    }
  };

  const handleEditCar = (car) => {
    setFormData(car);
    setEditing(true);
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${back}/api/cars/${formData._id}`, formData);
      setCars(cars.map(car => car._id === formData._id ? formData : car));
      resetForm();
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  const handleDeleteCar = async (_id) => {
    try {
      await axios.delete(`${back}/api/cars/${_id}`);
      setCars(cars.filter(car => car._id !== _id));
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      _id: '',
      name: '',
      price: '',
      image: '',
      limit: '',
      seats: '',
      fuel: '',
      transmission: '',
      type: '',
      ac: true
    });
    setEditing(false);
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Car Management</h1>

      <div className="admin-container">
        {/* Form */}
        <form
          onSubmit={editing ? handleUpdateCar : handleAddCar}
          className="admin-form"
        >
          <h2>{editing ? 'Edit Car' : 'Add New Car'}</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Car Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Price (₹/day)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Daily Limit (km)</label>
              <input
                type="number"
                name="limit"
                value={formData.limit}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Seats</label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fuel Type</label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                required
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Transmission</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
              >
                <option value="">Select Transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
            <div className="form-group">
              <label>Car Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Car Type</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="MUV">MUV</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div className="form-group">
              <label>AC Available</label>
              <input
                type="checkbox"
                name="ac"
                checked={formData.ac}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editing ? 'Update Car' : 'Add Car'}
            </button>
            {editing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Car List */}
        <div className="bike-list-container">
          <h2>Current Car Inventory</h2>
          {cars.length === 0 ? (
            <p className="no-bikes">No cars available. Add one to get started.</p>
          ) : (
            <div className="bike-list">
              {cars.map((car) => (
                <div key={car._id} className="bike-card">
                  <div className="bike-card-header">
                    <img src={car.image} alt={car.name} />
                    <h3>{car.name}</h3>
                  </div>
                  <div className="bike-card-details">
                    <p><span>Price:</span> ₹{car.price}/day</p>
                    <p><span>Limit:</span> {car.limit} km/day</p>
                    <p><span>Seats:</span> {car.seats}</p>
                    <p><span>Fuel:</span> {car.fuel}</p>
                    <p><span>Transmission:</span> {car.transmission}</p>
                    <p><span>Type:</span> {car.type}</p>
                    <p><span>AC:</span> {car.ac ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="bike-card-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEditCar(car)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteCar(car._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarAdminPage;