# Enhanced FastAPI Webhook Listener with Content Processing
# Receives webhooks from Payload CMS, processes content, and stores in vector database

from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import logging
import json
import asyncio
import uvicorn
from datetime import datetime

from content_processor import ContentProcessor
from vector_db import VectorDatabaseManager
from manual_processor import ProcessingOrchestrator

app = FastAPI(
    title="Rajalakshmi Vector Service", 
    description="Content processing and vector storage service for Rajalakshmi Engineering College",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize processors
content_processor = ContentProcessor()
vector_manager = VectorDatabaseManager()
manual_processor = ProcessingOrchestrator()

class WebhookPayload(BaseModel):
    collection: Optional[str] = None
    global_: Optional[str] = Field(None, alias='global')
    operation: str
    timestamp: str
    id: Optional[str] = None
    user: Optional[Dict[str, Any]] = None

async def process_webhook_content(payload_data: Dict[str, Any]):
    """Background task to process webhook content"""
    try:
        logger.info("Starting background processing of webhook content")
        logger.info(f"Payload data: {payload_data}")
        
        # Process content into chunks
        chunks = content_processor.process_webhook_payload(payload_data)
        logger.info(f"Generated {len(chunks)} chunks from webhook payload")
        
        if chunks:
            # Store in vector database
            success = await vector_manager.process_and_store_chunks(chunks)
            if success:
                logger.info(f"Successfully processed and stored {len(chunks)} chunks")
            else:
                logger.error("Failed to store chunks in vector database")
        else:
            logger.warning("No chunks generated from webhook payload")
            
    except Exception as e:
        logger.error(f"Error in background processing: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")

@app.post("/webhook/payload")
async def receive_webhook(payload: WebhookPayload, request: Request, background_tasks: BackgroundTasks):
    """
    Receives webhooks from Payload CMS, logs payload data, and triggers processing
    """
    try:
        # Get headers for additional context
        headers = dict(request.headers)
        
        # Log the webhook reception
        logger.info("=== WEBHOOK RECEIVED ===")
        
        # Check if it's a collection or global webhook and trigger processing
        if payload.collection:
            logger.info(f"Type: COLLECTION")
            logger.info(f"Collection: {payload.collection}")
            logger.info(f"Operation: {payload.operation}")
            logger.info(f"Document ID: {payload.id}")
            logger.info(f"Timestamp: {payload.timestamp}")
            if payload.user:
                logger.info(f"User ID: {payload.user.get('id', 'N/A')}")
                logger.info(f"User Email: {payload.user.get('email', 'N/A')}")
                logger.info(f"User Role: {payload.user.get('role', 'N/A')}")
            
            # Trigger collection processing
            logger.info(f"Triggering processing for collection: {payload.collection}")
            background_tasks.add_task(run_selective_processing, [payload.collection], None)
            
        elif payload.global_:
            logger.info(f"Type: GLOBAL")
            logger.info(f"Global: {payload.global_}")
            logger.info(f"Operation: {payload.operation}")
            logger.info(f"Timestamp: {payload.timestamp}")
            if payload.user:
                logger.info(f"User ID: {payload.user.get('id', 'N/A')}")
                logger.info(f"User Email: {payload.user.get('email', 'N/A')}")
                logger.info(f"User Role: {payload.user.get('role', 'N/A')}")
            
            # Trigger global processing
            logger.info(f"Triggering processing for global: {payload.global_}")
            background_tasks.add_task(run_selective_processing, None, [payload.global_])
            
        else:
            logger.warning("Unknown webhook type - neither collection nor global")
        
        logger.info(f"Headers: {headers}")
        logger.info(f"Full Payload: {payload.model_dump()}")
        
        # Return immediate response
        return {
            "status": "success", 
            "message": "Webhook received and processing triggered",
            "received_at": payload.timestamp,
            "operation": payload.operation,
            "collection": payload.collection,
            "global": payload.global_,
            "type": "collection" if payload.collection else "global" if payload.global_ else "unknown",
            "processing": "triggered"
        }
        
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")

# New endpoints for manual processing and management

@app.post("/manual/process-all")
async def manual_process_all(background_tasks: BackgroundTasks):
    """
    Manually trigger full processing of all CMS content
    """
    try:
        logger.info("Manual full processing triggered")
        
        # Add background task for processing
        background_tasks.add_task(run_full_processing)
        
        return {
            "status": "started",
            "message": "Full processing started in background",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error starting manual processing: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start processing: {str(e)}")

async def run_full_processing():
    """Background task for full processing"""
    try:
        logger.info("Starting full manual processing")
        result = await manual_processor.full_initial_processing()
        logger.info(f"Full processing completed: {result.get('summary', {})}")
    except Exception as e:
        logger.error(f"Error in full processing: {str(e)}")

@app.post("/manual/process-collections")
async def manual_process_collections(collections: List[str], background_tasks: BackgroundTasks):
    """
    Manually process specific collections
    """
    try:
        logger.info(f"Manual processing triggered for collections: {collections}")
        
        # Add background task for processing
        background_tasks.add_task(run_selective_processing, collections, None)
        
        return {
            "status": "started",
            "message": f"Processing started for collections: {collections}",
            "collections": collections,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error starting collections processing: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start processing: {str(e)}")

@app.post("/manual/process-globals")
async def manual_process_globals(globals_list: List[str], background_tasks: BackgroundTasks):
    """
    Manually process specific globals
    """
    try:
        logger.info(f"Manual processing triggered for globals: {globals_list}")
        
        # Add background task for processing
        background_tasks.add_task(run_selective_processing, None, globals_list)
        
        return {
            "status": "started",
            "message": f"Processing started for globals: {globals_list}",
            "globals": globals_list,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error starting globals processing: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start processing: {str(e)}")

async def run_selective_processing(collections: Optional[List[str]], globals_list: Optional[List[str]]):
    """Background task for selective processing"""
    try:
        logger.info(f"Starting selective processing: collections={collections}, globals={globals_list}")
        result = await manual_processor.selective_processing(collections, globals_list)
        logger.info(f"Selective processing completed: {result.get('summary', {})}")
    except Exception as e:
        logger.error(f"Error in selective processing: {str(e)}")

@app.get("/search")
async def search_content(
    query: str,
    department: Optional[str] = None,
    category: Optional[str] = None,
    content_type: Optional[str] = None,
    limit: int = 10
):
    """
    Search content in the vector database
    """
    try:
        # Build filters
        filters = {}
        if department:
            filters["department"] = department
        if category:
            filters["category"] = category
        if content_type:
            filters["content_type"] = content_type
        
        # Search
        results = await vector_manager.search_content(query, filters, limit)
        
        return {
            "query": query,
            "filters": filters,
            "results_count": len(results),
            "results": results,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error searching content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.get("/stats")
async def get_database_stats():
    """
    Get database statistics and processing information
    """
    try:
        stats = vector_manager.get_database_stats()
        
        return {
            "database_stats": stats,
            "timestamp": datetime.now().isoformat(),
            "service_status": "running"
        }
        
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@app.get("/test-cms")
async def test_cms_connection():
    """
    Test connection to Payload CMS
    """
    try:
        processor = manual_processor.processor
        result = await processor.test_cms_connection()
        
        return result
        
    except Exception as e:
        logger.error(f"Error testing CMS connection: {str(e)}")
        raise HTTPException(status_code=500, detail=f"CMS test failed: {str(e)}")

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "service": "webhook-listener"}

@app.get("/")
async def root():
    """
    Root endpoint with basic info
    """
    return {
        "service": "Webhook Listener",
        "description": "Simple webhook receiver for Payload CMS",
        "endpoints": {
            "webhook": "/webhook/payload",
            "health": "/health"
        }
    }

if __name__ == "__main__":
    logger.info("Starting webhook listener server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
