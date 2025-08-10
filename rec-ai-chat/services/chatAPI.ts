import axios, { AxiosResponse } from 'axios';
import { ChatRequest, ChatResponse, Conversation, Source } from '../types/chat';

class ChatAPIService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8001';
    this.timeout = parseInt(process.env.NEXT_PUBLIC_CHAT_API_TIMEOUT || '3000000');
  }

  private get axiosInstance() {
    return axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Send chat message
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response: AxiosResponse<ChatResponse> = await this.axiosInstance.post('/chat', request);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to send message');
      throw error;
    }
  }

  // Get conversation history
  async getConversation(conversationId: string): Promise<Conversation> {
    try {
      const response: AxiosResponse<Conversation> = await this.axiosInstance.get(
        `/conversations/${conversationId}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch conversation');
      throw error;
    }
  }

  // Delete conversation
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/conversations/${conversationId}`);
    } catch (error) {
      this.handleError(error, 'Failed to delete conversation');
      throw error;
    }
  }

  // Search content directly
  async searchContent(
    query: string,
    filters?: {
      department?: string;
      category?: string;
      content_type?: string;
    },
    limit: number = 10
  ): Promise<{ results: Source[]; results_count: number }> {
    try {
      const params = new URLSearchParams({
        query,
        limit: limit.toString(),
        ...filters,
      });

      const response = await this.axiosInstance.get(`/search?${params}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to search content');
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    services: Record<string, string>;
    active_conversations: number;
  }> {
    try {
      const response = await this.axiosInstance.get('/health');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Health check failed');
      throw error;
    }
  }

  private handleError(error: any, message: string): void {
    console.error(`${message}:`, error);
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const detail = error.response.data?.detail || 'Unknown error';
      throw new Error(`${message} (${status}): ${detail}`);
    } else if (error.request) {
      // Request made but no response received
      throw new Error(`${message}: No response from server`);
    } else {
      // Something else happened
      throw new Error(`${message}: ${error.message}`);
    }
  }
}

export const chatAPI = new ChatAPIService();
