#!/bin/bash

# Deepfake Detection Setup Script (Local Only - No Docker)
# This script sets up the complete deepfake detection system locally

set -e

echo "🚀 Setting up Deepfake Detection System (Local Only)..."

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

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and retry."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and retry."
        exit 1
    fi
    
    print_success "Node.js and npm are available"
}

# Check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.11+ and retry."
        exit 1
    fi
    
    if ! command -v pip3 &> /dev/null; then
        print_error "pip3 is not installed. Please install pip3 and retry."
        exit 1
    fi
    
    print_success "Python 3 and pip3 are available"
}

# Setup Python environment
setup_python() {
    print_status "Setting up Python environment..."
    
    cd deepfake-detector
    
    # Create virtual environment if not exists
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    # Activate venv
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
    
    # Install frontend dependencies (root)
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

# Start services locally
start_local() {
    print_status "Starting local services (3 terminals recommended)..."
    
    echo ""
    echo "Open three terminals and run the following commands:" 
    echo ""
    echo "Terminal 1 - Python Detector Service:"
    echo "  cd deepfake-detector && source venv/bin/activate && python main.py"
    echo ""
    echo "Terminal 2 - Backend API:"
    echo "  cd backend && npm start"
    echo ""
    echo "Terminal 3 - Frontend Web App:"
    echo "  npm run dev"
    echo ""
    print_status "Service URLs:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend: http://localhost:5000"
    echo "  - Detector: http://localhost:8001"
}

# Main setup function
main() {
    print_status "Starting local-only setup..."
    
    # Check prerequisites
    check_node
    check_python
    
    # Create directories
    create_directories
    
    # Create environment files
    create_env_files
    
    # Setup environments
    setup_python
    setup_node
    
    # Start instructions
    start_local
    
    print_success "Local setup complete! 🎉"
}

# Run main function
main "$@"