// SpecialEvent Model - Milestones & Special Events Manager
const mongoose = require('mongoose');

const specialEventSchema = new mongoose.Schema({
    // Basic Info
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '🎉' },

    // Event Type
    eventType: {
        type: String,
        enum: ['anniversary', 'birthday', 'milestone', 'holiday', 'custom'],
        default: 'custom'
    },

    // Date Configuration
    eventDate: { type: Date, required: true },
    eventTime: { type: String, default: '' }, // Time in HH:MM format
    isRecurring: { type: Boolean, default: false },
    recurringType: {
        type: String,
        enum: ['yearly', 'monthly', 'weekly', 'none'],
        default: 'none'
    },

    // Reminder Settings
    reminderEnabled: { type: Boolean, default: true },
    reminderDaysBefore: { type: [Number], default: [7, 3, 1, 0] }, // Days before to remind

    // Visual Styling
    color: { type: String, default: '#ec4899' },
    coverImage: { type: String, default: '' },

    // Grouping
    category: { type: String, default: 'General' },
    tags: { type: [String], default: [] },

    // Priority & Status
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    isActive: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false },
    completedDate: { type: Date, default: null },

    // Celebration Mode
    celebrationMode: {
        enabled: { type: Boolean, default: true },
        duration: { type: Number, default: 24 }, // hours
        animation: { type: String, default: 'confetti' },
        specialMessage: { type: String, default: '' }
    },

    // Notifications Sent Tracking
    notificationsSent: [{
        sentAt: { type: Date },
        channel: { type: String }, // 'telegram', 'email', 'browser'
        daysBefore: { type: Number }
    }],

    // Person Association (optional - for birthday events)
    associatedPerson: {
        type: String,
        enum: ['person1', 'person2', 'both', 'none'],
        default: 'none'
    },

    // Order for display
    order: { type: Number, default: 0 },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
specialEventSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for days until event
specialEventSchema.virtual('daysUntil').get(function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let eventDate = new Date(this.eventDate);

    // For recurring events, calculate next occurrence
    if (this.isRecurring && this.recurringType === 'yearly') {
        eventDate.setFullYear(today.getFullYear());
        if (eventDate < today) {
            eventDate.setFullYear(today.getFullYear() + 1);
        }
    }

    const diffTime = eventDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Enable virtuals in JSON
specialEventSchema.set('toJSON', { virtuals: true });
specialEventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('SpecialEvent', specialEventSchema);
