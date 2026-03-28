require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected!'))
  .catch((err) => console.error('❌ Atlas connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const passRoutes = require('./routes/passes');

app.use('/api/auth', authRoutes);
app.use('/api/passes', passRoutes);

app.get('/', (req, res) => {
  res.send('Gatepass API is Running 🚀');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
