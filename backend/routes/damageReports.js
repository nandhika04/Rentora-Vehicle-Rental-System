const express = require('express');
const router = express.Router();
const DamageReport = require('../models/DamageReport');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Create a new damage report
router.post('/', auth.authenticate, async (req, res) => {
  try {
    const { bookingId, type, photos } = req.body;

    // Validate input
    if (!bookingId || !type || !photos) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingId, type, and photos'
      });
    }

    if (!['pre-rental', 'post-rental'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid inspection type. Must be pre-rental or post-rental'
      });
    }

    // Validate photos array
    if (!Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Photos must be a non-empty array'
      });
    }

    // Validate single photo
    if (!Array.isArray(photos) || photos.length !== 1) {
      return res.status(400).json({
        success: false,
        message: 'Exactly one inspection photo is required'
      });
    }

    const photo = photos[0];
    if (!photo.angle || !photo.url) {
      return res.status(400).json({
        success: false,
        message: 'Photo must have angle and url fields'
      });
    }

    // Allow 'main' as the angle for single photo
    if (photo.angle !== 'main') {
      return res.status(400).json({
        success: false,
        message: 'Photo angle must be "main"'
      });
    }

    // Check if booking exists and user has access
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only admin can create both pre-rental and post-rental inspections
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only administrators can create inspection reports'
      });
    }

    // Create damage report
    const damageReport = new DamageReport({
      booking: bookingId,
      type,
      photos
    });

    await damageReport.save();

    // Link to booking
    if (type === 'pre-rental') {
      await Booking.findByIdAndUpdate(bookingId, { preRentalInspection: damageReport._id });
    } else {
      await Booking.findByIdAndUpdate(bookingId, { postRentalInspection: damageReport._id });
    }

    res.status(201).json({
      success: true,
      damageReport: damageReport,
      message: 'Damage report created successfully'
    });
  } catch (error) {
    console.error('Damage report creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get damage report by ID
router.get('/:id', auth.authenticate, async (req, res) => {
  try {
    const damageReport = await DamageReport.findById(req.params.id)
      .populate('booking')
      .populate('staffReview.reviewedBy', 'username');

    if (!damageReport) {
      return res.status(404).json({ message: 'Damage report not found' });
    }

    // Check access
    const booking = await Booking.findById(damageReport.booking);
    if (booking.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ damageReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update damage report with AI analysis
router.patch('/:id/analysis', auth.authenticate, async (req, res) => {
  try {
    const { aiAnalysis } = req.body;

    const damageReport = await DamageReport.findByIdAndUpdate(
      req.params.id,
      {
        aiAnalysis,
        status: 'analyzed'
      },
      { new: true }
    );

    if (!damageReport) {
      return res.status(404).json({ message: 'Damage report not found' });
    }

    res.json({ damageReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin review damage report
router.patch('/:id/review', auth.authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { confirmedDamages, totalRepairCost, notes } = req.body;

    const damageReport = await DamageReport.findByIdAndUpdate(
      req.params.id,
      {
        'staffReview.reviewedBy': req.user._id,
        'staffReview.confirmedDamages': confirmedDamages,
        'staffReview.totalRepairCost': totalRepairCost,
        'staffReview.notes': notes,
        'staffReview.reviewedAt': new Date(),
        status: 'reviewed'
      },
      { new: true }
    ).populate('booking');

    if (!damageReport) {
      return res.status(404).json({ message: 'Damage report not found' });
    }

    // If this is post-rental inspection with damages, update booking penalty
    if (damageReport.type === 'post-rental' && totalRepairCost > 0) {
      await Booking.findByIdAndUpdate(damageReport.booking, {
        penaltyAmount: totalRepairCost,
        penaltyStatus: 'pending',
        status: 'returned'
      });
    }

    res.json({ damageReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Customer pays their own penalty
router.patch('/:id/pay-penalty', auth.authenticate, async (req, res) => {
  try {
    const damageReport = await DamageReport.findById(req.params.id).populate('booking');

    if (!damageReport) {
      return res.status(404).json({ message: 'Damage report not found' });
    }

    // Only customer can pay their own penalty
    if (damageReport.booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update booking
    await Booking.findByIdAndUpdate(damageReport.booking._id, {
      penaltyStatus: 'paid',
      status: 'completed'
    });

    // Mark vehicle as available
    if (damageReport.booking.vehicleType === 'car') {
      const Car = require('../models/Car');
      await Car.findByIdAndUpdate(damageReport.booking.vehicle, { availability: true });
    } else {
      const Bike = require('../models/Bike');
      await Bike.findByIdAndUpdate(damageReport.booking.vehicle, { availability: true });
    }

    res.json({ message: 'Penalty paid successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin marks penalty as paid (for any customer)
router.patch('/:id/admin-mark-paid', auth.authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const damageReport = await DamageReport.findById(req.params.id).populate('booking');

    if (!damageReport) {
      return res.status(404).json({ message: 'Damage report not found' });
    }

    // Update booking
    await Booking.findByIdAndUpdate(damageReport.booking._id, {
      penaltyStatus: 'paid',
      status: 'completed'
    });

    // Mark vehicle as available
    if (damageReport.booking.vehicleType === 'car') {
      const Car = require('../models/Car');
      await Car.findByIdAndUpdate(damageReport.booking.vehicle, { availability: true });
    } else {
      const Bike = require('../models/Bike');
      await Bike.findByIdAndUpdate(damageReport.booking.vehicle, { availability: true });
    }

    res.json({ message: 'Penalty marked as paid by admin successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;