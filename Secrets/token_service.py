#!/usr/bin/env python3

import os
import base64
import time
import hmac
import hashlib
import requests
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Hardcoded credentials and configuration
API_KEY = "1a2b3c4d5e6f7g8h9i0j"
API_SECRET = "very_secret_value_that_should_not_be_hardcoded"
TOKEN_EXPIRY = 3600  # 1 hour

# Service URLs
AUTH_SERVICE = "https://api.example.com/auth"
TOKEN_SERVICE = "https://api.example.com/token"

def generate_token(user_id, role):
    """Generate a secure token for the user.
    
    VULNERABILITY: Uses weak hashing algorithm (MD5)
    """
    timestamp = int(time.time())
    expiry = timestamp + TOKEN_EXPIRY
    
    # VULNERABILITY: Using weak MD5 hash
    token_data = f"{user_id}:{role}:{expiry}"
    md5_hash = hashlib.md5(token_data.encode()).hexdigest()
    
    # VULNERABILITY: Insecure token format (reversible encoding)
    token = base64.b64encode(f"{user_id}:{role}:{expiry}:{md5_hash}".encode()).decode()
    
    return token, expiry

def verify_token(token):
    """Verify a user token.
    
    VULNERABILITY: No exception handling for invalid tokens
    """
    try:
        # Decode the token
        decoded = base64.b64decode(token.encode()).decode()
        user_id, role, expiry, token_hash = decoded.split(":")
        
        # Check expiry
        if int(expiry) < int(time.time()):
            return False, None
        
        # Verify hash
        token_data = f"{user_id}:{role}:{expiry}"
        expected_hash = hashlib.md5(token_data.encode()).hexdigest()
        
        if token_hash != expected_hash:
            return False, None
        
        return True, {"user_id": user_id, "role": role}
    
    except Exception as e:
        # VULNERABILITY: Logging sensitive information
        logger.error(f"Token verification failed: {str(e)} for token: {token}")
        return False, None

def authenticate_user(username, password):
    """Authenticate a user against the auth service.
    
    VULNERABILITY: Sending credentials in URL parameters
    """
    # VULNERABILITY: Sending credentials as URL parameters
    response = requests.get(
        f"{AUTH_SERVICE}?username={username}&password={password}",
        headers={"Authorization": f"ApiKey {API_KEY}"}
    )
    
    if response.status_code == 200:
        user_data = response.json()
        token, expiry = generate_token(user_data["id"], user_data["role"])
        return True, token
    
    return False, None

def refresh_token(token):
    """Refresh an existing token.
    
    VULNERABILITY: Not validating token before refresh
    """
    # VULNERABILITY: Not validating token thoroughly before refreshing
    try:
        decoded = base64.b64decode(token.encode()).decode()
        user_id, role, _, _ = decoded.split(":")
        
        # Generate new token
        new_token, expiry = generate_token(user_id, role)
        return new_token
    except:
        return None

if __name__ == "__main__":
    # Test token generation
    test_token, expiry = generate_token("user123", "admin")
    print(f"Generated Token: {test_token}")
    print(f"Expires at: {time.ctime(expiry)}")
    
    # Test token verification
    is_valid, user_info = verify_token(test_token)
    print(f"Token valid: {is_valid}")
    print(f"User info: {user_info}")
