export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          role: string
          headline: string
          socials: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          headline: string
          socials?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          headline?: string
          socials?: Json
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          slug: string
          title: string
          summary: string
          body_mdx: string
          tags: string[]
          repo_url: string | null
          live_url: string | null
          cover_image: string | null
          gallery: Json | null
          stack: string[]
          featured: boolean
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          summary: string
          body_mdx: string
          tags?: string[]
          repo_url?: string | null
          live_url?: string | null
          cover_image?: string | null
          gallery?: Json | null
          stack?: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          summary?: string
          body_mdx?: string
          tags?: string[]
          repo_url?: string | null
          live_url?: string | null
          cover_image?: string | null
          gallery?: Json | null
          stack?: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string
          body_mdx: string
          cover_image: string | null
          tags: string[]
          author_id: string
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt: string
          body_mdx: string
          cover_image?: string | null
          tags?: string[]
          author_id: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string
          body_mdx?: string
          cover_image?: string | null
          tags?: string[]
          author_id?: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
          handled: boolean
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
          handled?: boolean
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
          handled?: boolean
        }
      }
      pageviews: {
        Row: {
          id: number
          path: string
          slug: string | null
          content_type: 'post' | 'project' | 'page' | null
          user_hash: string
          country: string | null
          referrer: string | null
          read_ms: number | null
          scroll_pct: number | null
          created_at: string
        }
        Insert: {
          id?: number
          path: string
          slug?: string | null
          content_type?: 'post' | 'project' | 'page' | null
          user_hash: string
          country?: string | null
          referrer?: string | null
          read_ms?: number | null
          scroll_pct?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          path?: string
          slug?: string | null
          content_type?: 'post' | 'project' | 'page' | null
          user_hash?: string
          country?: string | null
          referrer?: string | null
          read_ms?: number | null
          scroll_pct?: number | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: number
          name: string
          content_type: 'post' | 'project' | 'page' | null
          slug: string | null
          meta: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          content_type?: 'post' | 'project' | 'page' | null
          slug?: string | null
          meta?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          content_type?: 'post' | 'project' | 'page' | null
          slug?: string | null
          meta?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_type_enum: 'post' | 'project' | 'page'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}