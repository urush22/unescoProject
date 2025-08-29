"""
Video Deepfake Detection Module
Uses LipForensics or XceptionNet for detecting manipulated videos
"""

import os
import logging
from typing import Optional, List
import numpy as np
import onnxruntime as ort

logger = logging.getLogger(__name__)

class VideoDetector:
    """Video deepfake detection using pre-trained models"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.session: Optional[ort.InferenceSession] = None
        self.input_name: Optional[str] = None
        self.model_path = model_path
        self.is_loaded = False
        self.frame_rate = 1  # Frames per second to sample
        
    async def predict(self, video_path: str) -> float:
        """
        Predict deepfake probability for a video
        
        Args:
            video_path: Path to the video file
            
        Returns:
            float: Deepfake probability (0.0 = authentic, 1.0 = deepfake)
        """
        if not self.is_loaded or self.session is None:
            raise RuntimeError("Video model not loaded. Set VIDEO_MODEL_PATH and restart.")
            
        try:
            # Extract frames from video
            frames = self._extract_frames(video_path)
            
            if not frames:
                raise RuntimeError("No frames extracted from video")
            
            # Run inference on frames
            predictions = []
            for frame in frames:
                prediction = self._run_inference_on_frame(frame)
                predictions.append(prediction)
            
            # Aggregate predictions (average for now, could use more sophisticated methods)
            final_prediction = np.mean(predictions)
            
            return float(final_prediction)
            
        except Exception as e:
            logger.error(f"Video prediction error: {e}")
            return 0.5  # Default to suspicious on error
    
    def _extract_frames(self, video_path: str) -> List[np.ndarray]:
        """Extract frames from video for analysis"""
        try:
            import cv2
            
            frames = []
            cap = cv2.VideoCapture(video_path)
            
            if not cap.isOpened():
                logger.error(f"Could not open video: {video_path}")
                return frames
            
            # Get video properties
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            
            if fps <= 0:
                fps = 30  # Default fallback
            
            # Calculate frame interval for sampling
            frame_interval = max(1, int(fps / self.frame_rate))
            
            logger.info(f"Video: {total_frames} frames, {fps:.2f} fps, sampling every {frame_interval} frames")
            
            frame_count = 0
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Sample frames based on interval
                if frame_count % frame_interval == 0:
                    # Convert BGR to RGB
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    
                    # Resize frame for model input
                    target_h = int(os.getenv('VIDEO_INPUT_H', '224'))
                    target_w = int(os.getenv('VIDEO_INPUT_W', '224'))
                    frame_resized = cv2.resize(frame_rgb, (target_w, target_h))
                    
                    # Normalize pixel values
                    frame_normalized = frame_resized.astype(np.float32) / 255.0
                    
                    # CHW for NCHW models
                    frame_chw = np.transpose(frame_normalized, (2, 0, 1))
                    frames.append(frame_chw)
                    
                    # Limit number of frames to process
                    if len(frames) >= 30:  # Max 30 frames
                        break
                
                frame_count += 1
            
            cap.release()
            
            logger.info(f"Extracted {len(frames)} frames for analysis")
            return frames
            
        except Exception as e:
            logger.error(f"Frame extraction error: {e}")
            return []
    
    def _run_inference_on_frame(self, frame: np.ndarray) -> float:
        """Run model inference on a single frame"""
        try:
            if self.session is None or self.input_name is None:
                raise ValueError("ONNX session not initialized")
            
            # Add batch dimension
            frame_batch = np.expand_dims(frame, axis=0).astype(np.float32)
            
            # This is a placeholder - replace with actual model inference
            # For example, with TensorFlow/Keras:
            # prediction = self.model.predict(frame_batch)
            # return prediction[0][0]  # Assuming binary classification
            
            # For PyTorch:
            # with torch.no_grad():
            #     prediction = self.model(frame_batch)
            #     return torch.sigmoid(prediction).item()
            
            outputs = self.session.run(None, {self.input_name: frame_batch})
            score = outputs[0]
            prob = float(np.array(score).squeeze())
            if prob < 0.0 or prob > 1.0:
                prob = 1.0 / (1.0 + np.exp(-prob))
            return float(prob)
            
        except Exception as e:
            logger.error(f"Frame inference error: {e}")
            return 0.5
    
    def _run_inference_on_video_clip(self, frames: List[np.ndarray]) -> float:
        """Run inference on entire video clip (for models that support temporal analysis)"""
        try:
            if self.model is None:
                raise ValueError("Model not loaded")
            
            # Stack frames into a single tensor
            # Shape: (num_frames, height, width, channels)
            frames_tensor = np.stack(frames, axis=0)
            
            # Add batch dimension
            frames_batch = np.expand_dims(frames_tensor, axis=0)
            
            # This is a placeholder - replace with actual model inference
            # For temporal models like LipForensics:
            # prediction = self.model.predict(frames_batch)
            # return prediction[0][0]
            
            # Mock inference for now
            return 0.65
            
        except Exception as e:
            logger.error(f"Video clip inference error: {e}")
            return 0.5

def load_video_model(model_path: Optional[str] = None) -> VideoDetector:
    """
    Load the video detection model
    
    Args:
        model_path: Optional path to model weights
        
    Returns:
        VideoDetector instance
    """
    try:
        if model_path is None:
            model_path = os.getenv('VIDEO_MODEL_PATH')

        detector = VideoDetector(model_path)

        if not model_path or not os.path.isfile(model_path):
            raise FileNotFoundError("VIDEO_MODEL_PATH not set or file not found")

        sess_opts = ort.SessionOptions()
        provider = 'CUDAExecutionProvider' if os.getenv('USE_GPU', 'false').lower() == 'true' else 'CPUExecutionProvider'
        try:
            detector.session = ort.InferenceSession(model_path, sess_options=sess_opts, providers=[provider])
        except Exception:
            detector.session = ort.InferenceSession(model_path, sess_options=sess_opts, providers=['CPUExecutionProvider'])
        detector.input_name = detector.session.get_inputs()[0].name
        detector.is_loaded = True
        logger.info(f"Video ONNX model loaded from {model_path}")
        
        return detector
        
    except Exception as e:
        logger.error(f"Failed to load video model: {e}")
        # Return mock detector for fallback
        return VideoDetector()

def _try_load_lipforensics(*args, **kwargs) -> bool:
    return False

def _try_load_xception_video(*args, **kwargs) -> bool:
    return False