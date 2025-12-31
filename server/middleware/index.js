// Middleware Index
const { authMiddleware, strictAuthMiddleware } = require('./auth');

module.exports = {
    authMiddleware,
    strictAuthMiddleware
};
