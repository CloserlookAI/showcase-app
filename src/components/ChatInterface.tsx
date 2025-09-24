'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
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

  const handleSubmit = async (messageText?: string) => {
    const finalMessage = messageText || input;
    if (!finalMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now() + Math.random(), // Ensure uniqueness
      role: 'user',
      content: finalMessage.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Send message and wait for the final agent response (API handles all polling)
      const response = await sendMessageToAgent(finalMessage.trim());

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleExampleClick = (exampleText: string) => {
    setInput(exampleText);
    handleSubmit(exampleText);
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col h-screen w-full">
        {/* Header */}
        <div className="flex-shrink-0 bg-white/15 backdrop-blur-md border-b border-white/30 shadow-lg px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                  Remote Agent
                </h1>
                <p className="text-sm text-white/90 font-medium">
                  Enterprise AI Assistant • Secure • Scalable
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="px-3 py-1.5 bg-green-500/20 rounded-full border border-green-400/30">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-100">Online</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 relative z-0">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-white/20 mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <h3 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                Welcome to Remote Agent
              </h3>
              <p className="text-white/90 max-w-2xl text-lg leading-relaxed mb-10">
                Your enterprise-grade AI assistant is ready to help with business intelligence, data analysis, automation, and strategic insights.
              </p>

              {/* Example Prompts */}
              <div className="max-w-4xl w-full mb-8">
                <h4 className="text-xl font-semibold text-white/95 mb-6 text-left">Try asking me about:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleExampleClick("Give me an overview of Lifeway's performance over the last year")}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/30 hover:border-white/50 transition-all duration-300 cursor-pointer text-left group"
                    disabled={isLoading}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1 text-sm">Performance Overview</h5>
                        <p className="text-white/80 text-sm leading-relaxed">&quot;Give me an overview of Lifeway&apos;s performance over the last year&quot;</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExampleClick("How do Lifeway's margins compare to its competitors?")}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/30 hover:border-white/50 transition-all duration-300 cursor-pointer text-left group"
                    disabled={isLoading}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1 text-sm">Competitive Analysis</h5>
                        <p className="text-white/80 text-sm leading-relaxed">&quot;How do Lifeway&apos;s margins compare to its competitors?&quot;</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExampleClick("Please summarize recent news coverage")}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/30 hover:border-white/50 transition-all duration-300 cursor-pointer text-left group"
                    disabled={isLoading}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1 text-sm">News Summary</h5>
                        <p className="text-white/80 text-sm leading-relaxed">&quot;Please summarize recent news coverage&quot;</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExampleClick("What trends in the dairy and health food sector should I be aware of?")}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/30 hover:border-white/50 transition-all duration-300 cursor-pointer text-left group"
                    disabled={isLoading}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1 text-sm">Industry Trends</h5>
                        <p className="text-white/80 text-sm leading-relaxed">&quot;What trends in the dairy and health food sector should I be aware of?&quot;</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Market Intelligence</h4>
                  <p className="text-white/60 text-sm">Real-time market data and competitive analysis</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Verified Insights</h4>
                  <p className="text-white/60 text-sm">Accurate financial data and trend analysis</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Strategic Guidance</h4>
                  <p className="text-white/60 text-sm">Actionable recommendations for business growth</p>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`${message.id}-${index}`}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}
            >
              <div className={`flex items-start space-x-4 max-w-md lg:max-w-3xl ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 ring-2 ring-white/20'
                    : 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 ring-2 ring-white/20'
                }`}>
                  {message.role === 'user' ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div
                  className={`px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-slate-700/90 via-slate-800/90 to-slate-900/90 text-white rounded-tr-md border border-white/10'
                      : 'bg-white/90 text-gray-800 rounded-tl-md border border-white/50'
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                  </div>

                  <div className={`flex items-center justify-between mt-3 pt-2 border-t ${
                    message.role === 'user'
                      ? 'border-white/10 text-gray-300'
                      : 'border-gray-200/50 text-gray-500'
                  }`}>
                    <p className="text-xs font-medium">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {message.role === 'agent' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Delivered</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-in slide-in-from-bottom duration-300">
              <div className="flex items-start space-x-4 max-w-md lg:max-w-3xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-white/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-md px-5 py-4 shadow-lg border border-white/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{thinkingText}</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200/50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-600 font-medium">Processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center animate-in slide-in-from-bottom duration-300">
              <div className="bg-red-50/90 backdrop-blur-sm border border-red-200/60 rounded-2xl px-6 py-4 max-w-2xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-800">Connection Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 bg-white/15 backdrop-blur-md border-t border-white/30 px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleFormSubmit} className="flex space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your enterprise AI assistant..."
                  disabled={isLoading}
                  className="w-full bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 border border-white/50 rounded-2xl pl-12 pr-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:bg-gray-100/60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg font-medium"
                />
                {input && (
                  <div className="absolute inset-y-0 right-16 flex items-center">
                    <div className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-1">
                      {input.length}/1000
                    </div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-2xl hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 shadow-lg font-semibold flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </form>
            <div className="flex items-center justify-between mt-3 text-xs text-white/70">
              <div className="flex items-center space-x-4">
                <span>Enterprise AI Assistant</span>
                <span>•</span>
                <span>Secure & Private</span>
              </div>
              <span>Press Enter to send</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}