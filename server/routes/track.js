// Visitor/Tracking Routes
const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// Track visitor
router.post('/', async (req, res) => {
    try {
        const { page, userAgent } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        await Visitor.create({ ip, userAgent, page });
        res.json({ success: true });
    } catch (error) {
        console.error('Track error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
