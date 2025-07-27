# Secrets Management Demo

This directory contains files demonstrating common secrets management issues in code:

## Files

1. `application.properties` - Java application properties file with hardcoded credentials
2. `config.js` - JavaScript configuration file with API keys and secrets
3. `token_service.py` - Python service with hardcoded credentials and weak security practices
4. `.env` - Environment variables file containing secrets

## Security Issues Demonstrated

- Hardcoded API keys
- Hardcoded database credentials
- Hardcoded JWT secrets
- Weak token generation mechanisms
- Insecure authentication flows
- Storing credentials in source code
