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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_outputs: {
        Row: {
          brand_id: string
          campaign_id: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          output_type: string | null
          preview: string | null
          task_id: string | null
          tool_name: string
        }
        Insert: {
          brand_id: string
          campaign_id?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          output_type?: string | null
          preview?: string | null
          task_id?: string | null
          tool_name: string
        }
        Update: {
          brand_id?: string
          campaign_id?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          output_type?: string | null
          preview?: string | null
          task_id?: string | null
          tool_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_outputs_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_outputs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_outputs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          approvable_id: string
          approvable_type: Database["public"]["Enums"]["approvable_type"]
          comment: string | null
          created_at: string
          id: string
          reviewer_id: string | null
          status: Database["public"]["Enums"]["approval_status"]
        }
        Insert: {
          approvable_id: string
          approvable_type: Database["public"]["Enums"]["approvable_type"]
          comment?: string | null
          created_at?: string
          id?: string
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
        }
        Update: {
          approvable_id?: string
          approvable_type?: Database["public"]["Enums"]["approvable_type"]
          comment?: string | null
          created_at?: string
          id?: string
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
        }
        Relationships: []
      }
      brands: {
        Row: {
          accent: string
          canon: string
          channels: string[]
          character: string
          created_at: string
          framework: string
          id: string
          is_experiment: boolean
          mode: string
          name: string
          payment: string
          short: string
          stage: string
          tagline: string
          url: string | null
        }
        Insert: {
          accent?: string
          canon?: string
          channels?: string[]
          character?: string
          created_at?: string
          framework?: string
          id: string
          is_experiment?: boolean
          mode?: string
          name: string
          payment?: string
          short: string
          stage?: string
          tagline?: string
          url?: string | null
        }
        Update: {
          accent?: string
          canon?: string
          channels?: string[]
          character?: string
          created_at?: string
          framework?: string
          id?: string
          is_experiment?: boolean
          mode?: string
          name?: string
          payment?: string
          short?: string
          stage?: string
          tagline?: string
          url?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          audience: string | null
          brand_id: string
          channels: string[]
          content_pillars: string[]
          created_at: string
          crm_segments: string[]
          end_date: string | null
          id: string
          linked_campaign_id: string | null
          name: string
          objective: string | null
          offer_angle: string | null
          owner_id: string | null
          seo_targets: string[]
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          updated_at: string
        }
        Insert: {
          audience?: string | null
          brand_id: string
          channels?: string[]
          content_pillars?: string[]
          created_at?: string
          crm_segments?: string[]
          end_date?: string | null
          id?: string
          linked_campaign_id?: string | null
          name: string
          objective?: string | null
          offer_angle?: string | null
          owner_id?: string | null
          seo_targets?: string[]
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
        }
        Update: {
          audience?: string | null
          brand_id?: string
          channels?: string[]
          content_pillars?: string[]
          created_at?: string
          crm_segments?: string[]
          end_date?: string | null
          id?: string
          linked_campaign_id?: string | null
          name?: string
          objective?: string | null
          offer_angle?: string | null
          owner_id?: string | null
          seo_targets?: string[]
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_linked_campaign_id_fkey"
            columns: ["linked_campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      content_briefs: {
        Row: {
          author_id: string | null
          brand_id: string
          brief_text: string | null
          campaign_id: string | null
          content_type: string | null
          created_at: string
          draft_text: string | null
          id: string
          platform: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["content_brief_status"]
          task_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          brand_id: string
          brief_text?: string | null
          campaign_id?: string | null
          content_type?: string | null
          created_at?: string
          draft_text?: string | null
          id?: string
          platform?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["content_brief_status"]
          task_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          brand_id?: string
          brief_text?: string | null
          campaign_id?: string | null
          content_type?: string | null
          created_at?: string
          draft_text?: string | null
          id?: string
          platform?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["content_brief_status"]
          task_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_briefs_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_briefs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_briefs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_journeys: {
        Row: {
          brand_id: string
          campaign_id: string | null
          created_at: string
          id: string
          journey_type: string | null
          message_draft: string | null
          name: string
          owner_id: string | null
          segment: string | null
          status: Database["public"]["Enums"]["crm_journey_status"]
          task_id: string | null
          updated_at: string
        }
        Insert: {
          brand_id: string
          campaign_id?: string | null
          created_at?: string
          id?: string
          journey_type?: string | null
          message_draft?: string | null
          name: string
          owner_id?: string | null
          segment?: string | null
          status?: Database["public"]["Enums"]["crm_journey_status"]
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          brand_id?: string
          campaign_id?: string | null
          created_at?: string
          id?: string
          journey_type?: string | null
          message_draft?: string | null
          name?: string
          owner_id?: string | null
          segment?: string | null
          status?: Database["public"]["Enums"]["crm_journey_status"]
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_journeys_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_journeys_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_journeys_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      seo_briefs: {
        Row: {
          brand_id: string
          brief_text: string | null
          campaign_id: string | null
          created_at: string
          id: string
          keyword_cluster: string | null
          owner_id: string | null
          status: Database["public"]["Enums"]["seo_brief_status"]
          target_page: string | null
          task_id: string | null
          updated_at: string
        }
        Insert: {
          brand_id: string
          brief_text?: string | null
          campaign_id?: string | null
          created_at?: string
          id?: string
          keyword_cluster?: string | null
          owner_id?: string | null
          status?: Database["public"]["Enums"]["seo_brief_status"]
          target_page?: string | null
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          brand_id?: string
          brief_text?: string | null
          campaign_id?: string | null
          created_at?: string
          id?: string
          keyword_cluster?: string | null
          owner_id?: string | null
          status?: Database["public"]["Enums"]["seo_brief_status"]
          target_page?: string | null
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_briefs_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_briefs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_briefs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_id: string | null
          blocker_note: string | null
          brand_id: string
          campaign_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
          workflow_type: Database["public"]["Enums"]["workflow_type"]
        }
        Insert: {
          assignee_id?: string | null
          blocker_note?: string | null
          brand_id: string
          campaign_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
          workflow_type?: Database["public"]["Enums"]["workflow_type"]
        }
        Update: {
          assignee_id?: string | null
          blocker_note?: string | null
          brand_id?: string
          campaign_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
          workflow_type?: Database["public"]["Enums"]["workflow_type"]
        }
        Relationships: [
          {
            foreignKeyName: "tasks_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "head_of_marketing"
        | "brand_manager"
        | "content_lead"
        | "crm_lead"
        | "seo_lead"
        | "contributor"
        | "approver"
      approvable_type: "content_brief" | "crm_journey" | "campaign"
      approval_status: "pending" | "approved" | "rejected" | "changes_requested"
      campaign_status:
        | "strategy"
        | "planning"
        | "production"
        | "review"
        | "published"
        | "learning"
      content_brief_status:
        | "idea"
        | "briefed"
        | "drafting"
        | "in_review"
        | "approved"
        | "scheduled"
        | "published"
        | "measured"
      crm_journey_status:
        | "segment_defined"
        | "journey_mapped"
        | "message_drafted"
        | "in_review"
        | "approved"
        | "sending"
        | "sent"
        | "measured"
      seo_brief_status:
        | "research"
        | "briefed"
        | "optimizing"
        | "in_review"
        | "published"
        | "tracking"
      task_priority: "critical" | "high" | "medium" | "low"
      task_status: "todo" | "in_progress" | "in_review" | "blocked" | "done"
      workflow_type: "content" | "crm" | "seo" | "general"
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
      app_role: [
        "admin",
        "head_of_marketing",
        "brand_manager",
        "content_lead",
        "crm_lead",
        "seo_lead",
        "contributor",
        "approver",
      ],
      approvable_type: ["content_brief", "crm_journey", "campaign"],
      approval_status: ["pending", "approved", "rejected", "changes_requested"],
      campaign_status: [
        "strategy",
        "planning",
        "production",
        "review",
        "published",
        "learning",
      ],
      content_brief_status: [
        "idea",
        "briefed",
        "drafting",
        "in_review",
        "approved",
        "scheduled",
        "published",
        "measured",
      ],
      crm_journey_status: [
        "segment_defined",
        "journey_mapped",
        "message_drafted",
        "in_review",
        "approved",
        "sending",
        "sent",
        "measured",
      ],
      seo_brief_status: [
        "research",
        "briefed",
        "optimizing",
        "in_review",
        "published",
        "tracking",
      ],
      task_priority: ["critical", "high", "medium", "low"],
      task_status: ["todo", "in_progress", "in_review", "blocked", "done"],
      workflow_type: ["content", "crm", "seo", "general"],
    },
  },
} as const
