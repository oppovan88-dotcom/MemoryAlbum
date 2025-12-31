// MemoryAlbum Server - Version 2.0.0 - Modular Architecture
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import configurations
const { connectDatabase } = require('./config/database');
const { configureCloudinary } = require('./config/cloudinary');

// Import services
const { eventScheduler } = require('./services/eventScheduler');
const { keepAliveService } = require('./services/keepAliveService');

// Import routes
const {
    authRoutes,
    dashboardRoutes,
    memoriesRoutes,
    messagesRoutes,
    timelineRoutes,
    settingsRoutes,
    uploadRoutes,
    trackRoutes,
    healthRoutes,
    appearanceRoutes,
    eventsRoutes,
    telegramRoutes
} = require('./routes');

// Initialize Express App
const app = express();

// ============== MIDDLEWARE ==============
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

// ============== ROUTES ==============
// Auth Routes
app.use('/api/auth', authRoutes.router);

// Dashboard Routes
app.use('/api/dashboard', dashboardRoutes);

// Memory Routes
app.use('/api/memories', memoriesRoutes);

// Message Routes
app.use('/api/messages', messagesRoutes);

// Timeline Routes
app.use('/api/timeline', timelineRoutes.router);

// Settings Routes
app.use('/api/settings', settingsRoutes);

// Upload Routes
app.use('/api/upload', uploadRoutes);

// Track Routes
app.use('/api/track', trackRoutes);

// Health Routes
app.use('/api/health', healthRoutes);

// Appearance Routes
app.use('/api/appearance', appearanceRoutes);

// Special Events Routes
app.use('/api/events', eventsRoutes);

// Telegram Routes
app.use('/api/telegram', telegramRoutes);

// Scheduler Status Route
app.get('/api/scheduler/status', (req, res) => {
    res.json(eventScheduler.getStatus());
});

// Scheduler Trigger Route (for testing)
app.post('/api/scheduler/trigger', async (req, res) => {
    try {
        await eventScheduler.triggerCheck();
        res.json({ success: true, message: 'Scheduler triggered manually' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Keep-Alive Status Route
app.get('/api/keep-alive/status', (req, res) => {
    res.json(keepAliveService.getStatus());
});

// Keep-Alive Trigger Route (for testing)
app.post('/api/keep-alive/ping', async (req, res) => {
    try {
        const result = await keepAliveService.triggerPing();
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============== INITIALIZATION ==============
const initializeServer = async () => {
    try {
        // Configure Cloudinary
        configureCloudinary();

        // Connect to Database
        await connectDatabase();

        // Create default data
        await authRoutes.createDefaultAdmin();
        await timelineRoutes.createDefaultTimeline();

        // Start Event Scheduler (for birthday/anniversary/event reminders)
        eventScheduler.start();

        // Start Server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log('📁 Modular server architecture loaded successfully!');
            console.log('📅 Event Scheduler active - Auto-reminders enabled!');

            // Start Keep-Alive service (only in production)
            if (process.env.SERVER_URL) {
                keepAliveService.start(process.env.SERVER_URL);
                console.log('💓 Keep-Alive service active - Server will stay awake!');
            } else {
                console.log('💤 Keep-Alive disabled (no SERVER_URL set - local dev mode)');
            }
        });
    } catch (error) {
        console.error('❌ Server initialization failed:', error);
        process.exit(1);
    }
};

// Start the server
initializeServer();

