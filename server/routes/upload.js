// Upload Routes
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { upload } = require('../config/multer');
const { cloudinary } = require('../config/cloudinary');
const { authMiddleware } = require('../middleware');

// Image Upload Route - uploads to Cloudinary
router.post('/', authMiddleware, (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: err.message || 'File upload failed' });
        }

        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('File uploaded locally:', req.file.filename);

        try {
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'memoryalbum',
                resource_type: 'image',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' }, // Max size
                    { quality: 'auto:good' } // Auto optimize quality
                ]
            });

            console.log('Cloudinary upload success:', result.secure_url);

            // Clean up local file
            fs.unlinkSync(req.file.path);

            // Return Cloudinary URL
            res.json({
                imageUrl: result.secure_url,
                publicId: result.public_id,
                filename: req.file.filename
            });
        } catch (cloudError) {
            console.error('Cloudinary error:', cloudError);
            // Clean up local file on error
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ error: 'Failed to upload to cloud storage' });
        }
    });
});

module.exports = router;
