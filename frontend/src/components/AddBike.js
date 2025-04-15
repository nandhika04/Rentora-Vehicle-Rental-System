// src/components/AddBike.js
import React, { useState } from 'react';
import axios from 'axios';

const AddBike = () => {
  const [bikeData, setBikeData] = useState({
    name: '',
    type: '',
    hourlyRate: '',
    availability: true,
    image: null,
    seatCount: '',
    kmLimit: '',
    fuelIncluded: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setBikeData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in bikeData) {
      formData.append(key, bikeData[key]);
    }

    try {
      await axios.post('http://localhost:5000/api/bikes/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Bike added successfully');
      setBikeData({
        name: '',
        type: '',
        hourlyRate: '',
        availability: true,
        image: null,
        seatCount: '',
        kmLimit: '',
        fuelIncluded: false,
      });
    } catch (error) {
      console.error('Error adding bike:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Add a New Bike</h2>
      <label>
        Name:
        <input type="text" name="name" value={bikeData.name} onChange={handleChange} required />
      </label>
      <label>
        Type:
        <input type="text" name="type" value={bikeData.type} onChange={handleChange} required />
      </label>
      
      <label>
        Availability:
        <input type="checkbox" name="availability" checked={bikeData.availability} onChange={handleChange} />
      </label>
      <label>
        Image:
        <input type="file" name="image" onChange={handleChange} required />
      </label>
      <label>
        Seat Count:
        <input type="number" name="seatCount" value={bikeData.seatCount} onChange={handleChange} required />
      </label>
      <label>
        Kilometer Limit:
        <input type="number" name="kmLimit" value={bikeData.kmLimit} onChange={handleChange} required />
      </label>
      <label>
        Fuel Included:
        <input type="checkbox" name="fuelIncluded" checked={bikeData.fuelIncluded} onChange={handleChange} />
      </label>
      <button type="submit">Add Bike</button>
    </form>
  );
};

export default AddBike;
