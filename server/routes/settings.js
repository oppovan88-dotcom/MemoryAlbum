// Settings Routes
const express = require('express');
const router = express.Router();
const fs = require('fs');
const SiteSettings = require('../models/SiteSettings');
const { authMiddleware } = require('../middleware');
const { upload } = require('../config/multer');
const { cloudinary } = require('../config/cloudinary');

// Get settings
router.get('/', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne({ key: 'relationship' });
        if (!settings) {
            // Create default settings
            settings = await SiteSettings.create({ key: 'relationship' });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update settings
router.put('/', authMiddleware, async (req, res) => {
    try {
        const settings = await SiteSettings.findOneAndUpdate(
            { key: 'relationship' },
            { ...req.body, updatedAt: Date.now() },
            { new: true, upsert: true }
        );
        res.json(settings);
    } catch (error) {
        console.error('Settings update error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Upload Person 1 Photo
router.post('/upload/person1', authMiddleware, (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: err.message || 'File upload failed' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            // Get current settings to check for old photo
            const currentSettings = await SiteSettings.findOne({ key: 'relationship' });

            // Delete old photo from Cloudinary if exists
            if (currentSettings?.person1Photo && currentSettings.person1Photo.includes('cloudinary.com')) {
                try {
                    const urlParts = currentSettings.person1Photo.split('/');
                    const uploadIndex = urlParts.indexOf('upload');
                    if (uploadIndex !== -1) {
                        const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
                        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
                        await cloudinary.uploader.destroy(publicId);
                        console.log('🗑️ Old person1 photo deleted from Cloudinary');
                    }
                } catch (deleteErr) {
                    console.error('Failed to delete old photo:', deleteErr.message);
                }
            }

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'memoryalbum/profiles',
                resource_type: 'image',
                transformation: [
                    { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                    { quality: 'auto:good' }
                ]
            });

            console.log('✅ Person1 photo uploaded:', result.secure_url);

            // Clean up local file
            fs.unlinkSync(req.file.path);

            // Update settings with new photo URL
            const settings = await SiteSettings.findOneAndUpdate(
                { key: 'relationship' },
                { person1Photo: result.secure_url, updatedAt: Date.now() },
                { new: true, upsert: true }
            );

            res.json({
                success: true,
                imageUrl: result.secure_url,
                settings
            });
        } catch (cloudError) {
            console.error('Cloudinary error:', cloudError);
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ error: 'Failed to upload to cloud storage' });
        }
    });
});

// Upload Person 2 Photo
router.post('/upload/person2', authMiddleware, (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: err.message || 'File upload failed' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            // Get current settings to check for old photo
            const currentSettings = await SiteSettings.findOne({ key: 'relationship' });

            // Delete old photo from Cloudinary if exists
            if (currentSettings?.person2Photo && currentSettings.person2Photo.includes('cloudinary.com')) {
                try {
                    const urlParts = currentSettings.person2Photo.split('/');
                    const uploadIndex = urlParts.indexOf('upload');
                    if (uploadIndex !== -1) {
                        const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
                        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
                        await cloudinary.uploader.destroy(publicId);
                        console.log('🗑️ Old person2 photo deleted from Cloudinary');
                    }
                } catch (deleteErr) {
                    console.error('Failed to delete old photo:', deleteErr.message);
                }
            }

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'memoryalbum/profiles',
                resource_type: 'image',
                transformation: [
                    { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                    { quality: 'auto:good' }
                ]
            });

            console.log('✅ Person2 photo uploaded:', result.secure_url);

            // Clean up local file
            fs.unlinkSync(req.file.path);

            // Update settings with new photo URL
            const settings = await SiteSettings.findOneAndUpdate(
                { key: 'relationship' },
                { person2Photo: result.secure_url, updatedAt: Date.now() },
                { new: true, upsert: true }
            );

            res.json({
                success: true,
                imageUrl: result.secure_url,
                settings
            });
        } catch (cloudError) {
            console.error('Cloudinary error:', cloudError);
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ error: 'Failed to upload to cloud storage' });
        }
    });
});

module.exports = router;
