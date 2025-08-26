const fs = require('fs').promises;
const path = require('path');

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

    // Basic file validation for images (without sharp)
    if (file.mimetype.startsWith('image/')) {
      try {
        // Basic file size check for images
        if (file.size < 100) { // Too small to be a valid image
          await cleanupFile(file.path);
          return res.status(400).json({
            success: false,
            message: 'File appears to be corrupted or invalid.'
          });
        }
        
        // Basic file header check
        const buffer = await fs.readFile(file.path);
        const isValidImage = isValidImageBuffer(buffer, file.mimetype);
        
        if (!isValidImage) {
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
 * Basic image validation using file headers (magic numbers)
 */
const isValidImageBuffer = (buffer, mimetype) => {
  if (buffer.length < 4) return false;

  const header = buffer.toString('hex', 0, 4).toUpperCase();
  
  switch (mimetype) {
    case 'image/jpeg':
      return header.startsWith('FFD8');
    case 'image/png':
      return header.startsWith('8950');
    case 'image/webp':
      return buffer.toString('ascii', 0, 4) === 'RIFF' && 
             buffer.toString('ascii', 8, 12) === 'WEBP';
    default:
      return true; // Allow other types to pass basic validation
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