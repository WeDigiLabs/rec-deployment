import os
from pydantic_settings import BaseSettings

class ChatSettings(BaseSettings):
    # LM Studio Configuration
    openai_api_key: str = "not_required_for_lm_studio"
    openai_base_url: str = "http://localhost:1234/v1"
    chat_model: str = "local-model"  # Your LM Studio model name
    
    # Vector Service Configuration
    vector_service_url: str = "http://localhost:8000"
    
    # Chat Configuration
    max_conversation_history: int = 50
    session_timeout: int = 3600  # 1 hour
    max_search_results: int = 5
    
    # Logging
    log_level: str = "INFO"
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": False
    }

settings = ChatSettings()
