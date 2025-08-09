import { useState, useCallback } from 'react';
import { chatAPI } from '../services/chatAPI';
import { ChatFilters, ChatResponse } from '../types/chat';

export const useAPIChat = (filters: ChatFilters = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string): Promise<ChatResponse | null> => {
    if (!message.trim()) return null;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await chatAPI.sendMessage({
        message: message.trim(),
        conversation_id: conversationId || undefined,
        filters,
      });

      setConversationId(response.conversation_id);
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, filters]);

  const clearConversation = useCallback(() => {
    setConversationId(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendMessage,
    isLoading,
    conversationId,
    error,
    clearConversation,
    clearError,
  };
};
