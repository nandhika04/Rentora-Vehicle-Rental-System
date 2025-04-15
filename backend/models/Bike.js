const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  seatCount: { type: Number, default: 2 },
  kilometerLimit: { type: Number, default: 100 },
  fuelIncluded: { type: Boolean, default: false },
  imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('Bike', bikeSchema);
