const { ImageAnnotatorClient } = require('@google-cloud/vision');
const fs = require('fs');

class GoogleCloudService {
  constructor() {
    this.config = {
      enabled: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
    };
    
    if (this.config.enabled) {
      this.client = new ImageAnnotatorClient();
    }
  }

  /**
   * Google Cloud Vision API integration
   */
  async detectWithGoogle(filePath, detectionType) {
    if (!this.config.enabled) {
      throw new Error('Google Cloud not configured');
    }

    try {
      if (detectionType === 'image') {
        return await this.analyzeImage(filePath);
      } else {
        throw new Error('Google Cloud Vision only supports image analysis');
      }
    } catch (error) {
      throw new Error(`Google Cloud error: ${error.message}`);
    }
  }

  async analyzeImage(filePath) {
    // Read the image file
    const imageBuffer = fs.readFileSync(filePath);

    // Perform safe search detection
    const [result] = await this.client.safeSearchDetection({
      image: { content: imageBuffer }
    });

    const safeSearch = result.safeSearchAnnotation;
    
    // Also perform face detection to check for manipulation
    const [faceResult] = await this.client.faceDetection({
      image: { content: imageBuffer }
    });

    return this.formatGoogleResult(safeSearch, faceResult.faceAnnotations);
  }

  formatGoogleResult(safeSearch, faces) {
    // Google doesn't directly detect deepfakes, but we can use various signals
    let classification = 'authentic';
    let confidence = 0.6;
    let details = [];

    // Check for unusual patterns that might indicate manipulation
    const suspiciousFactors = [];

    // Safe search results
    if (safeSearch.adult === 'LIKELY' || safeSearch.adult === 'VERY_LIKELY') {
      suspiciousFactors.push('Adult content detected');
    }
    if (safeSearch.violence === 'LIKELY' || safeSearch.violence === 'VERY_LIKELY') {
      suspiciousFactors.push('Violence detected');
    }

    // Face analysis
    if (faces && faces.length > 0) {
      faces.forEach((face, index) => {
        // Check for unusual confidence levels in facial features
        if (face.detectionConfidence < 0.8) {
          suspiciousFactors.push(`Face ${index + 1}: Low detection confidence`);
        }
        
        // Check for unusual head pose angles
        if (Math.abs(face.panAngle) > 45 || Math.abs(face.tiltAngle) > 45) {
          suspiciousFactors.push(`Face ${index + 1}: Unusual pose angles`);
        }
      });

      details.push(`${faces.length} face(s) detected`);
    } else {
      details.push('No faces detected');
    }

    // Determine classification based on suspicious factors
    if (suspiciousFactors.length > 2) {
      classification = 'suspicious';
      confidence = 0.7;
      details.push(...suspiciousFactors);
    } else if (suspiciousFactors.length > 0) {
      classification = 'suspicious';
      confidence = 0.6;
      details.push(...suspiciousFactors);
    } else {
      details.push('No suspicious patterns detected');
      details.push('Normal facial features and content');
    }

    details.push('Note: Google Cloud focuses on content analysis, not deepfake detection');

    return {
      classification,
      confidence,
      details
    };
  }
}

module.exports = new GoogleCloudService();