import httpx
import logging
from typing import List, Dict, Any, Optional
from config import settings

logger = logging.getLogger(__name__)

class RAGService:
    """Service for Retrieval-Augmented Generation"""
    
    def __init__(self, vector_service_url: str = "http://localhost:8000"):
        self.vector_service_url = vector_service_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def search_relevant_content(
        self, 
        query: str, 
        filters: Optional[Dict[str, str]] = None,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Search for relevant content using the vector service"""
        try:
            params = {
                "query": query,
                "limit": limit
            }
            
            # Add filters if provided
            if filters:
                if filters.get("department"):
                    params["department"] = filters["department"]
                if filters.get("category"):
                    params["category"] = filters["category"]
                if filters.get("content_type"):
                    params["content_type"] = filters["content_type"]
            
            response = await self.client.get(
                f"{self.vector_service_url}/search",
                params=params
            )
            response.raise_for_status()
            
            data = response.json()
            return data.get("results", [])
            
        except Exception as e:
            logger.error(f"Error searching content: {str(e)}")
            return []
    
    async def build_context_from_search(
        self, 
        search_results: List[Dict[str, Any]]
    ) -> str:
        """Build context string from search results"""
        if not search_results:
            return "No relevant information found."
        
        context_parts = []
        for i, result in enumerate(search_results, 1):
            content = result.get("content", "")
            metadata = result.get("metadata", {})
            
            # Format the context entry
            source_info = []
            if metadata.get("document_title"):
                source_info.append(f"Title: {metadata['document_title']}")
            if metadata.get("department"):
                source_info.append(f"Department: {metadata['department']}")
            if metadata.get("category"):
                source_info.append(f"Category: {metadata['category']}")
            
            source_str = " | ".join(source_info) if source_info else "Source"
            
            context_parts.append(f"[{i}] {source_str}\n{content}\n")
        
        return "\n".join(context_parts)
    
    def extract_sources_info(
        self, 
        search_results: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Extract source information for response metadata"""
        sources = []
        for result in search_results:
            metadata = result.get("metadata", {})
            source = {
                "title": metadata.get("document_title", "Unknown"),
                "type": metadata.get("content_type", "content"),
                "department": metadata.get("department"),
                "category": metadata.get("category"),
                "score": result.get("score", 0.0),
                "chunk_id": result.get("chunk_id")
            }
            sources.append(source)
        return sources
