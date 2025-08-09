import uuid
import json
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from models.chat_models import ChatMessage, MessageRole
import logging

logger = logging.getLogger(__name__)

class ConversationManager:
    """Manages conversation history and context"""
    
    def __init__(self, max_history: int = 50, session_timeout: int = 3600):
        self.conversations: Dict[str, List[ChatMessage]] = {}
        self.conversation_metadata: Dict[str, Dict[str, Any]] = {}
        self.max_history = max_history
        self.session_timeout = session_timeout
    
    def create_conversation(self) -> str:
        """Create a new conversation and return its ID"""
        conversation_id = str(uuid.uuid4())
        self.conversations[conversation_id] = []
        self.conversation_metadata[conversation_id] = {
            "created_at": datetime.now(),
            "last_activity": datetime.now(),
            "title": "New Conversation",
            "topics": []
        }
        return conversation_id
    
    def add_message(
        self, 
        conversation_id: str, 
        role: MessageRole, 
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Add a message to a conversation"""
        try:
            if conversation_id not in self.conversations:
                return False
            
            message = ChatMessage(
                role=role,
                content=content,
                metadata=metadata or {}
            )
            
            self.conversations[conversation_id].append(message)
            
            # Update conversation metadata
            self.conversation_metadata[conversation_id]["last_activity"] = datetime.now()
            
            # Trim history if too long
            if len(self.conversations[conversation_id]) > self.max_history:
                self.conversations[conversation_id] = self.conversations[conversation_id][-self.max_history:]
            
            # Update title based on first user message
            if role == MessageRole.USER and len(self.conversations[conversation_id]) == 1:
                title = content[:50] + "..." if len(content) > 50 else content
                self.conversation_metadata[conversation_id]["title"] = title
            
            return True
            
        except Exception as e:
            logger.error(f"Error adding message: {str(e)}")
            return False
    
    def get_conversation(self, conversation_id: str) -> Optional[List[ChatMessage]]:
        """Get conversation history"""
        if conversation_id in self.conversations:
            # Check if conversation is still active
            last_activity = self.conversation_metadata[conversation_id]["last_activity"]
            if datetime.now() - last_activity > timedelta(seconds=self.session_timeout):
                # Conversation expired
                return None
            return self.conversations[conversation_id]
        return None
    
    def get_conversation_context(self, conversation_id: str) -> str:
        """Get conversation context for LLM"""
        conversation = self.get_conversation(conversation_id)
        if not conversation:
            return ""
        
        # Get recent context (last 3 exchanges)
        recent_messages = conversation[-6:]  # 6 messages = 3 user + 3 assistant
        context_parts = []
        
        for msg in recent_messages:
            role_str = "User" if msg.role == MessageRole.USER else "Assistant"
            context_parts.append(f"{role_str}: {msg.content}")
        
        return "\n".join(context_parts)
    
    def cleanup_expired_conversations(self):
        """Remove expired conversations"""
        current_time = datetime.now()
        expired_ids = []
        
        for conv_id, metadata in self.conversation_metadata.items():
            if current_time - metadata["last_activity"] > timedelta(seconds=self.session_timeout):
                expired_ids.append(conv_id)
        
        for conv_id in expired_ids:
            del self.conversations[conv_id]
            del self.conversation_metadata[conv_id]
            logger.info(f"Cleaned up expired conversation: {conv_id}")
