# REC Chat Service - Conversational Layer

A conversational AI interface for Rajalakshmi Engineering College (REC) built on top of the existing vector service. This service provides a natural language chat interface that leverages retrieval-augmented generation (RAG) to answer questions about the college.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Chat Client   │───▶│   Chat API       │───▶│  Query Engine   │
│  (Frontend)     │    │ (FastAPI:8001)   │    │      (RAG)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Conversation    │◀───│  LLM Integration │◀───│  Search Results │
│   History       │    │ (LM Studio:1234) │    │ (Vector:8000)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

Before starting the chat service, ensure these services are running:

1. **Qdrant Vector Database** - Port 6333
2. **LM Studio** - Port 1234 (with a model loaded)
3. **Vector Service** - Port 8000 (existing REC vector service)
4. **Payload CMS** - Port 3000 (optional, for content management)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd rajalakshmi-website-chat-service
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   The `.env` file is already configured with default settings:
   ```env
   OPENAI_API_KEY=not_required_for_lm_studio
   OPENAI_BASE_URL=http://localhost:1234/v1
   CHAT_MODEL=local-model
   VECTOR_SERVICE_URL=http://localhost:8000
   ```

4. **Test the setup:**
   ```bash
   python test_setup.py
   python test_api.py
   ```

### Running the Service

1. **Start the chat service:**
   ```bash
   python start_chat_service.py
   ```
   
   Or manually:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8001 --reload
   ```

2. **Test with demo:**
   ```bash
   python demo_usage.py
   ```

## 🔧 API Endpoints

### Chat Endpoint
```http
POST /chat
Content-Type: application/json

{
  "message": "Tell me about CSE department admission requirements",
  "conversation_id": "optional-uuid",
  "filters": {
    "department": "CSE",
    "category": "academic"
  }
}
```

**Response:**
```json
{
  "message": "Here's information about CSE admissions...",
  "conversation_id": "uuid-of-conversation",
  "sources": [
    {
      "title": "CSE Department",
      "type": "academic",
      "department": "CSE",
      "score": 0.95
    }
  ],
  "metadata": {
    "search_results_count": 3,
    "filters_applied": {"department": "CSE"}
  },
  "timestamp": "2025-08-08T13:30:00"
}
```

### Other Endpoints

- `GET /conversations/{conversation_id}` - Get conversation history
- `DELETE /conversations/{conversation_id}` - Delete conversation
- `GET /health` - Health check
- `GET /search` - Direct search (passthrough to vector service)

## 📊 Components

### 1. Chat Models (`models/chat_models.py`)
- `ChatRequest` - Input message structure
- `ChatResponse` - Response with sources and metadata
- `ChatMessage` - Individual message in conversation
- `MessageRole` - User, Assistant, System roles

### 2. Conversation Manager (`models/conversation.py`)
- Manages conversation history and context
- Automatic session timeout and cleanup
- Thread-safe conversation storage

### 3. RAG Service (`services/rag_service.py`)
- Interfaces with the vector service (port 8000)
- Builds context from search results
- Extracts source information for responses

### 4. LLM Service (`services/llm_service.py`)
- Connects to LM Studio for text generation
- Builds prompts with college-specific context
- Handles conversation history

### 5. Prompt Templates (`utils/prompt_templates.py`)
- College-specific system prompts
- Department-focused prompts
- Query classification helpers

## 🎯 Usage Examples

### Basic Chat
```python
import httpx

async def chat_example():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8001/chat",
            json={
                "message": "What courses are offered in CSE?",
                "filters": {"department": "CSE"}
            }
        )
        return response.json()
```

### Conversation Continuation
```python
# First message
response1 = await client.post("/chat", json={
    "message": "Tell me about CSE admissions"
})

# Continue conversation
response2 = await client.post("/chat", json={
    "message": "What are the eligibility criteria?",
    "conversation_id": response1["conversation_id"]
})
```

## 🔧 Configuration

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_BASE_URL` | `http://localhost:1234/v1` | LM Studio endpoint |
| `VECTOR_SERVICE_URL` | `http://localhost:8000` | Vector service endpoint |
| `CHAT_MODEL` | `local-model` | Model name in LM Studio |
| `MAX_CONVERSATION_HISTORY` | `50` | Max messages per conversation |
| `SESSION_TIMEOUT` | `3600` | Session timeout in seconds |

### LM Studio Setup
1. Download and install LM Studio
2. Load a suitable model (recommend 7B+ parameters)
3. Start the local server on port 1234
4. Ensure the model name matches `CHAT_MODEL` in config

## 🧪 Testing

### Basic Setup Test
```bash
python test_setup.py
```
Tests imports, service initialization, and basic functionality.

### API Test
```bash
python test_api.py
```
Tests FastAPI app startup and route configuration.

### Demo Usage
```bash
python demo_usage.py
```
Demonstrates full conversation flow and shows example interactions.

## 📝 Logs

The service provides detailed logging for:
- Request/response tracking
- Search results and context building
- LLM interactions
- Conversation management
- Error handling

Logs are output to console with timestamps and structured information.

## 🚨 Troubleshooting

### Common Issues

1. **"Could not connect to vector service"**
   - Ensure vector service is running on port 8000
   - Check `VECTOR_SERVICE_URL` in `.env`

2. **"LLM service error"**
   - Verify LM Studio is running on port 1234
   - Check model is loaded and accessible
   - Verify `OPENAI_BASE_URL` configuration

3. **"No search results found"**
   - Check if vector database has content
   - Verify Qdrant is running on port 6333
   - Test vector service search endpoint directly

4. **Import errors**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt`
   - Check Python version (3.8+ required)

### Health Checks

```bash
# Check chat service
curl http://localhost:8001/health

# Check vector service
curl http://localhost:8000/health

# Check LM Studio
curl http://localhost:1234/v1/models
```

## 🔮 Next Steps

1. **Frontend Integration** - Build a web interface
2. **Authentication** - Add user authentication
3. **Persistent Storage** - Store conversations in database
4. **Advanced RAG** - Implement more sophisticated retrieval
5. **Analytics** - Add conversation analytics and insights

## 📄 License

This project is part of the Rajalakshmi Engineering College website chat service implementation.
