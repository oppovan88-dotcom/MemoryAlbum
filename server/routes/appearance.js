// Appearance Settings Routes - Full Frontend Configuration
const express = require('express');
const router = express.Router();
const AppearanceSettings = require('../models/AppearanceSettings');

// JSON fields that need to be parsed/stringified
const jsonFields = ['navItems', 'statsCards', 'icons', 'messages', 'settingsFields', 'timeOptions'];

// Parse JSON fields from database to objects
const parseJsonFields = (settings) => {
    const parsed = settings.toObject ? settings.toObject() : { ...settings };
    jsonFields.forEach(field => {
        if (parsed[field] && typeof parsed[field] === 'string') {
            try {
                parsed[field] = JSON.parse(parsed[field]);
            } catch (e) {
                console.error(`Error parsing ${field}:`, e);
            }
        }
    });
    return parsed;
};

// Stringify JSON fields for database storage
const stringifyJsonFields = (data) => {
    const stringified = { ...data };
    jsonFields.forEach(field => {
        if (stringified[field] && typeof stringified[field] !== 'string') {
            stringified[field] = JSON.stringify(stringified[field]);
        }
    });
    return stringified;
};

// GET appearance settings
router.get('/', async (req, res) => {
    try {
        let settings = await AppearanceSettings.findOne({ key: 'appearance' });
        if (!settings) {
            settings = await AppearanceSettings.create({ key: 'appearance' });
        }
        res.json(parseJsonFields(settings));
    } catch (error) {
        console.error('Error fetching appearance settings:', error);
        res.status(500).json({ error: 'Failed to fetch appearance settings' });
    }
});

// PUT update appearance settings
router.put('/', async (req, res) => {
    try {
        const updateData = stringifyJsonFields({ ...req.body, updatedAt: Date.now() });

        let settings = await AppearanceSettings.findOneAndUpdate(
            { key: 'appearance' },
            updateData,
            { new: true, upsert: true }
        );

        res.json(parseJsonFields(settings));
    } catch (error) {
        console.error('Error updating appearance settings:', error);
        res.status(500).json({ error: 'Failed to update appearance settings' });
    }
});

// POST add navigation item
router.post('/nav-item', async (req, res) => {
    try {
        const { id, icon, label } = req.body;
        if (!id || !label) {
            return res.status(400).json({ error: 'ID and label are required' });
        }

        let settings = await AppearanceSettings.findOne({ key: 'appearance' });
        if (!settings) {
            settings = await AppearanceSettings.create({ key: 'appearance' });
        }

        const navItems = JSON.parse(settings.navItems || '[]');
        navItems.push({ id, icon: icon || '📌', label });

        settings.navItems = JSON.stringify(navItems);
        settings.updatedAt = Date.now();
        await settings.save();

        res.json({ navItems });
    } catch (error) {
        console.error('Error adding nav item:', error);
        res.status(500).json({ error: 'Failed to add nav item' });
    }
});

// DELETE navigation item
router.delete('/nav-item/:id', async (req, res) => {
    try {
        let settings = await AppearanceSettings.findOne({ key: 'appearance' });
        if (!settings) {
            return res.status(404).json({ error: 'Settings not found' });
        }

        const navItems = JSON.parse(settings.navItems || '[]');
        const filtered = navItems.filter(item => item.id !== req.params.id);

        settings.navItems = JSON.stringify(filtered);
        settings.updatedAt = Date.now();
        await settings.save();

        res.json({ navItems: filtered });
    } catch (error) {
        console.error('Error deleting nav item:', error);
        res.status(500).json({ error: 'Failed to delete nav item' });
    }
});

// PUT reorder navigation items
router.put('/nav-items/reorder', async (req, res) => {
    try {
        const { navItems } = req.body;
        if (!Array.isArray(navItems)) {
            return res.status(400).json({ error: 'Invalid navItems array' });
        }

        let settings = await AppearanceSettings.findOne({ key: 'appearance' });
        if (!settings) {
            return res.status(404).json({ error: 'Settings not found' });
        }

        settings.navItems = JSON.stringify(navItems);
        settings.updatedAt = Date.now();
        await settings.save();

        res.json({ navItems });
    } catch (error) {
        console.error('Error reordering nav items:', error);
        res.status(500).json({ error: 'Failed to reorder nav items' });
    }
});

module.exports = router;
