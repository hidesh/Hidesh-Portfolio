export type ContentType = 'post' | 'project' | 'page';

export interface Profile {
  id: string;
  name: string;
  role: string;
  headline: string;
  socials: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body_mdx: string;
  tags: string[];
  repo_url?: string;
  live_url?: string;
  cover_image?: string;
  gallery?: Record<string, any>;
  stack: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body_mdx: string;
  cover_image?: string;
  tags: string[];
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  read_time?: number;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  handled: boolean;
}

export interface PageView {
  id: number;
  path: string;
  slug?: string;
  content_type?: ContentType;
  user_hash: string;
  country?: string;
  referrer?: string;
  read_ms?: number;
  scroll_pct?: number;
  created_at: string;
}

export interface Event {
  id: number;
  name: string;
  content_type?: ContentType;
  slug?: string;
  meta?: Record<string, any>;
  created_at: string;
}

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  averageReadTime: number;
  topCountries: Array<{ country: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  viewsOverTime: Array<{ date: string; views: number }>;
  contentPerformance: Array<{
    slug: string;
    title: string;
    views: number;
    uniqueViews: number;
    averageReadTime: number;
  }>;
}