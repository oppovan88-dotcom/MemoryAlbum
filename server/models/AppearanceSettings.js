// AppearanceSettings Model - Full Frontend Configuration
const mongoose = require('mongoose');

const appearanceSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, default: 'appearance' },

    // ============ App Branding ============
    appName: { type: String, default: 'Memory Album' },
    appShortName: { type: String, default: 'M' },
    appDescription: { type: String, default: 'Admin Dashboard' },
    appLogoUrl: { type: String, default: '' },
    appFaviconUrl: { type: String, default: '' },

    // ============ Primary Colors ============
    colorPrimary: { type: String, default: '#6366f1' },
    colorPrimaryDark: { type: String, default: '#8b5cf6' },
    colorSecondary: { type: String, default: '#10b981' },
    colorAccent: { type: String, default: '#ec4899' },
    colorWarning: { type: String, default: '#f59e0b' },
    colorDanger: { type: String, default: '#ef4444' },
    colorSuccess: { type: String, default: '#22c55e' },

    // ============ Background Colors ============
    colorDark: { type: String, default: '#1e293b' },
    colorDarker: { type: String, default: '#0f172a' },
    colorLight: { type: String, default: '#f8fafc' },
    colorWhite: { type: String, default: '#ffffff' },

    // ============ Text Colors ============
    colorTextPrimary: { type: String, default: '#1e293b' },
    colorTextSecondary: { type: String, default: '#64748b' },
    colorTextLight: { type: String, default: '#94a3b8' },

    // ============ Typography ============
    fontFamily: { type: String, default: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' },
    fontSizeBase: { type: Number, default: 14 },

    // ============ Layout ============
    sidebarWidth: { type: Number, default: 260 },
    borderRadius: { type: Number, default: 12 },

    // ============ Messages/Labels ============
    messages: {
        type: String, default: JSON.stringify({
            loading: 'Loading your memories...',
            noMemories: 'No memories found. Add your first memory!',
            noMessages: 'No messages yet.',
            noTimeline: 'No timeline items yet.',
            confirmDelete: 'Are you sure you want to delete this?',
            saveSuccess: 'Settings saved successfully!',
            saveFailed: 'Failed to save settings.',
        })
    },

    // ============ Navigation Items ============
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

    // ============ Stats Cards ============
    statsCards: {
        type: String, default: JSON.stringify([
            { key: 'totalMemories', icon: '📷', label: 'Memories', color: '#6366f1' },
            { key: 'totalVisitors', icon: '👥', label: 'Visitors', color: '#10b981', subKey: 'todayVisitors', subLabel: 'today' },
            { key: 'totalMessages', icon: '💬', label: 'Messages', color: '#f59e0b', subKey: 'unreadMessages', subLabel: 'unread' },
            { key: 'todayVisitors', icon: '📈', label: 'Today', color: '#ec4899' },
        ])
    },

    // ============ Icons ============
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
            menu: '☰',
            close: '✕',
            up: '↑',
            down: '↓',
            drag: '⋮⋮',
        })
    },

    // ============ Settings Form Fields ============
    settingsFields: {
        type: String, default: JSON.stringify([
            { key: 'person1Name', label: 'Person 1 Name', type: 'text', section: 'person1' },
            { key: 'person1Age', label: 'Age', type: 'number', section: 'person1' },
            { key: 'person1Gender', label: 'Gender', type: 'text', section: 'person1' },
            { key: 'person1Zodiac', label: 'Zodiac', type: 'text', section: 'person1' },
            { key: 'person2Name', label: 'Person 2 Name', type: 'text', section: 'person2' },
            { key: 'person2Age', label: 'Age', type: 'number', section: 'person2' },
            { key: 'person2Gender', label: 'Gender', type: 'text', section: 'person2' },
            { key: 'person2Zodiac', label: 'Zodiac', type: 'text', section: 'person2' },
            { key: 'relationshipDate', label: 'Relationship Date', type: 'date', section: 'relationship' },
            { key: 'timelineTitle', label: 'Timeline Title', type: 'text', section: 'relationship' },
        ])
    },

    // ============ Timeline Options ============
    timeOptions: {
        type: String, default: JSON.stringify([
            '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
            '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
            '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM',
        ])
    },

    // ============ Social Links ============
    socialLinks: {
        type: String, default: JSON.stringify([
            { name: 'Facebook', url: '', icon: '📘' },
            { name: 'Instagram', url: '', icon: '📷' },
            { name: 'TikTok', url: '', icon: '🎵' },
            { name: 'YouTube', url: '', icon: '▶️' },
        ])
    },

    // ============ Footer Content ============
    footerText: { type: String, default: 'Made with ❤️ by Us' },
    footerYear: { type: String, default: '2024' },
    footerLinks: {
        type: String, default: JSON.stringify([
            { label: 'Privacy', url: '/privacy' },
            { label: 'Terms', url: '/terms' },
        ])
    },

    // ============ Homepage Content ============
    heroTitle: { type: String, default: 'Our Love Story' },
    heroSubtitle: { type: String, default: 'A journey through our memories together' },
    heroButtonText: { type: String, default: 'View Memories' },
    heroBackgroundUrl: { type: String, default: '' },
    homepageWelcome: { type: String, default: 'Welcome to our memory album!' },

    // ============ About Section ============
    aboutTitle: { type: String, default: 'About Us' },
    aboutDescription: { type: String, default: 'Two hearts, one love story.' },
    showAboutSection: { type: Boolean, default: true },

    // ============ Contact Section ============
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    showContactSection: { type: Boolean, default: true },

    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AppearanceSettings', appearanceSettingsSchema);
