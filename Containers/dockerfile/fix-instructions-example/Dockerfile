FROM python:3.7-slim-buster

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Install packages (Debian Buster compatible)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the Python application
COPY app.py .

# Sample default command - run the hello world app
CMD ["python3", "app.py"]