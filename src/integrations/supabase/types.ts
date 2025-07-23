export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          performance_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          performance_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          performance_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_performance_id_fkey"
            columns: ["performance_id"]
            isOneToOne: false
            referencedRelation: "performances"
            referencedColumns: ["id"]
          },
        ]
      }
      duet_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          recipient_id: string
          requester_id: string
          song_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          recipient_id: string
          requester_id: string
          song_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          recipient_id?: string
          requester_id?: string
          song_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "duet_requests_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      leaderboards: {
        Row: {
          category: string
          created_at: string
          id: string
          period_end: string | null
          period_start: string | null
          rank: number | null
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          rank?: number | null
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          rank?: number | null
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          performance_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          performance_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          performance_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_performance_id_fkey"
            columns: ["performance_id"]
            isOneToOne: false
            referencedRelation: "performances"
            referencedColumns: ["id"]
          },
        ]
      }
      live_rooms: {
        Row: {
          created_at: string
          current_participants: number | null
          description: string | null
          host_id: string
          id: string
          is_active: boolean | null
          is_public: boolean | null
          max_participants: number | null
          room_code: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          host_id: string
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_participants?: number | null
          room_code?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          host_id?: string
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_participants?: number | null
          room_code?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      performances: {
        Row: {
          audio_url: string
          comment_count: number | null
          created_at: string
          duet_partner_id: string | null
          id: string
          is_duet: boolean | null
          is_public: boolean | null
          like_count: number | null
          pitch_accuracy: number | null
          score: number | null
          song_id: string
          thumbnail_url: string | null
          timing_accuracy: number | null
          title: string | null
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          audio_url: string
          comment_count?: number | null
          created_at?: string
          duet_partner_id?: string | null
          id?: string
          is_duet?: boolean | null
          is_public?: boolean | null
          like_count?: number | null
          pitch_accuracy?: number | null
          score?: number | null
          song_id: string
          thumbnail_url?: string | null
          timing_accuracy?: number | null
          title?: string | null
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          audio_url?: string
          comment_count?: number | null
          created_at?: string
          duet_partner_id?: string | null
          id?: string
          is_duet?: boolean | null
          is_public?: boolean | null
          like_count?: number | null
          pitch_accuracy?: number | null
          score?: number | null
          song_id?: string
          thumbnail_url?: string | null
          timing_accuracy?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "performances_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          followers_count: number | null
          following_count: number | null
          id: string
          is_verified: boolean | null
          location: string | null
          total_performances: number | null
          total_score: number | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          total_performances?: number | null
          total_score?: number | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          total_performances?: number | null
          total_score?: number | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      room_participants: {
        Row: {
          id: string
          is_host: boolean | null
          joined_at: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_host?: boolean | null
          joined_at?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_host?: boolean | null
          joined_at?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "live_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          album: string | null
          artist: string
          audio_url: string
          cover_image_url: string | null
          created_at: string
          difficulty_level: number | null
          duration: number
          genre: string | null
          id: string
          is_featured: boolean | null
          lyrics: string | null
          play_count: number | null
          title: string
          updated_at: string
        }
        Insert: {
          album?: string | null
          artist: string
          audio_url: string
          cover_image_url?: string | null
          created_at?: string
          difficulty_level?: number | null
          duration: number
          genre?: string | null
          id?: string
          is_featured?: boolean | null
          lyrics?: string | null
          play_count?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          album?: string | null
          artist?: string
          audio_url?: string
          cover_image_url?: string | null
          created_at?: string
          difficulty_level?: number | null
          duration?: number
          genre?: string | null
          id?: string
          is_featured?: boolean | null
          lyrics?: string | null
          play_count?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "verified_artist" | "user"
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
      app_role: ["admin", "moderator", "verified_artist", "user"],
    },
  },
} as const
