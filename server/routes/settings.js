// Settings Routes
const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { authMiddleware } = require('../middleware');

// Get settings
router.get('/', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne({ key: 'relationship' });
        if (!settings) {
            // Create default settings
            settings = await SiteSettings.create({ key: 'relationship' });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update settings
router.put('/', authMiddleware, async (req, res) => {
    try {
        const settings = await SiteSettings.findOneAndUpdate(
            { key: 'relationship' },
            { ...req.body, updatedAt: Date.now() },
            { new: true, upsert: true }
        );
        res.json(settings);
    } catch (error) {
        console.error('Settings update error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
