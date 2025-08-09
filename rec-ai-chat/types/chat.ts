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

export interface APIError {
  detail: string;
  status_code: number;
}
