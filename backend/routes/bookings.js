const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Bike = require('../models/Bike');
const auth = require('../middleware/auth');

// Create a new booking
router.post('/', auth.authenticate, async (req, res) => {
  try {
    console.log('Booking request received:', req.body);
    console.log('User making request:', req.user._id);

    const { vehicleId, vehicleType, pickupDate, pickupTime, dropoffDate, dropoffTime, totalCost } = req.body;

    // Validate required fields
    if (!vehicleId || !vehicleType || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime || totalCost === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: vehicleId, vehicleType, pickupDate, pickupTime, dropoffDate, dropoffTime, totalCost'
      });
    }

    if (!['car', 'bike'].includes(vehicleType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle type. Must be car or bike'
      });
    }

    // Check vehicle availability
    console.log('Looking for vehicle:', { vehicleId, vehicleType });

    let vehicle;
    if (vehicleType === 'car') {
      vehicle = await Car.findById(vehicleId);
      console.log('Car lookup result:', vehicle);
    } else {
      vehicle = await Bike.findById(vehicleId);
      console.log('Bike lookup result:', vehicle);
    }

    if (!vehicle) {
      console.log('Vehicle not found');
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (!vehicle.availability) {
      console.log('Vehicle not available:', vehicle.availability);
      return res.status(400).json({
        success: false,
        message: 'Vehicle is not available for booking'
      });
    }

    // Convert date strings to Date objects
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const dropoffDateTime = new Date(`${dropoffDate}T${dropoffTime}`);

    // Validate dates
    if (isNaN(pickupDateTime.getTime()) || isNaN(dropoffDateTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date or time format'
      });
    }

    if (pickupDateTime >= dropoffDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Pickup date/time must be before dropoff date/time'
      });
    }

    // Generate unique booking ID
    const bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create booking
    const booking = new Booking({
      bookingId,
      customer: req.user._id, // Fixed: use _id instead of id
      vehicle: vehicleId,
      vehicleType,
      pickupDate: pickupDateTime,
      pickupTime,
      dropoffDate: dropoffDateTime,
      dropoffTime,
      totalCost
    });

    console.log('About to save booking:', booking);

    try {
      await booking.save();
      console.log('Booking saved successfully:', booking);
    } catch (saveError) {
      console.error('Booking save error:', saveError);
      return res.status(400).json({
        success: false,
        message: 'Booking validation failed',
        error: saveError.message
      });
    }

    // Mark vehicle as unavailable
    if (vehicleType === 'car') {
      await Car.findByIdAndUpdate(vehicleId, { availability: false });
    } else {
      await Bike.findByIdAndUpdate(vehicleId, { availability: false });
    }

    res.status(201).json({
      success: true,
      booking: booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get user's bookings
router.get('/my-bookings', auth.authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('vehicle', 'name image')
      .populate('preRentalInspection')
      .populate('postRentalInspection')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by ID
router.get('/:id', auth.authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'username email')
      .populate('vehicle')
      .populate('preRentalInspection')
      .populate('postRentalInspection');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is customer or admin
    if (booking.customer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (for customers to return vehicles and admins to manage bookings)
router.patch('/:id/status', auth.authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'pending_return', 'returned', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id).populate('vehicle');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions: admins can update any booking, customers can only update their own
    const isAdmin = req.user.role === 'admin' || req.user.role === 'staff';
    const isBookingOwner = booking.customer.toString() === req.user._id.toString();

    if (!isAdmin && !isBookingOwner) {
      return res.status(403).json({ message: 'Access denied: You can only return your own bookings' });
    }

    // Additional validation for customers: can only change status to 'pending_return' from 'active'
    if (!isAdmin && status === 'pending_return' && booking.status !== 'active') {
      return res.status(400).json({ message: 'Can only initiate return for active bookings' });
    }

    // Additional validation for admins: can only activate confirmed bookings
    if (isAdmin && status === 'active' && booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Can only activate confirmed bookings' });
    }

    // Update booking status
    booking.status = status;
    await booking.save();

    // If booking is completed and no penalty, mark vehicle as available
    if (status === 'completed' && booking.penaltyStatus !== 'pending') {
      if (booking.vehicleType === 'car') {
        await Car.findByIdAndUpdate(booking.vehicle, { availability: true });
      } else {
        await Bike.findByIdAndUpdate(booking.vehicle, { availability: true });
      }
    }

    res.json({
      success: true,
      booking,
      message: status === 'pending_return' ? 'Vehicle return initiated. Staff will inspect it soon.' :
              status === 'active' ? 'Booking activated successfully. Customer can now return the vehicle.' :
              'Booking status updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings (admin only)
router.get('/', auth.authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const bookings = await Booking.find()
      .populate('customer', 'username email')
      .populate('vehicle', 'name')
      .populate('preRentalInspection')
      .populate('postRentalInspection')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;