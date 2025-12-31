// AppearanceSettings Model - Theme & Customization
const mongoose = require('mongoose');

const appearanceSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, default: 'appearance' },

    // App Branding
    appName: { type: String, default: 'Memory Album' },
    appShortName: { type: String, default: 'M' },
    appDescription: { type: String, default: 'Admin Dashboard' },

    // Primary Colors
    colorPrimary: { type: String, default: '#6366f1' },
    colorPrimaryDark: { type: String, default: '#8b5cf6' },
    colorSecondary: { type: String, default: '#10b981' },
    colorAccent: { type: String, default: '#ec4899' },
    colorWarning: { type: String, default: '#f59e0b' },
    colorDanger: { type: String, default: '#ef4444' },
    colorSuccess: { type: String, default: '#22c55e' },

    // Background Colors
    colorDark: { type: String, default: '#1e293b' },
    colorDarker: { type: String, default: '#0f172a' },
    colorLight: { type: String, default: '#f8fafc' },

    // Navigation Items (stored as JSON string)
    navItems: {
        type: String, default: JSON.stringify([
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'memories', icon: '📷', label: 'Memories' },
            { id: 'timeline', icon: '💖', label: 'Timeline' },
            { id: 'messages', icon: '💬', label: 'Messages' },
            { id: 'settings', icon: '⚙️', label: 'Settings' },
            { id: 'appearance', icon: '🎨', label: 'Appearance' },
        ])
    },

    // Stats Cards (stored as JSON string)
    statsCards: {
        type: String, default: JSON.stringify([
            { key: 'totalMemories', icon: '📷', label: 'Memories', color: '#6366f1' },
            { key: 'totalVisitors', icon: '👥', label: 'Visitors', color: '#10b981', subKey: 'todayVisitors', subLabel: 'today' },
            { key: 'totalMessages', icon: '💬', label: 'Messages', color: '#f59e0b', subKey: 'unreadMessages', subLabel: 'unread' },
            { key: 'todayVisitors', icon: '📈', label: 'Today', color: '#ec4899' },
        ])
    },

    // Icons (stored as JSON string)
    icons: {
        type: String, default: JSON.stringify({
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
        })
    },

    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AppearanceSettings', appearanceSettingsSchema);
