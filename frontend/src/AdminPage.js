import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import axios from 'axios';

const AdminPage = () => {
  const [bikes, setBikes] = useState([]);
  const [formData, setFormData] = useState({ _id: '', name: '', price: '', image: '', limit: '', seats: '', fuel: '' });
  const [editing, setEditing] = useState(false);

  const back = process.env.REACT_APP_BACKEND_URL;

  // Fetch bikes from the database
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await axios.get(back + '/api/bikes');
        setBikes(response.data);
      } catch (error) {
        console.error('Error fetching bikes:', error);
      }
    };
    fetchBikes();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update bike
  const handleAddBike = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(back + '/api/bikes', formData);
      setBikes([...bikes, response.data]);
      setFormData({ _id: '', name: '', price: '', image: '', limit: '', seats: '', fuel: '' });
    } catch (error) {
      console.error('Error adding bike:', error);
    }
  };

  // Edit a bike
  const handleEditBike = (bike) => {
    setFormData(bike);
    setEditing(true);
  };

  const handleUpdateBike = async (e) => {
    e.preventDefault();
    try {
      await axios.put(back + `/api/bikes/${formData._id}`, formData);
      setBikes(
        bikes.map((bike) =>
          bike._id === formData._id ? { ...bike, ...formData } : bike
        )
      );
      setEditing(false);
      setFormData({ _id: '', name: '', price: '', image: '', limit: '', seats: '', fuel: '' });
    } catch (error) {
      console.error('Error updating bike:', error);
    }
  };

  // Delete a bike
  const handleDeleteBike = async (_id) => {
    try {
      await axios.delete(back + `/api/bikes/${_id}`);
      setBikes(bikes.filter((bike) => bike._id !== _id));
    } catch (error) {
      console.error('Error deleting bike:', error);
    }
  };

  return (
    <div className="bike-management">
      <h1>Bike Management</h1>

      <form
        onSubmit={editing ? handleUpdateBike : handleAddBike}
        className="bike-form"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Bike Name"
          required
        />
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Bike Price"
          required
        />
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          required
        />
        <input
          type="text"
          name="limit"
          value={formData.limit}
          onChange={handleChange}
          placeholder="Limit"
          required
        />
        <input
          type="text"
          name="seats"
          value={formData.seats}
          onChange={handleChange}
          placeholder="Seats"
          required
        />
        <input
          type="text"
          name="fuel"
          value={formData.fuel}
          onChange={handleChange}
          placeholder="Fuel"
          required
        />
        <button type="submit">{editing ? 'Update Bike' : 'Add Bike'}</button>
      </form>

      <div className="bike-list">
        {bikes.map((bike) => (
          <div key={bike._id} className="bike-card">
            <h3>{bike.name}</h3>
            <p>Price: ₹{bike.price}</p>
            {/* Only show Name, Price and Buttons */}
            <div className="button-container">
              <button className="edit-button" onClick={() => handleEditBike(bike)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteBike(bike._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;