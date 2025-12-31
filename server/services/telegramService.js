// Telegram Bot Service - Send notifications to Telegram
const axios = require('axios');

class TelegramService {
    constructor(botToken = null) {
        this.botToken = botToken;
        this.baseUrl = botToken ? `https://api.telegram.org/bot${botToken}` : null;
    }

    // Set bot token dynamically
    setToken(token) {
        this.botToken = token;
        this.baseUrl = `https://api.telegram.org/bot${token}`;
    }

    // Test bot connection
    async testConnection() {
        try {
            if (!this.baseUrl) {
                return { success: false, error: 'Bot token not configured' };
            }
            const response = await axios.get(`${this.baseUrl}/getMe`);
            if (response.data.ok) {
                return {
                    success: true,
                    bot: response.data.result,
                    username: response.data.result.username
                };
            }
            return { success: false, error: 'Invalid response' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get chat info
    async getChatInfo(chatId) {
        try {
            const response = await axios.get(`${this.baseUrl}/getChat`, {
                params: { chat_id: chatId }
            });
            return { success: true, chat: response.data.result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Send message to chat
    async sendMessage(chatId, text, options = {}) {
        try {
            if (!this.baseUrl) {
                console.log('📢 Telegram not configured, message:', text);
                return { success: false, error: 'Bot token not configured' };
            }

            const response = await axios.post(`${this.baseUrl}/sendMessage`, {
                chat_id: chatId,
                text: text,
                parse_mode: options.parseMode || 'Markdown',
                disable_web_page_preview: options.disablePreview || false,
                disable_notification: options.silent || false,
                ...options
            });

            if (response.data.ok) {
                console.log('✅ Telegram message sent successfully');
                return { success: true, messageId: response.data.result.message_id };
            }
            return { success: false, error: 'Failed to send message' };
        } catch (error) {
            console.error('❌ Telegram send error:', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.description || error.message };
        }
    }

    // Send photo with caption
    async sendPhoto(chatId, photoUrl, caption = '') {
        try {
            if (!this.baseUrl) {
                return { success: false, error: 'Bot token not configured' };
            }

            const response = await axios.post(`${this.baseUrl}/sendPhoto`, {
                chat_id: chatId,
                photo: photoUrl,
                caption: caption,
                parse_mode: 'Markdown'
            });

            return { success: response.data.ok };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Send event reminder
    async sendEventReminder(chatId, event, daysLeft, template = null) {
        const defaultTemplate = '🔔 *Reminder!*\n\n{icon} *{title}*\n📅 {date}{time}\n⏰ {daysLeft} days left!\n\n{description}';
        const messageTemplate = template || defaultTemplate;

        const eventDate = new Date(event.eventDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const timeStr = event.eventTime ? ` at ${event.eventTime}` : '';

        const message = messageTemplate
            .replace('{icon}', event.icon || '🎉')
            .replace('{title}', event.title)
            .replace('{date}', eventDate)
            .replace('{time}', timeStr)
            .replace('{daysLeft}', daysLeft)
            .replace('{description}', event.description || '');

        return this.sendMessage(chatId, message);
    }

    // Send event day celebration
    async sendEventCelebration(chatId, event, template = null) {
        const defaultTemplate = '🎉 *TODAY IS THE DAY!*\n\n{icon} *{title}*{time}\n\n{specialMessage}';
        const messageTemplate = template || defaultTemplate;

        const timeStr = event.eventTime ? `\n⏰ Time: ${event.eventTime}` : '';

        const message = messageTemplate
            .replace('{icon}', event.icon || '🎉')
            .replace('{title}', event.title)
            .replace('{time}', timeStr)
            .replace('{specialMessage}', event.celebrationMode?.specialMessage || 'Have a wonderful celebration! 🥳');

        return this.sendMessage(chatId, message);
    }

    // Send new memory notification
    async sendMemoryNotification(chatId, memory, template = null) {
        const defaultTemplate = '📷 *New Memory Added!*\n\n*{title}*\n📅 {date}\n\n{description}';
        const messageTemplate = template || defaultTemplate;

        const message = messageTemplate
            .replace('{title}', memory.title)
            .replace('{date}', new Date(memory.date).toLocaleDateString())
            .replace('{description}', memory.description || '');

        // If memory has image, send with photo
        if (memory.imageUrl) {
            return this.sendPhoto(chatId, memory.imageUrl, message);
        }
        return this.sendMessage(chatId, message);
    }

    // Send new message notification
    async sendMessageNotification(chatId, msg, template = null) {
        const defaultTemplate = '💬 *New Message!*\n\nFrom: {name}\n\n_{message}_';
        const messageTemplate = template || defaultTemplate;

        const text = messageTemplate
            .replace('{name}', msg.name || 'Anonymous')
            .replace('{message}', msg.content || msg.message || '');

        return this.sendMessage(chatId, text);
    }

    // Format event list for Telegram
    formatEventList(events) {
        if (!events.length) {
            return '📅 *No upcoming events*';
        }

        let message = '📅 *Upcoming Events*\n\n';

        events.forEach((event, index) => {
            const daysLeft = event.daysUntil || this.calculateDaysUntil(event.eventDate);
            const dateStr = new Date(event.eventDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });

            const urgency = daysLeft === 0 ? '🔴' : daysLeft <= 3 ? '🟡' : '🟢';
            const daysText = daysLeft === 0 ? 'TODAY!' : `${daysLeft}d`;

            message += `${urgency} ${event.icon} *${event.title}*\n`;
            message += `   📅 ${dateStr} (${daysText})\n\n`;
        });

        return message;
    }

    // Calculate days until date
    calculateDaysUntil(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(date);
        eventDate.setHours(0, 0, 0, 0);
        const diffTime = eventDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

// Singleton instance
const telegramService = new TelegramService();

module.exports = { TelegramService, telegramService };
