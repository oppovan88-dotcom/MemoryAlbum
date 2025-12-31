// Visitor Model
const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    ip: String,
    userAgent: String,
    page: String,
    country: String,
    visitedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', visitorSchema);
