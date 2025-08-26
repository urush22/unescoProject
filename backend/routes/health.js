const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Deepfake Detection Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Detailed health check with dependencies
router.get('/detailed', (req, res) => {
  const healthCheck = {
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      api: 'healthy',
      sightengine: process.env.SIGHTENGINE_API_USER ? 'configured' : 'not_configured',
      deepware: process.env.DEEPWARE_API_KEY ? 'configured' : 'not_configured',
      sensity: process.env.SENSITY_API_KEY ? 'configured' : 'not_configured'
    },
    memory: {
      used: process.memoryUsage().heapUsed / 1024 / 1024,
      total: process.memoryUsage().heapTotal / 1024 / 1024
    }
  };

  res.status(200).json(healthCheck);
});

module.exports = router;