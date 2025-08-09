"""
Configuration settings for Rajalakshmi Vector Service
"""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # OpenAI Configuration (can be LM Studio or OpenAI)
    openai_api_key: str = "not_required_for_lm_studio"
    openai_base_url: str = "http://localhost:1234/v1"  # LM Studio default
    openai_model: str = "embedding"
    openai_embedding_dimension: int = 768  # Default for many embedding models
    
    # Qdrant Configuration
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: Optional[str] = None
    qdrant_collection_name: str = "rajalakshmi_content"
    qdrant_timeout: int = 60
    
    # Payload CMS Configuration
    payload_api_url: str = "http://localhost:3001/api"
    payload_api_secret: str = ""
    
    # Database Configuration
    database_url: Optional[str] = None
    
    # Processing Configuration
    chunk_size: int = 800
    chunk_overlap: int = 100
    max_tokens_per_chunk: int = 1000
    batch_size: int = 50
    max_retries: int = 3
    
    # Webhook Configuration
    webhook_secret: Optional[str] = None
    webhook_timeout: int = 30
    
    # Logging Configuration
    log_level: str = "INFO"
    log_format: str = "structured"
    
    # Cache Configuration
    redis_url: Optional[str] = None
    cache_ttl: int = 3600
    
    # Environment
    environment: str = "development"
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
        "extra": "ignore"
    }


# Global settings instance
settings = Settings()

# Content type mappings
COLLECTION_MAPPINGS = {
    "announcements": {
        "category": "administrative",
        "priority": "high",
        "audience": ["all_students", "faculty"],
        "content_fields": ["title", "content", "excerpt"]
    },
    "blog-posts": {
        "category": "academic",
        "priority": "medium",
        "audience": ["current_students", "prospective_students"],
        "content_fields": ["title", "content", "excerpt", "meta"]
    },
    "testimonials": {
        "category": "social_proof",
        "priority": "medium",
        "audience": ["prospective_students", "parents"],
        "content_fields": ["name", "testimonial", "position", "company"]
    },
    "coe": {
        "category": "academic",
        "priority": "high",
        "audience": ["current_students", "faculty"],
        "content_fields": ["title", "description", "objectives", "activities"]
    },
    "departments": {
        "category": "academic",
        "priority": "high",
        "audience": ["prospective_students", "current_students"],
        "content_fields": ["name", "description", "vision", "mission"]
    },
    "department-sections": {
        "category": "academic",
        "priority": "high",
        "audience": ["prospective_students", "current_students"],
        "content_fields": ["dynamicSections"]
    },
    "dynamic-pages": {
        "category": "general",
        "priority": "medium",
        "audience": ["all"],
        "content_fields": ["title", "content", "sections"]
    }
}

GLOBAL_MAPPINGS = {
    "about": {
        "category": "institutional",
        "priority": "high",
        "audience": ["prospective_students", "parents"],
        "content_fields": ["content", "vision", "mission", "history"]
    },
    "admissions": {
        "category": "admission",
        "priority": "high",
        "audience": ["prospective_students", "parents"],
        "content_fields": ["eligibilityCriteria", "applicationProcess", "fees"]
    },
    "research": {
        "category": "academic",
        "priority": "medium",
        "audience": ["faculty", "research_scholars"],
        "content_fields": ["researchAreas", "publications", "projects"]
    },
    "placement": {
        "category": "placement",
        "priority": "high",
        "audience": ["current_students", "alumni"],
        "content_fields": ["companies", "statistics", "process"]
    },
    "academics": {
        "category": "academic",
        "priority": "high",
        "audience": ["current_students", "prospective_students"],
        "content_fields": ["programs", "curriculum", "regulations"]
    },
    "facilities": {
        "category": "facility",
        "priority": "medium",
        "audience": ["current_students", "prospective_students"],
        "content_fields": ["infrastructure", "amenities", "services"]
    }
}

# Department mappings
DEPARTMENT_KEYWORDS = {
    "CSE": ["computer", "software", "programming", "AI", "ML", "data science", "algorithms"],
    "ECE": ["electronics", "communication", "VLSI", "embedded", "signal processing"],
    "MECH": ["mechanical", "thermal", "manufacturing", "automobile", "robotics"],
    "CIVIL": ["civil", "construction", "structural", "environmental", "transportation"],
    "EEE": ["electrical", "power", "energy", "motors", "control systems"],
    "BME": ["biomedical", "medical devices", "healthcare", "biotechnology"]
}

# Content type priorities for retrieval
CONTENT_PRIORITIES = {
    "announcements": 1.2,
    "admissions": 1.1,
    "department-sections": 1.0,
    "academics": 1.0,
    "placement": 0.9,
    "facilities": 0.8,
    "blog-posts": 0.7,
    "testimonials": 0.6
}
