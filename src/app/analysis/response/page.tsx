'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Message } from '@/types/chat';
import { sendMessageToAgent } from '@/lib/api';
import { ArrowLeft, Send, Copy, Download, Share } from 'lucide-react';

function ResponsePageContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thinkingText, setThinkingText] = useState('Agent is thinking...');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('query');

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

  // Auto-send initial query when component mounts
  useEffect(() => {
    if (query && messages.length === 0 && !isLoading) {
      const userMessage: Message = {
        id: Date.now() + Math.random().toString(),
        role: 'user',
        content: query.trim(),
        created_at: new Date().toISOString(),
      };

      setMessages([userMessage]);
      setIsLoading(true);
      setError(null);

      sendMessageToAgent(query.trim())
        .then(response => {
          const agentMessage: Message = {
            id: response.id,
            role: response.role,
            content: response.content,
            metadata: response.metadata,
            created_at: response.created_at,
          };
          setMessages(prev => [...prev, agentMessage]);
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : 'Failed to send message');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [query, isLoading, messages.length]);

  const handleSubmit = async (messageText?: string) => {
    const finalMessage = messageText || input;
    if (!finalMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now() + Math.random().toString(),
      role: 'user',
      content: finalMessage.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#000721]" />
            </button>
            <div className="w-10 h-10 bg-[#000721]/10 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src="https://avatars.githubusercontent.com/u/223376538?s=200&v=4"
                alt="Remote Agent"
                width={40}
                height={40}
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#000721]">Remote Agent Response</h1>
              <p className="text-gray-600">AI-powered analysis results • {query ? `Working on: "${query}"` : 'Continue your conversation'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
              Active Session
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="https://avatars.githubusercontent.com/u/223376538?s=200&v=4"
                alt="Remote Agent"
                width={24}
                height={24}
                className="object-cover rounded-full"
              />
            </div>
            <span>Analysis Conversation</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            Continue your conversation with the remote agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/80 backdrop-blur-sm rounded-lg border border-gray-200">
                {messages.map((message, index) => (
                  <div
                    key={`${message.id}-${index}`}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start items-start space-x-2'}`}
                  >
                    {message.role === 'agent' && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden mt-1">
                        <Image
                          src="https://avatars.githubusercontent.com/u/223376538?s=200&v=4"
                          alt="Agent"
                          width={32}
                          height={32}
                          className="object-cover rounded-full"
                        />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-3 py-2 relative group ${
                      message.role === 'user'
                        ? 'bg-[#000721] text-white rounded-2xl rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-200 shadow-sm'
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
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                        >
                          <Copy className="w-3 h-3 text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start items-start space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden mt-1">
                      <Image
                        src="https://avatars.githubusercontent.com/u/223376538?s=200&v=4"
                        alt="Agent"
                        width={32}
                        height={32}
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-sm px-3 py-2 max-w-[80%]">
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
            <div className="mt-4">
              <form onSubmit={handleFormSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Continue the conversation..."
                  disabled={isLoading}
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#000721]/50 focus:border-[#000721]/50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-[#000721] text-white rounded-xl hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#000721]/50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
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
          </CardContent>
        </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          <span className="text-sm">Export Chat</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 transition-colors shadow-sm">
          <Share className="w-4 h-4" />
          <span className="text-sm">Share Analysis</span>
        </button>
      </div>
    </div>
  );
}

export default function ResponsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>}>
      <ResponsePageContent />
    </Suspense>
  );
}