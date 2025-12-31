// Memory Routes
const express = require('express');
const router = express.Router();
const Memory = require('../models/Memory');
const { authMiddleware } = require('../middleware');
const { cloudinary } = require('../config/cloudinary');

// Get all memories
router.get('/', async (req, res) => {
    try {
        const memories = await Memory.find().sort({ order: 1, createdAt: -1 });
        res.json(memories);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create memory
router.post('/', authMiddleware, async (req, res) => {
    try {
        console.log('📥 POST /api/memories - Body:', req.body);
        const { title, description, imageUrl, date } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        // Get lowest order number to put new memory at the TOP
        const firstMemory = await Memory.findOne().sort({ order: 1 });
        const newOrder = (firstMemory && typeof firstMemory.order === 'number') ? firstMemory.order - 1 : 0;

        const memory = await Memory.create({
            title,
            description: description || '',
            imageUrl,
            date: date || Date.now(),
            order: newOrder
        });

        console.log('✅ Memory created:', memory._id);
        res.status(201).json(memory);
    } catch (error) {
        console.error('❌ Memory creation error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

// Bulk reorder memories - MUST be before :id routes to avoid route conflict!
router.put('/reorder-all', authMiddleware, async (req, res) => {
    try {
        const { orders } = req.body; // Array of { id, order }

        if (!orders || !Array.isArray(orders)) {
            return res.status(400).json({ error: 'Invalid orders data' });
        }

        // Use Promise.all with findByIdAndUpdate for better stability and auto-casting of IDs
        const updatePromises = orders.map(async (item) => {
            if (!item.id) return null;
            return Memory.findByIdAndUpdate(item.id, { $set: { order: item.order } }, { new: true });
        });

        await Promise.all(updatePromises);

        console.log(`✅ Memories reordered: ${orders.length} items processed`);
        res.json({ success: true, count: orders.length });
    } catch (error) {
        console.error('❌ Bulk reorder error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

// Update memory
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const memory = await Memory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(memory);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete memory
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // First, find the memory to get the image URL
        const memory = await Memory.findById(req.params.id);

        if (!memory) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        // If there's a Cloudinary image, delete it
        if (memory.imageUrl && memory.imageUrl.includes('cloudinary.com')) {
            try {
                // Extract public_id from Cloudinary URL
                const urlParts = memory.imageUrl.split('/');
                const uploadIndex = urlParts.indexOf('upload');
                if (uploadIndex !== -1) {
                    const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
                    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');

                    console.log('🗑️ Deleting Cloudinary image:', publicId);
                    await cloudinary.uploader.destroy(publicId);
                    console.log('✅ Cloudinary image deleted');
                }
            } catch (cloudErr) {
                console.error('⚠️ Failed to delete Cloudinary image:', cloudErr.message);
            }
        }

        // Delete the memory from database
        await Memory.findByIdAndDelete(req.params.id);
        console.log('✅ Memory deleted:', req.params.id);
        res.json({ message: 'Memory deleted' });
    } catch (error) {
        console.error('❌ Delete memory error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Move memory to first position
router.put('/:id/move-first', authMiddleware, async (req, res) => {
    try {
        const firstMemory = await Memory.findOne().sort({ order: 1 });
        const newOrder = firstMemory ? firstMemory.order - 1 : 0;
        const memory = await Memory.findByIdAndUpdate(req.params.id, { order: newOrder }, { new: true });
        res.json(memory);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Move memory up (decrease order)
router.put('/:id/move-up', authMiddleware, async (req, res) => {
    try {
        const currentMemory = await Memory.findById(req.params.id);
        if (!currentMemory) return res.status(404).json({ error: 'Memory not found' });

        // Find memory with next lower order (appears before current)
        const previousMemory = await Memory.findOne({ order: { $lt: currentMemory.order } }).sort({ order: -1 });

        if (previousMemory) {
            // Swap orders
            const tempOrder = currentMemory.order;
            await Memory.findByIdAndUpdate(currentMemory._id, { order: previousMemory.order });
            await Memory.findByIdAndUpdate(previousMemory._id, { order: tempOrder });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Move memory down (increase order)
router.put('/:id/move-down', authMiddleware, async (req, res) => {
    try {
        const currentMemory = await Memory.findById(req.params.id);
        if (!currentMemory) return res.status(404).json({ error: 'Memory not found' });

        // Find memory with next higher order (appears after current)
        const nextMemory = await Memory.findOne({ order: { $gt: currentMemory.order } }).sort({ order: 1 });

        if (nextMemory) {
            // Swap orders
            const tempOrder = currentMemory.order;
            await Memory.findByIdAndUpdate(currentMemory._id, { order: nextMemory.order });
            await Memory.findByIdAndUpdate(nextMemory._id, { order: tempOrder });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Reorder memory (drag and drop) - single swap
router.put('/:id/reorder', authMiddleware, async (req, res) => {
    try {
        const { targetId } = req.body;
        const draggedMemory = await Memory.findById(req.params.id);
        const targetMemory = await Memory.findById(targetId);

        if (!draggedMemory || !targetMemory) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        // Swap the orders
        const tempOrder = draggedMemory.order;
        await Memory.findByIdAndUpdate(draggedMemory._id, { order: targetMemory.order });
        await Memory.findByIdAndUpdate(targetMemory._id, { order: tempOrder });

        res.json({ success: true });
    } catch (error) {
        console.error('Reorder error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
