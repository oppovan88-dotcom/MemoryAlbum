// Auth Routes
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { authMiddleware } = require('../middleware');

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

        if (!admin) {
            console.log('Admin not found for email:', email);
            return res.status(401).json({ error: 'Email not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: 'Wrong password' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Debug endpoint - check what email is registered
router.get('/check', async (req, res) => {
    try {
        const admin = await Admin.findOne({});
        res.json({
            registeredEmail: admin ? admin.email : 'No admin found',
            envEmail: process.env.ADMIN_EMAIL
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current admin
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password');
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create default admin helper
const createDefaultAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await Admin.create({
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                name: 'Administrator'
            });
            console.log('✅ Default admin created');
        } else {
            // Update password if it changed
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await Admin.findOneAndUpdate(
                { email: process.env.ADMIN_EMAIL },
                { password: hashedPassword }
            );
            console.log('✅ Admin password updated');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

module.exports = { router, createDefaultAdmin };
