# Celery App - Vulnerability Requiring Code Changes AND Base Image Upgrade

This demonstrates **Celery 5.3.0 vulnerability** where upgrading requires **BOTH code changes AND base image upgrade**.

## 🔴 Vulnerability Details

- **Package**: Celery 5.3.0 (VULNERABLE)
- **Fixed Version**: Celery 5.6.0+
- **Requirements**:
  1. ⚠️ **Python 3.9+** (Celery 5.6 dropped Python 3.8)
  2. ⚠️ **Code changes** (Breaking API changes)

## 📋 The Problem

- **Base Image**: `python:3.8-slim`
- **Package**: `celery==5.3.0` (VULNERABLE)
- **Code**: Uses old Celery 5.3.x API

## ❌ Why Partial Fixes Don't Work

### Attempt 1: Update only requirements.txt
```txt
celery==5.6.0  # FAILS!
```
**Error:** `Package 'celery' requires Python >=3.9`

### Attempt 2: Update base image only
```dockerfile
FROM python:3.9-slim
```
**Result:** Runtime errors due to breaking API changes!

## ✅ Complete Fix Required

### 1. Update Dockerfile
```dockerfile
FROM python:3.8-slim  →  FROM python:3.9-slim
```

### 2. Update requirements.txt
```txt
celery==5.3.0  →  celery==5.6.0
```

### 3. Update Code

**Old (5.3.x):**
```python
@celery_app.task
def add_numbers(x, y):
    return x + y
```

**New (5.6+):**
```python
@shared_task(bind=True)
def add_numbers(self, x, y):
    return x + y
```

## 🔧 Files

- `Dockerfile` - Python 3.8 + Celery 5.3.0 (VULNERABLE)
- `app.py` - Old Celery API (VULNERABLE)
- `app_fixed.py` - New Celery API (reference)
- `requirements.txt` - celery==5.3.0

## 🎯 Key Takeaway

**You MUST do ALL THREE:**
1. Base image upgrade
2. Package upgrade  
3. Code refactoring

**Cannot fix without all three steps!**

