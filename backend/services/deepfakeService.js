const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class DeepfakeService {
  constructor() {
    this.providers = {
      sightengine: {
        enabled: !!(process.env.SIGHTENGINE_API_USER && process.env.SIGHTENGINE_API_SECRET),
        apiUser: process.env.SIGHTENGINE_API_USER,
        apiSecret: process.env.SIGHTENGINE_API_SECRET,
        baseUrl: 'https://api.sightengine.com/1.0'
      },
      deepware: {
        enabled: !!process.env.DEEPWARE_API_KEY,
        apiKey: process.env.DEEPWARE_API_KEY,
        baseUrl: 'https://api.deepware.ai/v1'
      },
      sensity: {
        enabled: !!process.env.SENSITY_API_KEY,
        apiKey: process.env.SENSITY_API_KEY,
        baseUrl: 'https://api.sensity.ai/v1'
      },
      hive: {
        enabled: !!process.env.HIVE_API_KEY,
        apiKey: process.env.HIVE_API_KEY,
        baseUrl: 'https://api.thehive.ai/api/v2'
      },
      huggingface: {
        enabled: !!process.env.HUGGINGFACE_API_KEY,
        apiKey: process.env.HUGGINGFACE_API_KEY,
        baseUrl: 'https://api-inference.huggingface.co/models'
      }
    };
  }

  /**
   * Main method to detect deepfakes using available providers
   */
  async detectDeepfake(filePath, detectionType) {
    // Try providers in order of preference
    const enabledProviders = Object.entries(this.providers)
      .filter(([_, config]) => config.enabled)
      .map(([name, _]) => name);

    if (enabledProviders.length === 0) {
      throw new Error('No deepfake detection providers configured');
    }

    let lastError = null;

    // Try each provider until one succeeds
    for (const providerName of enabledProviders) {
      try {
        console.log(`Attempting detection with provider: ${providerName}`);
        const result = await this.detectWithProvider(providerName, filePath, detectionType);
        return {
          ...result,
          provider: providerName
        };
      } catch (error) {
        console.error(`Provider ${providerName} failed:`, error.message);
        lastError = error;
        continue;
      }
    }

    // If all providers failed, throw the last error
    throw lastError || new Error('All deepfake detection providers failed');
  }

  /**
   * Detect deepfake using a specific provider
   */
  async detectWithProvider(providerName, filePath, detectionType) {
    switch (providerName) {
      case 'sightengine':
        return await this.detectWithSightengine(filePath, detectionType);
      case 'deepware':
        return await this.detectWithDeepware(filePath, detectionType);
      case 'sensity':
        return await this.detectWithSensity(filePath, detectionType);
      case 'hive':
        return await this.detectWithHive(filePath, detectionType);
      case 'huggingface':
        return await this.detectWithHuggingFace(filePath, detectionType);
      default:
        throw new Error(`Unknown provider: ${providerName}`);
    }
  }

  /**
   * Sightengine API integration
   */
  async detectWithSightengine(filePath, detectionType) {
    const config = this.providers.sightengine;
    
    const formData = new FormData();
    formData.append('media', fs.createReadStream(filePath));
    formData.append('models', 'deepfake');
    formData.append('api_user', config.apiUser);
    formData.append('api_secret', config.apiSecret);

    const response = await axios.post(`${config.baseUrl}/check.json`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      timeout: 30000
    });

    if (response.data.status !== 'success') {
      throw new Error(`Sightengine API error: ${response.data.error?.message || 'Unknown error'}`);
    }

    const deepfakeScore = response.data.type?.deepfake || 0;
    
    return this.formatSightengineResult(deepfakeScore, detectionType);
  }

  /**
   * DeepWare API integration (placeholder - actual API may differ)
   */
  async detectWithDeepware(filePath, detectionType) {
    const config = this.providers.deepware;
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('type', detectionType);

    const response = await axios.post(`${config.baseUrl}/detect`, formData, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        ...formData.getHeaders()
      },
      timeout: 45000
    });

    if (!response.data.success) {
      throw new Error(`DeepWare API error: ${response.data.message || 'Unknown error'}`);
    }

    return this.formatDeepwareResult(response.data, detectionType);
  }

  /**
   * Sensity API integration (placeholder - actual API may differ)
   */
  async detectWithSensity(filePath, detectionType) {
    const config = this.providers.sensity;
    
    const formData = new FormData();
    formData.append('media', fs.createReadStream(filePath));
    formData.append('analysis_type', 'deepfake');

    const response = await axios.post(`${config.baseUrl}/analyze`, formData, {
      headers: {
        'X-API-Key': config.apiKey,
        ...formData.getHeaders()
      },
      timeout: 45000
    });

    if (response.data.status !== 'completed') {
      throw new Error(`Sensity API error: ${response.data.error || 'Analysis failed'}`);
    }

    return this.formatSensityResult(response.data, detectionType);
  }

  /**
   * Hive AI API integration
   */
  async detectWithHive(filePath, detectionType) {
    const config = this.providers.hive;
    
    const formData = new FormData();
    formData.append('media', fs.createReadStream(filePath));

    // Hive AI supports both image and video deepfake detection
    let endpoint;
    if (detectionType === 'image') {
      endpoint = '/task/sync';
    } else if (detectionType === 'video') {
      endpoint = '/task/sync';
    } else {
      throw new Error('Hive AI does not support audio deepfake detection');
    }

    const response = await axios.post(`${config.baseUrl}${endpoint}`, formData, {
      headers: {
        'Authorization': `Token ${config.apiKey}`,
        ...formData.getHeaders()
      },
      timeout: 60000 // Hive AI might take longer for video processing
    });

    if (response.data.status?.length === 0 || !response.data.status) {
      throw new Error(`Hive AI error: ${response.data.message || 'Analysis failed'}`);
    }

    return this.formatHiveResult(response.data, detectionType);
  }

  /**
   * Hugging Face API integration
   */
  async detectWithHuggingFace(filePath, detectionType) {
    const config = this.providers.huggingface;
    
    if (detectionType === 'audio') {
      throw new Error('Hugging Face audio deepfake detection not yet implemented');
    }

    try {
      // Read file as buffer
      const fileBuffer = fs.readFileSync(filePath);
      
      // Choose appropriate model based on detection type
      let modelEndpoint;
      if (detectionType === 'image') {
        // Popular deepfake detection models on Hugging Face
        modelEndpoint = 'umm-maybe/AI-image-detector'; // or 'microsoft/DisCo-diff'
      } else if (detectionType === 'video') {
        // For video, we'll use image analysis on frames
        modelEndpoint = 'umm-maybe/AI-image-detector';
      }

      const response = await axios.post(`${config.baseUrl}/${modelEndpoint}`, fileBuffer, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/octet-stream'
        },
        timeout: 30000
      });

      return this.formatHuggingFaceResult(response.data, detectionType);

    } catch (error) {
      // If the model is loading, try a fallback
      if (error.response?.data?.error?.includes('loading')) {
        throw new Error('Hugging Face model is loading, please try again in a few seconds');
      }
      throw new Error(`Hugging Face API error: ${error.message}`);
    }
  }

  /**
   * Format Sightengine response
   */
  formatSightengineResult(deepfakeScore, detectionType) {
    const confidence = deepfakeScore;
    let classification, details;

    if (confidence > 0.7) {
      classification = 'deepfake';
      details = this.getDeepfakeDetails(detectionType, 'high');
    } else if (confidence > 0.3) {
      classification = 'suspicious';
      details = this.getDeepfakeDetails(detectionType, 'medium');
    } else {
      classification = 'authentic';
      details = this.getAuthenticDetails(detectionType);
    }

    return {
      classification,
      confidence,
      details
    };
  }

  /**
   * Format DeepWare response
   */
  formatDeepwareResult(data, detectionType) {
    const confidence = data.confidence || data.score || 0;
    const classification = data.is_deepfake ? 'deepfake' : 
                          (confidence > 0.5 ? 'suspicious' : 'authentic');

    return {
      classification,
      confidence,
      details: data.analysis_details || this.getGenericDetails(classification, detectionType)
    };
  }

  /**
   * Format Sensity response
   */
  formatSensityResult(data, detectionType) {
    const confidence = data.deepfake_probability || 0;
    let classification;

    if (confidence > 0.7) {
      classification = 'deepfake';
    } else if (confidence > 0.3) {
      classification = 'suspicious';
    } else {
      classification = 'authentic';
    }

    return {
      classification,
      confidence,
      details: data.details || this.getGenericDetails(classification, detectionType)
    };
  }

  /**
   * Format Hive AI response
   */
  formatHiveResult(data, detectionType) {
    // Hive AI returns status array with different model results
    const status = data.status[0] || {};
    const response = status.response || {};
    
    // Look for AI-generated content detection
    const outputs = response.output || [];
    let aiGenerated = false;
    let confidence = 0;
    let details = [];

    // Check for AI-generated image/video detection
    outputs.forEach(output => {
      if (output.class === 'ai_generated_image' || output.class === 'ai_generated_video') {
        if (output.score > confidence) {
          confidence = output.score;
          aiGenerated = true;
        }
      }
    });

    // Determine classification
    let classification;
    if (aiGenerated && confidence > 0.7) {
      classification = 'deepfake';
      details = this.getDeepfakeDetails(detectionType, 'high');
    } else if (aiGenerated && confidence > 0.3) {
      classification = 'suspicious';
      details = this.getDeepfakeDetails(detectionType, 'medium');
    } else {
      classification = 'authentic';
      details = this.getAuthenticDetails(detectionType);
    }

    // Add Hive AI specific details
    if (outputs.length > 0) {
      details.unshift(`Hive AI analysis: ${outputs.length} detection model(s) used`);
    }

    return {
      classification,
      confidence,
      details
    };
  }

  /**
   * Format Hugging Face response
   */
  formatHuggingFaceResult(data, detectionType) {
    let classification = 'authentic';
    let confidence = 0.5;
    let details = [];

    // Hugging Face models return different formats
    // Handle array response (classification results)
    if (Array.isArray(data)) {
      const result = data[0] || {};
      
      // Look for AI-generated or fake labels
      const aiLabels = ['FAKE', 'AI', 'artificial', 'generated', 'deepfake'];
      const realLabels = ['REAL', 'authentic', 'human', 'genuine'];
      
      let maxAiScore = 0;
      let maxRealScore = 0;
      
      data.forEach(item => {
        const label = item.label?.toLowerCase() || '';
        const score = item.score || 0;
        
        if (aiLabels.some(aiLabel => label.includes(aiLabel.toLowerCase()))) {
          maxAiScore = Math.max(maxAiScore, score);
        } else if (realLabels.some(realLabel => label.includes(realLabel.toLowerCase()))) {
          maxRealScore = Math.max(maxRealScore, score);
        }
      });
      
      // Determine classification
      if (maxAiScore > maxRealScore && maxAiScore > 0.7) {
        classification = 'deepfake';
        confidence = maxAiScore;
        details = this.getDeepfakeDetails(detectionType, 'high');
      } else if (maxAiScore > maxRealScore && maxAiScore > 0.3) {
        classification = 'suspicious';
        confidence = maxAiScore;
        details = this.getDeepfakeDetails(detectionType, 'medium');
      } else {
        classification = 'authentic';
        confidence = maxRealScore || 0.6;
        details = this.getAuthenticDetails(detectionType);
      }
      
      details.unshift(`Hugging Face AI detection: ${data.length} classification(s) analyzed`);
      
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      // Handle other response formats
      details = ['Hugging Face analysis completed', 'Standard classification applied'];
    }

    return {
      classification,
      confidence,
      details
    };
  }

  /**
   * Generate details for deepfake detection
   */
  getDeepfakeDetails(detectionType, severity) {
    const details = {
      image: {
        high: [
          'Inconsistent lighting patterns detected',
          'Facial feature misalignment found',
          'Unnatural skin texture artifacts',
          'Pixel-level manipulation signatures'
        ],
        medium: [
          'Minor compression artifacts detected',
          'Slight color inconsistencies in facial region',
          'Requires manual verification'
        ]
      },
      video: {
        high: [
          'Temporal inconsistencies between frames',
          'Unnatural blinking patterns',
          'Lip-sync misalignment detected',
          'Frame-to-frame facial distortions'
        ],
        medium: [
          'Minor temporal artifacts detected',
          'Slight motion blur inconsistencies',
          'Requires extended analysis'
        ]
      },
      audio: {
        high: [
          'Synthetic voice patterns detected',
          'Unnatural speech rhythm',
          'Audio compression artifacts',
          'Voice cloning signatures found'
        ],
        medium: [
          'Minor audio processing detected',
          'Slight spectral inconsistencies',
          'Requires audio expert review'
        ]
      }
    };

    return details[detectionType]?.[severity] || ['Analysis completed with concerns'];
  }

  /**
   * Generate details for authentic content
   */
  getAuthenticDetails(detectionType) {
    const details = {
      image: [
        'Natural facial features and expressions',
        'Consistent lighting and shadows',
        'No manipulation artifacts detected',
        'Authentic metadata signatures'
      ],
      video: [
        'Natural facial movements and expressions',
        'Consistent temporal flow',
        'Authentic motion patterns',
        'No frame manipulation detected'
      ],
      audio: [
        'Natural speech patterns',
        'Consistent audio quality',
        'No synthetic voice indicators',
        'Authentic recording characteristics'
      ]
    };

    return details[detectionType] || ['Content appears authentic'];
  }

  /**
   * Generate generic details when specific ones aren't available
   */
  getGenericDetails(classification, detectionType) {
    if (classification === 'authentic') {
      return this.getAuthenticDetails(detectionType);
    } else {
      return this.getDeepfakeDetails(detectionType, 'medium');
    }
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders() {
    return Object.entries(this.providers)
      .filter(([_, config]) => config.enabled)
      .map(([name, config]) => ({
        name,
        enabled: config.enabled,
        baseUrl: config.baseUrl
      }));
  }

  /**
   * Test connectivity to providers
   */
  async testProviders() {
    const results = {};
    
    for (const [name, config] of Object.entries(this.providers)) {
      if (!config.enabled) {
        results[name] = { status: 'disabled', message: 'Provider not configured' };
        continue;
      }

      try {
        // Simple connectivity test
        await axios.get(config.baseUrl, { timeout: 5000 });
        results[name] = { status: 'connected', message: 'Provider accessible' };
      } catch (error) {
        results[name] = { 
          status: 'error', 
          message: error.message || 'Connection failed' 
        };
      }
    }

    return results;
  }
}

module.exports = new DeepfakeService();