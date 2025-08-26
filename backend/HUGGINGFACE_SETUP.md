# Hugging Face Setup Guide - FREE Deepfake Detection

Hugging Face offers **FREE** deepfake detection models that you can use without paid subscriptions!

## 🆓 **Why Choose Hugging Face:**

✅ **Completely FREE** - No paid subscriptions required  
✅ **Multiple Models** - Various AI detection models available  
✅ **Easy Setup** - Just need a free API key  
✅ **Good Accuracy** - Community-driven models with decent performance  
✅ **Open Source** - Transparent and community-supported  

## 🔑 **Step 1: Get FREE Hugging Face API Key**

### **1. Sign Up (Free)**
1. Go to [huggingface.co](https://huggingface.co)
2. Click "Sign Up" 
3. Create a **free account** (no credit card needed)

### **2. Generate API Token**
1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Name: `deepfake-detection` 
4. Type: `Read`
5. Click "Generate"
6. **Copy the token** (starts with `hf_`)

## ⚙️ **Step 2: Configure Your Backend**

### **Edit `.env` file:**

```env
# Add this line (uncomment and paste your token):
HUGGINGFACE_API_KEY=hf_your_actual_token_here
```

**Example:**
```env
# Before:
# HUGGINGFACE_API_KEY=your_huggingface_api_key

# After:
HUGGINGFACE_API_KEY=hf_abcdefghijklmnopqrstuvwxyz1234567890
```

## 🤖 **Available Models (All Free)**

### **1. AI Image Detector (Recommended)**
- **Model**: `umm-maybe/AI-image-detector`
- **Purpose**: Detects AI-generated images
- **Accuracy**: Very good for AI-generated content
- **Speed**: Fast response

### **2. Microsoft DisCo**
- **Model**: `microsoft/DisCo-diff`
- **Purpose**: Diffusion model detection
- **Good for**: Stable Diffusion, DALL-E generated images

### **3. AI Content Detector**
- **Model**: `openai/shap-e`
- **Purpose**: General AI content detection
- **Use case**: Broad AI-generated content

## 🚀 **Step 3: Test Your Setup**

### **1. Start Backend**
```bash
cd backend
npm run dev
```

### **2. Check Provider Status**
```bash
curl http://localhost:5000/api/deepfake/providers
```

**Expected Response:**
```json
{
  "success": true,
  "providers": [
    {
      "name": "huggingface",
      "enabled": true,
      "baseUrl": "https://api-inference.huggingface.co/models"
    }
  ]
}
```

### **3. Test Detection**
Upload an image through your frontend at `http://localhost:3000/deepfake-detection`

## 📊 **Expected Results**

### **AI-Generated Image:**
```json
{
  "success": true,
  "result": "deepfake",
  "confidence": 85,
  "details": [
    "Hugging Face AI detection: 2 classification(s) analyzed",
    "Inconsistent lighting patterns detected",
    "Facial feature misalignment found"
  ],
  "provider": "huggingface"
}
```

### **Real Image:**
```json
{
  "success": true,
  "result": "authentic", 
  "confidence": 92,
  "details": [
    "Hugging Face AI detection: 2 classification(s) analyzed",
    "Natural facial features and expressions",
    "Consistent lighting and shadows"
  ],
  "provider": "huggingface"
}
```

## ⚡ **Performance Notes**

### **First Request:**
- May take **10-20 seconds** (model loading)
- You'll see: "Model is loading, please try again"
- **This is normal!** Just wait and retry

### **Subsequent Requests:**
- Much faster: **2-5 seconds**
- Models stay loaded for a while

## 🔧 **Advanced Configuration**

### **Use Different Models:**

Edit `backend/services/deepfakeService.js` line ~222:

```javascript
// Change this line:
modelEndpoint = 'umm-maybe/AI-image-detector';

// To try different models:
modelEndpoint = 'microsoft/DisCo-diff';
// or
modelEndpoint = 'your-preferred-model-name';
```

### **Multiple Models Setup:**

You can modify the code to try multiple models for better accuracy:

```javascript
const models = [
  'umm-maybe/AI-image-detector',
  'microsoft/DisCo-diff'
];
// Try each model and combine results
```

## 🆚 **Comparison with Paid Services**

| Feature | Hugging Face | Sightengine | Hive AI |
|---------|-------------|-------------|---------|
| **Cost** | 🆓 FREE | 💰 Paid | 💰 Paid |
| **Accuracy** | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent |
| **Speed** | ⭐⭐⭐ Medium | ⭐⭐⭐⭐⭐ Fast | ⭐⭐⭐⭐ Fast |
| **Setup** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐ Medium | ⭐⭐⭐ Medium |

## 🚨 **Troubleshooting**

### **Issue 1: "Model is loading"**
**Solution:** Wait 10-20 seconds and try again. This happens on first use.

### **Issue 2: "Invalid API key"**
**Solution:** 
1. Check your token starts with `hf_`
2. Verify it's uncommented in `.env`
3. Restart the backend server

### **Issue 3: "Model not found"**
**Solution:** The model name might have changed. Try:
- `umm-maybe/AI-image-detector`
- `microsoft/DisCo-diff`

### **Issue 4: Slow responses**
**Solution:** 
- First request is always slow (model loading)
- Subsequent requests are much faster
- Consider using multiple providers for fallback

## 💡 **Pro Tips**

1. **Start with Hugging Face** - It's free and works well!
2. **Combine with other providers** - Use multiple APIs for better coverage
3. **Test with various images** - Try AI-generated and real images
4. **Monitor usage** - Hugging Face has generous free limits

## 🎯 **Next Steps**

1. **Get your free API key** from Hugging Face
2. **Add to `.env` file**
3. **Test with sample images**
4. **Consider adding paid providers later** if needed

**You now have FREE deepfake detection powered by open-source AI models!** 🚀