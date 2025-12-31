// Database Configuration
const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        console.log('Database Name:', mongoose.connection.name);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = { connectDatabase, mongoose };
