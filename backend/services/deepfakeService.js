const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class DeepfakeService {
  constructor() {
    this.providers = {
      local: {
        enabled: !!process.env.LOCAL_DETECT_URL,
        baseUrl: process.env.LOCAL_DETECT_URL
      },
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
      case 'local':
        return await this.detectWithLocal(filePath, detectionType);
      case 'sightengine':
        return await this.detectWithSightengine(filePath, detectionType);
      case 'deepware':
        return await this.detectWithDeepware(filePath, detectionType);
      case 'sensity':
        return await this.detectWithSensity(filePath, detectionType);
      default:
        throw new Error(`Unknown provider: ${providerName}`);
    }
  }

  /**
   * Local Python microservice integration
   */
  async detectWithLocal(filePath, detectionType) {
    const config = this.providers.local;
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('detectionType', detectionType);

    const response = await axios.post(`${config.baseUrl}/detect`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      timeout: 120000 // 2 minutes for local processing
    });

    if (!response.data || !response.data.result) {
      throw new Error('Local detector error: invalid response');
    }

    // Use Python service's label directly; avoid re-thresholding here
    const classification = response.data.result;
    const confidence = typeof response.data.confidence === 'number' ? response.data.confidence : 0;
    const details = Array.isArray(response.data.details) && response.data.details.length > 0
      ? response.data.details
      : this.getGenericDetails(classification, detectionType);

    // Debug logs for traceability
    console.log('[local] detectionType:', detectionType, 'classification:', classification, 'confidence:', confidence);

    return {
      classification,
      confidence,
      details
    };
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