export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contacts: {
        Row: {
          created_at: string | null
          email: string
          handled: boolean | null
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          handled?: boolean | null
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          handled?: boolean | null
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          content_type: Database["public"]["Enums"]["content_type_enum"] | null
          created_at: string | null
          id: number
          meta: Json | null
          name: string
          slug: string | null
        }
        Insert: {
          content_type?: Database["public"]["Enums"]["content_type_enum"] | null
          created_at?: string | null
          id?: number
          meta?: Json | null
          name: string
          slug?: string | null
        }
        Update: {
          content_type?: Database["public"]["Enums"]["content_type_enum"] | null
          created_at?: string | null
          id?: number
          meta?: Json | null
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      pageviews: {
        Row: {
          content_type: Database["public"]["Enums"]["content_type_enum"] | null
          country: string | null
          created_at: string | null
          id: number
          path: string
          read_ms: number | null
          referrer: string | null
          scroll_pct: number | null
          slug: string | null
          user_hash: string
        }
        Insert: {
          content_type?: Database["public"]["Enums"]["content_type_enum"] | null
          country?: string | null
          created_at?: string | null
          id?: number
          path: string
          read_ms?: number | null
          referrer?: string | null
          scroll_pct?: number | null
          slug?: string | null
          user_hash: string
        }
        Update: {
          content_type?: Database["public"]["Enums"]["content_type_enum"] | null
          country?: string | null
          created_at?: string | null
          id?: number
          path?: string
          read_ms?: number | null
          referrer?: string | null
          scroll_pct?: number | null
          slug?: string | null
          user_hash?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          body_mdx: string
          cover_image: string | null
          created_at: string | null
          excerpt: string
          id: string
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          body_mdx: string
          cover_image?: string | null
          created_at?: string | null
          excerpt: string
          id?: string
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          body_mdx?: string
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string
          id?: string
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          headline: string
          id: string
          name: string
          role: string
          socials: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          headline: string
          id?: string
          name: string
          role: string
          socials?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          headline?: string
          id?: string
          name?: string
          role?: string
          socials?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          body_mdx: string
          cover_image: string | null
          created_at: string | null
          featured: boolean | null
          gallery: Json | null
          id: string
          live_url: string | null
          published_at: string | null
          repo_url: string | null
          slug: string
          stack: string[] | null
          summary: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          body_mdx: string
          cover_image?: string | null
          created_at?: string | null
          featured?: boolean | null
          gallery?: Json | null
          id?: string
          live_url?: string | null
          published_at?: string | null
          repo_url?: string | null
          slug: string
          stack?: string[] | null
          summary: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          body_mdx?: string
          cover_image?: string | null
          created_at?: string | null
          featured?: boolean | null
          gallery?: Json | null
          id?: string
          live_url?: string | null
          published_at?: string | null
          repo_url?: string | null
          slug?: string
          stack?: string[] | null
          summary?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_type_enum: "post" | "project" | "page"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_type_enum: ["post", "project", "page"],
    },
  },
} as const
