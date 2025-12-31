// Timeline Routes
const express = require('express');
const router = express.Router();
const Timeline = require('../models/Timeline');
const { authMiddleware } = require('../middleware');

// Get all timeline items
router.get('/', async (req, res) => {
    try {
        const timeline = await Timeline.find().sort({ order: 1 });
        res.json(timeline);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create timeline item
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { time, activity, details } = req.body;

        if (!time || !activity) {
            return res.status(400).json({ error: 'Time and activity are required' });
        }

        const maxOrder = await Timeline.findOne().sort({ order: -1 });
        const order = maxOrder ? maxOrder.order + 1 : 0;

        const timelineItem = await Timeline.create({
            time,
            activity,
            details: details || '',
            order
        });

        console.log('✅ Timeline item created:', timelineItem._id, 'Order:', order);
        res.status(201).json(timelineItem);
    } catch (error) {
        console.error('❌ Timeline creation error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

// Bulk reorder timeline
router.put('/reorder-all', authMiddleware, async (req, res) => {
    try {
        const { orders } = req.body;
        if (!orders || !Array.isArray(orders)) {
            return res.status(400).json({ error: 'Orders array is required' });
        }

        const updatePromises = orders.map(async (item) => {
            if (!item.id) return null;
            return Timeline.findByIdAndUpdate(item.id, { $set: { order: item.order } }, { new: true });
        });

        await Promise.all(updatePromises);

        console.log(`✅ Timeline reordered: ${orders.length} items processed`);
        res.json({ success: true, message: 'Timeline reordered successfully' });
    } catch (error) {
        console.error('❌ Timeline reorder error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

// Update timeline item
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { time, activity, details, isCompleted } = req.body;
        const timelineItem = await Timeline.findByIdAndUpdate(
            req.params.id,
            { time, activity, details, isCompleted },
            { new: true, runValidators: true }
        );
        if (!timelineItem) {
            return res.status(404).json({ error: 'Timeline item not found' });
        }
        res.json(timelineItem);
    } catch (error) {
        console.error('❌ Timeline update error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

// Delete timeline item
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const timelineItem = await Timeline.findByIdAndDelete(req.params.id);
        if (!timelineItem) {
            return res.status(404).json({ error: 'Timeline item not found' });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create default timeline items helper
const createDefaultTimeline = async () => {
    try {
        const existingTimeline = await Timeline.find();
        if (existingTimeline.length === 0) {
            const defaultItems = [
                { time: "07:00 AM", activity: "Messenger and TikTok 📱", details: "Good Morning" },
                { time: "08:30 AM", activity: "Make Up 💄", details: "Repair Yourself to go" },
                { time: "09:00 AM", activity: "Arrived 🚗", details: "Go To Chip Mong (Watched Movie)" },
                { time: "10:00 AM", activity: "Movie Time 🎬", details: "រឿង សងដៃខ្ញុំវិញ" },
                { time: "12:00 PM", activity: "Movie Time 🍿", details: "F1 Hall Gaint" },
                { time: "03:00 PM", activity: "Relaxed 🎮", details: "Play Games and Eating some Food" },
                { time: "05:00 PM", activity: "Back Home 🏠", details: "We go home and talking some fun" }
            ];
            await Timeline.insertMany(defaultItems);
            console.log('✅ Default timeline items created');
        }
    } catch (error) {
        console.error('Error creating default timeline:', error);
    }
};

module.exports = { router, createDefaultTimeline };
