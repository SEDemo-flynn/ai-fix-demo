# VULNERABLE VERSION - Uses Python 3.7 with vulnerable Pillow
# Pillow 9.5.0 has vulnerabilities, but fixed version 10.0+ requires Python 3.8+
FROM python:3.7-slim

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

