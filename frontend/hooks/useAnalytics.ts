import { useEffect, useCallback } from 'react';
import { analyticsAPI } from '@/lib/api';

// Generate or retrieve session ID
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  
  return sessionId;
};

export function useAnalytics() {
  const sessionId = getSessionId();

  const trackPageView = useCallback(async () => {
    if (typeof window === 'undefined') return;

    // Only track minimal page view - no extra metadata to save storage
    await analyticsAPI.trackEvent({
      session_id: sessionId,
      event_type: 'page_view',
      page_path: window.location.pathname,
      // Removed: section_name, user_agent, referrer, device_type
    });
  }, [sessionId]);

  // Track page view on mount
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return {
    trackPageView,
    sessionId,
  };
}
