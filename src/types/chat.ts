export interface Message {
  id: number;
  role: 'user' | 'agent' | 'system';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AgentResponse {
  id: number;
  agent_name: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ApiError {
  message: string;
}