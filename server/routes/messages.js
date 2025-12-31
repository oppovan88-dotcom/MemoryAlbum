// Message Routes
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { authMiddleware } = require('../middleware');

// Get all messages
router.get('/', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create message
router.post('/', async (req, res) => {
    try {
        console.log('📥 POST /api/messages - Body:', req.body);
        const message = await Message.create(req.body);
        console.log('✅ Message created:', message._id);
        res.status(201).json(message);
    } catch (error) {
        console.error('❌ Message creation error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

// Mark message as read
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete message
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
