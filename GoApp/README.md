# Go Application with stdlib v1.24.5

A simple Go web application demonstrating the use of Go stdlib version 1.24.5.

## Features

- Simple HTTP server
- Health check endpoint
- Containerized with Docker multi-stage build

## Prerequisites

- Go 1.24.5 or later
- Docker (for containerization)

## Running Locally

```bash
go run main.go
```

The server will start on port 8080 (or the port specified in the `PORT` environment variable).

## Endpoints

- `GET /` - Returns a welcome message
- `GET /health` - Health check endpoint

## Building with Docker

```bash
docker build -t goapp:latest .
```

## Running with Docker

```bash
docker run -p 8080:8080 goapp:latest
```

## Testing

```bash
curl http://localhost:8080/
curl http://localhost:8080/health
```

