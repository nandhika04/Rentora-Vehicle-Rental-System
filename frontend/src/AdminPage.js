import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import axios from 'axios';

const AdminPage = () => {
  const [bikes, setBikes] = useState([]);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    price: '',
    image: '',
    limit: '',
    seats: '',
    fuel: ''
  });
  const [editing, setEditing] = useState(false);
  const back = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await axios.get(`${back}/api/bikes`);
        setBikes(response.data);
      } catch (error) {
        console.error('Error fetching bikes:', error);
      }
    };
    fetchBikes();
  }, [back]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddBike = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(back + '/api/bikes', formData);
      setBikes([...bikes, response.data]);
      resetForm();
    } catch (error) {
      console.error('Error adding bike:', error);
    }
  };

  const handleEditBike = (bike) => {
    setFormData(bike);
    setEditing(true);
  };

  const handleUpdateBike = async (e) => {
    e.preventDefault();
    try {
      await axios.put(back + `/api/bikes/${formData._id}`, formData);
      setBikes(bikes.map(bike => bike._id === formData._id ? formData : bike));
      resetForm();
    } catch (error) {
      console.error('Error updating bike:', error);
    }
  };

  const handleDeleteBike = async (_id) => {
    try {
      await axios.delete(back + `/api/bikes/${_id}`);
      setBikes(bikes.filter(bike => bike._id !== _id));
    } catch (error) {
      console.error('Error deleting bike:', error);
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
      fuel: ''
    });
    setEditing(false);
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Bike Management</h1>

      <div className="admin-container">
        <form
          onSubmit={editing ? handleUpdateBike : handleAddBike}
          className="admin-form"
        >
          <h2>{editing ? 'Edit Bike' : 'Add New Bike'}</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Bike Name</label>
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
                type="text"
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
                type="text"
                name="limit"
                value={formData.limit}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Seats</label>
              <input
                type="text"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fuel Type</label>
              <input
                type="text"
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editing ? 'Update Bike' : 'Add Bike'}
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

        <div className="bike-list-container">
          <h2>Current Bike Inventory</h2>
          {bikes.length === 0 ? (
            <p className="no-bikes">No bikes available. Add one to get started.</p>
          ) : (
            <div className="bike-list">
              {bikes.map((bike) => (
                <div key={bike._id} className="bike-card">
                  <div className="bike-card-header">
                    <img src={bike.image} alt={bike.name} />
                    <h3>{bike.name}</h3>
                  </div>
                  <div className="bike-card-details">
                    <p><span>Price:</span> ₹{bike.price}/day</p>
                    <p><span>Limit:</span> {bike.limit} km/day</p>
                    <p><span>Seats:</span> {bike.seats}</p>
                    <p><span>Fuel:</span> {bike.fuel}</p>
                  </div>
                  <div className="bike-card-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEditBike(bike)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteBike(bike._id)}
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
  // ... rest of your AdminPage component code remains the same ...
};

export default AdminPage;