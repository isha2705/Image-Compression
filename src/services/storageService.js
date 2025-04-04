const fs = require('fs-extra');
const path = require('path');

// Path to our local JSON database file
const dbPath = path.join(__dirname, '../../data');
const imagesDbPath = path.join(dbPath, 'images.json');

// Ensure data directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

// Initialize images.json if it doesn't exist
if (!fs.existsSync(imagesDbPath)) {
  fs.writeJSONSync(imagesDbPath, { images: [], analytics: { totalCompression: 0, totalSaved: 0, count: 0 } });
}

// Get all images from local storage
const getAllImages = () => {
  try {
    const data = fs.readJSONSync(imagesDbPath);
    return data.images;
  } catch (error) {
    console.error('Error reading images from local storage:', error);
    return [];
  }
};

// Get image by ID
const getImageById = (id) => {
  try {
    const data = fs.readJSONSync(imagesDbPath);
    return data.images.find(image => image.id === id);
  } catch (error) {
    console.error(`Error finding image with ID ${id}:`, error);
    return null;
  }
};

// Save image data to local storage
const saveImage = (imageData) => {
  try {
    const data = fs.readJSONSync(imagesDbPath);
    data.images.push(imageData);
    
    // Update analytics
    const compressionRatio = (imageData.originalSize - imageData.compressedSize) / imageData.originalSize * 100;
    const bytesSaved = imageData.originalSize - imageData.compressedSize;
    
    data.analytics.totalCompression += compressionRatio;
    data.analytics.totalSaved += bytesSaved;
    data.analytics.count += 1;
    
    fs.writeJSONSync(imagesDbPath, data);
    return imageData;
  } catch (error) {
    console.error('Error saving image data:', error);
    return null;
  }
};

// Delete image by ID
const deleteImage = (id) => {
  try {
    const data = fs.readJSONSync(imagesDbPath);
    const imageIndex = data.images.findIndex(image => image.id === id);
    
    if (imageIndex === -1) {
      return false;
    }
    
    // Get the image to be deleted
    const deletedImage = data.images[imageIndex];
    
    // Remove from array
    data.images.splice(imageIndex, 1);
    
    // Update analytics
    if (data.analytics.count > 0) {
      const compressionRatio = (deletedImage.originalSize - deletedImage.compressedSize) / deletedImage.originalSize * 100;
      const bytesSaved = deletedImage.originalSize - deletedImage.compressedSize;
      
      data.analytics.totalCompression -= compressionRatio;
      data.analytics.totalSaved -= bytesSaved;
      data.analytics.count -= 1;
    }
    
    fs.writeJSONSync(imagesDbPath, data);
    
    // Delete the actual files
    const originalPath = path.join(__dirname, '../../public/uploads', deletedImage.originalFilename);
    const compressedPath = path.join(__dirname, '../../public/compressed', deletedImage.compressedFilename);
    
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }
    
    if (fs.existsSync(compressedPath)) {
      fs.unlinkSync(compressedPath);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting image with ID ${id}:`, error);
    return false;
  }
};

// Get analytics data
const getAnalytics = () => {
  try {
    const data = fs.readJSONSync(imagesDbPath);
    return data.analytics;
  } catch (error) {
    console.error('Error getting analytics data:', error);
    return { totalCompression: 0, totalSaved: 0, count: 0 };
  }
};

module.exports = {
  getAllImages,
  getImageById,
  saveImage,
  deleteImage,
  getAnalytics
}; 