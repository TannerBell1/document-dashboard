const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const analyticsRoutes = require('./routes/analytics');
require('dotenv').config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// use auth routes
app.use('/api/auth', authRoutes);

// use document routes
app.use('/api/documents', documentRoutes);

// use analytics routes
app.use('/api/analytics', analyticsRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

module.exports = app;