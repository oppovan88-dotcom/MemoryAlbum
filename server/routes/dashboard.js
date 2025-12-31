// Dashboard Routes
const express = require('express');
const router = express.Router();
const { Memory, Message, Visitor } = require('../models');
const { authMiddleware } = require('../middleware');

// Dashboard Stats
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalMemories = await Memory.countDocuments();
        const totalMessages = await Message.countDocuments();
        const unreadMessages = await Message.countDocuments({ isRead: false });
        const todayVisitors = await Visitor.countDocuments({ visitedAt: { $gte: today } });
        const totalVisitors = await Visitor.countDocuments();

        // Get last 7 days stats
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            const visitors = await Visitor.countDocuments({
                visitedAt: { $gte: date, $lt: nextDay }
            });

            last7Days.push({
                date: date.toISOString().split('T')[0],
                visitors
            });
        }

        // Recent messages
        const recentMessages = await Message.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalMemories,
            totalMessages,
            unreadMessages,
            todayVisitors,
            totalVisitors,
            last7Days,
            recentMessages
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
