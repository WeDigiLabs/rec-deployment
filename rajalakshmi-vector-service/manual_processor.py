"""
Manual Database Fetch and Processing for Existing Payload CMS Data
Handles bulk processing of existing content from Payload CMS
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
import httpx
from datetime import datetime
import json

from config import settings, COLLECTION_MAPPINGS, GLOBAL_MAPPINGS
from content_processor import ContentProcessor
from vector_db import VectorDatabaseManager

logger = logging.getLogger(__name__)


class PayloadCMSClient:
    """Client for fetching data from Payload CMS API"""
    
    def __init__(self):
        self.base_url = settings.payload_api_url
        self.api_secret = settings.payload_api_secret
        self.timeout = httpx.Timeout(30.0)
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for API requests"""
        headers = {
            "Content-Type": "application/json"
        }
        
        # Only add authorization if we have an API secret
        if self.api_secret and self.api_secret.strip():
            headers["Authorization"] = f"JWT {self.api_secret}"
        
        return headers
    
    async def fetch_collection_data(self, collection_name: str, limit: int = 100, 
                                  page: int = 1) -> Dict[str, Any]:
        """Fetch data from a specific collection"""
        try:
            url = f"{self.base_url}/{collection_name}"
            params = {
                "limit": limit,
                "page": page,
                "depth": 2  # Include related data
            }
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    url,
                    params=params,
                    headers=self._get_headers()
                )
                response.raise_for_status()
                return response.json()
                
        except Exception as e:
            logger.error(f"Error fetching collection {collection_name}: {str(e)}")
            return {}
    
    async def fetch_global_data(self, global_name: str) -> Dict[str, Any]:
        """Fetch data from a specific global"""
        try:
            url = f"{self.base_url}/globals/{global_name}"
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    url,
                    headers=self._get_headers()
                )
                response.raise_for_status()
                return response.json()
                
        except Exception as e:
            logger.error(f"Error fetching global {global_name}: {str(e)}")
            return {}
    
    async def fetch_all_collection_data(self, collection_name: str) -> List[Dict[str, Any]]:
        """Fetch all data from a collection with pagination"""
        all_docs = []
        page = 1
        limit = 100
        
        while True:
            try:
                data = await self.fetch_collection_data(collection_name, limit, page)
                docs = data.get('docs', [])
                
                if not docs:
                    break
                
                all_docs.extend(docs)
                
                # Check if there are more pages
                total_pages = data.get('totalPages', 1)
                if page >= total_pages:
                    break
                
                page += 1
                logger.info(f"Fetched page {page-1} for {collection_name}: {len(docs)} items")
                
            except Exception as e:
                logger.error(f"Error fetching page {page} for {collection_name}: {str(e)}")
                break
        
        logger.info(f"Total fetched for {collection_name}: {len(all_docs)} items")
        return all_docs


class ManualContentProcessor:
    """Handles manual processing of existing CMS content"""
    
    def __init__(self):
        self.cms_client = PayloadCMSClient()
        self.content_processor = ContentProcessor()
        self.vector_manager = VectorDatabaseManager()
    
    async def process_all_collections(self, collections: Optional[List[str]] = None) -> Dict[str, Any]:
        """Process all collections or specified collections"""
        
        if collections is None:
            collections = list(COLLECTION_MAPPINGS.keys())
        
        results = {
            "processed_collections": [],
            "failed_collections": [],
            "total_chunks": 0,
            "processing_time": None,
            "errors": []
        }
        
        start_time = datetime.now()
        
        for collection_name in collections:
            try:
                logger.info(f"Processing collection: {collection_name}")
                
                # Fetch all data for the collection
                docs = await self.cms_client.fetch_all_collection_data(collection_name)
                
                if not docs:
                    logger.warning(f"No documents found for collection: {collection_name}")
                    continue
                
                # Process documents in batches
                total_chunks = 0
                batch_size = 10  # Process 10 documents at a time
                
                for i in range(0, len(docs), batch_size):
                    batch = docs[i:i + batch_size]
                    batch_chunks = await self._process_document_batch(collection_name, batch, "collection")
                    total_chunks += len(batch_chunks)
                    
                    # Store in vector database
                    if batch_chunks:
                        success = await self.vector_manager.process_and_store_chunks(batch_chunks)
                        if not success:
                            logger.error(f"Failed to store chunks for batch in {collection_name}")
                
                results["processed_collections"].append({
                    "name": collection_name,
                    "documents": len(docs),
                    "chunks": total_chunks
                })
                results["total_chunks"] += total_chunks
                
                logger.info(f"Completed processing {collection_name}: {len(docs)} docs, {total_chunks} chunks")
                
            except Exception as e:
                error_msg = f"Error processing collection {collection_name}: {str(e)}"
                logger.error(error_msg)
                results["failed_collections"].append(collection_name)
                results["errors"].append(error_msg)
        
        end_time = datetime.now()
        results["processing_time"] = str(end_time - start_time)
        
        return results
    
    async def process_all_globals(self, globals_list: Optional[List[str]] = None) -> Dict[str, Any]:
        """Process all globals or specified globals"""
        
        if globals_list is None:
            globals_list = list(GLOBAL_MAPPINGS.keys())
        
        results = {
            "processed_globals": [],
            "failed_globals": [],
            "total_chunks": 0,
            "processing_time": None,
            "errors": []
        }
        
        start_time = datetime.now()
        
        for global_name in globals_list:
            try:
                logger.info(f"Processing global: {global_name}")
                
                # Fetch global data
                data = await self.cms_client.fetch_global_data(global_name)
                
                if not data:
                    logger.warning(f"No data found for global: {global_name}")
                    continue
                
                # Process the global data
                chunks = await self._process_single_document(global_name, data, "global")
                
                # Store in vector database
                if chunks:
                    success = await self.vector_manager.process_and_store_chunks(chunks)
                    if not success:
                        logger.error(f"Failed to store chunks for global {global_name}")
                
                results["processed_globals"].append({
                    "name": global_name,
                    "chunks": len(chunks)
                })
                results["total_chunks"] += len(chunks)
                
                logger.info(f"Completed processing {global_name}: {len(chunks)} chunks")
                
            except Exception as e:
                error_msg = f"Error processing global {global_name}: {str(e)}"
                logger.error(error_msg)
                results["failed_globals"].append(global_name)
                results["errors"].append(error_msg)
        
        end_time = datetime.now()
        results["processing_time"] = str(end_time - start_time)
        
        return results
    
    async def _process_document_batch(self, content_type: str, documents: List[Dict[str, Any]], 
                                    source_type: str) -> List:
        """Process a batch of documents"""
        all_chunks = []
        
        for doc in documents:
            try:
                chunks = await self._process_single_document(content_type, doc, source_type)
                all_chunks.extend(chunks)
            except Exception as e:
                logger.error(f"Error processing document {doc.get('id', 'unknown')}: {str(e)}")
        
        return all_chunks
    
    async def _process_single_document(self, content_type: str, data: Dict[str, Any], 
                                     source_type: str):
        """Process a single document"""
        
        # Create a webhook-like payload for processing
        payload = {
            source_type: content_type,
            "operation": "create",  # Treat as create for initial processing
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
        
        # Use the content processor
        chunks = self.content_processor.process_webhook_payload(payload)
        return chunks
    
    async def reprocess_collection(self, collection_name: str) -> Dict[str, Any]:
        """Reprocess a specific collection (useful for updates)"""
        logger.info(f"Reprocessing collection: {collection_name}")
        
        # First, delete existing data for this collection
        await self._delete_collection_data(collection_name)
        
        # Then process fresh data
        return await self.process_all_collections([collection_name])
    
    async def reprocess_global(self, global_name: str) -> Dict[str, Any]:
        """Reprocess a specific global (useful for updates)"""
        logger.info(f"Reprocessing global: {global_name}")
        
        # First, delete existing data for this global
        await self._delete_global_data(global_name)
        
        # Then process fresh data
        return await self.process_all_globals([global_name])
    
    async def _delete_collection_data(self, collection_name: str):
        """Delete all existing data for a collection from vector database"""
        try:
            # This would require implementing a method to delete by content_type
            # For now, we'll rely on the upsert mechanism to overwrite
            logger.info(f"Preparing to overwrite data for collection: {collection_name}")
        except Exception as e:
            logger.error(f"Error deleting collection data: {str(e)}")
    
    async def _delete_global_data(self, global_name: str):
        """Delete all existing data for a global from vector database"""
        try:
            # This would require implementing a method to delete by content_type
            # For now, we'll rely on the upsert mechanism to overwrite
            logger.info(f"Preparing to overwrite data for global: {global_name}")
        except Exception as e:
            logger.error(f"Error deleting global data: {str(e)}")
    
    async def get_processing_stats(self) -> Dict[str, Any]:
        """Get statistics about processed content"""
        try:
            db_stats = self.vector_manager.get_database_stats()
            
            # Add more detailed stats
            stats = {
                "database_info": db_stats,
                "collections_available": list(COLLECTION_MAPPINGS.keys()),
                "globals_available": list(GLOBAL_MAPPINGS.keys()),
                "last_updated": datetime.now().isoformat()
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting processing stats: {str(e)}")
            return {}
    
    async def test_cms_connection(self) -> Dict[str, Any]:
        """Test connection to Payload CMS"""
        try:
            # Try to fetch a simple collection
            test_collections = ["announcements", "departments"]
            results = {}
            
            for collection in test_collections:
                try:
                    data = await self.cms_client.fetch_collection_data(collection, limit=1)
                    results[collection] = {
                        "status": "success",
                        "total_docs": data.get('totalDocs', 0)
                    }
                except Exception as e:
                    results[collection] = {
                        "status": "error",
                        "error": str(e)
                    }
            
            return {
                "cms_connection": results,
                "base_url": settings.payload_api_url,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "cms_connection": "failed",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }


class ProcessingOrchestrator:
    """Orchestrates the entire manual processing workflow"""
    
    def __init__(self):
        self.processor = ManualContentProcessor()
    
    async def full_initial_processing(self) -> Dict[str, Any]:
        """Perform full initial processing of all CMS content"""
        logger.info("Starting full initial processing of CMS content")
        
        start_time = datetime.now()
        
        # Test CMS connection first
        connection_test = await self.processor.test_cms_connection()
        if any(result.get("status") == "error" for result in connection_test.get("cms_connection", {}).values()):
            logger.error("CMS connection test failed")
            return {
                "status": "failed",
                "error": "CMS connection failed",
                "connection_test": connection_test
            }
        
        results = {
            "status": "success",
            "start_time": start_time.isoformat(),
            "connection_test": connection_test,
            "collections_result": {},
            "globals_result": {},
            "total_processing_time": None,
            "summary": {}
        }
        
        try:
            # Process all collections
            collections_result = await self.processor.process_all_collections()
            results["collections_result"] = collections_result
            
            # Process all globals
            globals_result = await self.processor.process_all_globals()
            results["globals_result"] = globals_result
            
            # Generate summary
            end_time = datetime.now()
            total_chunks = collections_result["total_chunks"] + globals_result["total_chunks"]
            
            results["total_processing_time"] = str(end_time - start_time)
            results["summary"] = {
                "total_collections_processed": len(collections_result["processed_collections"]),
                "total_globals_processed": len(globals_result["processed_globals"]),
                "total_chunks_created": total_chunks,
                "failed_collections": collections_result["failed_collections"],
                "failed_globals": globals_result["failed_globals"],
                "total_errors": len(collections_result["errors"]) + len(globals_result["errors"])
            }
            
            # Get final database stats
            results["final_db_stats"] = await self.processor.get_processing_stats()
            
            logger.info(f"Completed full initial processing: {total_chunks} chunks created")
            
        except Exception as e:
            results["status"] = "failed"
            results["error"] = str(e)
            logger.error(f"Error in full initial processing: {str(e)}")
        
        return results
    
    async def selective_processing(self, collections: Optional[List[str]] = None, 
                                 globals_list: Optional[List[str]] = None) -> Dict[str, Any]:
        """Process only selected collections and globals"""
        logger.info(f"Starting selective processing: collections={collections}, globals={globals_list}")
        
        results = {
            "status": "success",
            "collections_result": {},
            "globals_result": {},
            "summary": {}
        }
        
        try:
            total_chunks = 0
            
            if collections:
                collections_result = await self.processor.process_all_collections(collections)
                results["collections_result"] = collections_result
                total_chunks += collections_result["total_chunks"]
            
            if globals_list:
                globals_result = await self.processor.process_all_globals(globals_list)
                results["globals_result"] = globals_result
                total_chunks += globals_result["total_chunks"]
            
            results["summary"] = {
                "total_chunks_created": total_chunks,
                "collections_processed": len(collections or []),
                "globals_processed": len(globals_list or [])
            }
            
            logger.info(f"Completed selective processing: {total_chunks} chunks created")
            
        except Exception as e:
            results["status"] = "failed"
            results["error"] = str(e)
            logger.error(f"Error in selective processing: {str(e)}")
        
        return results
