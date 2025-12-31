// TelegramSettings Model - Telegram Bot Configuration
const mongoose = require('mongoose');

const telegramSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, default: 'telegram' },

    // Bot Configuration
    botToken: { type: String, default: '' },
    botUsername: { type: String, default: '' },

    // Group/Chat Configuration
    chatId: { type: String, default: '' }, // Can be group ID or user ID
    chatType: { type: String, enum: ['group', 'private', 'channel'], default: 'group' },
    chatTitle: { type: String, default: '' },

    // Notification Settings
    notificationsEnabled: { type: Boolean, default: true },

    // What to notify
    notifyOn: {
        newMemory: { type: Boolean, default: true },
        newMessage: { type: Boolean, default: true },
        eventReminder: { type: Boolean, default: true },
        eventDay: { type: Boolean, default: true },
        dailyDigest: { type: Boolean, default: false },
        visitorMilestone: { type: Boolean, default: true }
    },

    // Timing
    quietHoursEnabled: { type: Boolean, default: false },
    quietHoursStart: { type: String, default: '22:00' }, // 24h format
    quietHoursEnd: { type: String, default: '08:00' },

    // Daily Digest Time
    dailyDigestTime: { type: String, default: '09:00' },

    // Message Templates (use {variables})
    templates: {
        eventReminder: {
            type: String,
            default: '🔔 *Reminder!*\n\n{icon} *{title}*\n📅 {date}\n⏰ {daysLeft} days left!\n\n{description}'
        },
        eventToday: {
            type: String,
            default: '🎉 *TODAY IS THE DAY!*\n\n{icon} *{title}*\n\n{specialMessage}'
        },
        newMemory: {
            type: String,
            default: '📷 *New Memory Added!*\n\n*{title}*\n📅 {date}\n\n{description}'
        },
        newMessage: {
            type: String,
            default: '💬 *New Message!*\n\nFrom: {name}\n\n_{message}_'
        },
        visitorMilestone: {
            type: String,
            default: '🎊 *Visitor Milestone!*\n\nYour Memory Album has reached *{count}* visitors! 🥳'
        }
    },

    // Connection Status
    isConnected: { type: Boolean, default: false },
    lastChecked: { type: Date, default: null },
    lastError: { type: String, default: '' },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware
telegramSettingsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('TelegramSettings', telegramSettingsSchema);
