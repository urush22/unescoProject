# Deepfake Detection Models Integration Guide

This directory contains the model integration modules for the deepfake detection service. Currently, the service runs with mock models for testing purposes. To use actual deepfake detection models, follow the integration guide below.

## Available Model Types

### Image Detection Models

#### 1. Face X-ray (Recommended)
- **Paper**: [Face X-ray for More General Face Forgery Detection](https://arxiv.org/abs/2003.06132)
- **GitHub**: [Face X-ray Implementation](https://github.com/youyuge34/Face-X-ray)
- **License**: MIT
- **Input**: RGB images (224x224 or 299x299)
- **Output**: Binary classification (authentic/deepfake)

**Integration Steps:**
1. Download pre-trained weights from the official repository
2. Place weights in `models/weights/face_xray.pth`
3. Update `_try_load_face_xray()` function in `image_detector.py`

#### 2. XceptionNet (Baseline)
- **Paper**: [FaceForensics++: Learning to Detect Manipulated Facial Images](https://arxiv.org/abs/1901.08971)
- **GitHub**: [FaceForensics++ Implementation](https://github.com/ondyari/FaceForensics)
- **License**: MIT
- **Input**: RGB images (299x299)
- **Output**: Binary classification

**Integration Steps:**
1. Download pre-trained weights from FaceForensics++ repository
2. Place weights in `models/weights/xception.pth`
3. Update `_try_load_xception()` function in `image_detector.py`

### Video Detection Models

#### 1. LipForensics (Recommended)
- **Paper**: [Leveraging Frequency Analysis for Deep Fake Image Recognition](https://arxiv.org/abs/2003.08685)
- **GitHub**: [LipForensics Implementation](https://github.com/ahmedtaha6/LipForensics)
- **License**: MIT
- **Input**: Video frames with temporal analysis
- **Output**: Binary classification

**Integration Steps:**
1. Download pre-trained weights from the official repository
2. Place weights in `models/weights/lipforensics.pth`
3. Update `_try_load_lipforensics()` function in `video_detector.py`

#### 2. XceptionNet Video
- **Paper**: [FaceForensics++: Learning to Detect Manipulated Facial Images](https://arxiv.org/abs/1901.08971)
- **Input**: Individual video frames
- **Output**: Binary classification per frame

### Audio Detection Models

#### 1. AASIST (Recommended)
- **Paper**: [AASIST: Audio Anti-Spoofing using Integrated Spectro-Temporal Graph Attention Networks](https://arxiv.org/abs/2110.01200)
- **GitHub**: [AASIST Implementation](https://github.com/clovaai/aasist)
- **License**: MIT
- **Input**: Mel-spectrogram features
- **Output**: Binary classification

**Integration Steps:**
1. Download pre-trained weights from the official repository
2. Place weights in `models/weights/aasist.pth`
3. Update `_try_load_aasist()` function in `audio_detector.py`

#### 2. RawNet2
- **Paper**: [RawNet2: End-to-End Raw Audio Format Network](https://arxiv.org/abs/1904.08104)
- **Input**: Raw audio waveforms
- **Output**: Binary classification

## Model Integration Examples

### TensorFlow/Keras Integration

```python
def _try_load_face_xray(detector: ImageDetector, model_path: Optional[str]) -> bool:
    try:
        import tensorflow as tf
        
        # Load the model
        detector.model = tf.keras.models.load_model(model_path)
        detector.is_loaded = True
        
        return True
    except Exception as e:
        logger.debug(f"Face X-ray loading failed: {e}")
        return False

def _run_inference(self, processed_image: np.ndarray) -> float:
    try:
        # Run inference
        prediction = self.model.predict(processed_image, verbose=0)
        return float(prediction[0][0])
    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise
```

### PyTorch Integration

```python
def _try_load_face_xray(detector: ImageDetector, model_path: Optional[str]) -> bool:
    try:
        import torch
        
        # Load the model
        detector.model = torch.load(model_path, map_location='cpu')
        detector.model.eval()
        detector.is_loaded = True
        
        return True
    except Exception as e:
        logger.debug(f"Face X-ray loading failed: {e}")
        return False

def _run_inference(self, processed_image: np.ndarray) -> float:
    try:
        import torch
        
        # Convert to tensor
        image_tensor = torch.from_numpy(processed_image).float()
        
        with torch.no_grad():
            prediction = self.model(image_tensor)
            return torch.sigmoid(prediction).item()
    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise
```

### ONNX Runtime Integration

```python
def _try_load_face_xray(detector: ImageDetector, model_path: Optional[str]) -> bool:
    try:
        import onnxruntime as ort
        
        # Create inference session
        detector.model = ort.InferenceSession(model_path)
        detector.is_loaded = True
        
        return True
    except Exception as e:
        logger.debug(f"Face X-ray loading failed: {e}")
        return False

def _run_inference(self, processed_image: np.ndarray) -> float:
    try:
        # Get input name
        input_name = self.model.get_inputs()[0].name
        
        # Run inference
        prediction = self.model.run(None, {input_name: processed_image})
        return float(prediction[0][0])
    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise
```

## Performance Optimization

### GPU Acceleration
To enable GPU acceleration, update the environment variables:

```bash
# For TensorFlow
export CUDA_VISIBLE_DEVICES=0

# For PyTorch
export CUDA_VISIBLE_DEVICES=0

# For ONNX Runtime
export CUDA_VISIBLE_DEVICES=0
```

### Model Quantization
For faster inference, consider quantizing your models:

```python
# TensorFlow quantization
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# PyTorch quantization
quantized_model = torch.quantization.quantize_dynamic(
    model, {torch.nn.Linear}, dtype=torch.qint8
)
```

### Batch Processing
For multiple files, implement batch processing:

```python
async def detect_batch(self, file_paths: List[str], detection_type: str) -> List[dict]:
    results = []
    
    # Process in batches
    batch_size = 4
    for i in range(0, len(file_paths), batch_size):
        batch = file_paths[i:i + batch_size]
        batch_results = await self._process_batch(batch, detection_type)
        results.extend(batch_results)
    
    return results
```

## Testing Your Models

1. **Unit Tests**: Create test files for each model module
2. **Integration Tests**: Test the complete detection pipeline
3. **Performance Tests**: Measure inference time and accuracy
4. **Edge Cases**: Test with various file formats and sizes

## Troubleshooting

### Common Issues

1. **Model Loading Failures**
   - Check file paths and permissions
   - Verify model format compatibility
   - Check dependency versions

2. **Memory Issues**
   - Reduce batch size
   - Use model quantization
   - Enable garbage collection

3. **Performance Issues**
   - Enable GPU acceleration
   - Use model optimization
   - Implement caching

### Debug Mode

Enable debug logging by setting the log level:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Next Steps

1. Download pre-trained weights for your chosen models
2. Update the model loading functions
3. Test with sample media files
4. Optimize performance for production use
5. Implement model versioning and updates

For more information, refer to the individual model repositories and documentation.