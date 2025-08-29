# Deepfake Detection Website

A comprehensive web application for detecting deepfake manipulation in images, videos, and audio files using state-of-the-art AI models.

## Features

- **Multi-Media Support**: Detect deepfakes in images, videos, and audio files
- **Advanced AI Models**: Integration with cutting-edge deepfake detection models
- **Real-time Analysis**: Fast processing with detailed results and confidence scores
- **User-Friendly Interface**: Modern, responsive web interface built with Next.js
- **API-First Design**: RESTful API for easy integration with other services
- **Scalable Architecture**: Microservices-based design (local-only setup; no Docker)

## Architecture

The system consists of three main components:

1. **Frontend** (Next.js): User interface for file upload and result display
2. **Backend** (Node.js): API server handling file uploads and routing
3. **Detector Service** (Python): AI model service for deepfake detection

## Quick Start

### Prerequisites

- Node.js 18+ and Python 3.11+
- Git

### Local Setup (No Docker)

```bash
# Clone the repository
git clone <your-repo-url>
cd <your-repo-name>

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Setup Python environment
cd deepfake-detector
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Create environment files
cp backend/.env.example backend/.env
cp deepfake-detector/.env.example deepfake-detector/.env

# Start services
# Terminal 1: Python detector service
cd deepfake-detector
source venv/bin/activate
python main.py

# Terminal 2: Node.js backend
cd backend
npm start

# Terminal 3: Next.js frontend
npm run dev
```

## Usage

1. **Access the Application**: Open http://localhost:3000 in your browser
2. **Choose Detection Type**: Select image, video, or audio detection
3. **Upload File**: Drag and drop or browse for your media file
4. **View Results**: Get detailed analysis with confidence scores and explanations

## API Endpoints

### Deepfake Detection

- `POST /api/deepfake/detect` - Analyze media file for deepfakes
- `GET /api/deepfake/providers` - List available detection providers

### Health Check

- `GET /api/health` - Service health status

## Configuration

### Environment Variables

#### Backend (.env)
```bash
PORT=5000
LOCAL_DETECT_URL=http://localhost:8001
TEMP_PATH=./temp
```

#### Detector Service (.env)
```bash
HOST=0.0.0.0
PORT=8001
LOG_LEVEL=info
```

## Model Integration

The system currently runs with mock models for testing. To integrate actual deepfake detection models:

### Recommended Models

- **Images**: Face X-ray, XceptionNet
- **Videos**: LipForensics, XceptionNet
- **Audio**: AASIST, RawNet2

### Integration Steps

1. Download pre-trained model weights
2. Place weights in `deepfake-detector/models/weights/`
3. Update model loading functions in respective detector modules
4. Test with sample media files

See `deepfake-detector/models/README.md` for detailed integration instructions.

## Development

### Project Structure

```
├── app/                    # Next.js frontend pages
│   └── deepfake-detection/ # Main detection interface
├── backend/               # Node.js API server
│   ├── routes/           # API endpoints
│   └── services/         # Business logic
├── deepfake-detector/    # Python AI service
│   └── models/          # Model integration modules
├── components/           # Reusable UI components
└── scripts/             # Local scripts and tooling
```

### Running Tests

```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test

# Python service tests
cd deepfake-detector
python -m pytest
```

### Code Quality

```bash
# Format code
npm run format
cd backend && npm run format
cd deepfake-detector && black .

# Lint code
npm run lint
cd backend && npm run lint
cd deepfake-detector && flake8 .
```

## Deployment

### Production Setup

1. Update environment variables for production
2. Configure CORS origins
3. Set up proper logging and monitoring
4. Use production-grade databases if needed
5. Configure SSL/TLS certificates

### Production Notes

- Use a process manager (e.g., pm2) to run Node and the Python service
- Configure systemd services on Linux servers for auto-restart
- Put the frontend behind a reverse proxy (e.g., Nginx) with TLS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Face X-ray: [Paper](https://arxiv.org/abs/2003.06132) | [Code](https://github.com/youyuge34/Face-X-ray)
- LipForensics: [Paper](https://arxiv.org/abs/2003.08685) | [Code](https://github.com/ahmedtaha6/LipForensics)
- AASIST: [Paper](https://arxiv.org/abs/2110.01200) | [Code](https://github.com/clovaai/aasist)
- FaceForensics++: [Paper](https://arxiv.org/abs/1901.08971) | [Code](https://github.com/ondyari/FaceForensics)

## Support

For issues and questions:
1. Check the troubleshooting section in model READMEs
2. Review existing GitHub issues
3. Create a new issue with detailed information

## Roadmap

- [ ] Batch processing support
- [ ] Real-time video streaming analysis
- [ ] Model ensemble methods
- [ ] Advanced result visualization
- [ ] API rate limiting and authentication
- [ ] Cloud deployment guides