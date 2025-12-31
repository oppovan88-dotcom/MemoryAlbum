// Memory Model
const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    imageUrl: String,
    imageData: String, // Base64 encoded image for cloud storage
    date: { type: Date, default: Date.now },
    order: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Memory', memorySchema);
