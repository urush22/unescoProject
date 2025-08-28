#!/bin/bash

# Deepfake Detection Setup Script
# This script sets up the complete deepfake detection system

set -e

echo "🚀 Setting up Deepfake Detection System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are available"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. Will use Docker instead."
        return 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_warning "npm is not installed. Will use Docker instead."
        return 1
    fi
    
    print_success "Node.js and npm are available"
    return 0
}

# Check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        print_warning "Python 3 is not installed. Will use Docker instead."
        return 1
    fi
    
    if ! command -v pip3 &> /dev/null; then
        print_warning "pip3 is not installed. Will use Docker instead."
        return 1
    fi
    
    print_success "Python 3 and pip3 are available"
    return 0
}

# Setup Python environment
setup_python() {
    print_status "Setting up Python environment..."
    
    cd deepfake-detector
    
    # Create virtual environment
    python3 -m venv venv
    source venv/bin/activate
    
    # Install dependencies
    pip install --upgrade pip
    pip install -r requirements.txt
    
    print_success "Python environment setup complete"
    cd ..
}

# Setup Node.js environment
setup_node() {
    print_status "Setting up Node.js environment..."
    
    # Install backend dependencies
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    npm install
    
    print_success "Node.js environment setup complete"
}

# Create environment files
create_env_files() {
    print_status "Creating environment configuration files..."
    
    # Backend environment
    if [ ! -f backend/.env ]; then
        cp backend/.env.example backend/.env
        print_success "Created backend/.env"
    else
        print_warning "backend/.env already exists, skipping..."
    fi
    
    # Python service environment
    if [ ! -f deepfake-detector/.env ]; then
        cp deepfake-detector/.env.example deepfake-detector/.env
        print_success "Created deepfake-detector/.env"
    else
        print_warning "deepfake-detector/.env already exists, skipping..."
    fi
    
    print_success "Environment files created"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p backend/temp
    mkdir -p deepfake-detector/models/weights
    mkdir -p deepfake-detector/logs
    
    print_success "Directories created"
}

# Setup with Docker
setup_docker() {
    print_status "Setting up with Docker..."
    
    # Build and start services
    docker-compose up -d --build
    
    print_success "Docker services started"
    print_status "Services are running on:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend: http://localhost:5000"
    echo "  - Detector: http://localhost:8001"
}

# Setup without Docker
setup_local() {
    print_status "Setting up local development environment..."
    
    # Start Python service in background
    cd deepfake-detector
    source venv/bin/activate
    python main.py &
    DETECTOR_PID=$!
    cd ..
    
    # Start backend service in background
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend service in background
    npm run dev &
    FRONTEND_PID=$!
    
    print_success "Local services started"
    print_status "Services are running on:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend: http://localhost:5000"
    echo "  - Detector: http://localhost:8001"
    echo ""
    print_warning "Press Ctrl+C to stop all services"
    
    # Wait for interrupt
    trap "kill $DETECTOR_PID $BACKEND_PID $FRONTEND_PID; exit" INT
    wait
}

# Main setup function
main() {
    print_status "Starting setup..."
    
    # Check prerequisites
    check_docker
    NODE_AVAILABLE=$(check_node)
    PYTHON_AVAILABLE=$(check_python)
    
    # Create directories
    create_directories
    
    # Create environment files
    create_env_files
    
    # Choose setup method
    if [ "$NODE_AVAILABLE" = "0" ] && [ "$PYTHON_AVAILABLE" = "0" ]; then
        print_status "Both Node.js and Python are available. Setting up local development environment..."
        setup_python
        setup_node
        setup_local
    else
        print_status "Using Docker for setup..."
        setup_docker
    fi
    
    print_success "Setup complete! 🎉"
    print_status "You can now access the deepfake detection system at http://localhost:3000"
}

# Run main function
main "$@"