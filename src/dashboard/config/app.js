// ============================================
// APP CONFIGURATION - Easy to customize!
// ============================================

export const appConfig = {
    // App Info
    name: 'Memory Album',
    shortName: 'M',
    description: 'Admin Dashboard',
    version: '1.0.0',

    // API Configuration
    api: {
        baseUrl: import.meta.env.VITE_API_URL || 'https://memoryalbum-wi0j.onrender.com/api',
        healthCheckInterval: 30000, // 30 seconds
    },

    // Cloudinary Configuration
    cloudinary: {
        cloudName: 'dbkdd1wrl',
        uploadPreset: 'memoryalbum_unsigned',
        folder: 'memoryalbum',
    },

    // Navigation Items - Add/Remove/Reorder tabs here!
    navigation: [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'memories', icon: '📷', label: 'Memories' },
        { id: 'timeline', icon: '💖', label: 'Timeline' },
        { id: 'messages', icon: '💬', label: 'Messages' },
        { id: 'settings', icon: '⚙️', label: 'Settings' },
        { id: 'appearance', icon: '🎨', label: 'Appearance' },
    ],

    // Dashboard Stats Cards Configuration
    statsCards: [
        { key: 'totalMemories', icon: '📷', label: 'Memories', color: '#6366f1' },
        { key: 'totalVisitors', icon: '👥', label: 'Visitors', color: '#10b981', subKey: 'todayVisitors', subLabel: 'today' },
        { key: 'totalMessages', icon: '💬', label: 'Messages', color: '#f59e0b', subKey: 'unreadMessages', subLabel: 'unread' },
        { key: 'todayVisitors', icon: '📈', label: 'Today', color: '#ec4899' },
    ],

    // Time Options for Timeline
    timeOptions: (() => {
        const options = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const hour = h % 12 || 12;
                const ampm = h < 12 ? 'AM' : 'PM';
                const minute = m.toString().padStart(2, '0');
                options.push(`${hour.toString().padStart(2, '0')}:${minute} ${ampm}`);
            }
        }
        return options;
    })(),

    // Settings Form Fields Configuration
    settingsFields: {
        person1: {
            title: '👤 Person 1',
            bgColor: '#f0fdf4',
            borderColor: '#22c55e',
            titleColor: '#166534',
            fields: [
                { key: 'person1Name', label: 'Name', type: 'text' },
                { key: 'person1BirthDate', label: 'Date of Birth', type: 'date' },
                { key: 'person1Photo', label: 'Photo URL', type: 'text' },
            ]
        },
        person2: {
            title: '👤 Person 2',
            bgColor: '#fdf2f8',
            borderColor: '#ec4899',
            titleColor: '#be185d',
            fields: [
                { key: 'person2Name', label: 'Name', type: 'text' },
                { key: 'person2BirthDate', label: 'Date of Birth', type: 'date' },
                { key: 'person2Photo', label: 'Photo URL', type: 'text' },
            ]
        }
    },

    // Messages to display
    messages: {
        loading: 'Loading dashboard...',
        noMemories: 'No memories found',
        noMessages: 'No messages yet',
        noTimeline: 'No timeline items yet. Click "Add Moment" to create one!',
        dragHint: '✋ Drag cards to reorder',
        confirmDelete: 'Delete this item?',
    },

    // Icons used throughout the app
    icons: {
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
        drag: '⋮⋮',
        up: '↑',
        down: '↓',
        check: '✓',
        unread: '🔔',
        time: '⏰',
        activity: '💫',
        details: '📝',
        heart: '💖',
        date: '📅',
    },
};

export default appConfig;
