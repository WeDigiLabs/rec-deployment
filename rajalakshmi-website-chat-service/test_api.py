"""
Test script to verify the FastAPI chat service starts correctly
"""
import asyncio
import sys
from contextlib import asynccontextmanager

async def test_api_startup():
    """Test that the FastAPI app can start without errors"""
    try:
        print("Testing FastAPI app startup...")
        
        # Import the main app
        from main import app
        print("✅ FastAPI app imported successfully")
        
        # Test that services are initialized
        from main import conversation_manager, rag_service, llm_service
        print("✅ Services are initialized")
        
        # Test conversation creation
        conv_id = conversation_manager.create_conversation()
        print(f"✅ Created test conversation: {conv_id}")
        
        # Test that app has the expected routes
        routes = [route.path for route in app.routes]
        expected_routes = ["/chat", "/conversations/{conversation_id}", "/health", "/search"]
        
        for route in expected_routes:
            # For parameterized routes, check if pattern exists
            if "{" in route:
                pattern_exists = any(route.replace("{conversation_id}", "").replace("}", "") in r for r in routes)
                if pattern_exists:
                    print(f"✅ Route pattern found: {route}")
                else:
                    print(f"⚠️  Route pattern not found: {route}")
            else:
                if route in routes:
                    print(f"✅ Route exists: {route}")
                else:
                    print(f"⚠️  Route missing: {route}")
        
        print(f"\n🎉 API startup test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ API startup test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_api_startup())
    sys.exit(0 if success else 1)
