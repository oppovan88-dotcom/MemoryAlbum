// SiteSettings Model
const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    // Person 1 (Left)
    person1Name: { type: String, default: 'Rith' },
    person1BirthDate: { type: String, default: '2005-03-15' }, // Date of birth - age is auto-calculated
    person1Gender: { type: String, default: '♂' },
    person1Photo: { type: String, default: './assets/images/1.jpg' },
    person1Tagline: { type: String, default: 'Rith Ft Ry' },
    // Person 2 (Right)
    person2Name: { type: String, default: 'Chanry' },
    person2BirthDate: { type: String, default: '2006-04-01' }, // Date of birth - age is auto-calculated
    person2Gender: { type: String, default: '♀' },
    person2Photo: { type: String, default: './assets/images/7.jpg' },
    person2Tagline: { type: String, default: 'Ry Ft Rith' },
    // Relationship
    relationshipDate: { type: String, default: '2025-05-13' },
    // Timeline
    timelineTitle: { type: String, default: 'Love Timeline' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
