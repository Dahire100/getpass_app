const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  exitDate: { type: String, required: true },
  exitTime: { type: String, required: true },
  returnTime: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'expired', 'completed'], default: 'pending' },
  qrCode: { type: String }, // Can be short ID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pass', passSchema);
