const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../utils/multerConfig');

// Home page - displays upload form only
router.get('/', imageController.getHomePage);

// Analytics overview page
router.get('/analytics', imageController.getAnalyticsPage);

// Image gallery page
router.get('/gallery', imageController.getGalleryPage);

// Upload and compress image
router.post('/upload', upload.single('image'), imageController.uploadAndCompressImage);

// View image details
router.get('/images/:id', imageController.getImageDetails);

// Download compressed image
router.get('/download/:id', imageController.downloadImage);

// Delete image
router.post('/delete/:id', imageController.deleteImage);

// Get analytics data for chart
router.get('/api/analytics', imageController.getAnalyticsData);

module.exports = router; 