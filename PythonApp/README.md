# Python Application - Pillow Vulnerability Demo

This application demonstrates a **Pillow vulnerability** where the fixed version requires a Python base image upgrade.

## 🔴 Vulnerability Details

- **Package**: Pillow 9.5.0
- **Severity**: HIGH (Multiple CVEs in Pillow 9.x)
- **Vulnerable Version**: Pillow 9.5.0 (has known vulnerabilities)
- **Fixed Version**: Pillow 10.0.0+
- **Problem**: Pillow 10.0.0+ **requires Python 3.8+** (dropped Python 3.7 support)

## 📋 The Problem

This project uses:
- **Base Image**: `python:3.7-slim`
- **Package**: `pillow==9.5.0` (VULNERABLE)

**You CANNOT upgrade to Pillow 10.0+ without upgrading the base image from `python:3.7` to `python:3.8+`.**

This demonstrates a real-world scenario where:
1. A package in `requirements.txt` has a vulnerability
2. The fixed version of that package requires a newer Python version
3. You must upgrade the Docker base image to fix the vulnerability

## 🔧 Files Included

- `Dockerfile` - Uses `python:3.7-slim` with `pillow==9.5.0` (VULNERABLE)
- `app.py` - Flask app that shows Pillow version
- `requirements.txt` - Contains vulnerable `pillow==9.5.0`

## 🚀 Running the Application

```bash
# Build image
docker build -t python-app .

# Run container
docker run -p 5000:5000 python-app

# Check vulnerability status
curl http://localhost:5000/version
```

Expected output:
```json
{
  "pillow": "9.5.0",
  "status": "VULNERABLE - Multiple CVEs",
  "note": "Pillow 10.0+ (fixed) requires Python 3.8+, but this image uses Python 3.7"
}
```

## 🎯 Key Takeaway

**When a package vulnerability fix requires a newer Python version, you cannot just update `requirements.txt`. You MUST upgrade the base Docker image.**

## ❌ Why You Can't Just Update requirements.txt

If you try to upgrade Pillow in `requirements.txt`:
```txt
pillow==10.0.0  # This will FAIL!
```

You'll get an error:
```
ERROR: Package 'pillow' requires a different Python: 3.7.x not in '>=3.8'
```

## ✅ Remediation Steps

1. Update `Dockerfile`: Change `FROM python:3.7-slim` to `FROM python:3.8-slim` (or newer)
2. Update `requirements.txt`: Change `pillow==9.5.0` to `pillow==10.0.0`
3. Rebuild the Docker image
4. Test your application for compatibility
5. Deploy the updated image

## 🔍 Scanning for Vulnerabilities

```bash
# Scan the image
docker scan python-app
```

Or use Trivy:
```bash
trivy image python-app
```

