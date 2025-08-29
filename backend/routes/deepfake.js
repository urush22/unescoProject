const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

const deepfakeService = require('../services/deepfakeService');
const { validateFile, cleanupFile } = require('../middleware/fileMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.TEMP_PATH || './temp';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `deepfake_${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/avi',
      'audio/mpeg',
      'audio/wav',
      'audio/mp4',
      'audio/ogg'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, and audio files are allowed.'));
    }
  }
});

// POST /api/deepfake/detect - Main detection endpoint
router.post('/detect', 
  upload.single('file'),
  validateFile,
  async (req, res) => {
    const startTime = Date.now();
    
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const { detectionType } = req.body;
      
      // Validate detection type
      const validTypes = ['image', 'video', 'audio'];
      if (!detectionType || !validTypes.includes(detectionType)) {
        await cleanupFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Invalid detection type. Must be image, video, or audio.'
        });
      }

      console.log(`Processing ${detectionType} file: ${req.file.originalname}`);

      // Process the file through deepfake detection service
      const result = await deepfakeService.detectDeepfake(req.file.path, detectionType);
      console.log('[detect] provider=%s type=%s classification=%s confidence=%s', result.provider, detectionType, result.classification, result.confidence);
      
      // Calculate processing time
      const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);

      // Clean up the uploaded file
      await cleanupFile(req.file.path);

      // Format response to match frontend expectations
      const response = {
        success: true,
        result: result.classification, // 'authentic', 'deepfake', 'suspicious'
        confidence: Math.round(result.confidence * 100),
        details: result.details || [],
        processingTime: parseFloat(processingTime),
        metadata: {
          filename: req.file.originalname,
          fileSize: req.file.size,
          detectionType: detectionType,
          provider: result.provider,
          timestamp: new Date().toISOString()
        }
      };

      res.json(response);

    } catch (error) {
      console.error('Detection error:', error);
      
      // Clean up file on error
      if (req.file) {
        await cleanupFile(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: 'Error processing file for deepfake detection',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// GET /api/deepfake/providers - Get available detection providers
router.get('/providers', (req, res) => {
  const providers = deepfakeService.getAvailableProviders();
  res.json({
    success: true,
    providers: providers
  });
});

// POST /api/deepfake/batch - Batch processing (future enhancement)
router.post('/batch', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Batch processing not yet implemented'
  });
});

module.exports = router;