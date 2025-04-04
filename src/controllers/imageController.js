const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const storageService = require('../services/storageService');
const compressionService = require('../services/compressionService');

// Display home page with upload form and image list
const getHomePage = async (req, res) => {
  try {
    const images = storageService.getAllImages();
    const analytics = storageService.getAnalytics();
    
    // Sort images by date (newest first)
    const sortedImages = images.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    
    res.render('index', { 
      images: sortedImages, 
      analytics 
    });
  } catch (error) {
    console.error('Error rendering homepage:', error);
    res.status(500).render('error', { message: 'Failed to load home page' });
  }
};

// Handle image upload and compression
const uploadAndCompressImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).render('error', { message: 'No image file uploaded' });
    }
    
    const originalFilePath = req.file.path;
    const originalFilename = req.file.filename;
    const outputFilename = `compressed-${Date.now()}${path.extname(originalFilename)}`;
    
    // Get compression options from form
    const options = {
      quality: parseInt(req.body.quality || 80),
      width: req.body.width ? parseInt(req.body.width) : null,
      height: req.body.height ? parseInt(req.body.height) : null,
      format: req.body.format || path.extname(originalFilename).substring(1) || 'jpeg'
    };
    
    // Compress the image
    const compressionResult = await compressionService.compressImage(
      originalFilePath,
      outputFilename,
      options
    );
    
    if (!compressionResult.success) {
      return res.status(500).render('error', { message: `Image compression failed: ${compressionResult.error}` });
    }
    
    // Save image data to storage
    const imageData = {
      id: uuidv4(),
      originalFilename,
      compressedFilename: outputFilename,
      originalSize: compressionResult.originalSize,
      compressedSize: compressionResult.compressedSize,
      compressionRatio: compressionResult.compressionRatio,
      width: compressionResult.width,
      height: compressionResult.height,
      format: compressionResult.format,
      quality: compressionResult.quality,
      uploadDate: new Date().toISOString()
    };
    
    storageService.saveImage(imageData);
    
    res.redirect(`/images/${imageData.id}`);
  } catch (error) {
    console.error('Error uploading and compressing image:', error);
    res.status(500).render('error', { message: 'Failed to upload and compress image' });
  }
};

// Display image details
const getImageDetails = (req, res) => {
  try {
    const imageId = req.params.id;
    const image = storageService.getImageById(imageId);
    
    if (!image) {
      return res.status(404).render('error', { message: 'Image not found' });
    }
    
    res.render('imageDetails', { image });
  } catch (error) {
    console.error('Error getting image details:', error);
    res.status(500).render('error', { message: 'Failed to get image details' });
  }
};

// Download compressed image
const downloadImage = (req, res) => {
  try {
    const imageId = req.params.id;
    const image = storageService.getImageById(imageId);
    
    if (!image) {
      return res.status(404).render('error', { message: 'Image not found' });
    }
    
    const filePath = path.join(__dirname, '../../public/compressed', image.compressedFilename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).render('error', { message: 'Compressed image file not found' });
    }
    
    res.download(filePath, `compressed-image.${image.format}`);
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).render('error', { message: 'Failed to download image' });
  }
};

// Delete image
const deleteImage = (req, res) => {
  try {
    const imageId = req.params.id;
    const result = storageService.deleteImage(imageId);
    
    if (!result) {
      return res.status(404).render('error', { message: 'Image not found or could not be deleted' });
    }
    
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).render('error', { message: 'Failed to delete image' });
  }
};

// Get analytics data for chart
const getAnalyticsData = (req, res) => {
  try {
    const analytics = storageService.getAnalytics();
    const images = storageService.getAllImages();
    
    // Generate additional data for charts
    const formatsData = {};
    const sizesData = [];
    
    images.forEach(img => {
      // Count by format
      if (formatsData[img.format]) {
        formatsData[img.format]++;
      } else {
        formatsData[img.format] = 1;
      }
      
      // Collect size data
      sizesData.push({
        id: img.id,
        original: img.originalSize,
        compressed: img.compressedSize,
        ratio: parseFloat(img.compressionRatio),
        date: new Date(img.uploadDate).toLocaleDateString()
      });
    });
    
    res.json({
      analytics,
      formatsData,
      sizesData
    });
  } catch (error) {
    console.error('Error getting analytics data:', error);
    res.status(500).json({ error: 'Failed to get analytics data' });
  }
};

module.exports = {
  getHomePage,
  uploadAndCompressImage,
  getImageDetails,
  downloadImage,
  deleteImage,
  getAnalyticsData
}; 