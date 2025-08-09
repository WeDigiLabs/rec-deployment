"""
Simple test script to verify the chat service setup
"""
import sys
import asyncio
from datetime import datetime

async def test_basic_setup():
    """Test basic imports and class initialization"""
    try:
        print("Testing imports...")
        
        # Test basic imports
        from models.chat_models import ChatRequest, ChatResponse, MessageRole
        from models.conversation import ConversationManager
        from services.rag_service import RAGService
        from services.llm_service import LLMService
        from config import settings
        
        print("✅ All imports successful")
        
        # Test basic initialization
        print("\nTesting service initialization...")
        
        conversation_manager = ConversationManager()
        rag_service = RAGService()
        # llm_service = LLMService()  # Skip this for now as it requires LM Studio
        
        print("✅ Services initialized successfully")
        
        # Test conversation creation
        print("\nTesting conversation management...")
        
        conv_id = conversation_manager.create_conversation()
        print(f"✅ Created conversation: {conv_id}")
        
        # Test adding messages
        success = conversation_manager.add_message(conv_id, MessageRole.USER, "Hello, test message")
        print(f"✅ Added user message: {success}")
        
        success = conversation_manager.add_message(conv_id, MessageRole.ASSISTANT, "Hello! How can I help you?")
        print(f"✅ Added assistant message: {success}")
        
        # Test retrieving conversation
        messages = conversation_manager.get_conversation(conv_id)
        print(f"✅ Retrieved conversation with {len(messages)} messages")
        
        # Test chat models
        print("\nTesting chat models...")
        
        request = ChatRequest(
            message="Tell me about CSE department",
            filters={"department": "CSE"}
        )
        print(f"✅ Created chat request: {request.message}")
        
        response = ChatResponse(
            message="Here's information about the CSE department...",
            conversation_id=conv_id,
            sources=[],
            metadata={"test": True}
        )
        print(f"✅ Created chat response: {response.message[:50]}...")
        
        print(f"\n🎉 Basic setup test completed successfully!")
        print(f"⏰ Test completed at: {datetime.now()}")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_basic_setup())
    sys.exit(0 if success else 1)
