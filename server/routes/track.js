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

// Get analytics statistics
router.get('/analytics', async (req, res) => {
    try {
        const { startDate, endDate, page } = req.query;

        // Build query filter
        const filter = {};
        if (startDate || endDate) {
            filter.visitedAt = {};
            if (startDate) filter.visitedAt.$gte = new Date(startDate);
            if (endDate) filter.visitedAt.$lte = new Date(endDate);
        }
        if (page) filter.page = page;

        // Get total visits
        const totalVisits = await Visitor.countDocuments(filter);

        // Get unique visitors (by IP)
        const uniqueVisitors = await Visitor.distinct('ip', filter);

        // Get visits by page
        const visitsByPage = await Visitor.aggregate([
            { $match: filter },
            { $group: { _id: '$page', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get visits by date (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const visitsByDate = await Visitor.aggregate([
            {
                $match: {
                    visitedAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get recent visits
        const recentVisits = await Visitor.find(filter)
            .sort({ visitedAt: -1 })
            .limit(10)
            .select('page ip visitedAt userAgent');

        res.json({
            success: true,
            data: {
                totalVisits,
                uniqueVisitors: uniqueVisitors.length,
                visitsByPage,
                visitsByDate,
                recentVisits
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
