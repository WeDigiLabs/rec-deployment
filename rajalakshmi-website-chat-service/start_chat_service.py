"""
Demo script to start the REC Chat Service
This script demonstrates how to run the conversational layer for the Rajalakshmi website chat service.
"""

def print_startup_info():
    """Print startup information and instructions"""
    print("🤖 REC Chat Service - Conversational Layer")
    print("=" * 50)
    print()
    print("📋 Prerequisites:")
    print("1. ✅ Qdrant vector database running on port 6333")
    print("2. ✅ LM Studio running on port 1234")
    print("3. ✅ Vector service running on port 8000")
    print("4. ✅ Payload CMS running on port 3000")
    print()
    print("🚀 Starting Chat Service on port 8001...")
    print()
    print("📡 Available Endpoints:")
    print("- POST /chat                    - Main chat endpoint")
    print("- GET  /conversations/{id}      - Get conversation history") 
    print("- DELETE /conversations/{id}    - Delete conversation")
    print("- GET  /health                  - Health check")
    print("- GET  /search                  - Direct search (passthrough)")
    print()
    print("💡 Example Usage:")
    print("curl -X POST http://localhost:8001/chat \\")
    print('     -H "Content-Type: application/json" \\')
    print('     -d \'{"message": "Tell me about CSE department admission requirements"}\'')
    print()
    print("🔧 Configuration loaded from .env file")
    print("📝 Logs will show detailed request/response information")
    print()

if __name__ == "__main__":
    import uvicorn
    from main import app
    
    print_startup_info()
    
    try:
        # Start the FastAPI server
        uvicorn.run(
            app, 
            host="0.0.0.0", 
            port=8001, 
            log_level="info",
            reload=True  # Enable auto-reload during development
        )
    except KeyboardInterrupt:
        print("\\n👋 Chat service stopped by user")
    except Exception as e:
        print(f"❌ Error starting chat service: {e}")
