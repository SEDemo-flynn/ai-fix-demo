# Security Vulnerability Demo Repository

A comprehensive repository demonstrating Docker container security vulnerabilities and TypeScript development practices.

## 🔒 Security Demo Components

### Docker Vulnerability Scanning Demo
This repository includes a complete setup for demonstrating container image vulnerability detection across different severity levels.

#### Vulnerability Severity Examples (`Containers/docker-compose.yml`)
- **Critical Severity**: nginx:1.14.0, ubuntu:14.04, debian:bookworm-20240130, debian:trixie-slim
- **High Severity**: node:10.15.0, ubuntu:jammy-20250714
- **Medium Severity**: redis:5.0.7
- **Low Severity**: alpine:3.12
- **Secure Baseline**: nginx:alpine (for comparison)

#### Multi-Stage Vulnerable Application (`Containers/app/`)
A complete Node.js application built with intentionally vulnerable Docker images:
- **Build Stage**: alpine:3.15.8 (vulnerable Alpine)
- **Test Stage**: debian:bookworm-20231218 (vulnerable Debian)
- **Production Stage**: ubuntu:mantic-20230819 (vulnerable Ubuntu)

#### Secrets Detection Demo (`Secrets/`)
Focused collection of exposed secrets for testing secret detection and remediation:
- **JavaScript Config**: Database password, AWS access key
- **Python Environment**: Database password, JWT secret
- **Environment Variables**: Database password, Stripe key
- **Java Properties**: Database password, Stripe API key
- **Executable Script**: Live token exposure demonstration

## 🚀 Quick Start - Security Demo

### Run Vulnerability Containers
```bash
cd Containers
docker-compose up -d
```

### Build & Test Vulnerable App
```bash
cd Containers/app
docker build -t vulnerability-demo-app .
docker run -p 3000:3000 vulnerability-demo-app
```

### Access Demo Application
- Web Interface: http://localhost:3000
- Health Check: http://localhost:3000/api/health
- System Info: http://localhost:3000/api/info

### Test Secret Detection
```bash
# Scan for exposed secrets
secret-scanner ./Secrets/

# Test different file types
secret-scanner Secrets/config.js
secret-scanner Secrets/environment.py
secret-scanner Secrets/sample.env
secret-scanner Secrets/application.properties

# Run the executable token demo
cd Secrets && python3 token_service.py
```

## 📊 TypeScript + Lodash Demo

A TypeScript project demonstrating various lodash 4.17.11 functionalities.

### Features

- **Array Operations**: Chunking, shuffling, sampling, and set operations
- **Collection Processing**: Filtering, mapping, grouping, and statistical operations
- **Object Manipulation**: Picking, omitting, deep cloning, and merging
- **String Utilities**: Case transformations and text processing
- **Utility Functions**: Debouncing, throttling, and validation helpers
- **Advanced Patterns**: Method chaining and data transformation pipelines

## 📁 Project Structure

```
security-demo-repository/
├── Containers/                   # Docker Security Demo
│   ├── app/                     # Vulnerable Multi-stage Application
│   │   ├── Dockerfile           # Multi-stage build with vulnerable images
│   │   ├── package.json         # Node.js dependencies
│   │   ├── package-lock.json    # Dependency lock file
│   │   ├── server.js            # Express.js application
│   │   ├── .dockerignore        # Build optimization
│   │   ├── README.md            # App documentation
│   │   └── node_modules/        # Installed dependencies
│   └── docker-compose.yml       # Various vulnerability severity examples
├── SCA/                         # Software Composition Analysis Demo
│   ├── src/                     # TypeScript source files
│   ├── package.json             # TypeScript project dependencies
│   ├── package-lock.json        # Dependency lock file
│   └── tsconfig.json            # TypeScript configuration
├── ASCA/                        # Application Security Code Analysis
│   └── hello.js                 # Demo JavaScript file
├── Malicious/                   # Malicious package examples
│   ├── package.json             # Malicious package demo
│   └── node_modules/            # Dependencies
├── Secrets/                     # Secret Detection Demo
│   ├── config.js                # JavaScript configuration with secrets
│   ├── environment.py           # Python environment with credentials
│   ├── sample.env               # Environment variables with secrets
│   ├── application.properties   # Java Spring configuration
│   ├── token_service.py         # Executable Python script with token exposure
│   └── README.md                # Secret detection documentation
├── .gitignore                   # Git ignore rules
├── .vscode/                     # VS Code configuration
└── README.md                    # This file
```

## 🛠️ Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- npm or yarn

## 🔧 Installation & Usage

### TypeScript Development
```bash
# Install dependencies
npm install

# Development mode (with ts-node)
npm run dev

# Build and run
npm run build
npm start

# Clean build files
npm run clean
```

### Security Demo Usage
```bash
# Start all vulnerability containers
cd Containers && docker-compose up -d

# Build vulnerable demo app
cd Containers/app && docker build -t vulnerability-demo-app .

# Run vulnerability scanning on any of the images
docker scan vulnerability-demo-app  # Example with Docker scan

# Test secret detection tools
secret-scanner ./Secrets/ --format json --output secrets-report.json
```

## 🔍 Security Testing Features

### Vulnerability Severity Detection
The setup demonstrates detection of:
- **Critical**: End-of-life operating systems, severely outdated packages
- **High**: Known security vulnerabilities in application frameworks
- **Medium**: Outdated packages with moderate security risks
- **Low**: Minor version vulnerabilities and configuration issues

### Multi-Stage Build Vulnerabilities
- Demonstrates vulnerabilities across different build stages
- Shows how security issues can be introduced at various points
- Provides realistic scenarios for security scanner testing

### Secret Detection Capabilities
The setup demonstrates detection of:
- **Critical Secrets**: AWS keys, database passwords, private keys
- **High Sensitivity**: JWT secrets, OAuth credentials, API keys
- **Medium Risk**: Internal service credentials, development tokens
- **Low Risk**: Debug settings, non-production configurations

⚠️ **Warning**: This repository contains intentionally vulnerable Docker images and exposed secrets for educational and testing purposes only. Use in isolated environments.

## 📚 Lodash Features Demonstrated

### Array Operations
- `_.chunk()` - Split arrays into chunks
- `_.shuffle()` - Randomize array order
- `_.sampleSize()` - Get random samples
- `_.difference()` - Find array differences

### Collection Operations
- `_.filter()` - Filter collections
- `_.map()` - Transform collections
- `_.groupBy()` - Group by property
- `_.meanBy()` - Calculate averages
- `_.sortBy()` - Sort collections

### Object Operations
- `_.pick()` - Select properties
- `_.omit()` - Exclude properties
- `_.cloneDeep()` - Deep clone objects
- `_.mergeWith()` - Advanced merging

### String Operations
- `_.camelCase()` - Convert to camelCase
- `_.kebabCase()` - Convert to kebab-case
- `_.startCase()` - Convert to Title Case
- `_.capitalize()` - Capitalize strings

### Utility Functions
- `_.debounce()` - Debounce function calls
- `_.throttle()` - Throttle function calls
- `_.isEmpty()` - Check if empty
- `_.isEqual()` - Deep equality check
- `_.get()` - Safe property access
- `_.chain()` - Method chaining

## 📦 Dependencies

### Security Demo
- **Docker**: Container runtime for vulnerability demos
- **Docker Compose**: Multi-container orchestration
- **Express.js**: Web framework for demo application
- **Node.js**: Runtime for demo application

### TypeScript Demo
- **lodash**: 4.17.11 - The main utility library
- **typescript**: ^5.0.0 - TypeScript compiler
- **@types/lodash**: ^4.14.191 - TypeScript definitions for lodash
- **@types/node**: ^18.15.0 - Node.js TypeScript definitions
- **ts-node**: ^10.9.0 - TypeScript execution environment

## 🎯 Use Cases

- **Security Training**: Demonstrate vulnerability and secret detection capabilities
- **Tool Testing**: Validate security scanning tools and secret detection policies
- **Educational**: Learn about container security and secret management best practices
- **Development**: TypeScript and lodash utility examples
- **Remediation Testing**: Practice secret remediation and vulnerability patching

## 📄 License

MIT