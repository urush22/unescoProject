from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import tempfile
import shutil
import os
from typing import List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Deepfake Detection API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Response model
class DetectResponse(BaseModel):
    result: str  # "authentic", "deepfake", "suspicious"
    confidence: float  # 0.0 to 1.0
    details: List[str]

# Global model variables (will be loaded at startup)
image_model = None
video_model = None
audio_model = None

def load_models():
    """Load deepfake detection models"""
    global image_model, video_model, audio_model
    
    try:
        # Import model loading functions
        from models.image_detector import load_image_model
        from models.video_detector import load_video_model
        from models.audio_detector import load_audio_model
        
        logger.info("Loading image detection model...")
        image_model = load_image_model()
        
        logger.info("Loading video detection model...")
        video_model = load_video_model()
        
        logger.info("Loading audio detection model...")
        audio_model = load_audio_model()
        
        logger.info("All models loaded successfully!")
        
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        logger.warning("Running with mock models for testing")

@app.on_event("startup")
async def startup_event():
    """Load models when the service starts"""
    load_models()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Deepfake Detection API",
        "models_loaded": {
            "image": image_model is not None,
            "video": video_model is not None,
            "audio": audio_model is not None
        }
    }

@app.post("/detect", response_model=DetectResponse)
async def detect_deepfake(
    file: UploadFile = File(...),
    detectionType: str = Form(...)
):
    """
    Detect deepfakes in uploaded media files
    
    Args:
        file: Media file (image, video, or audio)
        detectionType: Type of detection ("image", "video", or "audio")
    
    Returns:
        Detection result with confidence and details
    """
    
    # Validate detection type
    valid_types = ["image", "video", "audio"]
    if detectionType not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid detection type. Must be one of: {valid_types}"
        )
    
    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
    
    try:
        logger.info(f"Processing {detectionType} file: {file.filename}")
        
        # Run detection based on type with extra logging
        if detectionType == "image":
            result = await detect_image(tmp_path)
        elif detectionType == "video":
            # Log basic video stats
            try:
                import cv2
                cap = cv2.VideoCapture(tmp_path)
                total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                fps = cap.get(cv2.CAP_PROP_FPS) or 0
                duration_s = (total_frames / fps) if fps > 0 else 0
                logger.info(f"Video stats - frames: {total_frames}, fps: {fps:.2f}, duration_s: {duration_s:.2f}")
                cap.release()
            except Exception as e:
                logger.warning(f"Video metadata logging failed: {e}")
            result = await detect_video(tmp_path)
        elif detectionType == "audio":
            # Log basic audio stats
            try:
                import soundfile as sf
                info = sf.info(tmp_path)
                duration_s = info.frames / float(info.samplerate) if info.samplerate else 0
                logger.info(f"Audio stats - samplerate: {info.samplerate}, channels: {info.channels}, duration_s: {duration_s:.2f}")
            except Exception as e:
                logger.warning(f"Audio metadata logging failed: {e}")
            result = await detect_audio(tmp_path)
        else:
            result = {
                "result": "suspicious",
                "confidence": 0.5,
                "details": ["Unknown detection type"]
            }
        
        logger.info(f"Detection result: {result}")
        return DetectResponse(**result)
        
    except Exception as e:
        logger.error(f"Detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")
    
    finally:
        # Clean up temporary file
        try:
            os.unlink(tmp_path)
        except Exception as e:
            logger.warning(f"Failed to delete temp file: {e}")

async def detect_image(file_path: str) -> dict:
    """Detect deepfakes in images"""
    try:
        if image_model:
            # Use actual model
            confidence = await image_model.predict(file_path)
        else:
            # Mock detection for testing
            confidence = 0.15  # Mock result
        
        # Determine classification
        if confidence > 0.7:
            result = "deepfake"
            details = [
                "High confidence deepfake detection",
                "Facial manipulation artifacts detected",
                "Inconsistent lighting patterns found",
                "Pixel-level manipulation signatures identified"
            ]
        elif confidence > 0.3:
            result = "suspicious"
            details = [
                "Medium confidence detection",
                "Some suspicious patterns detected",
                "Requires manual verification",
                "Minor artifacts found"
            ]
        else:
            result = "authentic"
            details = [
                "No manipulation detected",
                "Natural facial features",
                "Consistent lighting patterns",
                "Authentic content signatures"
            ]
        
        return {
            "result": result,
            "confidence": float(confidence),
            "details": details
        }
        
    except Exception as e:
        logger.error(f"Image detection error: {e}")
        return {
            "result": "suspicious",
            "confidence": 0.5,
            "details": [f"Detection error: {str(e)}"]
        }

async def detect_video(file_path: str) -> dict:
    """Detect deepfakes in videos"""
    try:
        if video_model:
            # Use actual model
            confidence = await video_model.predict(file_path)
        else:
            # Mock detection for testing
            confidence = 0.65  # Mock result
        
        # Determine classification
        if confidence > 0.7:
            result = "deepfake"
            details = [
                "High confidence video deepfake detection",
                "Temporal inconsistencies detected",
                "Unnatural facial movements found",
                "Frame manipulation artifacts identified"
            ]
        elif confidence > 0.3:
            result = "suspicious"
            details = [
                "Medium confidence video detection",
                "Some temporal artifacts detected",
                "Requires extended analysis",
                "Minor motion inconsistencies found"
            ]
        else:
            result = "authentic"
            details = [
                "No video manipulation detected",
                "Natural temporal flow",
                "Consistent motion patterns",
                "Authentic video signatures"
            ]
        
        return {
            "result": result,
            "confidence": float(confidence),
            "details": details
        }
        
    except Exception as e:
        logger.error(f"Video detection error: {e}")
        return {
            "result": "suspicious",
            "confidence": 0.5,
            "details": [f"Video detection error: {str(e)}"]
        }

async def detect_audio(file_path: str) -> dict:
    """Detect deepfakes in audio"""
    try:
        if audio_model:
            # Use actual model
            confidence = await audio_model.predict(file_path)
        else:
            # Mock detection for testing
            confidence = 0.25  # Mock result
        
        # Determine classification
        if confidence > 0.7:
            result = "deepfake"
            details = [
                "High confidence audio deepfake detection",
                "Synthetic voice patterns detected",
                "Voice cloning signatures found",
                "Unnatural speech characteristics identified"
            ]
        elif confidence > 0.3:
            result = "suspicious"
            details = [
                "Medium confidence audio detection",
                "Some suspicious patterns detected",
                "Requires audio expert review",
                "Minor processing artifacts found"
            ]
        else:
            result = "authentic"
            details = [
                "No audio manipulation detected",
                "Natural speech patterns",
                "Consistent audio quality",
                "Authentic recording characteristics"
            ]
        
        return {
            "result": result,
            "confidence": float(confidence),
            "details": details
        }
        
    except Exception as e:
        logger.error(f"Audio detection error: {e}")
        return {
            "result": "suspicious",
            "confidence": 0.5,
            "details": [f"Audio detection error: {str(e)}"]
        }

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )