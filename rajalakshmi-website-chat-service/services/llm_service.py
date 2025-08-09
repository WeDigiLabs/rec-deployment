from openai import OpenAI
import logging
from typing import List, Dict, Any
from models.chat_models import ChatMessage
from config import settings

logger = logging.getLogger(__name__)

class LLMService:
    """Service for LLM interactions using LM Studio"""
    
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.openai_api_key,  # Not required for LM Studio
            base_url=settings.openai_base_url.replace("/v1", "/v1")  # Ensure proper endpoint
        )
        self.chat_model = getattr(settings, 'chat_model', 'local-model')
    
    async def generate_response(
        self,
        user_query: str,
        context: str,
        conversation_history: List[ChatMessage] = None,
        college_context: str = None
    ) -> str:
        """Generate a response using the LLM"""
        try:
            # Build the system prompt
            system_prompt = self._build_system_prompt(college_context)
            
            # Build messages
            messages = [{"role": "system", "content": system_prompt}]
            
            # Add conversation history (last 5 messages for context)
            if conversation_history:
                for msg in conversation_history[-5:]:
                    messages.append({
                        "role": msg.role.value,
                        "content": msg.content
                    })
            
            # Add current context and query
            user_prompt = self._build_user_prompt(user_query, context)
            messages.append({"role": "user", "content": user_prompt})
            
            # Generate response
            response = self.client.chat.completions.create(
                model=self.chat_model,
                messages=messages,
                max_tokens=1000,
                temperature=0.7,
                stream=False
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Error generating LLM response: {str(e)}")
            return "I apologize, but I'm having trouble generating a response right now. Please try again."
    
    def _build_system_prompt(self, college_context: str = None) -> str:
        """Build the system prompt for the chatbot"""
        base_prompt = """You are REC Assistant, a helpful AI chatbot for Rajalakshmi Engineering College (REC).

Your role:
- Provide accurate information about REC based on the provided context
- Be helpful, friendly, and professional
- Focus on admissions, academics, departments, facilities, and campus life
- If you don't have information, clearly state that and suggest contacting the college

Guidelines:
- Always base your answers on the provided context
- Be concise but comprehensive
- Use bullet points for lists when appropriate
- Include specific details like fees, dates, requirements when available
- Mention department names, course names, and specific facilities accurately
"""
        
        if college_context:
            base_prompt += f"\n\nCollege Information:\n{college_context}"
        
        return base_prompt
    
    def _build_user_prompt(self, query: str, context: str) -> str:
        """Build the user prompt with context"""
        return f"""Based on the following information about Rajalakshmi Engineering College, please answer the user's question.

Context Information:
{context}

User Question: {query}

Please provide a helpful and accurate response based on the context provided."""
