# Windows Installation Guide

If you're experiencing issues with `npm install` on Windows, follow these steps:

## 🔧 Method 1: Clean Installation (Recommended)

```bash
# 1. Clean npm cache
npm cache clean --force

# 2. Delete node_modules folder if it exists
rmdir /s node_modules
del package-lock.json

# 3. Install with updated dependencies
npm install
```

## 🔧 Method 2: Alternative Package Manager

If npm continues to fail, try using yarn:

```bash
# Install yarn globally (if not already installed)
npm install -g yarn

# Install dependencies with yarn
yarn install

# Start the server with yarn
yarn dev
```

## 🔧 Method 3: Manual Dependency Installation

If you're still having issues, install packages individually:

```bash
# Install core dependencies first
npm install express cors dotenv helmet compression

# Install file handling
npm install multer@2.0.0-alpha.7 form-data

# Install utilities
npm install axios express-rate-limit express-validator uuid

# Install dev dependencies
npm install --save-dev nodemon
```

## 🚨 Common Windows Issues & Solutions

### Issue 1: "Command failed" with native dependencies
**Solution:** We've removed Sharp and FFmpeg dependencies that commonly cause issues on Windows.

### Issue 2: "Permission denied" errors
**Solution:** Run your terminal/command prompt as Administrator.

### Issue 3: "Network timeout" errors
**Solution:** Use a different npm registry:
```bash
npm install --registry https://registry.npmmirror.com
```

### Issue 4: "Python not found" errors
**Solution:** Install Windows build tools:
```bash
npm install --global windows-build-tools
```

## ✅ Verify Installation

After successful installation, you should see:
- `node_modules/` folder created
- `package-lock.json` file created
- No error messages (warnings are OK)

## 🚀 Start the Server

```bash
# Start in development mode
npm run dev

# You should see:
# 🚀 Deepfake Detection Backend running on port 5000
```

## 🆘 Still Having Issues?

1. **Check Node.js version**: Make sure you have Node.js 16+ installed
   ```bash
   node --version
   npm --version
   ```

2. **Clear all caches**:
   ```bash
   npm cache clean --force
   yarn cache clean
   ```

3. **Use the simplified package.json**: The updated version removes problematic dependencies

4. **Try different network**: Sometimes corporate firewalls block npm downloads

## 📞 Alternative: Use Docker

If all else fails, you can run the backend using Docker:

```dockerfile
# Create Dockerfile in backend folder
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
# Build and run with Docker
docker build -t deepfake-backend .
docker run -p 5000:5000 deepfake-backend
```