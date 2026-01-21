# Celery Task Queue Application

A simple Flask application with Celery for asynchronous task processing.

## 📋 Setup

- **Base Image**: `python:3.8-slim`
- **Packages**:
  - `celery==5.3.0`
  - `kombu==5.2.4` (message queue library)
  - `billiard==3.6.4` (process pool library)
  - `redis==4.5.0`

## 🔧 Files

- `Dockerfile` - Python 3.8 base image
- `app.py` - Celery task queue application
- `requirements.txt` - Python dependencies

## 🚀 Running the Application

```bash
# Build image
docker build -t celery-app .

# Run container
docker run -p 5000:5000 celery-app

# Check version
curl http://localhost:5000/version
```

## 📡 Endpoints

- `GET /` - Home endpoint with all package versions
- `GET /health` - Health check
- `GET /version` - Detailed version information
- `GET /task/add/<x>/<y>` - Create async task to add two numbers
- `GET /queue/inspect` - Inspect message queue (uses kombu)
- `GET /workers/info` - Get worker pool information (uses billiard)

