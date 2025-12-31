// Keep-Alive Service - Prevents server from sleeping on free hosting (Render.com)
// Pings the server health endpoint every 14 minutes to keep it awake

const https = require('https');
const http = require('http');

class KeepAliveService {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
        this.pingIntervalMs = 14 * 60 * 1000; // 14 minutes (Render sleeps after 15 min)
        this.lastPing = null;
        this.pingCount = 0;
        this.serverUrl = null;
    }

    // Start the keep-alive service
    start(serverUrl) {
        if (this.isRunning) {
            console.log('💓 Keep-Alive already running');
            return;
        }

        // Set server URL from environment or parameter
        this.serverUrl = serverUrl || process.env.SERVER_URL || null;

        if (!this.serverUrl) {
            console.log('⚠️ Keep-Alive: No SERVER_URL set, service will not run (local dev mode)');
            return;
        }

        console.log(`💓 Starting Keep-Alive Service for: ${this.serverUrl}`);
        this.isRunning = true;

        // Wait 5 minutes before first ping (give server time to fully initialize)
        setTimeout(() => {
            this.ping();

            // Then ping every 14 minutes
            this.intervalId = setInterval(() => {
                this.ping();
            }, this.pingIntervalMs);
        }, 5 * 60 * 1000);

        console.log('✅ Keep-Alive started - pinging every 14 minutes');
    }

    // Stop the keep-alive service
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log('⏹️ Keep-Alive stopped');
    }

    // Ping the health endpoint
    async ping() {
        if (!this.serverUrl) return;

        const healthUrl = `${this.serverUrl}/api/health`;
        const protocol = healthUrl.startsWith('https') ? https : http;

        try {
            const startTime = Date.now();

            const response = await new Promise((resolve, reject) => {
                const req = protocol.get(healthUrl, { timeout: 30000 }, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        resolve({
                            statusCode: res.statusCode,
                            data: data,
                            responseTime: Date.now() - startTime
                        });
                    });
                });

                req.on('error', reject);
                req.on('timeout', () => {
                    req.destroy();
                    reject(new Error('Request timed out'));
                });
            });

            this.lastPing = new Date();
            this.pingCount++;

            console.log(`💓 Keep-Alive ping #${this.pingCount} | Status: ${response.statusCode} | Response time: ${response.responseTime}ms`);

            return {
                success: true,
                statusCode: response.statusCode,
                responseTime: response.responseTime
            };
        } catch (error) {
            console.error(`❌ Keep-Alive ping failed:`, error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Manual ping for testing
    async triggerPing() {
        console.log('🔧 Manual Keep-Alive ping triggered...');
        return await this.ping();
    }

    // Get service status
    getStatus() {
        return {
            isRunning: this.isRunning,
            serverUrl: this.serverUrl,
            lastPing: this.lastPing,
            pingCount: this.pingCount,
            pingIntervalMs: this.pingIntervalMs
        };
    }
}

// Singleton instance
const keepAliveService = new KeepAliveService();

module.exports = { KeepAliveService, keepAliveService };
