'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { Message } from '@/types/chat';
import { sendMessageToSpecificAgent, remixAgent, listAgents, wakeAgent, getHtmlFromMarketAgent, getAgentState } from '@/lib/api';
import { Send, Copy, Download, Code, Eye } from 'lucide-react';
import AgentDropdown from '@/components/AgentList';

function MarketCanvasContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thinkingText, setThinkingText] = useState('Agent is thinking...');
  const [htmlContent, setHtmlContent] = useState('');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [sessionAgent, setSessionAgent] = useState<string | null>(null);
  const [isFirstMessage, setIsFirstMessage] = useState<boolean>(true);
  const [isLoadingHtml, setIsLoadingHtml] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const thinkingPhrases = [
      'Agent is thinking...',
      'Processing your request...',
      'Generating report...',
      'Working on it...',
      'Analyzing market data...',
      'Creating competitor analysis...'
    ];

    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setThinkingText(prev => {
          const currentIndex = thinkingPhrases.indexOf(prev);
          const nextIndex = (currentIndex + 1) % thinkingPhrases.length;
          return thinkingPhrases[nextIndex];
        });
      }, 1500);
    } else {
      setThinkingText('Agent is thinking...');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const loadHtmlFromAgent = async (agentName: string) => {
    try {
      setIsLoadingHtml(true);
      setError(null);
      console.log(`Loading HTML for agent: ${agentName}`);

      const htmlData = await getHtmlFromMarketAgent(agentName);

      console.log(`HTML loaded successfully, length: ${htmlData.content.length}`);
      console.log('HTML content preview:', htmlData.content.substring(0, 200));

      if (!htmlData.content || htmlData.content.trim() === '') {
        throw new Error('Empty HTML content received');
      }

      setHtmlContent(htmlData.content);
    } catch (err) {
      console.error('Failed to load HTML:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load HTML report';
      setError(errorMsg);
      setHtmlContent('');
    } finally {
      setIsLoadingHtml(false);
    }
  };

  useEffect(() => {
    const initializeBaseAgent = async () => {
      try {
        const agentData = await getAgentState('lway-market-competitors');
        // Only wake if agent is slept (not init, idle, or busy)
        if (agentData.state === 'slept') {
          console.log('Agent is sleeping, waking it up...');
          await wakeAgent('lway-market-competitors');
          // Wait a moment for agent to wake before loading HTML
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        await loadHtmlFromAgent('lway-market-competitors');
      } catch (err) {
        console.error('Failed to initialize base agent:', err);
        setError(err instanceof Error ? err.message : 'Failed to load base agent');
      }
    };

    initializeBaseAgent();
  }, []);

  const findNextAgentName = async (): Promise<string> => {
    const baseAgentName = 'lway-market-competitors';
    const { agents } = await listAgents(baseAgentName);

    let highestNumber = 0;
    agents.forEach((agent: { name: string }) => {
      const match = agent.name.match(/^lway-market-competitors-(\d+)$/);
      if (match) {
        const number = parseInt(match[1], 10);
        if (number > highestNumber) {
          highestNumber = number;
        }
      }
    });

    return `${baseAgentName}-${highestNumber + 1}`;
  };

  const createSessionAgent = async (): Promise<string> => {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const newAgentName = await findNextAgentName();
        console.log(`Creating new agent: ${newAgentName}`);

        await remixAgent('lway-market-competitors', newAgentName);
        console.log(`Agent created: ${newAgentName}`);

        // Newly remixed agents are in 'init' state and don't need waking
        setSessionAgent(newAgentName);
        setIsFirstMessage(false);

        await loadHtmlFromAgent(newAgentName);

        return newAgentName;
      } catch (err) {
        lastError = err;
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes('already exists') && attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }
        throw err;
      }
    }

    throw lastError;
  };

  const handleSubmit = async (messageText?: string) => {
    const finalMessage = messageText || input;
    if (!finalMessage.trim() || isLoading) return;

    // Generate a stable ID that won't cause hydration issues
    const timestamp = Date.now();
    const userMessage: Message = {
      id: `user-${timestamp}`,
      role: 'user',
      content: finalMessage.trim(),
      created_at: new Date(timestamp).toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      let targetAgent: string;

      // If this is the first message, create a session agent
      if (isFirstMessage) {
        targetAgent = await createSessionAgent();
      } else {
        // Use existing session agent for subsequent messages
        if (!sessionAgent) {
          throw new Error('Session agent not found. This should not happen.');
        }
        targetAgent = sessionAgent;
      }

      // Send message to the session agent
      const response = await sendMessageToSpecificAgent(targetAgent, finalMessage.trim());

      const agentMessage: Message = {
        id: response.id,
        role: response.role,
        content: response.content,
        metadata: response.metadata,
        created_at: response.created_at,
      };

      setMessages(prev => [...prev, agentMessage]);

      // Refresh HTML content from the agent
      await loadHtmlFromAgent(targetAgent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadHtmlFile = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lifeway_market_competitors_report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSelectAgent = async (agentName: string) => {
    console.log('Selecting agent:', agentName);
    setSessionAgent(agentName);
    setIsFirstMessage(false);
    setError(null);
    setMessages([]);
    setHtmlContent('');

    try {
      const agentData = await getAgentState(agentName);
      // Only wake if agent is slept (not init, idle, or busy)
      if (agentData.state === 'slept') {
        console.log('Agent is sleeping, waking it up...');
        await wakeAgent(agentName);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      await loadHtmlFromAgent(agentName);
      console.log('Successfully loaded HTML for agent:', agentName);
    } catch (err) {
      console.error('Error loading HTML for agent:', agentName, err);
      setError(err instanceof Error ? err.message : 'Failed to load HTML for selected agent');
    }
  };

  const handleCreateNewAgent = async () => {
    try {
      await createSessionAgent();
      setMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create new agent');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000721] via-[#1e293b] to-[#334155] p-6" suppressHydrationWarning>
      {/* Main Content - Split Screen */}
      <div className="h-[calc(100vh-3rem)] flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white/95 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl">
          <div className="flex-shrink-0 p-6 border-b border-white/20 overflow-visible relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full overflow-hidden">
                  <Image
                    src="https://avatars.githubusercontent.com/u/223376538?s=200&v=4"
                    alt="Remote Agent"
                    width={20}
                    height={20}
                    className="object-cover rounded-full"
                  />
                </div>
                <h2 className="text-lg font-semibold text-[#000721]">Discussion</h2>
              </div>
              <div className="flex items-center space-x-3">
                <AgentDropdown
                  onSelectAgent={handleSelectAgent}
                  onCreateNewAgent={handleCreateNewAgent}
                  currentAgent={sessionAgent}
                  baseAgentName="lway-market-competitors"
                />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={`${message.id}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start items-start space-x-2'}`}
              >
                {message.role === 'agent' && (
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden mt-1">
                    <Image
                      src="https://avatars.githubusercontent.com/u/223376538?s=200&v=4"
                      alt="Agent"
                      width={24}
                      height={24}
                      className="object-cover rounded-full"
                    />
                  </div>
                )}
                <div className={`max-w-[80%] px-3 py-2 relative group ${
                  message.role === 'user'
                    ? 'bg-[#000721] text-white rounded-2xl rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {message.role === 'agent' && (
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                    >
                      <Copy className="w-3 h-3 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-start space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden mt-1">
                  <Image
                    src="https://avatars.githubusercontent.com/u/223376538?s=200&v=4"
                    alt="Agent"
                    width={24}
                    height={24}
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#000721] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#000721] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-2 h-2 bg-[#000721] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                    <span className="text-sm text-gray-700">{thinkingText}</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 p-6 border-t border-white/20">
            <form onSubmit={handleFormSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the report or request changes..."
                disabled={isLoading}
                className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#000721]/50 focus:border-[#000721]/50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all shadow-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-[#000721] text-white rounded-xl hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#000721]/50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[50px]"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel - HTML Canvas */}
        <div className="w-full lg:w-2/3 flex flex-col bg-white/95 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl">
          <div className="flex-shrink-0 p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#000721]">HTML Report</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={downloadHtmlFile}
                  className="px-3 py-1 bg-[#000721] text-white hover:bg-[#1e293b] rounded-md text-sm transition-all"
                >
                  <Download className="w-4 h-4 inline mr-1" />
                  Download
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    viewMode === 'preview'
                      ? 'bg-[#000721] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    viewMode === 'code'
                      ? 'bg-[#000721] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Code className="w-4 h-4 inline mr-1" />
                  Code
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {viewMode === 'code' ? (
              <div className="p-6 h-full">
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="w-full h-full p-4 bg-white border border-white/20 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#000721]/50 focus:border-[#000721]/50 shadow-inner"
                  placeholder="HTML content will appear here..."
                />
              </div>
            ) : (
              <div className="h-full p-6">
                <div className="h-full bg-white rounded-lg border border-white/20 shadow-inner relative">
                  {isLoadingHtml ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500">Loading report...</div>
                    </div>
                  ) : htmlContent ? (
                    <iframe
                      srcDoc={htmlContent}
                      className="w-full h-full border-0 rounded-lg"
                      title="Report Preview"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500">No report available</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketCanvasPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading Canvas...</div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading Canvas...</div>
      </div>
    }>
      <MarketCanvasContent />
    </Suspense>
  );
}
