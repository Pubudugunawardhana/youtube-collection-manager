const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serverless MongoDB Connection Middleware
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
