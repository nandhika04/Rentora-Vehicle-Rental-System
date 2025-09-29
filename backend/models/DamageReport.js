const mongoose = require('mongoose');

const damageReportSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  type: {
    type: String,
    enum: ['pre-rental', 'post-rental'],
    required: true
  },
  photos: [{
    angle: {
      type: String,
      enum: ['main'], // Single inspection photo
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  aiAnalysis: {
    detectedDamages: [{
      location: String,
      description: String,
      severity: {
        type: String,
        enum: ['minor', 'moderate', 'severe']
      }
    }],
    overallAssessment: String
  },
  staffReview: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    confirmedDamages: [{
      location: String,
      description: String,
      severity: String,
      repairCost: Number
    }],
    totalRepairCost: {
      type: Number,
      default: 0
    },
    notes: String,
    reviewedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'reviewed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DamageReport', damageReportSchema);