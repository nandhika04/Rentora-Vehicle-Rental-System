// backend/routes/bikes.js
const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');

// Route to add a new bike
router.post('/add', async (req, res) => {
  try {
    const { name, type, hourlyRate, availability } = req.body;
    const newBike = new Bike({ name, type, hourlyRate, availability });
    await newBike.save();
    res.status(201).json({ message: 'Bike added successfully', bike: newBike });
  } catch (error) {
    res.status(400).json({ message: 'Error adding bike', error: error.message });
  }
});

module.exports = router;
