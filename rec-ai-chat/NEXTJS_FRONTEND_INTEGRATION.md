# 🚀 Next.js Frontend Integration Guide for REC Chat Service

A comprehensive guide for integrating the REC Chat Service API with a Next.js frontend application.

## 📋 Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Data Models](#data-models)
4. [Next.js Integration Setup](#nextjs-integration-setup)
5. [API Service Layer](#api-service-layer)
6. [React Components](#react-components)
7. [State Management](#state-management)
8. [Error Handling](#error-handling)
9. [Streaming Support](#streaming-support)
10. [Best Practices](#best-practices)
11. [Example Implementation](#example-implementation)

## 🎯 Overview

The REC Chat Service API provides a conversational AI interface for Rajalakshmi Engineering College. It runs on port 8001 and offers:

- **Intelligent chat responses** using RAG (Retrieval-Augmented Generation)
- **Conversation persistence** with automatic cleanup
- **Contextual search** with department/category filtering
- **Source citations** for transparency
- **CORS enabled** for frontend integration

### Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │───▶│   Chat API       │───▶│  Vector Service │
│   (Port 3000)   │    │ (Port 8001)      │    │  (Port 8000)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔌 API Endpoints

### 1. Main Chat Endpoint

**POST** `/chat`

Primary endpoint for sending messages and receiving AI responses.

**Request:**
```typescript
interface ChatRequest {
  message: string;
  conversation_id?: string;
  filters?: {
    department?: string;
    category?: string;
    content_type?: string;
  };
}
```

**Response:**
```typescript
interface ChatResponse {
  message: string;
  conversation_id: string;
  sources: Source[];
  metadata: {
    search_results_count: number;
    filters_applied: Record<string, any>;
    has_context: boolean;
  };
  timestamp: string;
}
```

### 2. Conversation Management

**GET** `/conversations/{conversation_id}`
- Retrieve conversation history
- Returns messages array with metadata

**DELETE** `/conversations/{conversation_id}`
- Delete conversation and cleanup
- Returns success confirmation

### 3. Direct Search

**GET** `/search`

Query parameters:
- `query` (required): Search text
- `department` (optional): Filter by department
- `category` (optional): Filter by category
- `content_type` (optional): Filter by content type
- `limit` (optional, default 10): Number of results

### 4. Health Check

**GET** `/health`
- Service status monitoring
- Returns operational status of all components

## 📦 Data Models

### Core Types

```typescript
// Message roles
type MessageRole = 'user' | 'assistant' | 'system';

// Chat message structure
interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Source information
interface Source {
  title: string;
  type: string;
  department: string;
  score: number;
  url?: string;
  preview?: string;
}

// Conversation filters
interface ChatFilters {
  department?: string;
  category?: string;
  content_type?: string;
}

// Error response
interface APIError {
  detail: string;
  status_code: number;
}
```

## ⚙️ Next.js Integration Setup

### 1. Environment Configuration

Create `.env.local`:
```env
NEXT_PUBLIC_CHAT_API_URL=http://localhost:8001
NEXT_PUBLIC_CHAT_API_TIMEOUT=30000
```

### 2. Package Installation

```bash
npm install axios @tanstack/react-query zustand
# or
yarn add axios @tanstack/react-query zustand
```

### 3. TypeScript Configuration

Add to your `types/chat.ts`:
```typescript
export interface ChatRequest {
  message: string;
  conversation_id?: string;
  filters?: ChatFilters;
}

export interface ChatResponse {
  message: string;
  conversation_id: string;
  sources: Source[];
  metadata: {
    search_results_count: number;
    filters_applied: Record<string, any>;
    has_context: boolean;
  };
  timestamp: string;
}

export interface ChatFilters {
  department?: 'CSE' | 'ECE' | 'MECH' | 'CIVIL' | 'EEE' | 'IT';
  category?: 'academic' | 'admission' | 'placement' | 'facilities';
  content_type?: 'announcement' | 'blog-post' | 'department' | 'testimonial';
}

export interface Source {
  title: string;
  type: string;
  department: string;
  score: number;
  url?: string;
  preview?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  conversation_id: string;
  messages: ChatMessage[];
  metadata: Record<string, any>;
}
```

## 🛠️ API Service Layer

Create `services/chatAPI.ts`:

```typescript
import axios, { AxiosResponse } from 'axios';
import { ChatRequest, ChatResponse, Conversation, Source } from '../types/chat';

class ChatAPIService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8001';
    this.timeout = parseInt(process.env.NEXT_PUBLIC_CHAT_API_TIMEOUT || '30000');
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
```

## 🎨 React Components

### 1. Chat Interface Component

Create `components/ChatInterface.tsx`:

```typescript
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { chatAPI } from '../services/chatAPI';
import { ChatMessage, ChatFilters } from '../types/chat';
import { ChatMessageComponent } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { FilterPanel } from './FilterPanel';
import { LoadingSpinner } from './LoadingSpinner';

interface ChatInterfaceProps {
  className?: string;
  initialFilters?: ChatFilters;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  className = '',
  initialFilters = {},
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ChatFilters>(initialFilters);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return chatAPI.sendMessage({
        message,
        conversation_id: conversationId || undefined,
        filters,
      });
    },
    onSuccess: (response) => {
      setConversationId(response.conversation_id);
      
      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp,
        metadata: {
          sources: response.sources,
          ...response.metadata,
        },
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        metadata: { error: true },
      };
      
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Send to API
    sendMessageMutation.mutate(message.trim());
  };

  const handleClearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  const handleFilterChange = (newFilters: ChatFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            REC AI Assistant
          </h2>
          <button
            onClick={handleClearChat}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 
                     border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear Chat
          </button>
        </div>
        
        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFilterChange}
          className="mt-3"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg mb-2">👋 Welcome to REC AI Assistant!</p>
            <p className="text-sm">
              Ask me anything about Rajalakshmi Engineering College - 
              admissions, courses, facilities, placements, and more.
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <ChatMessageComponent
            key={index}
            message={message}
            isLoading={
              index === messages.length - 1 && 
              message.role === 'user' && 
              sendMessageMutation.isPending
            }
          />
        ))}
        
        {sendMessageMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-sm text-gray-600">
                Thinking...
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={sendMessageMutation.isPending}
          placeholder="Ask me about REC..."
        />
      </div>
    </div>
  );
};
```

### 2. Chat Message Component

Create `components/ChatMessage.tsx`:

```typescript
import React from 'react';
import { ChatMessage, Source } from '../types/chat';
import { SourcesList } from './SourcesList';

interface ChatMessageProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
  isLoading = false,
}) => {
  const isUser = message.role === 'user';
  const sources = message.metadata?.sources as Source[] || [];
  const hasError = message.metadata?.error;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl ${isUser ? 'ml-12' : 'mr-12'}`}>
        {/* Message bubble */}
        <div
          className={`
            rounded-lg px-4 py-3 ${
              isUser
                ? 'bg-blue-600 text-white'
                : hasError
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-gray-100 text-gray-800'
            }
          `}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
          
          {isLoading && (
            <div className="mt-2 text-xs opacity-75">
              Loading...
            </div>
          )}
        </div>

        {/* Sources (only for assistant messages) */}
        {!isUser && sources.length > 0 && (
          <SourcesList sources={sources} className="mt-2" />
        )}

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
```

### 3. Chat Input Component

Create `components/ChatInput.tsx`:

```typescript
import React, { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
  className = '',
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 disabled:bg-gray-100 disabled:cursor-not-allowed"
        rows={2}
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Send
      </button>
    </div>
  );
};
```

### 4. Filter Panel Component

Create `components/FilterPanel.tsx`:

```typescript
import React from 'react';
import { ChatFilters } from '../types/chat';

interface FilterPanelProps {
  filters: ChatFilters;
  onFiltersChange: (filters: ChatFilters) => void;
  className?: string;
}

const DEPARTMENTS = [
  { value: 'CSE', label: 'Computer Science' },
  { value: 'ECE', label: 'Electronics & Communication' },
  { value: 'MECH', label: 'Mechanical' },
  { value: 'CIVIL', label: 'Civil' },
  { value: 'EEE', label: 'Electrical & Electronics' },
  { value: 'IT', label: 'Information Technology' },
];

const CATEGORIES = [
  { value: 'academic', label: 'Academic' },
  { value: 'admission', label: 'Admission' },
  { value: 'placement', label: 'Placement' },
  { value: 'facilities', label: 'Facilities' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  className = '',
}) => {
  const updateFilter = (key: keyof ChatFilters, value: string | undefined) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    onFiltersChange(newFilters);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Department Filter */}
      <select
        value={filters.department || ''}
        onChange={(e) => updateFilter('department', e.target.value || undefined)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All Departments</option>
        {DEPARTMENTS.map((dept) => (
          <option key={dept.value} value={dept.value}>
            {dept.label}
          </option>
        ))}
      </select>

      {/* Category Filter */}
      <select
        value={filters.category || ''}
        onChange={(e) => updateFilter('category', e.target.value || undefined)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {(filters.department || filters.category) && (
        <button
          onClick={() => onFiltersChange({})}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
```

### 5. Sources List Component

Create `components/SourcesList.tsx`:

```typescript
import React, { useState } from 'react';
import { Source } from '../types/chat';

interface SourcesListProps {
  sources: Source[];
  className?: string;
}

export const SourcesList: React.FC<SourcesListProps> = ({
  sources,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div className={`${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-blue-600 hover:text-blue-800 underline"
      >
        {isExpanded ? 'Hide' : 'Show'} Sources ({sources.length})
      </button>
      
      {isExpanded && (
        <div className="mt-2 space-y-2">
          {sources.map((source, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-md p-2 text-xs"
            >
              <div className="font-medium text-gray-800">
                {source.title}
              </div>
              <div className="text-gray-600 flex items-center space-x-2 mt-1">
                <span className="bg-gray-100 px-1 rounded">
                  {source.department}
                </span>
                <span className="bg-blue-100 px-1 rounded text-blue-800">
                  {source.type}
                </span>
                <span className="text-gray-500">
                  Relevance: {Math.round(source.score * 100)}%
                </span>
              </div>
              {source.preview && (
                <div className="text-gray-600 mt-1 italic">
                  {source.preview}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## 🎛️ State Management

### Using Zustand for Chat State

Create `stores/chatStore.ts`:

```typescript
import { create } from 'zustand';
import { ChatMessage, ChatFilters } from '../types/chat';

interface ChatState {
  // State
  messages: ChatMessage[];
  conversationId: string | null;
  filters: ChatFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  addMessage: (message: ChatMessage) => void;
  setConversationId: (id: string | null) => void;
  setFilters: (filters: ChatFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // Initial state
  messages: [],
  conversationId: null,
  filters: {},
  isLoading: false,
  error: null,

  // Actions
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setConversationId: (id) =>
    set({ conversationId: id }),

  setFilters: (filters) =>
    set({ filters }),

  setLoading: (loading) =>
    set({ isLoading: loading }),

  setError: (error) =>
    set({ error }),

  clearChat: () =>
    set({
      messages: [],
      conversationId: null,
      error: null,
    }),

  clearError: () =>
    set({ error: null }),
}));
```

## 🚨 Error Handling

### Custom Error Hook

Create `hooks/useErrorHandler.ts`:

```typescript
import { useCallback } from 'react';
import { toast } from 'react-hot-toast'; // or your preferred toast library

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, fallbackMessage = 'An error occurred') => {
    console.error('Error:', error);

    let message = fallbackMessage;
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    // Show toast notification
    toast.error(message);

    // Return the message for further handling if needed
    return message;
  }, []);

  return { handleError };
};
```

### Error Boundary Component

Create `components/ErrorBoundary.tsx`:

```typescript
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Chat component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 p-4">
          <div className="text-red-600 text-lg mb-2">
            ⚠️ Something went wrong
          </div>
          <div className="text-gray-600 text-sm text-center mb-4">
            The chat interface encountered an error. Please refresh the page to try again.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 🌊 Streaming Support (Future Enhancement)

For real-time response streaming, here's a foundation for Server-Sent Events:

```typescript
// hooks/useStreamingChat.ts
import { useState, useCallback } from 'react';

export const useStreamingChat = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  const streamMessage = useCallback(async (
    message: string,
    conversationId?: string,
    onChunk?: (chunk: string) => void,
    onComplete?: (response: any) => void
  ) => {
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.chunk) {
              onChunk?.(data.chunk);
            } else if (data.done) {
              onComplete?.(data);
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return { streamMessage, isStreaming };
};
```

## ✅ Best Practices

### 1. Performance Optimization
- Use React.memo for message components
- Implement virtual scrolling for long conversations
- Debounce search inputs
- Lazy load conversation history

### 2. Accessibility
- Add proper ARIA labels
- Ensure keyboard navigation
- Screen reader support
- Focus management

### 3. User Experience
- Auto-scroll to new messages
- Show typing indicators
- Persist conversations in localStorage
- Responsive design for mobile

### 4. Error Resilience
- Implement retry mechanisms
- Graceful degradation
- Offline support with queue
- Network status awareness

### 5. Security
- Sanitize user inputs
- Validate API responses
- Rate limiting on frontend
- Secure environment variables

## 📱 Example Implementation

### Complete Page Component

Create `pages/chat.tsx` or `app/chat/page.tsx`:

```typescript
'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ChatInterface } from '../components/ChatInterface';
import { ErrorBoundary } from '../components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function ChatPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg h-[700px]">
                <ChatInterface />
              </div>
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
```

### Custom Hook for Chat Logic

Create `hooks/useChat.ts`:

```typescript
import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatAPI } from '../services/chatAPI';
import { ChatMessage, ChatFilters } from '../types/chat';
import { useErrorHandler } from './useErrorHandler';

export const useChat = (initialFilters: ChatFilters = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ChatFilters>(initialFilters);
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) =>
      chatAPI.sendMessage({
        message,
        conversation_id: conversationId || undefined,
        filters,
      }),
    onSuccess: (response) => {
      setConversationId(response.conversation_id);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp,
        metadata: {
          sources: response.sources,
          ...response.metadata,
        },
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Invalidate conversation cache
      queryClient.invalidateQueries({
        queryKey: ['conversation', response.conversation_id],
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to send message');
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        metadata: { error: true },
      };
      
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(message.trim());
  }, [sendMessageMutation]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  return {
    messages,
    conversationId,
    filters,
    isLoading: sendMessageMutation.isPending,
    sendMessage,
    setFilters,
    clearChat,
  };
};
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install axios @tanstack/react-query zustand react-hot-toast
   ```

2. **Set up environment:**
   ```env
   NEXT_PUBLIC_CHAT_API_URL=http://localhost:8001
   ```

3. **Create the basic structure:**
   ```
   components/
   ├── ChatInterface.tsx
   ├── ChatMessage.tsx
   ├── ChatInput.tsx
   ├── FilterPanel.tsx
   ├── SourcesList.tsx
   └── ErrorBoundary.tsx
   
   services/
   └── chatAPI.ts
   
   types/
   └── chat.ts
   
   hooks/
   ├── useChat.ts
   └── useErrorHandler.ts
   ```

4. **Start building:** Begin with the `ChatInterface` component and gradually add features.

## 🔗 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

---

This guide provides a complete foundation for integrating the REC Chat Service with a Next.js frontend. Customize the components and styling to match your application's design system and requirements.
