// backend/routes/bikes.js
const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');

// Get all bikes
router.get('/', async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new bike
router.post('/', async (req, res) => {
  const bike = new Bike({
    name: req.body.name,
    type: req.body.type,
    price: req.body.price,
    image: req.body.image,
    limit: req.body.limit,
    seats: req.body.seats,
    fuel: req.body.fuel,
    ac: req.body.ac
  });

  try {
    const newBike = await bike.save();
    res.status(201).json(newBike);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a bike
router.put('/:id', async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (bike) {
      bike.name = req.body.name || bike.name;
      bike.type = req.body.type || bike.type;
      bike.price = req.body.price || bike.price;
      bike.image = req.body.image || bike.image;
      bike.limit = req.body.limit || bike.limit;
      bike.seats = req.body.seats || bike.seats;
      bike.fuel = req.body.fuel || bike.fuel;
      bike.ac = req.body.ac !== undefined ? req.body.ac : bike.ac;

      const updatedBike = await bike.save();
      res.json(updatedBike);
    } else {
      res.status(404).json({ message: 'Bike not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a bike
router.delete('/:id', async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (bike) {
      await bike.remove();
      res.json({ message: 'Bike deleted' });
    } else {
      res.status(404).json({ message: 'Bike not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
