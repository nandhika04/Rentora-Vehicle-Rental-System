const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  seats: {
    type: Number,
    required: true
  },
  fuel: {
    type: String,
    required: true
  },
  transmission: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  ac: {
    type: Boolean,
    default: true
  },
  availability: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', carSchema);
