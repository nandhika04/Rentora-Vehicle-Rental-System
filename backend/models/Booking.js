const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Could be Car or Bike, so we store the type too
  },
  vehicleType: {
    type: String,
    enum: ['car', 'bike'],
    required: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  pickupTime: {
    type: String,
    required: true
  },
  dropoffDate: {
    type: Date,
    required: true
  },
  dropoffTime: {
    type: String,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'active', 'pending_return', 'returned', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  preRentalInspection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DamageReport'
  },
  postRentalInspection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DamageReport'
  },
  penaltyAmount: {
    type: Number,
    default: 0
  },
  penaltyStatus: {
    type: String,
    enum: ['none', 'pending', 'paid'],
    default: 'none'
  }
}, {
  timestamps: true
});

// Generate unique booking ID before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);