'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Sparkles } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Generate session ID
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('chat_session_id');
      if (!id) {
        id = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chat_session_id', id);
      }
      return id;
    }
    return '';
  });

  const { messages, isLoading, error, sendMessage } = useChat(sessionId);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[100] group transition-all cursor-pointer duration-500 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open chat"
      >
        {/* Animated glow ring */}
        <div className="absolute -inset-2 bg-gradient-to-r from-white/20 via-gray-300/20 to-white/20 rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 animate-pulse" />
        
        {/* Button */}
        <div className="relative p-4 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] border border-white/30 rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-110 hover:border-white/50">
          <MessageCircle className="w-7 h-7 text-white group-hover:text-gray-300 transition-colors" />
          
          {/* Notification dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-br from-white to-gray-300"></span>
          </span>
        </div>
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-4 right-4 z-[100] transition-all duration-700 ease-out ${
          isOpen 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          width: 'min(380px, calc(100vw - 2rem))',
          height: 'min(550px, calc(100vh - 2rem))',
          maxHeight: 'calc(100vh - 2rem)'
        }}
      >
        {/* Main Container */}
        <div className="h-full m-2 sm:m-4 flex flex-col bg-gradient-to-br from-[#0a0a0a]/98 via-[#0f0f0f]/98 to-[#0a0a0a]/98 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Animated border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse pointer-events-none rounded-3xl" />
          
          {/* Header */}
          <div className="relative flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-[#0f0f0f]/50 to-transparent backdrop-blur-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* AI Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/40 blur-xl rounded-full animate-pulse" />
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-white to-gray-300 rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg">Ask about Kamalesh</h3>
                <p className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  AI Assistant
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in duration-700">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-white/20 to-gray-300/20 rounded-full flex items-center justify-center border border-white/30">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Hi there! 👋</h4>
                <p className="text-sm text-gray-400 max-w-xs">Ask me anything about Kamalesh&apos;s skills, projects, or experience!</p>
              </div>
            )}

            {messages.map((message, idx) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-500`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-white to-gray-300 rounded-full flex items-center justify-center shadow-lg shadow-white/30">
                    <Sparkles className="w-4 h-4 text-black" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-white/30 to-gray-300/30 text-white border border-white/30 shadow-lg shadow-white/10 rounded-br-sm'
                      : 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#0f0f0f]/80 text-gray-100 border border-white/10 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border border-gray-600 shadow-lg">
                    <span className="text-xs font-bold text-gray-300">You</span>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start animate-in slide-in-from-bottom-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-white to-gray-300 rounded-full flex items-center justify-center shadow-lg shadow-white/30">
                  <Sparkles className="w-4 h-4 text-black animate-pulse" />
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#0f0f0f]/80 px-4 py-3 rounded-2xl border border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center p-4 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-in fade-in">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-5 border-t border-white/10 bg-gradient-to-r from-[#0a0a0a]/50 to-[#0f0f0f]/50 backdrop-blur-sm">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about Kamalesh..."
                className="flex-1 px-5 py-3.5 bg-[#0a0a0a]/60 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 backdrop-blur-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-5 py-3.5 bg-gradient-to-br from-white to-gray-200 text-black rounded-2xl hover:from-gray-100 hover:to-gray-300 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg shadow-white/30 border border-white/30 font-medium"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
