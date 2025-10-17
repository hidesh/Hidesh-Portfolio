// Real-time analytics system for portfolio
import { createClient } from '@/lib/supabase/client';

export interface AnalyticsEvent {
  id?: string;
  event_type: 'page_view' | 'project_click' | 'contact_form' | 'resume_download';
  page_path: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  device_type?: 'desktop' | 'mobile' | 'tablet';
  created_at?: string;
  session_id?: string;
}

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  topPages: Array<{ page: string; views: number }>;
  topCountries: Array<{ country: string; visitors: number }>;
  deviceTypes: Array<{ type: string; count: number }>;
  recentEvents: AnalyticsEvent[];
  dailyViews: Array<{ date: string; views: number }>;
}

class AnalyticsService {
  private supabase = createClient();
  private sessionId: string = '';

  constructor() {
    // Only initialize session ID on client side
    if (typeof window !== 'undefined') {
      this.sessionId = this.getOrCreateSessionId();
    }
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  async trackPageView(path: string): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Ensure session ID is set
      if (!this.sessionId) {
        this.sessionId = this.getOrCreateSessionId();
      }

      const event: AnalyticsEvent = {
        event_type: 'page_view',
        page_path: path,
        user_agent: navigator?.userAgent || 'Unknown',
        referrer: document?.referrer || undefined,
        device_type: this.detectDeviceType(),
        session_id: this.sessionId,
      };

      await this.supabase
        .from('analytics_events')
        .insert([event]);
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  async trackEvent(eventType: AnalyticsEvent['event_type'], path: string, metadata?: Record<string, any>): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const event: AnalyticsEvent = {
        event_type: eventType,
        page_path: path,
        user_agent: navigator.userAgent,
        session_id: this.sessionId,
        ...metadata,
      };

      await this.supabase
        .from('analytics_events')
        .insert([event]);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  async getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);

      // Get all events from the specified period
      const { data: events, error } = await this.supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', dateThreshold.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the data
      const pageViews = events?.filter(e => e.event_type === 'page_view') || [];
      const uniqueSessions = new Set(pageViews.map(e => e.session_id)).size;

      // Top pages
      const pageViewCounts = pageViews.reduce((acc, event) => {
        acc[event.page_path] = (acc[event.page_path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topPages = Object.entries(pageViewCounts)
        .map(([page, views]) => ({ page, views: views as number }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Device types
      const deviceCounts = pageViews.reduce((acc, event) => {
        const device = event.device_type || 'unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const deviceTypes = Object.entries(deviceCounts)
        .map(([type, count]) => ({ type, count: count as number }));

      // Daily views for the chart
      const dailyViewsMap = pageViews.reduce((acc, event) => {
        const date = new Date(event.created_at!).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dailyViews = Object.entries(dailyViewsMap)
        .map(([date, views]) => ({ date, views: views as number }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return {
        totalViews: pageViews.length,
        uniqueVisitors: uniqueSessions,
        topPages,
        topCountries: [], // Will implement with IP geolocation if needed
        deviceTypes,
        recentEvents: events?.slice(0, 50) || [],
        dailyViews,
      };
    } catch (error) {
      console.error('Failed to get analytics data:', error);
      // Return fallback data
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        topPages: [],
        topCountries: [],
        deviceTypes: [],
        recentEvents: [],
        dailyViews: [],
      };
    }
  }

  private detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop';
    
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/tablet|ipad|playbook|silk/.test(userAgent)) {
      return 'tablet';
    }
    
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/.test(userAgent)) {
      return 'mobile';
    }
    
    return 'desktop';
  }

  // Method to create the analytics table if it doesn't exist
  async initializeAnalyticsTable(): Promise<void> {
    try {
      // This would typically be done in Supabase dashboard or migration
      // Here for reference of the table structure needed:
      /*
      CREATE TABLE analytics_events (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        event_type VARCHAR NOT NULL,
        page_path VARCHAR NOT NULL,
        user_agent TEXT,
        referrer VARCHAR,
        country VARCHAR,
        city VARCHAR,
        device_type VARCHAR,
        session_id VARCHAR,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
      CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
      CREATE INDEX idx_analytics_events_page_path ON analytics_events(page_path);
      */
    } catch (error) {
      console.error('Failed to initialize analytics table:', error);
    }
  }
}

export const analytics = new AnalyticsService();

// Hook for React components
export function useAnalytics() {
  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
  };
}