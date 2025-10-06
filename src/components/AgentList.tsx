'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { listAgents } from '@/lib/api';
import { ChevronDown, Bot, Loader, Plus } from 'lucide-react';

interface Agent {
  name: string;
  created_by: string;
  state: string;
  description: string | null;
  parent_agent_name: string | null;
  created_at: string;
  last_activity_at: string | null;
  metadata: object;
  tags: string[];
}

interface AgentDropdownProps {
  onSelectAgent: (agentName: string) => void;
  onCreateNewAgent: () => void;
  currentAgent?: string | null;
  baseAgentName?: string;
}

export default function AgentDropdown({ onSelectAgent, onCreateNewAgent, currentAgent, baseAgentName = 'lway-performance-overview' }: AgentDropdownProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadAgents = useCallback(async () => {
    try {
      setError(null);
      const { agents: agentList } = await listAgents(baseAgentName, 100, 1);

      // Sort agents to show base agent first, then by creation date
      const sortedAgents = agentList.sort((a, b) => {
        if (a.name === baseAgentName) return -1;
        if (b.name === baseAgentName) return 1;

        // Sort by creation date (newest first for non-base agents)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setAgents(sortedAgents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  }, [baseAgentName]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const getAgentDisplayName = (agent: Agent) => {
    if (agent.name === baseAgentName) {
      return 'Base Agent';
    }

    // Check if it has a description to use as display name
    if (agent.description && agent.description.trim()) {
      return agent.description;
    }

    // Extract number from agent name if it follows the pattern
    const match = agent.name.match(new RegExp(`${baseAgentName}-(\\d+)$`));
    if (match) {
      return `Agent #${match[1]}`;
    }

    return agent.name;
  };

  const getAgentStatusColor = (state: string) => {
    switch (state) {
      case 'idle':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'init':
        return 'bg-blue-100 text-blue-800';
      case 'slept':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  const handleSelectAgent = (agentName: string) => {
    onSelectAgent(agentName);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    onCreateNewAgent();
    setIsOpen(false);
  };

  const getCurrentAgentName = () => {
    if (!currentAgent) return 'Select Agent';

    const currentAgentData = agents.find(agent => agent.name === currentAgent);
    if (currentAgentData) {
      return getAgentDisplayName(currentAgentData);
    }

    return currentAgent === baseAgentName ? 'Base Agent' : currentAgent;
  };

  const isBaseAgent = (agentName: string) => agentName === baseAgentName;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[200px]"
        disabled={loading}
      >
        <Bot className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-900 truncate flex-1 text-left">
          {loading ? 'Loading...' : getCurrentAgentName()}
        </span>
        {loading ? (
          <Loader className="w-4 h-4 animate-spin text-gray-400" />
        ) : (
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && !loading && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-96 overflow-y-auto w-80">
          {error && (
            <div className="p-3 bg-red-50 border-b border-red-200">
              <p className="text-xs text-red-800">{error}</p>
            </div>
          )}

          <div className="py-1">
            {agents.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">No agents found</div>
            ) : (
              agents.map((agent) => (
                <button
                  key={agent.name}
                  onClick={() => handleSelectAgent(agent.name)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                    currentAgent === agent.name ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                  }`}
                >
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium truncate">
                        {getAgentDisplayName(agent)}
                      </span>
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${getAgentStatusColor(agent.state)}`}>
                        {agent.state}
                      </span>
                      {isBaseAgent(agent.name) && (
                        <span className="px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                          Original
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{agent.name}</p>
                  </div>
                </div>
              </button>
              ))
            )}

            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={handleCreateNew}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-900"
              >
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">Create New Remixed Agent</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}