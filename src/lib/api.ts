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