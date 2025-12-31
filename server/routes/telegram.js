// Telegram Settings Routes - Bot Configuration & Testing
const express = require('express');
const router = express.Router();
const TelegramSettings = require('../models/TelegramSettings');
const { telegramService } = require('../services/telegramService');

// ============== GET TELEGRAM SETTINGS ==============
router.get('/', async (req, res) => {
    try {
        let settings = await TelegramSettings.findOne({ key: 'telegram' });

        if (!settings) {
            // Create default settings
            settings = new TelegramSettings({ key: 'telegram' });
            await settings.save();
        }

        // Mask the bot token for security (show only last 4 chars)
        const maskedSettings = settings.toObject();
        if (maskedSettings.botToken) {
            maskedSettings.botTokenMasked = '***' + maskedSettings.botToken.slice(-10);
            maskedSettings.hasToken = true;
        } else {
            maskedSettings.hasToken = false;
        }

        res.json(maskedSettings);
    } catch (error) {
        console.error('Error fetching telegram settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// ============== UPDATE TELEGRAM SETTINGS ==============
router.put('/', async (req, res) => {
    try {
        const updates = req.body;

        // Don't update token if it's masked value
        if (updates.botToken && updates.botToken.startsWith('***')) {
            delete updates.botToken;
        }

        let settings = await TelegramSettings.findOne({ key: 'telegram' });

        if (!settings) {
            settings = new TelegramSettings({ key: 'telegram', ...updates });
        } else {
            Object.assign(settings, updates);
        }

        settings.updatedAt = Date.now();
        await settings.save();

        // Mask token in response
        const response = settings.toObject();
        if (response.botToken) {
            response.botTokenMasked = '***' + response.botToken.slice(-10);
            response.hasToken = true;
        }

        res.json(response);
    } catch (error) {
        console.error('Error updating telegram settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// ============== TEST BOT CONNECTION ==============
router.post('/test-connection', async (req, res) => {
    try {
        let { botToken } = req.body;

        // If no token provided, use stored token
        if (!botToken || botToken.startsWith('***')) {
            const settings = await TelegramSettings.findOne({ key: 'telegram' });
            botToken = settings?.botToken;
        }

        if (!botToken) {
            return res.status(400).json({ success: false, error: 'Bot token not provided' });
        }

        telegramService.setToken(botToken);
        const result = await telegramService.testConnection();

        if (result.success) {
            // Update settings with bot info
            await TelegramSettings.findOneAndUpdate(
                { key: 'telegram' },
                {
                    isConnected: true,
                    botUsername: result.bot.username,
                    lastChecked: new Date(),
                    lastError: ''
                }
            );
        }

        res.json(result);
    } catch (error) {
        console.error('Error testing connection:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============== SEND TEST MESSAGE ==============
router.post('/test-message', async (req, res) => {
    try {
        const settings = await TelegramSettings.findOne({ key: 'telegram' });

        if (!settings?.botToken) {
            return res.status(400).json({ success: false, error: 'Bot token not configured' });
        }

        if (!settings?.chatId) {
            return res.status(400).json({ success: false, error: 'Chat ID not configured' });
        }

        telegramService.setToken(settings.botToken);

        const testMessage = `🧪 *Test Message from Memory Album*\n\n✅ Your Telegram integration is working!\n\n📅 ${new Date().toLocaleString()}\n\n_This message was sent from your admin dashboard._`;

        const result = await telegramService.sendMessage(settings.chatId, testMessage);

        res.json(result);
    } catch (error) {
        console.error('Error sending test message:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============== GET CHAT INFO ==============
router.post('/get-chat-info', async (req, res) => {
    try {
        const { chatId } = req.body;
        const settings = await TelegramSettings.findOne({ key: 'telegram' });

        if (!settings?.botToken) {
            return res.status(400).json({ success: false, error: 'Bot token not configured' });
        }

        telegramService.setToken(settings.botToken);

        const targetChatId = chatId || settings.chatId;
        if (!targetChatId) {
            return res.status(400).json({ success: false, error: 'Chat ID not provided' });
        }

        const result = await telegramService.getChatInfo(targetChatId);

        if (result.success) {
            // Update settings with chat info
            await TelegramSettings.findOneAndUpdate(
                { key: 'telegram' },
                {
                    chatId: targetChatId,
                    chatTitle: result.chat.title || result.chat.first_name || 'Unknown',
                    chatType: result.chat.type
                }
            );
        }

        res.json(result);
    } catch (error) {
        console.error('Error getting chat info:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============== GET BOT UPDATES (for getting chat ID) ==============
router.get('/updates', async (req, res) => {
    try {
        const settings = await TelegramSettings.findOne({ key: 'telegram' });

        if (!settings?.botToken) {
            return res.status(400).json({ success: false, error: 'Bot token not configured' });
        }

        const axios = require('axios');
        const response = await axios.get(`https://api.telegram.org/bot${settings.botToken}/getUpdates`);

        if (response.data.ok) {
            // Extract unique chats from updates
            const chats = [];
            const seen = new Set();

            response.data.result.forEach(update => {
                const chat = update.message?.chat || update.my_chat_member?.chat;
                if (chat && !seen.has(chat.id)) {
                    seen.add(chat.id);
                    chats.push({
                        id: chat.id,
                        type: chat.type,
                        title: chat.title || chat.first_name || chat.username || 'Unknown'
                    });
                }
            });

            res.json({ success: true, chats });
        } else {
            res.json({ success: false, error: 'Failed to get updates' });
        }
    } catch (error) {
        console.error('Error getting updates:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============== QUICK SETUP - Set token and chat ID ==============
router.post('/quick-setup', async (req, res) => {
    try {
        const { botToken, chatId } = req.body;

        if (!botToken || !chatId) {
            return res.status(400).json({ success: false, error: 'Bot token and Chat ID are required' });
        }

        // Test connection first
        telegramService.setToken(botToken);
        const connectionTest = await telegramService.testConnection();

        if (!connectionTest.success) {
            return res.status(400).json({ success: false, error: 'Invalid bot token: ' + connectionTest.error });
        }

        // Test chat access
        const chatInfo = await telegramService.getChatInfo(chatId);

        // Save settings
        let settings = await TelegramSettings.findOne({ key: 'telegram' });

        if (!settings) {
            settings = new TelegramSettings({ key: 'telegram' });
        }

        settings.botToken = botToken;
        settings.chatId = chatId;
        settings.botUsername = connectionTest.bot.username;
        settings.chatTitle = chatInfo.success ? (chatInfo.chat.title || chatInfo.chat.first_name) : 'Unknown';
        settings.chatType = chatInfo.success ? chatInfo.chat.type : 'group';
        settings.isConnected = true;
        settings.notificationsEnabled = true;
        settings.lastChecked = new Date();

        await settings.save();

        // Send welcome message
        const welcomeMessage = `🎉 *Memory Album Connected!*\n\n✅ Bot: @${connectionTest.bot.username}\n✅ Chat: ${settings.chatTitle}\n\n_You will now receive notifications for special events and milestones!_`;

        await telegramService.sendMessage(chatId, welcomeMessage);

        res.json({
            success: true,
            bot: connectionTest.bot,
            chat: chatInfo.chat,
            message: 'Telegram integration configured successfully!'
        });
    } catch (error) {
        console.error('Error in quick setup:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
