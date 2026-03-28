const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gatepass_secret_key';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No Auth Token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Apply for Pass
router.post('/apply', verifyToken, async (req, res) => {
  try {
    const { reason, exitDate, exitTime, returnTime } = req.body;
    const pass = new Pass({
      userId: req.user.id,
      reason,
      exitDate,
      exitTime,
      returnTime,
      qrCode: `PASS-${Math.random().toString(36).substring(7).toUpperCase()}`
    });
    await pass.save();
    res.status(201).json({ message: 'Pass applied successfully!', pass });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Pass History (for student)
router.get('/history', verifyToken, async (req, res) => {
  try {
    const passes = await Pass.find({ userId: req.user.id }).sort('-createdAt');
    res.json(passes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin/Guard: Get all passes
router.get('/all', verifyToken, async (req, res) => {
  try {
    // Populate user info if desired, assuming user model is 'User'
    const passes = await Pass.find().sort('-createdAt').populate('userId', 'name email rollNo role');
    res.json(passes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin/Guard: Update pass status
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const pass = await Pass.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!pass) return res.status(404).json({ message: 'Pass not found' });
    res.json({ message: 'Pass updated successfully', pass });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Pass by QR Code or Manual ID
router.get('/verify/:qrCode', verifyToken, async (req, res) => {
  try {
    const pass = await Pass.findOne({ qrCode: req.params.qrCode }).populate('userId', 'name email rollNo role');
    if (!pass) return res.status(404).json({ message: 'Pass not found' });
    res.json(pass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
