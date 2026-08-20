'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Sparkles, ArrowDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '@/hooks/useChat';

const SUGGESTED_PROMPTS = [
  'What are Kamalesh\'s top skills?',
  'Tell me about recent projects',
  'What tech stack does he use?',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
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

  // Track scroll position for "scroll to bottom" button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue);
    setInputValue('');
  };

  const handlePromptClick = async (prompt: string) => {
    if (isLoading) return;
    await sendMessage(prompt);
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* ─────────── FLOATING TRIGGER BUTTON ─────────── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[100] group transition-all cursor-pointer duration-500 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open chat"
      >
        {/* Outer glow */}
        <div className="absolute -inset-3 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />

        {/* Button body */}
        <div className="relative p-4 bg-[#111] border border-white/15 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.8)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.08)] transition-all duration-500 hover:border-white/30 hover:scale-105 active:scale-95">
          <MessageCircle className="w-6 h-6 text-white/90" />
          
          {/* Live indicator */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
          </span>
        </div>
      </button>

      {/* ─────────── CHAT PANEL ─────────── */}
      <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-right ${
          isOpen 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-4 opacity-0 scale-[0.97] pointer-events-none'
        }`}
        style={{
          width: 'min(420px, calc(100vw - 2rem))',
          height: 'min(620px, calc(100vh - 4rem))',
        }}
      >
        <div className="h-full flex flex-col bg-[#0c0c0c] border border-white/[0.08] rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden">
          
          {/* ── HEADER ── */}
          <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            {/* Subtle top accent line */}
            <div className="absolute top-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="flex items-center gap-3.5">
              {/* AI Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-[18px] h-[18px] text-white/80" />
                </div>
                {/* Online Indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-[2.5px] border-[#0c0c0c] shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
              </div>
              
              <div>
                <h3 className="font-semibold text-white/95 text-[15px] tracking-tight leading-tight">Kamalesh AI</h3>
                <p className="text-[11px] text-white/35 font-medium tracking-wide mt-0.5">
                  Always online · Instant replies
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-1 text-white/30 hover:text-white/70 hover:bg-white/[0.06] rounded-xl transition-all duration-300 active:scale-90"
              aria-label="Close chat"
            >
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* ── MESSAGES ── */}
          <div 
            ref={messagesContainerRef}
            className="relative flex-1 overflow-y-auto px-5 py-5 space-y-5"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* Empty State */}
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center px-2">
                {/* Icon */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150" />
                  <div className="relative w-16 h-16 rounded-[22px] bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.08] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white/60" />
                  </div>
                </div>
                
                <h4 className="text-[17px] font-semibold text-white/90 mb-1.5 tracking-tight">How can I help?</h4>
                <p className="text-[13px] text-white/35 max-w-[240px] leading-relaxed mb-8">
                  Ask me about Kamalesh&apos;s skills, projects, experience, or anything else.
                </p>

                {/* Suggested Prompts */}
                <div className="w-full space-y-2">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full text-left px-4 py-3 text-[13px] text-white/60 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl transition-all duration-300 hover:text-white/80 active:scale-[0.98] group"
                    >
                      <span className="inline-block mr-2 text-white/20 group-hover:text-white/40 transition-colors">→</span>
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Sender label */}
                <span className={`text-[10px] font-medium uppercase tracking-[0.12em] mb-1.5 px-1 ${
                  message.role === 'user' ? 'text-white/25' : 'text-white/25'
                }`}>
                  {message.role === 'user' ? 'You' : 'AI'}
                </span>
                
                {/* Message bubble */}
                <div
                  className={`max-w-[82%] px-4 py-3 transition-all duration-200 overflow-hidden ${
                    message.role === 'user'
                      ? 'bg-white text-[#0c0c0c] rounded-[20px] rounded-tr-[6px] shadow-[0_2px_12px_rgba(255,255,255,0.06)]'
                      : 'bg-white/[0.05] text-white/85 rounded-[20px] rounded-tl-[6px] border border-white/[0.06]'
                  }`}
                >
                  <div className="text-[14px] leading-[1.6] break-words">
                    <ReactMarkdown 
                      components={{
                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="underline font-medium hover:opacity-80 transition-opacity break-all" style={{ color: message.role === 'user' ? '#2563eb' : '#60a5fa' }} />,
                        p: ({node, ...props}) => <p {...props} className="m-0 mb-2 last:mb-0 whitespace-pre-wrap break-words" />,
                        ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 m-0 space-y-1 my-2" />,
                        ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 m-0 space-y-1 my-2" />,
                        li: ({node, ...props}) => <li {...props} className="m-0" />,
                        strong: ({node, ...props}) => <strong {...props} className={`font-bold ${message.role === 'user' ? 'text-black' : 'text-white'}`} />,
                        h1: ({node, ...props}) => <h1 {...props} className={`font-bold text-lg mt-3 mb-2 ${message.role === 'user' ? 'text-black' : 'text-white'}`} />,
                        h2: ({node, ...props}) => <h2 {...props} className={`font-bold text-base mt-3 mb-2 ${message.role === 'user' ? 'text-black' : 'text-white'}`} />,
                        h3: ({node, ...props}) => <h3 {...props} className={`font-semibold text-[15px] mt-2 mb-1 ${message.role === 'user' ? 'text-black' : 'text-white'}`} />,
                        code: ({node, inline, ...props}: any) => inline 
                          ? <code {...props} className="px-1.5 py-0.5 rounded-md bg-white/10 font-mono text-[12px]" />
                          : <code {...props} className="block w-full overflow-x-auto p-3 bg-black/40 rounded-lg font-mono text-[12px] my-2" />
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Timestamp */}
                {message.created_at && (
                  <span className="text-[10px] text-white/20 mt-1 px-1 font-mono">
                    {formatTime(message.created_at)}
                  </span>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] mb-1.5 px-1 text-white/25">AI</span>
                <div className="bg-white/[0.05] px-5 py-4 rounded-[20px] rounded-tl-[6px] border border-white/[0.06]">
                  <div className="flex gap-[6px] items-center">
                    <div className="w-[7px] h-[7px] bg-white/40 rounded-full animate-[chatPulse_1.4s_ease-in-out_infinite]" />
                    <div className="w-[7px] h-[7px] bg-white/40 rounded-full animate-[chatPulse_1.4s_ease-in-out_0.2s_infinite]" />
                    <div className="w-[7px] h-[7px] bg-white/40 rounded-full animate-[chatPulse_1.4s_ease-in-out_0.4s_infinite]" />
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mx-auto px-4 py-3 bg-red-500/[0.08] border border-red-500/20 rounded-2xl max-w-[90%]">
                <p className="text-[13px] text-red-400 text-center">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to bottom */}
          {showScrollBtn && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-[90px] left-1/2 -translate-x-1/2 z-20 p-2 bg-[#0c0c0c] border border-white/10 rounded-full shadow-lg hover:bg-white/5 transition-all duration-300 hover:border-white/20"
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="w-4 h-4 text-white/50" />
            </button>
          )}

          {/* ── INPUT ── */}
          <div className="border-t border-white/[0.06] bg-[#0c0c0c]">
            <form onSubmit={handleSubmit} className="p-4">
              <div className="flex items-center gap-2 p-1.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl transition-all duration-300 focus-within:border-white/[0.15] focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_4px_rgba(255,255,255,0.02)]">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Message..."
                  className="flex-1 px-3.5 py-2.5 bg-transparent text-[14px] text-white placeholder-white/25 focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-white text-[#0c0c0c] rounded-[14px] transition-all duration-200 disabled:opacity-20 disabled:bg-white/30 hover:bg-white/90 active:scale-90 shadow-[0_2px_8px_rgba(255,255,255,0.08)]"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── KEYFRAME ANIMATIONS ── */}
      <style jsx global>{`
        @keyframes chatPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
