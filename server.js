const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authController = require('./controllers/auth.controller');
require('dotenv').config();

const app = express();

// Update CORS configuration
app.use(cors({
  origin: 'http://localhost:5174', // Match your frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Reconnection handling
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Attempting to reconnect...');
  connectDB();
});

// Connect to MongoDB
connectDB();

// Use the auth controller for the Google auth route
app.post('/api/auth/google', authController.googleAuth);

const PORT = process.env.PORT || 5001; // Make sure this matches your vite.config.js proxy target

app.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try another port.`);
    process.exit(1);
  }
}); 