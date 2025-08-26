const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

/**
 * Validate uploaded file
 */
const validateFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      await cleanupFile(file.path);
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 50MB.'
      });
    }

    // Validate file extension against mimetype
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeExtMap = {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/quicktime': ['.mov'],
      'video/avi': ['.avi'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/mp4': ['.m4a'],
      'audio/ogg': ['.ogg']
    };

    const expectedExtensions = mimeExtMap[file.mimetype];
    if (!expectedExtensions || !expectedExtensions.includes(extension)) {
      await cleanupFile(file.path);
      return res.status(400).json({
        success: false,
        message: `File extension ${extension} does not match detected file type ${file.mimetype}`
      });
    }

    // Additional validation for images using sharp
    if (file.mimetype.startsWith('image/')) {
      try {
        const metadata = await sharp(file.path).metadata();
        
        // Check image dimensions (reasonable limits)
        if (metadata.width > 8000 || metadata.height > 8000) {
          await cleanupFile(file.path);
          return res.status(400).json({
            success: false,
            message: 'Image dimensions too large. Maximum size is 8000x8000 pixels.'
          });
        }
        
        // Check for valid image format
        if (!metadata.format) {
          await cleanupFile(file.path);
          return res.status(400).json({
            success: false,
            message: 'Invalid or corrupted image file.'
          });
        }
        
      } catch (error) {
        await cleanupFile(file.path);
        return res.status(400).json({
          success: false,
          message: 'Invalid or corrupted image file.'
        });
      }
    }

    // Check for common malicious file patterns
    const suspiciousPatterns = [
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.pif$/i,
      /\.jar$/i,
      /\.sh$/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(file.originalname))) {
      await cleanupFile(file.path);
      return res.status(400).json({
        success: false,
        message: 'File type not allowed for security reasons.'
      });
    }

    next();
  } catch (error) {
    console.error('File validation error:', error);
    
    if (req.file) {
      await cleanupFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error validating file'
    });
  }
};

/**
 * Clean up uploaded file
 */
const cleanupFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Cleaned up file: ${filePath}`);
  } catch (error) {
    console.error(`Error cleaning up file ${filePath}:`, error.message);
  }
};

/**
 * Clean up old temporary files (older than 1 hour)
 */
const cleanupOldFiles = async () => {
  try {
    const tempDir = process.env.TEMP_PATH || './temp';
    const files = await fs.readdir(tempDir);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtime.getTime() > oneHour) {
        await fs.unlink(filePath);
        console.log(`Cleaned up old file: ${filePath}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old files:', error);
  }
};

/**
 * Schedule cleanup every 30 minutes
 */
setInterval(cleanupOldFiles, 30 * 60 * 1000);

module.exports = {
  validateFile,
  cleanupFile,
  cleanupOldFiles
};