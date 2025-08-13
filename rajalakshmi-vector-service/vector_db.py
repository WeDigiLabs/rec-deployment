"""
Qdrant Vector Database Handler for Rajalakshmi Engineering College
Handles vector storage, retrieval, and management
"""

import logging
import asyncio
from typing import List, Dict, Any, Optional, Tuple
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import (
    VectorParams, Distance, CollectionStatus, PointStruct, Filter, FieldCondition, 
    MatchValue, UpdateResult, ScoredPoint
)
import openai
from openai import OpenAI
import numpy as np
from tenacity import retry, stop_after_attempt, wait_exponential

from config import settings
from content_processor import ContentChunk

logger = logging.getLogger(__name__)


class EmbeddingGenerator:
    """Handles embedding generation using OpenAI API (compatible with LM Studio)"""
    
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.openai_api_key,
            base_url=settings.openai_base_url
        )
        self.model = settings.openai_model
        self.dimension = settings.openai_embedding_dimension
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text"""
        try:
            response = self.client.embeddings.create(
                model=self.model,
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            raise
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts in batch"""
        try:
            # Split into smaller batches if needed (API has limits)
            batch_size = 100
            all_embeddings = []
            
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                response = self.client.embeddings.create(
                    model=self.model,
                    input=batch
                )
                batch_embeddings = [item.embedding for item in response.data]
                all_embeddings.extend(batch_embeddings)
            
            return all_embeddings
        except Exception as e:
            logger.error(f"Error generating batch embeddings: {str(e)}")
            raise


class QdrantVectorStore:
    """Qdrant vector database operations"""
    
    def __init__(self):
        self.client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key,
            timeout=settings.qdrant_timeout
        )
        self.collection_name = settings.qdrant_collection_name
        self.embedding_generator = EmbeddingGenerator()
        # Try to ensure collection, but don't fail hard if Qdrant not up yet
        try:
            self._ensure_collection_exists()
        except Exception as e:
            logger.warning(
                "Qdrant not reachable on startup (will retry on first DB operation): %s", str(e)
            )

    def _retry_ensure_collection(self):
        """Retry ensuring collection exists when first operation is executed."""
        try:
            self._ensure_collection_exists()
        except Exception as e:
            raise RuntimeError(
                f"Qdrant still not reachable at {settings.qdrant_url}. Start Qdrant and retry. Error: {e}"
            )
    
    def _ensure_collection_exists(self):
        """Ensure the collection exists, create if not"""
        try:
            collections = self.client.get_collections().collections
            collection_names = [col.name for col in collections]
            
            if self.collection_name not in collection_names:
                logger.info(f"Creating collection: {self.collection_name}")
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=settings.openai_embedding_dimension,
                        distance=Distance.COSINE
                    )
                )
                logger.info(f"Collection {self.collection_name} created successfully")
            else:
                logger.info(f"Collection {self.collection_name} already exists")
                
        except Exception as e:
            logger.error(f"Error ensuring collection exists: {str(e)}")
            raise
    
    async def upsert_chunks(self, chunks: List[ContentChunk]) -> bool:
        """Insert or update content chunks in the vector database"""
        try:
            if not chunks:
                logger.warning("No chunks to upsert")
                return True
            # Ensure collection available (lazy retry)
            self._retry_ensure_collection()
            
            # Generate embeddings for all chunks
            texts = [chunk.content for chunk in chunks]
            embeddings = await self.embedding_generator.generate_embeddings_batch(texts)
            
            # Prepare points for Qdrant
            points = []
            for chunk, embedding in zip(chunks, embeddings):
                point = PointStruct(
                    id=chunk.chunk_id,
                    vector=embedding,
                    payload={
                        "content": chunk.content,
                        "metadata": chunk.metadata,
                        "source_id": chunk.source_id,
                        "source_type": chunk.source_type,
                        "content_type": chunk.content_type,
                        "chunk_index": chunk.chunk_index,
                        "total_chunks": chunk.total_chunks
                    }
                )
                points.append(point)
            
            # Batch upsert
            batch_size = settings.batch_size
            for i in range(0, len(points), batch_size):
                batch = points[i:i + batch_size]
                result = self.client.upsert(
                    collection_name=self.collection_name,
                    points=batch
                )
                logger.info(f"Upserted batch {i//batch_size + 1}: {len(batch)} points")
            
            logger.info(f"Successfully upserted {len(chunks)} chunks")
            return True
            
        except Exception as e:
            logger.error(f"Error upserting chunks: {str(e)}")
            return False
    
    async def search_similar(self, query: str, filters: Optional[Dict[str, Any]] = None, 
                           limit: int = 10, score_threshold: float = 0.5) -> List[Dict[str, Any]]:
        """Search for similar content"""
        try:
            self._retry_ensure_collection()
            # Generate query embedding
            query_embedding = await self.embedding_generator.generate_embedding(query)
            
            # Build filter conditions
            filter_conditions = None
            if filters:
                conditions = []
                for key, value in filters.items():
                    # Determine the correct field path
                    # Some fields are in metadata, others are top-level
                    if key in ['source_type', 'source_id', 'content_type']:
                        field_path = key
                    else:
                        field_path = f"metadata.{key}"
                    
                    if isinstance(value, list):
                        # Handle list values with OR condition
                        or_conditions = []
                        for v in value:
                            or_conditions.append(
                                FieldCondition(key=field_path, match=MatchValue(value=v))
                            )
                        if len(or_conditions) == 1:
                            conditions.append(or_conditions[0])
                        else:
                            conditions.append(models.Filter(should=or_conditions))
                    else:
                        # Handle single values
                        conditions.append(
                            FieldCondition(key=field_path, match=MatchValue(value=value))
                        )
                
                if conditions:
                    filter_conditions = Filter(must=conditions)
            
            # Search with lower score threshold to get more results
            search_result = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                query_filter=filter_conditions,
                limit=limit,
                score_threshold=score_threshold,
                with_payload=True,
                with_vectors=False
            )
            
            # Format results
            results = []
            for point in search_result:
                result = {
                    "id": point.id,
                    "score": float(point.score),
                    "content": point.payload.get("content", ""),
                    "metadata": point.payload.get("metadata", {}),
                    "source_id": point.payload.get("source_id", ""),
                    "source_type": point.payload.get("source_type", ""),
                    "content_type": point.payload.get("content_type", "")
                }
                results.append(result)
            
            logger.info(f"Found {len(results)} similar chunks for query: '{query}'")
            return results
            
        except Exception as e:
            logger.error(f"Error searching similar content: {str(e)}")
            return []
    
    async def get_chunks_by_source(self, source_id: str, source_type: str) -> List[Dict[str, Any]]:
        """Get all chunks for a specific source document"""
        try:
            self._retry_ensure_collection()
            filter_conditions = Filter(
                must=[
                    FieldCondition(key="source_id", match=MatchValue(value=source_id)),
                    FieldCondition(key="source_type", match=MatchValue(value=source_type))
                ]
            )
            
            # Scroll through all points matching the filter
            points, _ = self.client.scroll(
                collection_name=self.collection_name,
                scroll_filter=filter_conditions,
                limit=1000  # Adjust based on expected chunk count
            )
            
            results = []
            for point in points:
                result = {
                    "id": point.id,
                    "content": point.payload.get("content", ""),
                    "metadata": point.payload.get("metadata", {}),
                    "chunk_index": point.payload.get("chunk_index", 0),
                    "total_chunks": point.payload.get("total_chunks", 1)
                }
                results.append(result)
            
            # Sort by chunk index
            results.sort(key=lambda x: x["chunk_index"])
            
            logger.info(f"Retrieved {len(results)} chunks for source {source_id}")
            return results
            
        except Exception as e:
            logger.error(f"Error retrieving chunks by source: {str(e)}")
            return []
    
    async def delete_chunks_by_source(self, source_id: str, source_type: str) -> bool:
        """Delete all chunks for a specific source document"""
        try:
            self._retry_ensure_collection()
            filter_conditions = Filter(
                must=[
                    FieldCondition(key="source_id", match=MatchValue(value=source_id)),
                    FieldCondition(key="source_type", match=MatchValue(value=source_type))
                ]
            )
            
            result = self.client.delete(
                collection_name=self.collection_name,
                points_selector=models.FilterSelector(filter=filter_conditions)
            )
            
            logger.info(f"Deleted chunks for source {source_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting chunks by source: {str(e)}")
            return False
    
    async def update_chunk(self, chunk_id: str, chunk: ContentChunk) -> bool:
        """Update a specific chunk"""
        try:
            self._retry_ensure_collection()
            # Generate embedding
            embedding = await self.embedding_generator.generate_embedding(chunk.content)
            
            # Create point
            point = PointStruct(
                id=chunk_id,
                vector=embedding,
                payload={
                    "content": chunk.content,
                    "metadata": chunk.metadata,
                    "source_id": chunk.source_id,
                    "source_type": chunk.source_type,
                    "content_type": chunk.content_type,
                    "chunk_index": chunk.chunk_index,
                    "total_chunks": chunk.total_chunks
                }
            )
            
            # Upsert single point
            result = self.client.upsert(
                collection_name=self.collection_name,
                points=[point]
            )
            
            logger.info(f"Updated chunk {chunk_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating chunk {chunk_id}: {str(e)}")
            return False
    
    def get_collection_info(self) -> Dict[str, Any]:
        """Get collection information and statistics"""
        try:
            # Use a simpler approach to avoid pydantic validation issues
            collections = self.client.get_collections().collections
            collection_exists = any(col.name == self.collection_name for col in collections)
            
            if collection_exists:
                # Get point count using scroll
                try:
                    points, _ = self.client.scroll(
                        collection_name=self.collection_name,
                        limit=1,
                        with_payload=False,
                        with_vectors=False
                    )
                    # Get actual count by scrolling through all
                    all_points, _ = self.client.scroll(
                        collection_name=self.collection_name,
                        limit=10000,  # Large number to get all points
                        with_payload=False,
                        with_vectors=False
                    )
                    points_count = len(all_points)
                except Exception:
                    points_count = 0
                
                return {
                    "name": self.collection_name,
                    "status": "active",
                    "points_count": points_count
                }
            else:
                return {"name": self.collection_name, "status": "not_found", "points_count": 0}
                
        except Exception as e:
            logger.error(f"Error getting collection info: {str(e)}")
            return {"name": self.collection_name, "status": "error", "points_count": 0}
    
    async def search_with_filters(self, query: str, department: Optional[str] = None,
                                category: Optional[str] = None, content_type: Optional[str] = None,
                                limit: int = 10) -> List[Dict[str, Any]]:
        """Search with common filter combinations"""
        filters = {}
        
        if department:
            filters["department"] = department
        if category:
            filters["category"] = category
        if content_type:
            filters["content_type"] = content_type
        
        return await self.search_similar(query, filters, limit)
    
    async def get_recent_content(self, hours: int = 24, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recently updated content"""
        try:
            # Get all content and filter by date in Python since Qdrant date filtering is complex
            points, _ = self.client.scroll(
                collection_name=self.collection_name,
                limit=limit,
                with_payload=True,
                with_vectors=False
            )
            
            results = []
            from datetime import datetime, timedelta
            cutoff_time = datetime.now() - timedelta(hours=hours)
            
            for point in points:
                try:
                    last_updated_str = point.payload.get("metadata", {}).get("last_updated", "")
                    if last_updated_str:
                        # Parse the ISO datetime string
                        last_updated = datetime.fromisoformat(last_updated_str.replace('Z', '+00:00'))
                        if last_updated.replace(tzinfo=None) >= cutoff_time:
                            result = {
                                "id": point.id,
                                "content": point.payload.get("content", "")[:200] + "...",
                                "metadata": point.payload.get("metadata", {}),
                                "source_type": point.payload.get("source_type", ""),
                                "content_type": point.payload.get("content_type", "")
                            }
                            results.append(result)
                except Exception as date_error:
                    # If date parsing fails, include the item anyway
                    result = {
                        "id": point.id,
                        "content": point.payload.get("content", "")[:200] + "...",
                        "metadata": point.payload.get("metadata", {}),
                        "source_type": point.payload.get("source_type", ""),
                        "content_type": point.payload.get("content_type", "")
                    }
                    results.append(result)
            
            logger.info(f"Retrieved {len(results)} recent content chunks")
            return results
            
        except Exception as e:
            logger.error(f"Error retrieving recent content: {str(e)}")
            return []


class VectorDatabaseManager:
    """Main manager for vector database operations"""
    
    def __init__(self):
        self.vector_store = QdrantVectorStore()
    
    async def process_and_store_chunks(self, chunks: List[ContentChunk]) -> bool:
        """Process content chunks and store in vector database"""
        try:
            if not chunks:
                logger.warning("No chunks to process")
                return True
            
            logger.info(f"Processing {len(chunks)} chunks for storage")
            
            # Group chunks by source for potential deletion of old content
            source_groups = {}
            for chunk in chunks:
                key = f"{chunk.source_type}:{chunk.source_id}"
                if key not in source_groups:
                    source_groups[key] = []
                source_groups[key].append(chunk)
            
            # Process each source group
            for source_key, source_chunks in source_groups.items():
                source_type, source_id = source_key.split(":", 1)
                
                # Delete existing chunks for this source (for updates)
                await self.vector_store.delete_chunks_by_source(source_id, source_type)
                
                # Insert new chunks
                success = await self.vector_store.upsert_chunks(source_chunks)
                if not success:
                    logger.error(f"Failed to store chunks for source {source_id}")
                    return False
            
            logger.info("Successfully processed and stored all chunks")
            return True
            
        except Exception as e:
            logger.error(f"Error processing and storing chunks: {str(e)}")
            return False
    
    async def search_content(self, query: str, filters: Optional[Dict[str, Any]] = None,
                           limit: int = 10) -> List[Dict[str, Any]]:
        """Search for content with optional filters"""
        return await self.vector_store.search_similar(query, filters, limit)
    
    async def search_similar(self, query: str, filters: Optional[Dict[str, Any]] = None,
                           limit: int = 10) -> List[Dict[str, Any]]:
        """Alias for search_content - search for similar content"""
        return await self.search_content(query, filters, limit)
    
    async def get_content_by_source(self, source_id: str, source_type: str) -> List[Dict[str, Any]]:
        """Get all content for a specific source"""
        return await self.vector_store.get_chunks_by_source(source_id, source_type)
    
    async def delete_content_by_source(self, source_id: str, source_type: str) -> bool:
        """Delete all content for a specific source"""
        return await self.vector_store.delete_chunks_by_source(source_id, source_type)
    
    def get_database_stats(self) -> Dict[str, Any]:
        """Get database statistics"""
        return self.vector_store.get_collection_info()
