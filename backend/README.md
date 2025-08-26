# Deepfake Detection Backend

A robust Node.js/Express backend API for deepfake detection that integrates with multiple AI-powered detection services. This backend supports image, video, and audio deepfake detection with secure file handling and comprehensive validation.

## Features

- 🛡️ **Multi-provider Support**: Integrates with Sightengine, DeepWare, Sensity, and Hive AI APIs
- 📁 **Secure File Upload**: Comprehensive file validation and automatic cleanup
- 🎯 **Multi-media Detection**: Supports images, videos, and audio files
- 🔒 **Security First**: Rate limiting, CORS protection, and file security validation
- 📊 **Health Monitoring**: Built-in health checks and provider status monitoring
- 🚀 **Production Ready**: Includes error handling, logging, and graceful shutdown

## Quick Start

### 1. Installation

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your API credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# API Keys (configure at least one)
SIGHTENGINE_API_USER=your_api_user
SIGHTENGINE_API_SECRET=your_api_secret

# Optional alternative providers
DEEPWARE_API_KEY=your_deepware_api_key
SENSITY_API_KEY=your_sensity_api_key
HIVE_API_KEY=your_hive_api_key
```

### 3. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Deepfake Detection Backend is running",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

#### 2. Detailed Health Check
```http
GET /api/health/detailed
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 3600,
  "services": {
    "api": "healthy",
    "sightengine": "configured",
    "deepware": "not_configured",
    "sensity": "not_configured"
  },
  "memory": {
    "used": 45.2,
    "total": 128.5
  }
}
```

#### 3. Deepfake Detection
```http
POST /api/deepfake/detect
Content-Type: multipart/form-data
```

**Parameters:**
- `file` (file): The media file to analyze (required)
- `detectionType` (string): Type of detection - `image`, `video`, or `audio` (required)

**Response:**
```json
{
  "success": true,
  "result": "authentic",
  "confidence": 85,
  "details": [
    "Natural facial features and expressions",
    "Consistent lighting and shadows",
    "No manipulation artifacts detected",
    "Authentic metadata signatures"
  ],
  "processingTime": 2.34,
  "metadata": {
    "filename": "example.jpg",
    "fileSize": 2048576,
    "detectionType": "image",
    "provider": "sightengine",
    "timestamp": "2024-01-20T10:30:00.000Z"
  }
}
```

**Possible Results:**
- `authentic`: Content appears to be genuine
- `deepfake`: Content is likely artificially generated
- `suspicious`: Content shows signs of manipulation but requires further analysis

#### 4. Get Available Providers
```http
GET /api/deepfake/providers
```

**Response:**
```json
{
  "success": true,
  "providers": [
    {
      "name": "sightengine",
      "enabled": true,
      "baseUrl": "https://api.sightengine.com/1.0"
    }
  ]
}
```

## Supported File Types

### Images
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### Videos
- MP4 (.mp4)
- WebM (.webm)
- QuickTime (.mov)
- AVI (.avi)

### Audio
- MP3 (.mp3)
- WAV (.wav)
- M4A (.m4a)
- OGG (.ogg)

## File Limits

- **Maximum file size**: 50MB
- **Maximum image dimensions**: 8000x8000 pixels
- **Processing timeout**: 45 seconds per request

## API Provider Setup

### Sightengine (Recommended)

1. Sign up at [sightengine.com](https://sightengine.com)
2. Get your API user ID and secret key
3. Add to your `.env` file:
   ```env
   SIGHTENGINE_API_USER=your_api_user
   SIGHTENGINE_API_SECRET=your_api_secret
   ```

### DeepWare (Alternative)

1. Contact DeepWare for API access
2. Obtain your API key
3. Add to your `.env` file:
   ```env
   DEEPWARE_API_KEY=your_api_key
   ```

### Sensity (Alternative)

1. Sign up for Sensity platform access
2. Generate an API key
3. Add to your `.env` file:
   ```env
   SENSITY_API_KEY=your_api_key
   ```

## Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

Common HTTP status codes:
- `400`: Bad Request (invalid file, missing parameters)
- `413`: Payload Too Large (file size exceeded)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error (processing failed)

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **File Validation**: Strict mime-type and extension checking
- **CORS Protection**: Configurable allowed origins
- **Security Headers**: Helmet.js for security headers
- **Automatic Cleanup**: Temporary files are automatically removed
- **Input Sanitization**: All user inputs are validated

## Development

### Running Tests
```bash
npm test
```

### Project Structure
```
backend/
├── routes/
│   ├── deepfake.js      # Main detection endpoints
│   └── health.js        # Health check endpoints
├── services/
│   └── deepfakeService.js # Core detection logic
├── middleware/
│   └── fileMiddleware.js  # File validation and cleanup
├── server.js            # Main application entry point
├── package.json         # Dependencies and scripts
└── .env.example        # Environment variables template
```

### Adding New Providers

To add a new deepfake detection provider:

1. Add provider configuration to `services/deepfakeService.js`
2. Implement the provider-specific detection method
3. Add response formatting function
4. Update environment variables documentation

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Support (Optional)

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Process Management
Use PM2 for production process management:
```bash
npm install -g pm2
pm2 start server.js --name deepfake-backend
```

## License

MIT License - See LICENSE file for details.

## Support

For issues and questions:
1. Check the API response error messages
2. Verify your environment configuration
3. Test with the health check endpoints
4. Review the logs for detailed error information