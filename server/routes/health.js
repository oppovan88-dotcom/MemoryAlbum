// Health Check Routes
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Server start time tracking
const serverStartTime = Date.now();

// Health Check - Enhanced with performance metrics
router.get('/', (req, res) => {
    const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
    const memoryUsage = process.memoryUsage();

    res.json({
        status: 'ok',
        version: '2.1.0',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        uptime: {
            seconds: uptime,
            formatted: formatUptime(uptime)
        },
        memory: {
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`
        },
        keepAlive: 'active'
    });
});

// Format uptime to human-readable string
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);

    return parts.join(' ');
}

module.exports = router;
