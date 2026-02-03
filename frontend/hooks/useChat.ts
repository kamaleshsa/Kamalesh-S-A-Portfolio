import { useState, useEffect, useCallback } from 'react';
import { chatAPI, ChatResponse } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversation history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await chatAPI.getHistory(sessionId);
        setMessages(history);
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };

    loadHistory();
  }, [sessionId]);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response: ChatResponse = await chatAPI.sendMessage({
        session_id: sessionId,
        message: content,
      });

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        created_at: response.created_at,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (_err) {
      setError('Failed to send message. Please try again.');
      // Remove the user message on error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
