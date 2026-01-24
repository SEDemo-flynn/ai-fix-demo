FROM checkmarx.jfrog.io/ast-docker/chainguard/python3.12-bash-fips:3.12.12@sha256:b7a019029cf8c1d41952fea6d6dee58ff96f25bc47683ce2647f19e34ba414ee

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

