const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ChatMessage {
  session_id: string;
  message: string;
}

export interface ChatResponse {
  message: string;
  conversation_id: string;
  created_at: string;
}

export interface AnalyticsEvent {
  session_id: string;
  event_type: string;
  page_path?: string;
  section_name?: string;
  user_agent?: string;
  referrer?: string;
  device_type?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// Chat API
export const chatAPI = {
  sendMessage: async (data: ChatMessage): Promise<ChatResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  },
  
  getHistory: async (sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/chat/history/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }
    
    return response.json();
  },
};

// Analytics API
export const analyticsAPI = {
  trackEvent: async (event: AnalyticsEvent) => {
    try {
      await fetch(`${API_BASE_URL}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  },
  
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    return response.json();
  },
  
  getLiveVisitors: async () => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/visitors/live`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch live visitors');
    }
    
    return response.json();
  },
};

// Contact API
export const contactAPI = {
  submit: async (data: ContactFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/contact/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to submit form');
    }
    
    return response.json();
  },
};
