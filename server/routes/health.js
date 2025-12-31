// Health Check Routes
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Health Check
router.get('/', (req, res) => {
    res.json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
