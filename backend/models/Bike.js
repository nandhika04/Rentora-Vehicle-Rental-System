const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true }, // Changed from hourlyRate to price
  availability: { type: Boolean, default: true },
  seats: { type: Number, default: 2 }, // Changed from seatCount to seats
  limit: { type: Number, default: 100 }, // Changed from kilometerLimit to limit
  fuel: { type: String, default: 'Petrol' }, // Changed from fuelIncluded to fuel
  image: { type: String, required: true }, // Changed from imageUrl to image
  ac: { type: Boolean, default: false } // Added for consistency with cars
});

module.exports = mongoose.model('Bike', bikeSchema);
