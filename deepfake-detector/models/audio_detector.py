"""
Audio Deepfake Detection Module
Uses AASIST or RawNet2 for detecting synthetic voices and audio manipulation
"""

import os
import logging
from typing import Optional
import numpy as np
import onnxruntime as ort

logger = logging.getLogger(__name__)

class AudioDetector:
    """Audio deepfake detection using pre-trained models"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.session: Optional[ort.InferenceSession] = None
        self.input_name: Optional[str] = None
        self.model_path = model_path
        self.is_loaded = False
        self.sample_rate = 16000  # Target sample rate for models
        self.max_duration = 10.0  # Maximum audio duration in seconds
        
    async def predict(self, audio_path: str) -> float:
        """
        Predict deepfake probability for an audio file
        
        Args:
            audio_path: Path to the audio file
            
        Returns:
            float: Deepfake probability (0.0 = authentic, 1.0 = deepfake)
        """
        if not self.is_loaded or self.session is None:
            raise RuntimeError("Audio model not loaded. Set AUDIO_MODEL_PATH and restart.")
            
        try:
            # Preprocess audio
            processed_audio = self._preprocess_audio(audio_path)
            
            # Run inference
            prediction = self._run_inference(processed_audio)
            
            return float(prediction)
            
        except Exception as e:
            logger.error(f"Audio prediction error: {e}")
            raise
    
    def _preprocess_audio(self, audio_path: str) -> np.ndarray:
        """Preprocess audio for model input"""
        try:
            import librosa
            import soundfile as sf
            
            # Load audio file
            try:
                # Try librosa first (better format support)
                audio, sr = librosa.load(audio_path, sr=None, mono=True)
            except Exception:
                # Fallback to soundfile
                audio, sr = sf.read(audio_path)
                if len(audio.shape) > 1:
                    audio = audio[:, 0]  # Take first channel if stereo
            
            # Resample to target sample rate
            if sr != self.sample_rate:
                audio = librosa.resample(audio, orig_sr=sr, target_sr=self.sample_rate)
            
            # Trim silence
            audio, _ = librosa.effects.trim(audio, top_db=20)
            
            # Pad or truncate to target duration
            target_length = int(self.sample_rate * self.max_duration)
            if len(audio) > target_length:
                audio = audio[:target_length]
            else:
                # Pad with zeros
                padding = target_length - len(audio)
                audio = np.pad(audio, (0, padding), mode='constant')
            
            # Normalize audio
            audio = librosa.util.normalize(audio)
            
            # Convert to float32
            audio = audio.astype(np.float32)
            
            return audio
            
        except Exception as e:
            logger.error(f"Audio preprocessing error: {e}")
            raise
    
    def _extract_features(self, audio: np.ndarray) -> np.ndarray:
        """Extract audio features for model input"""
        try:
            import librosa
            
            # Extract mel-spectrogram features
            mel_spec = librosa.feature.melspectrogram(
                y=audio,
                sr=self.sample_rate,
                n_mels=80,
                hop_length=160,
                win_length=400,
                fmin=0,
                fmax=8000
            )
            
            # Convert to log scale
            mel_spec = librosa.power_to_db(mel_spec, ref=np.max)
            
            # Normalize features
            mel_spec = (mel_spec - mel_spec.mean()) / (mel_spec.std() + 1e-8)
            
            # Add batch and channel dimensions
            mel_spec = np.expand_dims(mel_spec, axis=0)  # Add batch dimension
            mel_spec = np.expand_dims(mel_spec, axis=0)  # Add channel dimension
            
            return mel_spec
            
        except Exception as e:
            logger.error(f"Feature extraction error: {e}")
            raise
    
    def _run_inference(self, audio: np.ndarray) -> float:
        """Run model inference on preprocessed audio"""
        try:
            if self.session is None or self.input_name is None:
                raise ValueError("ONNX session not initialized")
            
            # Extract features
            features = self._extract_features(audio)
            
            outputs = self.session.run(None, {self.input_name: features.astype(np.float32)})
            score = outputs[0]
            prob = float(np.array(score).squeeze())
            if prob < 0.0 or prob > 1.0:
                prob = 1.0 / (1.0 + np.exp(-prob))
            return float(prob)
            
        except Exception as e:
            logger.error(f"Inference error: {e}")
            raise
    
    def _run_inference_raw(self, audio: np.ndarray) -> float:
        """Run inference on raw audio (for models that don't need feature extraction)"""
        try:
            if self.model is None:
                raise ValueError("Model not loaded")
            
            # Add batch dimension
            audio_batch = np.expand_dims(audio, axis=0)
            
            # This is a placeholder - replace with actual model inference
            # For raw audio models like RawNet2:
            # prediction = self.model.predict(audio_batch)
            # return prediction[0][0]
            
            # Mock inference for now
            return 0.25
            
        except Exception as e:
            logger.error(f"Raw audio inference error: {e}")
            raise

def load_audio_model(model_path: Optional[str] = None) -> AudioDetector:
    """
    Load the audio detection model
    
    Args:
        model_path: Optional path to model weights
        
    Returns:
        AudioDetector instance
    """
    try:
        if model_path is None:
            model_path = os.getenv('AUDIO_MODEL_PATH')

        detector = AudioDetector(model_path)

        if not model_path or not os.path.isfile(model_path):
            raise FileNotFoundError("AUDIO_MODEL_PATH not set or file not found")

        sess_opts = ort.SessionOptions()
        provider = 'CUDAExecutionProvider' if os.getenv('USE_GPU', 'false').lower() == 'true' else 'CPUExecutionProvider'
        try:
            detector.session = ort.InferenceSession(model_path, sess_options=sess_opts, providers=[provider])
        except Exception:
            detector.session = ort.InferenceSession(model_path, sess_options=sess_opts, providers=['CPUExecutionProvider'])
        detector.input_name = detector.session.get_inputs()[0].name
        detector.is_loaded = True
        logger.info(f"Audio ONNX model loaded from {model_path}")
        
        return detector
        
    except Exception as e:
        logger.error(f"Failed to load audio model: {e}")
        # Return mock detector for fallback
        return AudioDetector()

def _try_load_aasist(*args, **kwargs) -> bool:
    return False

def _try_load_rawnet2(*args, **kwargs) -> bool:
    return False