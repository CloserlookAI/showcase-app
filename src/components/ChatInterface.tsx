'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, AgentResponse } from '@/types/chat';
import { sendMessageToAgent } from '@/lib/api';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thinkingText, setThinkingText] = useState('Agent is thinking...');
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
      'Computing response...',
      'Working on it...',
      'Gathering information...',
      'Executing remote tasks...'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now() + Math.random(), // Ensure uniqueness
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Send message and wait for the final agent response (API handles all polling)
      const response = await sendMessageToAgent(input.trim());

      const agentMessage: Message = {
        id: response.id,
        role: response.role,
        content: response.content,
        metadata: response.metadata,
        created_at: response.created_at,
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col h-screen w-full">
        {/* Header */}
        <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border-b border-white/20 shadow-sm px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">RA</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Remote Agent
              </h1>
              <p className="text-sm text-white/80">
                Your intelligent data agent is ready to help
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-800 rounded-full flex items-center justify-center mb-6">
                <span className="text-white text-2xl font-bold">RA</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Welcome to Remote Agent</h3>
              <p className="text-white/80 max-w-md">
                Start a conversation with your remote AI agent. I can help with data analysis, automation, coding, and remote task execution!
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`${message.id}-${index}`}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}
            >
              <div className={`flex items-start space-x-3 max-w-md lg:max-w-2xl ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800'
                    : 'bg-gradient-to-r from-slate-600 to-slate-700'
                }`}>
                  <span className="text-white text-xs font-semibold">
                    {message.role === 'user' ? 'U' : 'A'}
                  </span>
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-tr-sm'
                      : 'bg-white/80 backdrop-blur-sm text-gray-800 rounded-tl-sm border border-white/40'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-in slide-in-from-bottom duration-300">
              <div className="flex items-start space-x-3 max-w-md lg:max-w-2xl">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">A</span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-white/40">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">{thinkingText}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center animate-in slide-in-from-bottom duration-300">
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-2xl px-4 py-3 max-w-md shadow-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500 font-bold">X</span>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border-t border-white/20 px-6 py-4">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="w-full bg-gray-800/90 text-white placeholder-gray-400 backdrop-blur-sm border border-gray-600/60 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 disabled:bg-gray-700/60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 shadow-sm font-medium"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}