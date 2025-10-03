import { AgentResponse, ApiError } from '@/types/chat';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  async sendMessage(content: string): Promise<AgentResponse> {
    return this.request<AgentResponse>('/api/agent/messages', {
      method: 'POST',
      body: JSON.stringify({
        content,
      }),
    });
  }

  async getMessages(limit: number = 100, offset: number = 0): Promise<AgentResponse[]> {
    return this.request<AgentResponse[]>(`/api/agent/messages?limit=${limit}&offset=${offset}`);
  }

  async getAgentInfo() {
    return this.request('/api/agent/info');
  }

  // Remix Agent Methods
  async sendMessageToSpecificAgent(agentName: string, content: string): Promise<AgentResponse> {
    return this.request<AgentResponse>('/api/remix-agent/messages', {
      method: 'POST',
      body: JSON.stringify({
        agentName,
        content,
      }),
    });
  }

  async getMessagesFromAgent(agentName: string, limit: number = 100, offset: number = 0): Promise<AgentResponse[]> {
    return this.request<AgentResponse[]>(`/api/remix-agent/messages?agent=${agentName}&limit=${limit}&offset=${offset}`);
  }

  async getHtmlFromAgent(agentName: string): Promise<{ content: string; contentType: string; path: string; agent: string }> {
    return this.request(`/api/remix-agent/files?agent=${agentName}`);
  }

  async remixAgent(parentAgentName: string, newAgentName: string): Promise<{ success: boolean; parentAgent: string; newAgent: string; agentData: unknown }> {
    return this.request('/api/remix-agent/remix', {
      method: 'POST',
      body: JSON.stringify({
        parentAgentName,
        newAgentName,
      }),
    });
  }

  async listAgents(prefix: string, limit: number = 100, page: number = 1): Promise<{
    agents: Array<{
      name: string;
      created_by: string;
      state: string;
      description: string | null;
      parent_agent_name: string | null;
      created_at: string;
      last_activity_at: string | null;
      metadata: object;
      tags: string[];
    }>;
    total: number;
    page: number;
    pages: number;
    limit: number;
  }> {
    return this.request(`/api/remix-agent/list-agents?prefix=${prefix}&limit=${limit}&page=${page}`);
  }

  async getAgentState(agentName: string): Promise<{ state: string; [key: string]: unknown }> {
    return this.request(`/api/remix-agent/state?agentName=${agentName}`);
  }

  async wakeAgent(agentName: string, prompt?: string): Promise<unknown> {
    return this.request('/api/remix-agent/wake', {
      method: 'POST',
      body: JSON.stringify({
        agentName,
        prompt,
      }),
    });
  }

}

const apiClient = new ApiClient();

export const sendMessageToAgent = (content: string): Promise<AgentResponse> => {
  return apiClient.sendMessage(content);
};

export const getAgentMessages = (limit?: number, offset?: number): Promise<AgentResponse[]> => {
  return apiClient.getMessages(limit, offset);
};

export const getAgentInfo = () => {
  return apiClient.getAgentInfo();
};

// Remix Agent Exports
export const sendMessageToSpecificAgent = (agentName: string, content: string): Promise<AgentResponse> => {
  return apiClient.sendMessageToSpecificAgent(agentName, content);
};

export const getMessagesFromAgent = (agentName: string, limit?: number, offset?: number): Promise<AgentResponse[]> => {
  return apiClient.getMessagesFromAgent(agentName, limit, offset);
};

export const getHtmlFromAgent = (agentName: string): Promise<{ content: string; contentType: string; path: string; agent: string }> => {
  return apiClient.getHtmlFromAgent(agentName);
};

export const remixAgent = (parentAgentName: string, newAgentName: string): Promise<{ success: boolean; parentAgent: string; newAgent: string; agentData: unknown }> => {
  return apiClient.remixAgent(parentAgentName, newAgentName);
};

export const getAgentState = (agentName: string): Promise<{ state: string; [key: string]: unknown }> => {
  return apiClient.getAgentState(agentName);
};

export const wakeAgent = (agentName: string, prompt?: string): Promise<unknown> => {
  return apiClient.wakeAgent(agentName, prompt);
};

export const listAgents = (prefix: string, limit?: number, page?: number): Promise<{
  agents: Array<{
    name: string;
    created_by: string;
    state: string;
    description: string | null;
    parent_agent_name: string | null;
    created_at: string;
    last_activity_at: string | null;
    metadata: object;
    tags: string[];
  }>;
  total: number;
  page: number;
  pages: number;
  limit: number;
}> => {
  return apiClient.listAgents(prefix, limit, page);
};

