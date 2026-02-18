const mongoose = require('mongoose');

const detectionHistorySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true  // ← Added for performance
  },
  fileName: { type: String, required: true },
  detectionType: { type: String, enum: ['image', 'video', 'audio'], required: true },
  result: { type: String, enum: ['authentic', 'suspicious', 'deepfake'], required: true },
  confidence: { type: Number, required: true, min: 0, max: 1 },
  provider: { type: String, required: true },
}, {
  timestamps: true  // This auto-creates createdAt and updatedAt, so remove your manual 'timestamp' field
});

// Compound indexes for common queries
detectionHistorySchema.index({ user: 1, createdAt: -1 });
detectionHistorySchema.index({ user: 1, result: 1 });
detectionHistorySchema.index({ user: 1, detectionType: 1 });

module.exports = mongoose.model('DetectionHistory', detectionHistorySchema);