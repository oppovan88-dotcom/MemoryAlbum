// Routes Index - Export all routes
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const memoriesRoutes = require('./memories');
const messagesRoutes = require('./messages');
const timelineRoutes = require('./timeline');
const settingsRoutes = require('./settings');
const uploadRoutes = require('./upload');
const trackRoutes = require('./track');
const healthRoutes = require('./health');
const appearanceRoutes = require('./appearance');

module.exports = {
    authRoutes,
    dashboardRoutes,
    memoriesRoutes,
    messagesRoutes,
    timelineRoutes,
    settingsRoutes,
    uploadRoutes,
    trackRoutes,
    healthRoutes,
    appearanceRoutes
};

