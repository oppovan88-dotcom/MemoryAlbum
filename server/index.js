// MemoryAlbum Server - Version 1.1.0 - Timeline API Enabled
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// MongoDB Connection
console.log('⏳ Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        console.log('Database Name:', mongoose.connection.name);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit if DB connection fails to avoid silent failures
    });

// ============== SCHEMAS ==============

// Admin Schema
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: 'Admin' },
    createdAt: { type: Date, default: Date.now }
});

// Memory Schema
const memorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    imageUrl: String,
    imageData: String, // Base64 encoded image for cloud storage
    date: { type: Date, default: Date.now },
    order: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Visitor Schema (for analytics)
const visitorSchema = new mongoose.Schema({
    ip: String,
    userAgent: String,
    page: String,
    country: String,
    visitedAt: { type: Date, default: Date.now }
});

// Message Schema (guestbook)
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: String,
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Stats Schema
const statsSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    pageViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    messages: { type: Number, default: 0 }
});

// Site Settings Schema (for relationship profile)
const siteSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    // Person 1 (Left)
    person1Name: { type: String, default: 'Rith' },
    person1Age: { type: Number, default: 20 },
    person1Gender: { type: String, default: '♂' },
    person1Zodiac: { type: String, default: 'Pisces' },
    person1ZodiacSymbol: { type: String, default: '♓' },
    person1Photo: { type: String, default: './assets/images/1.jpg' },
    person1Tagline: { type: String, default: 'Rith Ft Ry' },
    // Person 2 (Right)
    person2Name: { type: String, default: 'Chanry' },
    person2Age: { type: Number, default: 19 },
    person2Gender: { type: String, default: '♀' },
    person2Zodiac: { type: String, default: 'Aries' },
    person2ZodiacSymbol: { type: String, default: '♈' },
    person2Photo: { type: String, default: './assets/images/7.jpg' },
    person2Tagline: { type: String, default: 'Ry Ft Rith' },
    // Relationship
    relationshipDate: { type: String, default: '2025-05-13' },
    // Timeline
    timelineTitle: { type: String, default: 'Love Timeline' },
    updatedAt: { type: Date, default: Date.now }
});

// Timeline Schema (for love timeline)
const timelineSchema = new mongoose.Schema({
    time: { type: String, required: true },
    activity: { type: String, required: true },
    details: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);
const Memory = mongoose.model('Memory', memorySchema);
const Visitor = mongoose.model('Visitor', visitorSchema);
const Message = mongoose.model('Message', messageSchema);
const Stats = mongoose.model('Stats', statsSchema);
const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
const Timeline = mongoose.model('Timeline', timelineSchema);

// ============== MIDDLEWARE ==============

// Auth Middleware - Optional (no login required for /ryxrith/dashboard)
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || token === 'no-auth-required') {
            // No auth required - allow access
            return next();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (error) {
        // Allow access even if token is invalid
        next();
    }
};

// ============== ROUTES ==============

// Create default admin on startup
const createDefaultAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await Admin.create({
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                name: 'Administrator'
            });
            console.log('✅ Default admin created');
        } else {
            // Update password if it changed
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await Admin.findOneAndUpdate(
                { email: process.env.ADMIN_EMAIL },
                { password: hashedPassword }
            );
            console.log('✅ Admin password updated');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

// Create default timeline items on startup
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

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

        if (!admin) {
            console.log('Admin not found for email:', email);
            return res.status(401).json({ error: 'Email not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: 'Wrong password' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Debug endpoint - check what email is registered
app.get('/api/auth/check', async (req, res) => {
    try {
        const admin = await Admin.findOne({});
        res.json({
            registeredEmail: admin ? admin.email : 'No admin found',
            envEmail: process.env.ADMIN_EMAIL
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password');
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Dashboard Stats
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
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

// Memory Routes
app.get('/api/memories', async (req, res) => {
    try {
        const memories = await Memory.find().sort({ order: 1, createdAt: -1 });
        res.json(memories);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/memories', authMiddleware, async (req, res) => {
    try {
        console.log('📥 POST /api/memories - Body:', req.body);
        const { title, description, imageUrl, date } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        // Get highest order number to put new memory at the end
        const lastMemory = await Memory.findOne().sort({ order: -1 });
        const newOrder = (lastMemory && typeof lastMemory.order === 'number') ? lastMemory.order + 1 : 0;

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

app.put('/api/memories/:id', authMiddleware, async (req, res) => {
    try {
        const memory = await Memory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(memory);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/memories/:id', authMiddleware, async (req, res) => {
    try {
        await Memory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Memory deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Move memory to first position
app.put('/api/memories/:id/move-first', authMiddleware, async (req, res) => {
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
app.put('/api/memories/:id/move-up', authMiddleware, async (req, res) => {
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
app.put('/api/memories/:id/move-down', authMiddleware, async (req, res) => {
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

// Bulk reorder memories (update all order values at once) - MUST be before :id route
app.put('/api/memories/reorder-all', authMiddleware, async (req, res) => {
    try {
        const { orders } = req.body; // Array of { id, order }

        if (!orders || !Array.isArray(orders)) {
            return res.status(400).json({ error: 'Invalid orders data' });
        }

        // Update all memories with their new order values
        const updatePromises = orders.map(item =>
            Memory.findByIdAndUpdate(item.id, { order: item.order })
        );

        await Promise.all(updatePromises);

        console.log('Bulk reorder success:', orders.length, 'memories updated');
        res.json({ success: true });
    } catch (error) {
        console.error('Bulk reorder error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reorder memory (drag and drop) - single swap
app.put('/api/memories/:id/reorder', authMiddleware, async (req, res) => {
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

// Image Upload Route - uploads to Cloudinary
app.post('/api/upload', authMiddleware, (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: err.message || 'File upload failed' });
        }

        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('File uploaded locally:', req.file.filename);

        try {
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'memoryalbum',
                resource_type: 'image',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' }, // Max size
                    { quality: 'auto:good' } // Auto optimize quality
                ]
            });

            console.log('Cloudinary upload success:', result.secure_url);

            // Clean up local file
            fs.unlinkSync(req.file.path);

            // Return Cloudinary URL
            res.json({
                imageUrl: result.secure_url,
                publicId: result.public_id,
                filename: req.file.filename
            });
        } catch (cloudError) {
            console.error('Cloudinary error:', cloudError);
            // Clean up local file on error
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ error: 'Failed to upload to cloud storage' });
        }
    });
});

// Message Routes
app.get('/api/messages', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/messages', async (req, res) => {
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

app.put('/api/messages/:id/read', authMiddleware, async (req, res) => {
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

app.delete('/api/messages/:id', authMiddleware, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Track visitor
app.post('/api/track', async (req, res) => {
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

// Settings Routes
app.get('/api/settings', async (req, res) => {
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

app.put('/api/settings', authMiddleware, async (req, res) => {
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

// Timeline Routes
app.get('/api/timeline', async (req, res) => {
    try {
        const timeline = await Timeline.find().sort({ createdAt: 1 });
        res.json(timeline);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/timeline', authMiddleware, async (req, res) => {
    try {
        const { time, activity, details } = req.body;

        if (!time || !activity) {
            return res.status(400).json({ error: 'Time and activity are required' });
        }

        const timelineItem = await Timeline.create({
            time,
            activity,
            details: details || ''
        });

        console.log('✅ Timeline item created:', timelineItem._id);
        res.status(201).json(timelineItem);
    } catch (error) {
        console.error('❌ Timeline creation error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

/* REORDER ROUTES REMOVED */

app.put('/api/timeline/:id', authMiddleware, async (req, res) => {
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

app.delete('/api/timeline/:id', authMiddleware, async (req, res) => {
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

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await createDefaultAdmin();
    await createDefaultTimeline();
});
