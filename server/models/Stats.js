// Stats Model
const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    pageViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    messages: { type: Number, default: 0 }
});

module.exports = mongoose.model('Stats', statsSchema);
