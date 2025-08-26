# Deepfake Detection Website - Setup Instructions

This repository contains a complete deepfake detection system with a Next.js frontend and Node.js backend that integrates with AI-powered detection APIs.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager
- API keys from at least one deepfake detection provider

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys (see API Setup section)

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to project root (where package.json is)
cd ..

# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🔑 API Setup

You need to configure at least one deepfake detection API provider. Here are the recommended options:

### Option 1: Sightengine (Recommended)

1. **Sign up**: Go to [sightengine.com](https://sightengine.com) and create an account
2. **Get credentials**: Navigate to your dashboard and copy your API User ID and Secret
3. **Configure**: Add to your `backend/.env` file:
   ```env
   SIGHTENGINE_API_USER=your_api_user_id
   SIGHTENGINE_API_SECRET=your_api_secret
   ```

### Option 2: DeepWare (Alternative)

1. **Contact**: Reach out to DeepWare for API access
2. **Get API key**: Obtain your API key from their platform
3. **Configure**: Add to your `backend/.env` file:
   ```env
   DEEPWARE_API_KEY=your_api_key
   ```

### Option 3: Sensity (Alternative)

1. **Sign up**: Create an account on Sensity platform
2. **Generate key**: Create an API key in your dashboard
3. **Configure**: Add to your `backend/.env` file:
   ```env
   SENSITY_API_KEY=your_api_key
   ```

## 🧪 Testing the Integration

1. **Start both servers** (frontend on :3000, backend on :5000)
2. **Navigate to**: `http://localhost:3000/deepfake-detection`
3. **Test the flow**:
   - Select detection type (Image/Video/Audio)
   - Upload a test file
   - Wait for processing
   - View results

### Test Files

You can test with:
- **Images**: Any JPEG, PNG, or WebP image
- **Videos**: MP4, WebM, MOV, or AVI files
- **Audio**: MP3, WAV, M4A, or OGG files

## 📁 Project Structure

```
/
├── app/                          # Next.js frontend
│   ├── deepfake-detection/      # Main detection page
│   ├── page.tsx                 # Homepage
│   └── layout.tsx               # App layout
├── backend/                     # Node.js backend
│   ├── routes/                  # API routes
│   ├── services/                # Business logic
│   ├── middleware/              # Custom middleware
│   ├── server.js                # Main server file
│   └── .env                     # Environment variables
├── components/                  # Shared UI components
└── package.json                 # Frontend dependencies
```

## 🔧 Configuration Options

### Backend Environment Variables

```env
# Server Configuration
PORT=5000                        # Backend server port
NODE_ENV=development             # Environment mode
FRONTEND_URL=http://localhost:3000 # Frontend URL for CORS

# File Upload Limits
MAX_FILE_SIZE=50MB               # Maximum upload size
UPLOAD_PATH=./uploads            # Upload directory
TEMP_PATH=./temp                 # Temporary files directory

# Rate Limiting
RATE_LIMIT_WINDOW=15             # Rate limit window (minutes)
RATE_LIMIT_MAX_REQUESTS=100      # Max requests per window
```

### Supported File Types

- **Images**: JPEG, PNG, WebP (up to 8000x8000 px)
- **Videos**: MP4, WebM, QuickTime, AVI (up to 50MB)
- **Audio**: MP3, WAV, M4A, OGG (up to 50MB)

## 🛡️ Security Features

- **File Validation**: Strict MIME type and extension checking
- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configurable allowed origins
- **Automatic Cleanup**: Temporary files are removed automatically
- **Input Sanitization**: All inputs are validated

## 🚨 Troubleshooting

### Common Issues

1. **"No deepfake detection providers configured"**
   - Make sure you've added valid API credentials to `backend/.env`
   - Uncomment the API key lines in the .env file

2. **"Failed to process file"**
   - Check that your API keys are valid
   - Verify the file type is supported
   - Ensure file size is under 50MB

3. **CORS errors**
   - Make sure the backend is running on port 5000
   - Check that `FRONTEND_URL` in backend/.env matches your frontend URL

4. **Connection refused**
   - Ensure both frontend and backend servers are running
   - Check that ports 3000 and 5000 are not blocked

### Health Check

Test backend status: `http://localhost:5000/api/health`

Expected response:
```json
{
  "success": true,
  "message": "Deepfake Detection Backend is running",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## 📚 API Documentation

Full backend API documentation is available in `backend/README.md`

### Key Endpoints

- `POST /api/deepfake/detect` - Main detection endpoint
- `GET /api/health` - Health check
- `GET /api/deepfake/providers` - List available providers

## 🚀 Production Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in your environment
2. Configure production API URLs
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   cd backend
   pm2 start server.js --name deepfake-backend
   ```

### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `.next` directory to your hosting provider

3. Update the API URL in the frontend code to point to your production backend

## 💡 Features

- ✅ **Multi-provider Support**: Sightengine, DeepWare, Sensity
- ✅ **File Upload**: Drag & drop with progress indication
- ✅ **Real-time Processing**: Live progress updates
- ✅ **Detailed Results**: Confidence scores and analysis details
- ✅ **Security**: Rate limiting, file validation, CORS protection
- ✅ **Error Handling**: Comprehensive error messages and recovery
- ✅ **Mobile Friendly**: Responsive design for all devices

## 📝 License

MIT License - See LICENSE file for details.

## 🤝 Support

For issues and questions:
1. Check this setup guide
2. Review the troubleshooting section
3. Test with the health check endpoints
4. Check browser console and backend logs for error details