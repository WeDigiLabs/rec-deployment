import os
from pydantic import field_validator
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
    
    @field_validator('max_conversation_history', mode='before')
    @classmethod
    def validate_max_conversation_history(cls, v):
        if v == '' or v is None:
            return 50
        return int(v) if isinstance(v, str) else v
    
    @field_validator('session_timeout', mode='before')
    @classmethod
    def validate_session_timeout(cls, v):
        if v == '' or v is None:
            return 3600
        return int(v) if isinstance(v, str) else v
    
    @field_validator('max_search_results', mode='before')
    @classmethod
    def validate_max_search_results(cls, v):
        if v == '' or v is None:
            return 5
        return int(v) if isinstance(v, str) else v
    
    # Logging
    log_level: str = "INFO"
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": False
    }

settings = ChatSettings()
