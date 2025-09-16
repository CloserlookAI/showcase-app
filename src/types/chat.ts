export interface Message {
  id: number;
  role: 'user' | 'agent' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  intermediateResponses?: AgentResponse[];
}

export interface AgentResponse {
  id: number;
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