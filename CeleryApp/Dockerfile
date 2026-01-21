# VULNERABLE VERSION
# Uses Python 3.8 with Celery 5.3.0
# Celery 5.6+ (fixed) requires Python 3.9+ AND has breaking API changes
FROM python:3.8-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app.py .

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]

