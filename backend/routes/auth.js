const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gatepass_secret_key';

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, rollNo, idNumber } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name, email, password: hashedPassword, role, rollNo, idNumber
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ message: 'User not found in this role' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

// Update Profile Route
router.put('/profile/:id', verifyToken, async (req, res) => {
  try {
    // Security check: only allow updating own profile (or admin)
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ message: 'You can only update your own profile' });
    }

    const { name } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (name) user.name = name;
    await user.save();
    
    res.json({ message: 'Profile updated', user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
