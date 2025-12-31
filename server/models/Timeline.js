// Timeline Model
const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
    time: { type: String, required: true },
    activity: { type: String, required: true },
    details: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Timeline', timelineSchema);
