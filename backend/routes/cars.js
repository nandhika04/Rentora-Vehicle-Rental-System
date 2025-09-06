const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Get all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new car
router.post('/', async (req, res) => {
  const car = new Car({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    limit: req.body.limit,
    seats: req.body.seats,
    fuel: req.body.fuel,
    transmission: req.body.transmission,
    type: req.body.type,
    ac: req.body.ac
  });

  try {
    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a car
router.put('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      car.name = req.body.name || car.name;
      car.price = req.body.price || car.price;
      car.image = req.body.image || car.image;
      car.limit = req.body.limit || car.limit;
      car.seats = req.body.seats || car.seats;
      car.fuel = req.body.fuel || car.fuel;
      car.transmission = req.body.transmission || car.transmission;
      car.type = req.body.type || car.type;
      car.ac = req.body.ac !== undefined ? req.body.ac : car.ac;

      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a car
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      await car.remove();
      res.json({ message: 'Car deleted' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
