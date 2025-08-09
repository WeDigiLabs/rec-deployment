from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from datetime import datetime
from typing import Optional

from models.chat_models import ChatRequest, ChatResponse, ConversationSummary
from models.conversation import ConversationManager, MessageRole
from services.rag_service import RAGService
from services.llm_service import LLMService
from config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="REC Chatbot API",
    description="Conversational AI interface for Rajalakshmi Engineering College",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
conversation_manager = ConversationManager()
rag_service = RAGService(vector_service_url=settings.vector_service_url)
llm_service = LLMService()

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    """Main chat endpoint"""
    try:
        # Get or create conversation
        conversation_id = request.conversation_id
        if not conversation_id:
            conversation_id = conversation_manager.create_conversation()
        
        # Add user message to conversation
        conversation_manager.add_message(
            conversation_id, 
            MessageRole.USER, 
            request.message
        )
        
        # Get conversation history
        conversation_history = conversation_manager.get_conversation(conversation_id)
        
        # Search for relevant content
        search_results = await rag_service.search_relevant_content(
            request.message, 
            request.filters,
            limit=5
        )
        
        # Build context from search results
        context = await rag_service.build_context_from_search(search_results)
        
        # Generate response using LLM
        response_text = await llm_service.generate_response(
            request.message,
            context,
            conversation_history
        )
        
        # Add assistant response to conversation
        conversation_manager.add_message(
            conversation_id,
            MessageRole.ASSISTANT,
            response_text
        )
        
        # Extract sources information
        sources = rag_service.extract_sources_info(search_results)
        
        # Schedule cleanup task
        background_tasks.add_task(conversation_manager.cleanup_expired_conversations)
        
        return ChatResponse(
            message=response_text,
            conversation_id=conversation_id,
            sources=sources,
            metadata={
                "search_results_count": len(search_results),
                "filters_applied": request.filters or {},
                "has_context": bool(context.strip())
            }
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@app.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get conversation history"""
    try:
        conversation = conversation_manager.get_conversation(conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found or expired")
        
        return {
            "conversation_id": conversation_id,
            "messages": conversation,
            "metadata": conversation_manager.conversation_metadata.get(conversation_id, {})
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving conversation: {str(e)}")

@app.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """Delete a conversation"""
    try:
        if conversation_id in conversation_manager.conversations:
            del conversation_manager.conversations[conversation_id]
            del conversation_manager.conversation_metadata[conversation_id]
            return {"message": "Conversation deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Conversation not found")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting conversation: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test vector service connection
        test_results = await rag_service.search_relevant_content("test", limit=1)
        
        return {
            "status": "healthy",
            "services": {
                "chat_api": "operational",
                "vector_service": "operational" if test_results is not None else "error",
                "llm_service": "operational"
            },
            "active_conversations": len(conversation_manager.conversations),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.get("/search")
async def search_content(
    query: str,
    department: Optional[str] = None,
    category: Optional[str] = None,
    content_type: Optional[str] = None,
    limit: int = 10
):
    """Direct search endpoint (passthrough to vector service)"""
    try:
        filters = {}
        if department:
            filters["department"] = department
        if category:
            filters["category"] = category
        if content_type:
            filters["content_type"] = content_type
        
        results = await rag_service.search_relevant_content(query, filters, limit)
        
        return {
            "query": query,
            "filters": filters,
            "results": results,
            "results_count": len(results),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in search endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
