const fs = require('fs');
const deepfakeService = require('../services/deepfakeService');
const DetectionHistory = require('../models/DetectionHistory');

// Detect deepfake and save history
const detectDeepfake = async (req, res) => {
  const startTime = Date.now();

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { detectionType } = req.body;

    const validTypes = ['image', 'video', 'audio'];
    if (!detectionType || !validTypes.includes(detectionType)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Invalid detection type. Must be image, video, or audio.'
      });
    }

    // Run detection
    const detectionResult = await deepfakeService.detectDeepfake(req.file.path, detectionType);

    // Save scan to DB
    await DetectionHistory.create({
      user: req.user._id,
      fileName: req.file.originalname,
      detectionType,
      result: detectionResult.classification,
      confidence: detectionResult.confidence,
      provider: detectionResult.provider,
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);

    res.json({
      success: true,
      result: detectionResult.classification,
      confidence: detectionResult.confidence,
      details: detectionResult.details,
      processingTime: parseFloat(processingTime),
      metadata: {
        filename: req.file.originalname,
        fileSize: req.file.size,
        detectionType,
        provider: detectionResult.provider,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Detection error:', error);
    if (req.file) fs.unlinkSync(req.file.path);

    res.status(500).json({
      success: false,
      message: 'Error processing file for deepfake detection',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};


// Get user's scan history with pagination & filters
const getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, detectionType, result } = req.query;
    
    const filter = { user: req.user._id };
    if (detectionType) filter.detectionType = detectionType;
    if (result) filter.result = result;

    const history = await DetectionHistory.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await DetectionHistory.countDocuments(filter);

    res.json({
      success: true,
      data: history,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single scan by ID
const getHistoryById = async (req, res) => {
  try {
    const scan = await DetectionHistory.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan not found' });
    }

    res.json({ success: true, data: scan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete scan from history
const deleteHistory = async (req, res) => {
  try {
    const scan = await DetectionHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan not found' });
    }

    res.json({ success: true, message: 'Scan deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user statistics
const getStats = async (req, res) => {
  try {
    const totalScans = await DetectionHistory.countDocuments({ user: req.user._id });
    
    const resultStats = await DetectionHistory.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$result', count: { $sum: 1 } } }
    ]);

    const typeStats = await DetectionHistory.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$detectionType', count: { $sum: 1 } } }
    ]);

    const avgConfidence = await DetectionHistory.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, avg: { $avg: '$confidence' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalScans,
        byResult: resultStats.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {}),
        byType: typeStats.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {}),
        avgConfidence: avgConfidence[0]?.avg || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  detectDeepfake, 
  getHistory, 
  getHistoryById, 
  deleteHistory, 
  getStats 
};
