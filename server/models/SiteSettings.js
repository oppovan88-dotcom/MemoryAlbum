// SiteSettings Model
const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    // Person 1 (Left)
    person1Name: { type: String, default: 'Rith' },
    person1Age: { type: Number, default: 20 },
    person1Gender: { type: String, default: '♂' },
    person1Zodiac: { type: String, default: 'Pisces' },
    person1ZodiacSymbol: { type: String, default: '♓' },
    person1Photo: { type: String, default: './assets/images/1.jpg' },
    person1Tagline: { type: String, default: 'Rith Ft Ry' },
    // Person 2 (Right)
    person2Name: { type: String, default: 'Chanry' },
    person2Age: { type: Number, default: 19 },
    person2Gender: { type: String, default: '♀' },
    person2Zodiac: { type: String, default: 'Aries' },
    person2ZodiacSymbol: { type: String, default: '♈' },
    person2Photo: { type: String, default: './assets/images/7.jpg' },
    person2Tagline: { type: String, default: 'Ry Ft Rith' },
    // Relationship
    relationshipDate: { type: String, default: '2025-05-13' },
    // Timeline
    timelineTitle: { type: String, default: 'Love Timeline' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
