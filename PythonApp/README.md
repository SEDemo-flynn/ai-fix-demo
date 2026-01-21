# Python Flask Application

A simple Flask web application with image processing capabilities.

## 📋 Setup

- **Base Image**: `python:3.7-slim`
- **Packages**: Flask, Werkzeug, Pillow

## 🔧 Files

- `Dockerfile` - Python 3.7 base image
- `app.py` - Flask application
- `requirements.txt` - Python dependencies

## 🚀 Running the Application

```bash
# Build image
docker build -t python-app .

# Run container
docker run -p 5000:5000 python-app

# Check version
curl http://localhost:5000/version
```

## 📡 Endpoints

- `GET /` - Home endpoint
- `GET /health` - Health check
- `GET /version` - Version information

