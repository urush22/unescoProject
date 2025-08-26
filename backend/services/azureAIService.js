const axios = require('axios');
const fs = require('fs');

class AzureAIService {
  constructor() {
    this.config = {
      enabled: !!(process.env.AZURE_API_KEY && process.env.AZURE_ENDPOINT),
      apiKey: process.env.AZURE_API_KEY,
      endpoint: process.env.AZURE_ENDPOINT,
      apiVersion: '2023-10-01'
    };
  }

  /**
   * Azure AI Content Safety integration for image analysis
   */
  async detectWithAzure(filePath, detectionType) {
    if (!this.config.enabled) {
      throw new Error('Azure AI not configured');
    }

    try {
      if (detectionType === 'image') {
        return await this.analyzeImage(filePath);
      } else if (detectionType === 'video') {
        return await this.analyzeVideo(filePath);
      } else {
        throw new Error('Azure AI does not support audio analysis');
      }
    } catch (error) {
      throw new Error(`Azure AI error: ${error.message}`);
    }
  }

  async analyzeImage(filePath) {
    // Convert image to base64
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');

    const url = `${this.config.endpoint}/contentsafety/image:analyze?api-version=${this.config.apiVersion}`;

    const response = await axios.post(url, {
      image: {
        content: base64Image
      },
      categories: ['Hate', 'SelfHarm', 'Sexual', 'Violence'],
      outputType: 'FourSeverityLevels'
    }, {
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    return this.formatAzureResult(response.data, 'image');
  }

  async analyzeVideo(filePath) {
    // For video, you'd need to extract frames or use Azure Video Analyzer
    // This is a simplified example
    throw new Error('Video analysis requires additional setup with Azure Video Analyzer');
  }

  formatAzureResult(data, detectionType) {
    // Azure returns content safety scores, not deepfake detection
    // You'd need to interpret the results based on your needs
    const maxSeverity = Math.max(
      data.hateResult?.severity || 0,
      data.selfHarmResult?.severity || 0,
      data.sexualResult?.severity || 0,
      data.violenceResult?.severity || 0
    );

    // This is a simplified interpretation - Azure doesn't detect deepfakes directly
    let classification = 'authentic';
    let confidence = 0.5;

    if (maxSeverity > 2) {
      classification = 'suspicious';
      confidence = 0.7;
    }

    return {
      classification,
      confidence,
      details: [
        `Content safety analysis completed`,
        `Max severity level: ${maxSeverity}`,
        `Note: Azure AI focuses on content safety, not deepfake detection`
      ]
    };
  }
}

module.exports = new AzureAIService();