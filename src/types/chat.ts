export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  intermediateResponses?: AgentResponse[];
}

export interface ContentItem {
  type: string;
  content: string;
}


export interface AgentResponse {
  id: string;
  agent_name: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
  intermediateResponses?: AgentResponse[];
}

export interface ApiError {
  error?: string;
  message?: string;
}