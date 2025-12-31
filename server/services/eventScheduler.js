// Event Scheduler Service - Auto-reminder system for birthdays, anniversaries, and special events
const { telegramService } = require('./telegramService');
const { SpecialEvent, SiteSettings, TelegramSettings } = require('../models');

class EventScheduler {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
        this.checkIntervalMs = 60 * 60 * 1000; // Check every hour
        this.lastCheck = null;
    }

    // Start the scheduler
    start() {
        if (this.isRunning) {
            console.log('📅 Event Scheduler already running');
            return;
        }

        console.log('🚀 Starting Event Scheduler...');
        this.isRunning = true;

        // Run immediately on start
        this.runScheduledTasks();

        // Then run every hour
        this.intervalId = setInterval(() => {
            this.runScheduledTasks();
        }, this.checkIntervalMs);

        console.log('✅ Event Scheduler started - checking every hour');
    }

    // Stop the scheduler
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log('⏹️ Event Scheduler stopped');
    }

    // Main task runner
    async runScheduledTasks() {
        try {
            console.log(`📅 [${new Date().toISOString()}] Running scheduled event checks...`);
            this.lastCheck = new Date();

            // Get Telegram settings
            const telegramSettings = await TelegramSettings.findOne({ key: 'telegram' });
            if (!telegramSettings?.botToken || !telegramSettings?.chatId) {
                // Try from env
                const botToken = process.env.TELEGRAM_BOT_TOKEN;
                const chatId = process.env.TELEGRAM_CHAT_ID;
                if (!botToken || !chatId) {
                    console.log('⚠️ Telegram not configured, skipping notifications');
                    return;
                }
                telegramService.setToken(botToken);
                this.chatId = chatId;
            } else {
                telegramService.setToken(telegramSettings.botToken);
                this.chatId = telegramSettings.chatId;
            }

            // 1. Sync auto-events from settings
            await this.syncAutoEvents();

            // 2. Check and send reminders for all events
            await this.checkAndSendReminders();

            console.log('✅ Scheduled tasks completed');
        } catch (error) {
            console.error('❌ Error in scheduled tasks:', error);
        }
    }

    // Sync automatic events from SiteSettings (birthdays, anniversary)
    async syncAutoEvents() {
        try {
            const settings = await SiteSettings.findOne({ key: 'main' });
            if (!settings) return;

            const currentYear = new Date().getFullYear();

            // Auto-create Person 1 Birthday
            if (settings.person1BirthDate) {
                await this.createOrUpdateAutoEvent({
                    autoId: 'birthday_person1',
                    title: `${settings.person1Name || 'Person 1'}'s Birthday 🎂`,
                    description: `Happy Birthday ${settings.person1Name}! 🎉🎁`,
                    icon: '🎂',
                    eventType: 'birthday',
                    birthDate: settings.person1BirthDate,
                    isRecurring: true,
                    recurringType: 'yearly',
                    associatedPerson: 'person1'
                });
            }

            // Auto-create Person 2 Birthday
            if (settings.person2BirthDate) {
                await this.createOrUpdateAutoEvent({
                    autoId: 'birthday_person2',
                    title: `${settings.person2Name || 'Person 2'}'s Birthday 🎂`,
                    description: `Happy Birthday ${settings.person2Name}! 🎉🎁`,
                    icon: '🎂',
                    eventType: 'birthday',
                    birthDate: settings.person2BirthDate,
                    isRecurring: true,
                    recurringType: 'yearly',
                    associatedPerson: 'person2'
                });
            }

            // Auto-create Anniversary
            if (settings.relationshipDate) {
                const startDate = new Date(settings.relationshipDate);
                const yearsTogetther = currentYear - startDate.getFullYear();
                await this.createOrUpdateAutoEvent({
                    autoId: 'anniversary',
                    title: `${yearsTogetther > 0 ? yearsTogetther + ' Year ' : ''}Anniversary 💕`,
                    description: `Celebrating ${yearsTogetther > 0 ? yearsTogetther + ' years of ' : ''}love together! 💑`,
                    icon: '💕',
                    eventType: 'anniversary',
                    birthDate: settings.relationshipDate,
                    isRecurring: true,
                    recurringType: 'yearly',
                    associatedPerson: 'both'
                });
            }

            // Auto-create New Year
            await this.createOrUpdateAutoEvent({
                autoId: 'new_year',
                title: `Happy New Year ${currentYear + 1}! 🎆`,
                description: `Wishing you a wonderful year ahead! 🥳🎊`,
                icon: '🎆',
                eventType: 'holiday',
                birthDate: `${currentYear + 1}-01-01`,
                isRecurring: true,
                recurringType: 'yearly',
                associatedPerson: 'both'
            });

            console.log('✅ Auto-events synced from settings');
        } catch (error) {
            console.error('❌ Error syncing auto events:', error);
        }
    }

    // Create or update an auto-generated event
    async createOrUpdateAutoEvent({ autoId, title, description, icon, eventType, birthDate, isRecurring, recurringType, associatedPerson }) {
        try {
            // Parse the date and set to current/next year
            const dateParts = birthDate.split('-');
            const month = parseInt(dateParts[1]) - 1;
            const day = parseInt(dateParts[2]);

            const now = new Date();
            let eventDate = new Date(now.getFullYear(), month, day);

            // If the date has passed this year, set to next year
            if (eventDate < now) {
                eventDate.setFullYear(now.getFullYear() + 1);
            }

            // Check if event already exists (by tag)
            let event = await SpecialEvent.findOne({ tags: autoId });

            if (event) {
                // Update existing event
                event.title = title;
                event.description = description;
                event.icon = icon;
                event.eventDate = eventDate;
                event.isRecurring = isRecurring;
                event.recurringType = recurringType;
                event.associatedPerson = associatedPerson;
                await event.save();
            } else {
                // Create new event
                event = new SpecialEvent({
                    title,
                    description,
                    icon,
                    eventType,
                    eventDate,
                    isRecurring,
                    recurringType,
                    associatedPerson,
                    tags: [autoId, 'auto-generated'],
                    reminderDaysBefore: [30, 14, 7, 3, 1, 0], // 1 month, 2 weeks, 1 week, 3 days, 1 day, day-of
                    reminderEnabled: true,
                    isActive: true,
                    celebrationMode: {
                        enabled: true,
                        duration: 24,
                        animation: 'confetti',
                        specialMessage: description
                    }
                });
                await event.save();
                console.log(`✨ Created auto-event: ${title}`);
            }
        } catch (error) {
            console.error(`❌ Error creating/updating auto event ${autoId}:`, error);
        }
    }

    // Check all events and send appropriate reminders
    async checkAndSendReminders() {
        try {
            const now = new Date();
            const events = await SpecialEvent.find({ isActive: true, reminderEnabled: true });

            for (const event of events) {
                await this.processEventReminders(event, now);
            }
        } catch (error) {
            console.error('❌ Error checking reminders:', error);
        }
    }

    // Process reminders for a single event
    async processEventReminders(event, now) {
        try {
            let eventDate = new Date(event.eventDate);

            // If eventTime is set, use it for exact time matching
            if (event.eventTime) {
                const [hours, minutes] = event.eventTime.split(':').map(Number);
                eventDate.setHours(hours, minutes, 0, 0);
            } else {
                // Default to 9 AM if no time set
                eventDate.setHours(9, 0, 0, 0);
            }

            // For recurring events, check if we need to calculate for this year
            if (event.isRecurring && event.recurringType === 'yearly') {
                const thisYear = new Date(now.getFullYear(), eventDate.getMonth(), eventDate.getDate(), eventDate.getHours(), eventDate.getMinutes());
                const nextYear = new Date(now.getFullYear() + 1, eventDate.getMonth(), eventDate.getDate(), eventDate.getHours(), eventDate.getMinutes());

                // Use this year if the date hasn't passed, otherwise use next year
                eventDate = thisYear >= now ? thisYear : nextYear;
            }

            // Calculate time differences
            const diffMs = eventDate - now;
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
            const diffMinutes = Math.ceil(diffMs / (1000 * 60));

            // Check each reminder interval
            const reminders = [
                { days: 30, label: '1 month', type: 'days' },
                { days: 14, label: '2 weeks', type: 'days' },
                { days: 7, label: '1 week', type: 'days' },
                { days: 3, label: '3 days', type: 'days' },
                { days: 1, label: '1 day', type: 'days' },
                { hours: 1, label: '1 hour', type: 'hours' },
                { days: 0, label: 'now', type: 'start' }
            ];

            for (const reminder of reminders) {
                const shouldSend = this.shouldSendReminder(event, reminder, diffDays, diffHours, diffMinutes, now);

                if (shouldSend) {
                    await this.sendReminderNotification(event, reminder, diffDays, diffHours);

                    // Record that we sent this notification
                    event.notificationsSent.push({
                        sentAt: now,
                        channel: 'telegram',
                        daysBefore: reminder.days || 0,
                        reminderType: reminder.type
                    });
                    await event.save();

                    // Only send one reminder per check (most urgent)
                    break;
                }
            }
        } catch (error) {
            console.error(`❌ Error processing reminders for ${event.title}:`, error);
        }
    }

    // Determine if we should send a reminder
    shouldSendReminder(event, reminder, diffDays, diffHours, diffMinutes, now) {
        // Check if this reminder was already sent recently (within 23 hours for daily, 50 minutes for hourly)
        const recentNotifications = event.notificationsSent.filter(n => {
            const hoursSinceNotification = (now - new Date(n.sentAt)) / (1000 * 60 * 60);
            if (reminder.type === 'hours') {
                return n.daysBefore === (reminder.hours || 0) && hoursSinceNotification < 0.9; // 54 minutes
            }
            return n.daysBefore === reminder.days && hoursSinceNotification < 23;
        });

        if (recentNotifications.length > 0) {
            return false;
        }

        // Check based on reminder type
        if (reminder.type === 'start') {
            // Event is starting now (within 30 minutes)
            return diffMinutes >= -30 && diffMinutes <= 30;
        } else if (reminder.type === 'hours') {
            // 1 hour before (between 45-75 minutes before)
            return diffMinutes >= 45 && diffMinutes <= 75;
        } else {
            // Days-based reminders (check if we're in the reminder day window)
            // Send between 8 AM and 10 AM if we're on the target day
            const hour = now.getHours();
            const isReminderDay = diffDays === reminder.days;
            const isGoodTime = hour >= 8 && hour <= 10;

            return isReminderDay && isGoodTime;
        }
    }

    // Send the actual reminder notification
    async sendReminderNotification(event, reminder, diffDays, diffHours) {
        try {
            let message = '';
            const eventDateStr = new Date(event.eventDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Add time if set
            const timeStr = event.eventTime ? `\n⏰ Time: ${event.eventTime}` : '';

            if (reminder.type === 'start') {
                // Event is starting NOW!
                message = `🎉 *IT'S TIME!*\n\n` +
                    `${event.icon} *${event.title}*\n\n` +
                    `📅 ${eventDateStr}${timeStr}\n\n` +
                    `${event.celebrationMode?.specialMessage || event.description || 'Time to celebrate! 🥳🎊'}\n\n` +
                    `✨ _Have a wonderful time!_`;
            } else if (reminder.type === 'hours') {
                // 1 hour reminder
                message = `⏰ *STARTING SOON!*\n\n` +
                    `${event.icon} *${event.title}*\n\n` +
                    `📅 ${eventDateStr}${timeStr}\n\n` +
                    `⏳ Only *1 hour* left!\n\n` +
                    `${event.description || ''}`;
            } else {
                // Days-based reminder
                const daysText = reminder.days === 1 ? 'Tomorrow' :
                    reminder.days === 0 ? 'Today' :
                        `In ${reminder.label}`;

                message = `🔔 *Reminder!*\n\n` +
                    `${event.icon} *${event.title}*\n\n` +
                    `📅 ${eventDateStr}${timeStr}\n` +
                    `⏳ *${daysText}!*\n\n` +
                    `${event.description || ''}\n\n` +
                    `${this.getCountdownEmoji(diffDays)}`;
            }

            // Send to Telegram
            const result = await telegramService.sendMessage(this.chatId, message);

            if (result.success) {
                console.log(`✅ Sent ${reminder.label} reminder for: ${event.title}`);
            } else {
                console.error(`❌ Failed to send reminder: ${result.error}`);
            }

            return result;
        } catch (error) {
            console.error(`❌ Error sending reminder notification:`, error);
            return { success: false, error: error.message };
        }
    }

    // Get countdown emoji based on days
    getCountdownEmoji(days) {
        if (days === 0) return '🎉 TODAY IS THE DAY!';
        if (days === 1) return '⚡ TOMORROW!';
        if (days <= 3) return '🔥 Almost here!';
        if (days <= 7) return '📆 Coming up soon!';
        if (days <= 14) return '📅 Mark your calendar!';
        return '🗓️ Save the date!';
    }

    // Manual trigger for testing
    async triggerCheck() {
        console.log('🔧 Manual trigger: Running scheduled tasks...');
        await this.runScheduledTasks();
    }

    // Get scheduler status
    getStatus() {
        return {
            isRunning: this.isRunning,
            lastCheck: this.lastCheck,
            checkIntervalMs: this.checkIntervalMs
        };
    }
}

// Singleton instance
const eventScheduler = new EventScheduler();

module.exports = { EventScheduler, eventScheduler };
