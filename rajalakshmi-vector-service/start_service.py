#!/usr/bin/env python3
"""
Startup script for Rajalakshmi Vector Service
"""

import os
import sys
import asyncio
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

try:
    import uvicorn
    from webhook_listener import app
    from config import settings
except ImportError as e:
    print(f"Error importing required modules: {e}")
    print("Please install required dependencies: pip install -r requirements.txt")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def check_environment():
    """Check if all required environment variables are set"""
    # Debug: Print what we're loading
    logger.info(f"OPENAI_BASE_URL: {os.getenv('OPENAI_BASE_URL', 'NOT SET')}")
    logger.info(f"PAYLOAD_API_SECRET: {os.getenv('PAYLOAD_API_SECRET', 'NOT SET')}")
    logger.info(f"OPENAI_API_KEY: {os.getenv('OPENAI_API_KEY', 'NOT SET')}")
    
    # For LM Studio, OPENAI_API_KEY is not actually required
    required_vars = []
    missing_vars = []
    
    # Check if using LM Studio or OpenAI
    openai_base_url = os.getenv('OPENAI_BASE_URL', '')
    skip_key = os.getenv('SKIP_OPENAI_API_KEY_CHECK') == '1'
    local_indicators = ['localhost', '127.0.0.1', 'host.docker.internal']
    # Allow treating certain Tailscale / LAN hostnames as local if flag set
    probably_local = any(ind in openai_base_url for ind in local_indicators)

    if probably_local or skip_key:
        logger.info(
            "Detected local embedding configuration%s" % (
                " (override via SKIP_OPENAI_API_KEY_CHECK)" if skip_key and not probably_local else ""
            )
        )
        if os.getenv('PAYLOAD_API_SECRET') == 'your_payload_secret_here':
            logger.warning("PAYLOAD_API_SECRET is set to default value. Update for production.")
    else:
        # Treat as remote / cloud -> require API key
        if not os.getenv('OPENAI_API_KEY') or os.getenv('OPENAI_API_KEY') == 'not_required_for_lm_studio':
            missing_vars.append('OPENAI_API_KEY')
        logger.info("Detected OpenAI cloud API configuration (key required)")
    
    if missing_vars:
        logger.error(f"Missing required environment variables: {missing_vars}")
        logger.error("Please set these variables in your .env file or environment")
        return False
    
    logger.info("Environment check passed!")
    return True

def main():
    """Main startup function"""
    logger.info("Starting Rajalakshmi Vector Service...")
    
    # Check environment
    if not check_environment():
        sys.exit(1)
    
    # Log configuration
    logger.info(f"Qdrant URL: {settings.qdrant_url}")
    logger.info(f"Payload API URL: {settings.payload_api_url}")
    logger.info(f"Collection Name: {settings.qdrant_collection_name}")
    logger.info(f"Environment: {settings.environment}")
    
    # Start the server
    try:
        if settings.environment == "development":
            # Use import string for reload functionality
            uvicorn.run(
                "webhook_listener:app",
                host="0.0.0.0",
                port=8000,
                log_level=settings.log_level.lower(),
                reload=True
            )
        else:
            # Use app object for production
            uvicorn.run(
                app,
                host="0.0.0.0",
                port=8000,
                log_level=settings.log_level.lower(),
                reload=False
            )
    except KeyboardInterrupt:
        logger.info("Service stopped by user")
    except Exception as e:
        logger.error(f"Error starting service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
