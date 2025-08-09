"""
Example usage of the REC Chat Service
This script demonstrates how to interact with the conversational layer programmatically.
"""
import asyncio
import httpx
import json
from datetime import datetime

class ChatServiceClient:
    """Simple client for the REC Chat Service"""
    
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url
        self.client = httpx.AsyncClient()
    
    async def send_message(self, message: str, conversation_id: str = None, filters: dict = None):
        """Send a message to the chat service"""
        payload = {
            "message": message,
            "conversation_id": conversation_id,
            "filters": filters or {}
        }
        
        response = await self.client.post(
            f"{self.base_url}/chat",
            json=payload,
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()
    
    async def get_conversation(self, conversation_id: str):
        """Get conversation history"""
        response = await self.client.get(f"{self.base_url}/conversations/{conversation_id}")
        response.raise_for_status()
        return response.json()
    
    async def health_check(self):
        """Check if service is healthy"""
        response = await self.client.get(f"{self.base_url}/health")
        return response.json()
    
    async def close(self):
        """Close the client"""
        await self.client.aclose()

async def demo_conversation():
    """Demonstrate a conversation with the chat service"""
    client = ChatServiceClient()
    
    try:
        print("🤖 REC Chat Service Demo")
        print("=" * 40)
        
        # Health check
        print("\\n1. Checking service health...")
        health = await client.health_check()
        print(f"   Status: {health.get('status', 'unknown')}")
        
        conversation_id = None
        
        # Demo questions about REC
        demo_questions = [
            "What courses are offered in the CSE department?",
            "Tell me about the admission process for engineering programs", 
            "What are the placement statistics for recent graduates?",
            "What facilities are available on campus?",
            "How can I apply for hostel accommodation?"
        ]
        
        print(f"\\n2. Starting demo conversation with {len(demo_questions)} questions...")
        
        for i, question in enumerate(demo_questions, 1):
            print(f"\\n--- Question {i} ---")
            print(f"User: {question}")
            
            # Send message
            response = await client.send_message(
                message=question,
                conversation_id=conversation_id,
                filters={"department": "CSE"} if "CSE" in question else None
            )
            
            # Update conversation ID for subsequent messages
            if not conversation_id:
                conversation_id = response["conversation_id"]
                print(f"Started new conversation: {conversation_id}")
            
            print(f"Assistant: {response['message']}")
            print(f"Sources found: {len(response.get('sources', []))}")
            
            if response.get('sources'):
                print("Source types:", [s.get('type') for s in response['sources'][:3]])
        
        print(f"\\n3. Retrieving full conversation history...")
        conversation = await client.get_conversation(conversation_id)
        print(f"   Total messages: {len(conversation.get('messages', []))}")
        print(f"   Conversation title: {conversation.get('metadata', {}).get('title', 'Unknown')}")
        
        print("\\n✅ Demo completed successfully!")
        
    except httpx.ConnectError:
        print("❌ Could not connect to chat service.")
        print("   Make sure the service is running on port 8001")
        print("   Run: python start_chat_service.py")
        
    except Exception as e:
        print(f"❌ Demo failed: {e}")
        
    finally:
        await client.close()

async def demo_direct_testing():
    """Demo without requiring external services (offline testing)"""
    print("\\n🧪 Direct Component Testing (Offline)")
    print("=" * 40)
    
    try:
        from models.conversation import ConversationManager
        from models.chat_models import MessageRole
        
        # Test conversation management
        manager = ConversationManager()
        conv_id = manager.create_conversation()
        
        print(f"✅ Created conversation: {conv_id}")
        
        # Simulate a conversation
        questions = [
            "Hello, I want to know about CSE admissions",
            "What are the eligibility criteria?",
            "What about the fee structure?"
        ]
        
        responses = [
            "Hello! I'd be happy to help you with CSE admission information.",
            "For CSE admissions, you typically need to have completed 12th grade with Mathematics and Physics.",
            "The fee structure varies by program. Let me get you the latest information."
        ]
        
        for q, r in zip(questions, responses):
            manager.add_message(conv_id, MessageRole.USER, q)
            manager.add_message(conv_id, MessageRole.ASSISTANT, r)
        
        conversation = manager.get_conversation(conv_id)
        print(f"✅ Conversation has {len(conversation)} messages")
        
        # Show conversation
        for msg in conversation:
            role = "User" if msg.role == MessageRole.USER else "Assistant"
            print(f"   {role}: {msg.content[:50]}{'...' if len(msg.content) > 50 else ''}")
        
        print("\\n✅ Direct testing completed successfully!")
        
    except Exception as e:
        print(f"❌ Direct testing failed: {e}")

async def main():
    """Main demo function"""
    print(f"🚀 REC Chat Service Example - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Try online demo first
    print("\\nAttempting online demo (requires running services)...")
    await demo_conversation()
    
    # Always run offline demo
    await demo_direct_testing()
    
    print("\\n📖 Next Steps:")
    print("1. Start your vector service: http://localhost:8000")
    print("2. Start LM Studio: http://localhost:1234") 
    print("3. Start chat service: python start_chat_service.py")
    print("4. Test with: python demo_usage.py")

if __name__ == "__main__":
    asyncio.run(main())
