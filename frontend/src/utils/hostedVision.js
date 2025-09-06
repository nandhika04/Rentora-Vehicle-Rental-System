// Enhanced Hosted AI Vision Services for Vehicle Damage Detection
// Supports multiple AI providers: Roboflow, Hugging Face, Google Cloud Vision

// Configuration for different AI services
const AI_SERVICES = {
  ROBOTFLOW: 'roboflow',
  HUGGING_FACE: 'huggingface',
  GOOGLE_CLOUD: 'googlecloud'
};

// Default configuration
const DEFAULT_CONFIG = {
  service: AI_SERVICES.ROBOTFLOW,
  confidence: 0.7,
  maxResults: 10
};

// Roboflow configuration
const ROBOTFLOW_CONFIG = {
  endpoint: process.env.REACT_APP_ROBOFLOW_ENDPOINT || 'https://detect.roboflow.com',
  apiKey: process.env.REACT_APP_ROBOFLOW_API_KEY,
  model: 'car-damage-detection', // Default model, can be customized
  version: '1'
};

// Hugging Face configuration
const HUGGING_FACE_CONFIG = {
  endpoint: process.env.REACT_APP_HUGGING_FACE_ENDPOINT || 'https://api-inference.huggingface.co',
  apiKey: process.env.REACT_APP_HUGGING_FACE_API_KEY,
  model: 'microsoft/DialoGPT-medium' // Default model, can be customized
};

// Google Cloud Vision configuration
const GOOGLE_CLOUD_CONFIG = {
  endpoint: process.env.REACT_APP_GOOGLE_CLOUD_ENDPOINT || 'https://vision.googleapis.com/v1',
  apiKey: process.env.REACT_APP_GOOGLE_CLOUD_API_KEY
};

/**
 * Main function to call hosted AI vision service
 * @param {File|string} image - Image file or base64 string
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} AI detection results
 */
export const callHostedVisionAPI = async (image, options = {}) => {
  const config = { ...DEFAULT_CONFIG, ...options };
  
  try {
    switch (config.service) {
      case AI_SERVICES.ROBOTFLOW:
        return await callRoboflowAPI(image, config);
      case AI_SERVICES.HUGGING_FACE:
        return await callHuggingFaceAPI(image, config);
      case AI_SERVICES.GOOGLE_CLOUD:
        return await callGoogleCloudAPI(image, config);
      default:
        throw new Error(`Unsupported AI service: ${config.service}`);
    }
  } catch (error) {
    console.error('AI Vision API Error:', error);
    throw new Error(`AI detection failed: ${error.message}`);
  }
};

/**
 * Call Roboflow API for damage detection
 */
const callRoboflowAPI = async (image, config) => {
  if (!ROBOTFLOW_CONFIG.apiKey) {
    throw new Error('Roboflow API key not configured. Set REACT_APP_ROBOFLOW_API_KEY');
  }

  const formData = new FormData();
  
  if (image instanceof File) {
    formData.append('file', image);
  } else {
    // Convert base64 to blob
    const response = await fetch(image);
    const blob = await response.blob();
    formData.append('file', blob, 'image.jpg');
  }

  const url = `${ROBOTFLOW_CONFIG.endpoint}/${ROBOTFLOW_CONFIG.model}/${ROBOTFLOW_CONFIG.version}?api_key=${ROBOTFLOW_CONFIG.apiKey}&confidence=${config.confidence}`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Roboflow API error: ${response.status}`);
  }

  const result = await response.json();
  return processRoboflowResults(result);
};

/**
 * Call Hugging Face API for damage detection
 */
const callHuggingFaceAPI = async (image, config) => {
  if (!HUGGING_FACE_CONFIG.apiKey) {
    throw new Error('Hugging Face API key not configured. Set REACT_APP_HUGGING_FACE_API_KEY');
  }

  let imageData;
  if (image instanceof File) {
    imageData = await fileToBase64(image);
  } else {
    imageData = image;
  }

  const response = await fetch(`${HUGGING_FACE_CONFIG.endpoint}/models/${HUGGING_FACE_CONFIG.model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HUGGING_FACE_CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: imageData,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.status}`);
  }

  const result = await response.json();
  return processHuggingFaceResults(result);
};

/**
 * Call Google Cloud Vision API for damage detection
 */
const callGoogleCloudAPI = async (image, config) => {
  if (!GOOGLE_CLOUD_CONFIG.apiKey) {
    throw new Error('Google Cloud API key not configured. Set REACT_APP_GOOGLE_CLOUD_API_KEY');
  }

  let imageData;
  if (image instanceof File) {
    imageData = await fileToBase64(image);
  } else {
    imageData = image;
  }

  // Remove data:image/jpeg;base64, prefix if present
  const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');

  const response = await fetch(`${GOOGLE_CLOUD_CONFIG.endpoint}/images:annotate?key=${GOOGLE_CLOUD_CONFIG.apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [{
        image: {
          content: base64Data
        },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
          { type: 'SAFE_SEARCH_DETECTION' }
        ]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Google Cloud API error: ${response.status}`);
  }

  const result = await response.json();
  return processGoogleCloudResults(result);
};

/**
 * Process Roboflow API results
 */
const processRoboflowResults = (result) => {
  if (!result.predictions || result.predictions.length === 0) {
    return {
      damageDetected: false,
      message: 'No damage detected',
      confidence: 0,
      regions: []
    };
  }

  const regions = result.predictions.map(pred => ({
    type: pred.class,
    confidence: pred.confidence,
    boundingBox: {
      x: pred.x - pred.width / 2,
      y: pred.y - pred.height / 2,
      width: pred.width,
      height: pred.height
    },
    center: { x: pred.x, y: pred.y }
  }));

  const avgConfidence = regions.reduce((sum, r) => sum + r.confidence, 0) / regions.length;

  return {
    damageDetected: true,
    message: `Detected ${regions.length} damage region(s)`,
    confidence: avgConfidence,
    regions,
    source: 'Roboflow AI'
  };
};

/**
 * Process Hugging Face API results
 */
const processHuggingFaceResults = (result) => {
  // Hugging Face results are typically text-based
  // This would need to be customized based on the specific model used
  return {
    damageDetected: false,
    message: 'Hugging Face API - Text-based analysis not implemented for damage detection',
    confidence: 0,
    regions: [],
    source: 'Hugging Face AI'
  };
};

/**
 * Process Google Cloud Vision API results
 */
const processGoogleCloudResults = (result) => {
  if (!result.responses || result.responses.length === 0) {
    return {
      damageDetected: false,
      message: 'No analysis results',
      confidence: 0,
      regions: []
    };
  }

  const response = result.responses[0];
  const regions = [];

  // Process object localization results
  if (response.localizedObjectAnnotations) {
    response.localizedObjectAnnotations.forEach(obj => {
      if (obj.name.toLowerCase().includes('car') || obj.name.toLowerCase().includes('vehicle')) {
        const vertices = obj.boundingPoly.normalizedVertices;
        regions.push({
          type: 'vehicle_detected',
          confidence: obj.score,
          boundingBox: {
            x: vertices[0].x * 100,
            y: vertices[0].y * 100,
            width: (vertices[1].x - vertices[0].x) * 100,
            height: (vertices[2].y - vertices[0].y) * 100
          },
          center: {
            x: (vertices[0].x + vertices[2].x) * 50,
            y: (vertices[0].y + vertices[2].y) * 50
          }
        });
      }
    });
  }

  // Process label detection for damage indicators
  if (response.labelAnnotations) {
    const damageKeywords = ['scratch', 'dent', 'damage', 'broken', 'cracked'];
    const damageLabels = response.labelAnnotations.filter(label => 
      damageKeywords.some(keyword => 
        label.description.toLowerCase().includes(keyword)
      )
    );

    if (damageLabels.length > 0) {
      regions.push({
        type: 'damage_indicated',
        confidence: damageLabels[0].score,
        boundingBox: null,
        center: null,
        description: damageLabels.map(l => l.description).join(', ')
      });
    }
  }

  return {
    damageDetected: regions.length > 0,
    message: regions.length > 0 ? `Analysis complete: ${regions.length} finding(s)` : 'No damage indicators found',
    confidence: regions.length > 0 ? regions.reduce((sum, r) => sum + r.confidence, 0) / regions.length : 0,
    regions,
    source: 'Google Cloud Vision AI'
  };
};

/**
 * Utility function to convert File to base64
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Get available AI services
 */
export const getAvailableAIServices = () => {
  const services = [];
  
  if (ROBOTFLOW_CONFIG.apiKey) services.push(AI_SERVICES.ROBOTFLOW);
  if (HUGGING_FACE_CONFIG.apiKey) services.push(AI_SERVICES.HUGGING_FACE);
  if (GOOGLE_CLOUD_CONFIG.apiKey) services.push(AI_SERVICES.GOOGLE_CLOUD);
  
  return services;
};

/**
 * Get service configuration
 */
export const getServiceConfig = (service) => {
  switch (service) {
    case AI_SERVICES.ROBOTFLOW:
      return ROBOTFLOW_CONFIG;
    case AI_SERVICES.HUGGING_FACE:
      return HUGGING_FACE_CONFIG;
    case AI_SERVICES.GOOGLE_CLOUD:
      return GOOGLE_CLOUD_CONFIG;
    default:
      return null;
  }
};

/**
 * Validate service configuration
 */
export const validateServiceConfig = (service) => {
  const config = getServiceConfig(service);
  if (!config) return false;
  
  switch (service) {
    case AI_SERVICES.ROBOTFLOW:
      return !!config.apiKey;
    case AI_SERVICES.HUGGING_FACE:
      return !!config.apiKey;
    case AI_SERVICES.GOOGLE_CLOUD:
      return !!config.apiKey;
    default:
      return false;
  }
};


