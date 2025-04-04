const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');

/**
 * Compress an image file using Sharp
 * @param {string} inputPath - Path to the original image
 * @param {string} outputFilename - Filename for the compressed image
 * @param {Object} options - Compression options
 * @returns {Promise<Object>} - Object containing compression results
 */
const compressImage = async (inputPath, outputFilename, options = {}) => {
  try {
    const outputPath = path.join(__dirname, '../../public/compressed', outputFilename);
    
    // Get original file size
    const originalStats = await fs.stat(inputPath);
    const originalSize = originalStats.size;
    
    // Default compression options
    const defaultOptions = {
      quality: options.quality || 80,
      width: options.width || null,
      height: options.height || null,
      format: options.format || 'jpeg'
    };
    
    // Process image with Sharp
    let sharpInstance = sharp(inputPath);
    
    // Resize if width or height is provided
    if (defaultOptions.width || defaultOptions.height) {
      sharpInstance = sharpInstance.resize({
        width: defaultOptions.width,
        height: defaultOptions.height,
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convert to specified format with quality settings
    if (defaultOptions.format === 'jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality: defaultOptions.quality });
    } else if (defaultOptions.format === 'png') {
      sharpInstance = sharpInstance.png({ quality: defaultOptions.quality });
    } else if (defaultOptions.format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality: defaultOptions.quality });
    } else if (defaultOptions.format === 'avif') {
      sharpInstance = sharpInstance.avif({ quality: defaultOptions.quality });
    }
    
    // Save the processed image
    await sharpInstance.toFile(outputPath);
    
    // Get compressed file size
    const compressedStats = await fs.stat(outputPath);
    const compressedSize = compressedStats.size;
    
    // Get dimensions of the compressed image
    const metadata = await sharp(outputPath).metadata();
    
    return {
      originalSize,
      compressedSize,
      compressionRatio: ((originalSize - compressedSize) / originalSize * 100).toFixed(2),
      format: defaultOptions.format,
      quality: defaultOptions.quality,
      width: metadata.width,
      height: metadata.height,
      success: true
    };
  } catch (error) {
    console.error('Error compressing image:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  compressImage
}; 