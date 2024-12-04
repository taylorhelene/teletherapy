const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionType: { type: String, required: true },
  startDate: { type: Date, required: true },
  duration: { type: Number }, // in minutes
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
  sessionCount: { type: Number, default: 0 }, // Tracks sessions completed by the user
  paid: { type: Boolean, default: false },   // Tracks if the user has paid for additional sessions
});

module.exports = mongoose.model('Session', SessionSchema);
