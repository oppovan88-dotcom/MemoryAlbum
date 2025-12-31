// Special Events Routes - CRUD + Telegram Notifications
const express = require('express');
const router = express.Router();
const SpecialEvent = require('../models/SpecialEvent');
const TelegramSettings = require('../models/TelegramSettings');
const { telegramService } = require('../services/telegramService');

// ============== GET ALL EVENTS ==============
router.get('/', async (req, res) => {
    try {
        const events = await SpecialEvent.find().sort({ eventDate: 1 });

        // Add daysUntil to each event
        const eventsWithDays = events.map(event => {
            const eventObj = event.toObject();
            eventObj.daysUntil = calculateDaysUntil(event.eventDate, event.isRecurring);
            return eventObj;
        });

        res.json(eventsWithDays);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// ============== GET UPCOMING EVENTS (Next 30 days) ==============
router.get('/upcoming', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const events = await SpecialEvent.find({ isActive: true }).sort({ eventDate: 1 });

        const upcoming = events.filter(event => {
            const daysUntil = calculateDaysUntil(event.eventDate, event.isRecurring);
            return daysUntil >= 0 && daysUntil <= days;
        }).map(event => {
            const eventObj = event.toObject();
            eventObj.daysUntil = calculateDaysUntil(event.eventDate, event.isRecurring);
            return eventObj;
        });

        // Sort by daysUntil
        upcoming.sort((a, b) => a.daysUntil - b.daysUntil);

        res.json(upcoming);
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({ error: 'Failed to fetch upcoming events' });
    }
});

// ============== GET TODAY'S EVENTS ==============
router.get('/today', async (req, res) => {
    try {
        const events = await SpecialEvent.find({ isActive: true });

        const todayEvents = events.filter(event => {
            return calculateDaysUntil(event.eventDate, event.isRecurring) === 0;
        });

        res.json(todayEvents);
    } catch (error) {
        console.error('Error fetching today events:', error);
        res.status(500).json({ error: 'Failed to fetch today events' });
    }
});

// ============== GET SINGLE EVENT ==============
router.get('/:id', async (req, res) => {
    try {
        const event = await SpecialEvent.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const eventObj = event.toObject();
        eventObj.daysUntil = calculateDaysUntil(event.eventDate, event.isRecurring);

        res.json(eventObj);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});

// ============== CREATE EVENT ==============
router.post('/', async (req, res) => {
    try {
        const eventData = req.body;

        // Set order to be last
        const lastEvent = await SpecialEvent.findOne().sort({ order: -1 });
        eventData.order = lastEvent ? lastEvent.order + 1 : 0;

        const event = new SpecialEvent(eventData);
        await event.save();

        // Calculate how soon the event is
        const now = new Date();
        let eventDateTime = new Date(event.eventDate);

        // If eventTime is set, use it
        if (event.eventTime) {
            const [hours, minutes] = event.eventTime.split(':').map(Number);
            eventDateTime.setHours(hours, minutes, 0, 0);
        }

        const minutesUntilEvent = (eventDateTime - now) / (1000 * 60);

        // If event is within 30 minutes (or in the past today), send immediate "IT'S TIME" alert
        if (minutesUntilEvent <= 30 && minutesUntilEvent >= -60) {
            await notifyTelegram('eventNow', event);
        } else {
            // Send normal "event created" notification
            await notifyTelegram('eventCreated', event);
        }

        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// ============== UPDATE EVENT ==============
router.put('/:id', async (req, res) => {
    try {
        const event = await SpecialEvent.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// ============== DELETE EVENT ==============
router.delete('/:id', async (req, res) => {
    try {
        const event = await SpecialEvent.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// ============== MARK EVENT AS COMPLETED ==============
router.put('/:id/complete', async (req, res) => {
    try {
        const event = await SpecialEvent.findByIdAndUpdate(
            req.params.id,
            {
                isCompleted: true,
                completedDate: new Date(),
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error('Error completing event:', error);
        res.status(500).json({ error: 'Failed to complete event' });
    }
});

// ============== TRIGGER REMINDER (Manual) ==============
router.post('/:id/remind', async (req, res) => {
    try {
        const event = await SpecialEvent.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const result = await notifyTelegram('eventReminder', event);

        if (result.success) {
            // Track notification sent
            event.notificationsSent.push({
                sentAt: new Date(),
                channel: 'telegram',
                daysBefore: calculateDaysUntil(event.eventDate, event.isRecurring)
            });
            await event.save();
        }

        res.json(result);
    } catch (error) {
        console.error('Error sending reminder:', error);
        res.status(500).json({ error: 'Failed to send reminder' });
    }
});

// ============== CHECK & SEND DUE REMINDERS ==============
router.post('/check-reminders', async (req, res) => {
    try {
        const events = await SpecialEvent.find({
            isActive: true,
            reminderEnabled: true,
            isCompleted: false
        });

        const results = [];

        for (const event of events) {
            const daysUntil = calculateDaysUntil(event.eventDate, event.isRecurring);

            // Check if we should send a reminder
            if (event.reminderDaysBefore.includes(daysUntil)) {
                // Check if already sent for this day
                const alreadySent = event.notificationsSent.some(n =>
                    n.daysBefore === daysUntil &&
                    isToday(n.sentAt)
                );

                if (!alreadySent) {
                    const type = daysUntil === 0 ? 'eventToday' : 'eventReminder';
                    const result = await notifyTelegram(type, event, daysUntil);

                    if (result.success) {
                        event.notificationsSent.push({
                            sentAt: new Date(),
                            channel: 'telegram',
                            daysBefore: daysUntil
                        });
                        await event.save();
                        results.push({ event: event.title, status: 'sent', daysUntil });
                    } else {
                        results.push({ event: event.title, status: 'failed', error: result.error });
                    }
                }
            }
        }

        res.json({ checked: events.length, results });
    } catch (error) {
        console.error('Error checking reminders:', error);
        res.status(500).json({ error: 'Failed to check reminders' });
    }
});

// ============== GET EVENT CATEGORIES ==============
router.get('/meta/categories', async (req, res) => {
    try {
        const categories = await SpecialEvent.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// ============== HELPER FUNCTIONS ==============

function calculateDaysUntil(eventDate, isRecurring = false) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let targetDate = new Date(eventDate);
    targetDate.setHours(0, 0, 0, 0);

    // For recurring yearly events, find next occurrence
    if (isRecurring) {
        targetDate.setFullYear(today.getFullYear());
        if (targetDate < today) {
            targetDate.setFullYear(today.getFullYear() + 1);
        }
    }

    const diffTime = targetDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
}

async function notifyTelegram(type, event, daysUntil = null) {
    try {
        const settings = await TelegramSettings.findOne({ key: 'telegram' });

        // Use database settings or fallback to environment variables
        const botToken = settings?.botToken || process.env.TELEGRAM_BOT_TOKEN;
        const chatId = settings?.chatId || process.env.TELEGRAM_CHAT_ID;
        const notificationsEnabled = settings?.notificationsEnabled !== false; // Default to true

        if (!botToken || !chatId) {
            return { success: false, error: 'Telegram not configured' };
        }

        telegramService.setToken(botToken);

        const template = settings?.templates?.[type] || null;
        const dateStr = new Date(event.eventDate).toLocaleDateString();
        const timeStr = event.eventTime ? ` ⏰ ${event.eventTime}` : '';

        if (type === 'eventToday') {
            return telegramService.sendEventCelebration(chatId, event, template);
        } else if (type === 'eventReminder') {
            return telegramService.sendEventReminder(chatId, event, daysUntil, template);
        } else if (type === 'eventCreated') {
            const message = `📌 *New Event Created!*\n\n${event.icon} *${event.title}*\n📅 ${dateStr}${timeStr}\n\n${event.description || ''}`;
            return telegramService.sendMessage(chatId, message);
        } else if (type === 'eventNow') {
            // Immediate alert for events happening NOW or within 30 minutes
            const message = `🎉 *IT'S TIME!*\n\n${event.icon} *${event.title}*\n📅 ${dateStr}${timeStr}\n\n${event.celebrationMode?.specialMessage || event.description || 'Time to celebrate! 🥳🎊'}\n\n✨ _Have a wonderful time!_`;
            return telegramService.sendMessage(chatId, message);
        }

        return { success: false, error: 'Unknown notification type' };
    } catch (error) {
        console.error('Telegram notify error:', error);
        return { success: false, error: error.message };
    }
}

module.exports = router;
