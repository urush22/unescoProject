"""
Image Deepfake Detection Module
Uses Face X-ray or XceptionNet for detecting manipulated images
"""

import os
import logging
from typing import Optional
import numpy as np
import onnxruntime as ort

logger = logging.getLogger(__name__)

class ImageDetector:
    """Image deepfake detection using pre-trained models"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.session: Optional[ort.InferenceSession] = None
        self.input_name: Optional[str] = None
        self.model_path = model_path
        self.is_loaded = False
        
    async def predict(self, image_path: str) -> float:
        """
        Predict deepfake probability for an image
        
        Args:
            image_path: Path to the image file
            
        Returns:
            float: Deepfake probability (0.0 = authentic, 1.0 = deepfake)
        """
        if not self.is_loaded or self.session is None:
            raise RuntimeError("Image model not loaded. Set IMAGE_MODEL_PATH and restart.")
            
        try:
            # Preprocess image
            processed_image = self._preprocess_image(image_path)
            
            # Run inference
            prediction = self._run_inference(processed_image)
            
            return float(prediction)
            
        except Exception as e:
            logger.error(f"Image prediction error: {e}")
            raise
    
    def _preprocess_image(self, image_path: str) -> np.ndarray:
        """Preprocess image for model input"""
        try:
            import cv2
            from PIL import Image
            
            # Load image
            if image_path.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                # Use PIL for better format support
                image = Image.open(image_path).convert('RGB')
                image = np.array(image)
            else:
                # Use OpenCV as fallback
                image = cv2.imread(image_path)
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Resize to model input size (default 224x224; override via env if needed)
            target_h = int(os.getenv('IMAGE_INPUT_H', '224'))
            target_w = int(os.getenv('IMAGE_INPUT_W', '224'))
            image = cv2.resize(image, (target_w, target_h))

            # Normalize pixel values and optionally mean/std
            image = image.astype(np.float32) / 255.0
            if os.getenv('IMAGE_NORM_MEAN') and os.getenv('IMAGE_NORM_STD'):
                mean = np.fromstring(os.getenv('IMAGE_NORM_MEAN'), sep=',', dtype=np.float32)
                std = np.fromstring(os.getenv('IMAGE_NORM_STD'), sep=',', dtype=np.float32)
                image = (image - mean) / (std + 1e-8)

            # HWC -> CHW and add batch dimension (NCHW)
            image = np.transpose(image, (0, 1, 2))  # HWC
            image = np.transpose(image, (2, 0, 1))  # CHW
            image = np.expand_dims(image, axis=0)   # NCHW
            
            return image
            
        except Exception as e:
            logger.error(f"Image preprocessing error: {e}")
            raise
    
    def _run_inference(self, processed_image: np.ndarray) -> float:
        """Run model inference on preprocessed image"""
        try:
            if self.session is None or self.input_name is None:
                raise ValueError("ONNX session not initialized")

            outputs = self.session.run(None, {self.input_name: processed_image})
            score = outputs[0]
            # Reduce to scalar
            prob = float(np.array(score).squeeze())
            # If output seems to be a logit, apply sigmoid
            if prob < 0.0 or prob > 1.0:
                prob = 1.0 / (1.0 + np.exp(-prob))
            return float(prob)
            
        except Exception as e:
            logger.error(f"Inference error: {e}")
            raise

def load_image_model(model_path: Optional[str] = None) -> ImageDetector:
    """
    Load the image detection model
    
    Args:
        model_path: Optional path to model weights
        
    Returns:
        ImageDetector instance
    """
    try:
        if model_path is None:
            model_path = os.getenv('IMAGE_MODEL_PATH')

        detector = ImageDetector(model_path)

        if not model_path or not os.path.isfile(model_path):
            raise FileNotFoundError("IMAGE_MODEL_PATH not set or file not found")

        # Load ONNX model
        sess_opts = ort.SessionOptions()
        provider = 'CUDAExecutionProvider' if os.getenv('USE_GPU', 'false').lower() == 'true' else 'CPUExecutionProvider'
        try:
            detector.session = ort.InferenceSession(model_path, sess_options=sess_opts, providers=[provider])
        except Exception:
            detector.session = ort.InferenceSession(model_path, sess_options=sess_opts, providers=['CPUExecutionProvider'])
        detector.input_name = detector.session.get_inputs()[0].name
        detector.is_loaded = True
        logger.info(f"Image ONNX model loaded from {model_path}")
        
        return detector
        
    except Exception as e:
        logger.error(f"Failed to load image model: {e}")
        # Return mock detector for fallback
        return ImageDetector()

def _try_load_face_xray(*args, **kwargs) -> bool:
    return False

def _try_load_xception(*args, **kwargs) -> bool:
    return False