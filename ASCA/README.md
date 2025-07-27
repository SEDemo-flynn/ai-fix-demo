# Vulnerable Demo Application

This folder contains a deliberately vulnerable Node.js application for security testing purposes.

## Intentional Vulnerabilities

The application contains the following intentional security vulnerabilities:

1. SQL Injection in user details retrieval
2. Reflected XSS vulnerabilities
3. Insecure direct object references
4. Hardcoded credentials
5. Insecure CORS configuration
6. Sensitive information logging
7. Missing authentication
8. Information disclosure in comments

## Files

- `server.js` - Main application file with various vulnerable endpoints
- `database-utils.js` - Utility functions with vulnerable code patterns
- `vulnerable_app.db` - SQLite database used by the application

⚠️ **WARNING**: This code is intentionally vulnerable and should never be used in production.

