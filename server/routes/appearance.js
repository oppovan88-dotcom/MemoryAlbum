// Appearance Settings Routes
const express = require('express');
const router = express.Router();
const AppearanceSettings = require('../models/AppearanceSettings');

// Default appearance settings
const defaultAppearance = {
    key: 'appearance',
    appName: 'Memory Album',
    appShortName: 'M',
    appDescription: 'Admin Dashboard',
    colorPrimary: '#6366f1',
    colorPrimaryDark: '#8b5cf6',
    colorSecondary: '#10b981',
    colorAccent: '#ec4899',
    colorWarning: '#f59e0b',
    colorDanger: '#ef4444',
    colorSuccess: '#22c55e',
    colorDark: '#1e293b',
    colorDarker: '#0f172a',
    colorLight: '#f8fafc',
    navItems: JSON.stringify([
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'memories', icon: '📷', label: 'Memories' },
        { id: 'timeline', icon: '💖', label: 'Timeline' },
        { id: 'messages', icon: '💬', label: 'Messages' },
        { id: 'settings', icon: '⚙️', label: 'Settings' },
        { id: 'appearance', icon: '🎨', label: 'Appearance' },
    ]),
    statsCards: JSON.stringify([
        { key: 'totalMemories', icon: '📷', label: 'Memories', color: '#6366f1' },
        { key: 'totalVisitors', icon: '👥', label: 'Visitors', color: '#10b981', subKey: 'todayVisitors', subLabel: 'today' },
        { key: 'totalMessages', icon: '💬', label: 'Messages', color: '#f59e0b', subKey: 'unreadMessages', subLabel: 'unread' },
        { key: 'todayVisitors', icon: '📈', label: 'Today', color: '#ec4899' },
    ]),
    icons: JSON.stringify({
        loading: '📷',
        memories: '📷',
        messages: '💬',
        timeline: '💕',
        settings: '⚙️',
        add: '➕',
        edit: '✏️',
        delete: '🗑️',
        save: '💾',
        logout: '🚪',
        search: '🔍',
        heart: '💖',
    }),
};

// GET appearance settings
router.get('/', async (req, res) => {
    try {
        let settings = await AppearanceSettings.findOne({ key: 'appearance' });
        if (!settings) {
            settings = await AppearanceSettings.create(defaultAppearance);
        }

        // Parse JSON strings to objects for frontend
        const response = {
            ...settings.toObject(),
            navItems: JSON.parse(settings.navItems || '[]'),
            statsCards: JSON.parse(settings.statsCards || '[]'),
            icons: JSON.parse(settings.icons || '{}'),
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching appearance settings:', error);
        res.status(500).json({ error: 'Failed to fetch appearance settings' });
    }
});

// PUT update appearance settings
router.put('/', async (req, res) => {
    try {
        const updateData = { ...req.body, updatedAt: Date.now() };

        // Stringify arrays/objects before saving
        if (typeof updateData.navItems !== 'string') {
            updateData.navItems = JSON.stringify(updateData.navItems);
        }
        if (typeof updateData.statsCards !== 'string') {
            updateData.statsCards = JSON.stringify(updateData.statsCards);
        }
        if (typeof updateData.icons !== 'string') {
            updateData.icons = JSON.stringify(updateData.icons);
        }

        let settings = await AppearanceSettings.findOneAndUpdate(
            { key: 'appearance' },
            updateData,
            { new: true, upsert: true }
        );

        // Parse JSON strings to objects for response
        const response = {
            ...settings.toObject(),
            navItems: JSON.parse(settings.navItems || '[]'),
            statsCards: JSON.parse(settings.statsCards || '[]'),
            icons: JSON.parse(settings.icons || '{}'),
        };

        res.json(response);
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
            settings = await AppearanceSettings.create(defaultAppearance);
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

module.exports = router;
