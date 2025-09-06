# AI Damage Detection Setup Guide

This guide will help you set up the AI-powered damage detection system for your vehicle rental application.

## 🚀 Quick Start

1. **Create Environment File**: Create a `.env` file in the `frontend` directory
2. **Choose AI Service**: Select one of the supported AI services below
3. **Get API Keys**: Sign up and obtain API keys from your chosen service
4. **Configure Environment**: Add the API keys to your `.env` file
5. **Restart Frontend**: Stop and restart your React development server

## 🔧 Supported AI Services

### 1. Roboflow (Recommended for Beginners)

**Best for**: Easy setup, pre-trained models, good documentation

**Setup Steps**:
1. Go to [Roboflow](https://roboflow.com/) and create an account
2. Navigate to "Deploy" → "Hosted API"
3. Choose a car damage detection model (or use the default)
4. Copy your API key and endpoint URL

**Environment Variables**:
```env
REACT_APP_ROBOFLOW_API_KEY=your_api_key_here
REACT_APP_ROBOFLOW_ENDPOINT=https://detect.roboflow.com
```

**Cost**: Free tier available, then pay-per-use

### 2. Hugging Face

**Best for**: Advanced users, custom models, open source

**Setup Steps**:
1. Go to [Hugging Face](https://huggingface.co/) and create an account
2. Navigate to "Settings" → "Access Tokens"
3. Create a new token with "read" permissions
4. Copy your token

**Environment Variables**:
```env
REACT_APP_HUGGING_FACE_API_KEY=your_token_here
REACT_APP_HUGGING_FACE_ENDPOINT=https://api-inference.huggingface.co
```

**Cost**: Free tier available, then pay-per-use

### 3. Google Cloud Vision API

**Best for**: Enterprise users, high accuracy, comprehensive features

**Setup Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Vision API
4. Create credentials (API key)
5. Copy your API key

**Environment Variables**:
```env
REACT_APP_GOOGLE_CLOUD_API_KEY=your_api_key_here
REACT_APP_GOOGLE_CLOUD_ENDPOINT=https://vision.googleapis.com/v1
```

**Cost**: Pay-per-use, first 1000 requests/month free

## 📁 Complete Environment File Example

Create a file named `.env` in your `frontend` directory:

```env
# Backend URL
REACT_APP_BACKEND_URL=http://localhost:5000

# AI Service Configuration (choose one or more)
REACT_APP_ROBOFLOW_API_KEY=your_roboflow_key_here
REACT_APP_ROBOFLOW_ENDPOINT=https://detect.roboflow.com

# OR use Hugging Face
REACT_APP_HUGGING_FACE_API_KEY=your_huggingface_token_here
REACT_APP_HUGGING_FACE_ENDPOINT=https://api-inference.huggingface.co

# OR use Google Cloud Vision
REACT_APP_GOOGLE_CLOUD_API_KEY=your_google_key_here
REACT_APP_GOOGLE_CLOUD_ENDPOINT=https://vision.googleapis.com/v1
```

## 🎯 How It Works

### 1. Image Upload
- Users upload "before" and "after" images of vehicles
- Images are processed using client-side algorithms

### 2. Local Damage Detection
- **Pixel-level comparison** between before/after images
- **Region detection** using connected components analysis
- **Damage classification** based on shape and size heuristics
- **Severity scoring** from 0-100 based on area and intensity

### 3. AI Enhancement (Optional)
- **AI Detect button** sends images to your chosen AI service
- **Bounding boxes** are drawn around detected damage
- **Confidence scores** are provided for each detection
- **Damage types** are classified (scratch, dent, chip, etc.)

### 4. Report Generation
- **Comprehensive reports** with all detection results
- **Severity assessment** and cost estimation
- **Review workflow** for staff approval/rejection
- **Historical tracking** of all damage reports

## 🔍 Testing the System

### 1. Basic Functionality (No AI Required)
- Upload before/after images
- Click "Detect Damage" to see local analysis
- View damage regions and severity scores
- Save damage reports

### 2. AI Integration Testing
- Ensure your `.env` file is configured
- Restart the frontend server
- Upload an "after" image
- Click "AI Detect" to test the AI service
- Verify bounding boxes and confidence scores

### 3. Sample Test Images
For testing, you can use:
- **Before**: Clean car image
- **After**: Same car with visible scratches/dents
- **Expected**: Detection of damaged areas with severity scores

## 🛠️ Troubleshooting

### Common Issues

**"Missing API Key" Error**:
- Check your `.env` file exists in the `frontend` directory
- Verify the variable names match exactly
- Restart your React development server

**"AI Detection Failed" Error**:
- Check your internet connection
- Verify your API key is valid
- Check the AI service status page
- Review browser console for detailed error messages

**No Damage Detected**:
- Ensure images are clear and well-lit
- Check that images show the same vehicle
- Verify images are in supported formats (JPG, PNG, WebP)

### Performance Tips

**For Better Detection**:
- Use high-resolution images (minimum 800x600)
- Ensure consistent lighting between before/after
- Capture images from the same angle
- Avoid shadows and reflections

**For Faster Processing**:
- Compress images to reasonable sizes
- Use JPG format for faster uploads
- Close other browser tabs during processing

## 📊 Understanding Results

### Severity Scores
- **0-30**: Minor damage (scratches, small dents)
- **31-60**: Moderate damage (larger dents, paint chips)
- **61-100**: Major damage (deep scratches, large dents)

### Damage Types
- **Scratch**: Linear damage patterns
- **Dent**: Circular/oval damage patterns
- **Chip**: Small localized damage
- **Deep Damage**: High severity damage
- **Surface Damage**: General surface issues

### Confidence Levels
- **90%+**: Very confident detection
- **70-89%**: Confident detection
- **50-69%**: Moderate confidence
- **Below 50%**: Low confidence (may need review)

## 🔒 Security Considerations

### API Key Protection
- Never commit `.env` files to version control
- Use environment variables in production
- Rotate API keys regularly
- Monitor API usage for unusual activity

### Data Privacy
- Images are processed locally when possible
- AI services may store images temporarily
- Review privacy policies of chosen AI services
- Consider data retention policies

## 🚀 Production Deployment

### Environment Variables
In production, set environment variables through your hosting platform:

**Vercel**:
```bash
vercel env add REACT_APP_ROBOFLOW_API_KEY
```

**Netlify**:
- Go to Site Settings → Environment Variables
- Add your API keys

**Heroku**:
```bash
heroku config:set REACT_APP_ROBOFLOW_API_KEY=your_key
```

### Monitoring
- Set up alerts for API usage limits
- Monitor error rates and response times
- Track user engagement with damage detection
- Analyze detection accuracy over time

## 📚 Additional Resources

### Documentation
- [Roboflow API Docs](https://docs.roboflow.com/)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference)
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)

### Community Support
- [Roboflow Community](https://community.roboflow.com/)
- [Hugging Face Forums](https://discuss.huggingface.co/)
- [Google Cloud Community](https://cloud.google.com/support)

### Model Training (Advanced)
If you want to train custom models:
- **Roboflow**: Upload your own dataset and train
- **Hugging Face**: Use custom models from the hub
- **Google Cloud**: Train custom AutoML Vision models

## 🎉 Success!

Once configured, you'll have:
- ✅ Automated damage detection
- ✅ AI-powered analysis
- ✅ Professional damage reports
- ✅ Staff review workflow
- ✅ Historical damage tracking

Your vehicle rental system now includes cutting-edge AI technology for damage assessment!
