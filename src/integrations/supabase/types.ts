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
      activity_log: {
        Row: {
          action_metadata: Json | null
          action_type: string
          company_id: string | null
          created_at: string | null
          details: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action_metadata?: Json | null
          action_type: string
          company_id?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action_metadata?: Json | null
          action_type?: string
          company_id?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "contact_inquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      add_back_categories: {
        Row: {
          amount: number | null
          assessment_id: string
          category: string
          created_at: string
          description: string | null
          id: string
          is_applied: boolean | null
        }
        Insert: {
          amount?: number | null
          assessment_id: string
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_applied?: boolean | null
        }
        Update: {
          amount?: number | null
          assessment_id?: string
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_applied?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "add_back_categories_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "financial_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_sessions: {
        Row: {
          assessment_id: string
          created_at: string
          id: string
          scenario_data: Json | null
          session_name: string
          updated_at: string
        }
        Insert: {
          assessment_id: string
          created_at?: string
          id?: string
          scenario_data?: Json | null
          session_name?: string
          updated_at?: string
        }
        Update: {
          assessment_id?: string
          created_at?: string
          id?: string
          scenario_data?: Json | null
          session_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_sessions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "financial_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      buyer_analysis: {
        Row: {
          buyer_scores: Json | null
          created_at: string
          id: string
          quiz_answers: Json | null
          selected_buyer: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          buyer_scores?: Json | null
          created_at?: string
          id?: string
          quiz_answers?: Json | null
          selected_buyer?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          buyer_scores?: Json | null
          created_at?: string
          id?: string
          quiz_answers?: Json | null
          selected_buyer?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      client_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          module_name: string
          user_id: string
          week_number: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          module_name: string
          user_id: string
          week_number: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          module_name?: string
          user_id?: string
          week_number?: number
        }
        Relationships: []
      }
      client_scenarios: {
        Row: {
          add_backs: Json | null
          adjusted_ebitda: number | null
          created_at: string
          current_ebitda: number | null
          id: string
          revenue: number | null
          scenario_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          add_backs?: Json | null
          adjusted_ebitda?: number | null
          created_at?: string
          current_ebitda?: number | null
          id?: string
          revenue?: number | null
          scenario_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          add_backs?: Json | null
          adjusted_ebitda?: number | null
          created_at?: string
          current_ebitda?: number | null
          id?: string
          revenue?: number | null
          scenario_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      company_comments: {
        Row: {
          comment: string
          comment_type: string | null
          company_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          comment: string
          comment_type?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          comment?: string
          comment_type?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_comments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "contact_inquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_inquiries: {
        Row: {
          admin_notes: string | null
          annual_revenue: number | null
          assigned_to: string | null
          company_name: string
          contact_email: string
          contact_name: string | null
          created_at: string | null
          exit_timeline: string | null
          id: string
          industry: string | null
          source_form_version: string | null
          status: string | null
        }
        Insert: {
          admin_notes?: string | null
          annual_revenue?: number | null
          assigned_to?: string | null
          company_name: string
          contact_email: string
          contact_name?: string | null
          created_at?: string | null
          exit_timeline?: string | null
          id?: string
          industry?: string | null
          source_form_version?: string | null
          status?: string | null
        }
        Update: {
          admin_notes?: string | null
          annual_revenue?: number | null
          assigned_to?: string | null
          company_name?: string
          contact_email?: string
          contact_name?: string | null
          created_at?: string | null
          exit_timeline?: string | null
          id?: string
          industry?: string | null
          source_form_version?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_inquiries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      data_room_documents: {
        Row: {
          category: string
          created_at: string | null
          document_date: string | null
          document_name: string
          document_type: string | null
          file_size: number | null
          file_url: string
          id: string
          is_active: boolean | null
          metadata: Json | null
          previous_version_id: string | null
          subcategory: string
          updated_at: string | null
          upload_date: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          document_date?: string | null
          document_name: string
          document_type?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          previous_version_id?: string | null
          subcategory: string
          updated_at?: string | null
          upload_date?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          document_date?: string | null
          document_name?: string
          document_type?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          previous_version_id?: string | null
          subcategory?: string
          updated_at?: string | null
          upload_date?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "data_room_documents_previous_version_id_fkey"
            columns: ["previous_version_id"]
            isOneToOne: false
            referencedRelation: "data_room_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      data_room_progress: {
        Row: {
          category: string
          completion_percentage: number | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          last_upload_date: string | null
          subcategory: string | null
          total_required: number | null
          total_uploaded: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_upload_date?: string | null
          subcategory?: string | null
          total_required?: number | null
          total_uploaded?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_upload_date?: string | null
          subcategory?: string | null
          total_required?: number | null
          total_uploaded?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      data_room_readiness: {
        Row: {
          created_at: string | null
          id: string
          last_calculated: string | null
          missing_critical: string[] | null
          overall_score: string | null
          required_documents: number | null
          total_documents: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_calculated?: string | null
          missing_critical?: string[] | null
          overall_score?: string | null
          required_documents?: number | null
          total_documents?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_calculated?: string | null
          missing_critical?: string[] | null
          overall_score?: string | null
          required_documents?: number | null
          total_documents?: number | null
          user_id?: string
        }
        Relationships: []
      }
      data_room_structure: {
        Row: {
          category: string
          company_type: string | null
          created_at: string | null
          created_by: string | null
          document_types: string[] | null
          id: string
          is_custom: boolean | null
          is_required: boolean | null
          sort_order: number | null
          subcategory: string
        }
        Insert: {
          category: string
          company_type?: string | null
          created_at?: string | null
          created_by?: string | null
          document_types?: string[] | null
          id?: string
          is_custom?: boolean | null
          is_required?: boolean | null
          sort_order?: number | null
          subcategory: string
        }
        Update: {
          category?: string
          company_type?: string | null
          created_at?: string | null
          created_by?: string | null
          document_types?: string[] | null
          id?: string
          is_custom?: boolean | null
          is_required?: boolean | null
          sort_order?: number | null
          subcategory?: string
        }
        Relationships: []
      }
      exit_readiness_assessments: {
        Row: {
          answers: Json
          assessment_version: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          score: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answers?: Json
          assessment_version?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          score?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answers?: Json
          assessment_version?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          score?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      financial_assessments: {
        Row: {
          adjusted_ebitda: number | null
          assessment_status: string | null
          company_id: string
          created_at: string
          created_by: string | null
          current_ebitda: number | null
          ebitda_margin: number | null
          id: string
          net_income: number | null
          pe_readiness_score: number | null
          revenue: number | null
          updated_at: string
        }
        Insert: {
          adjusted_ebitda?: number | null
          assessment_status?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          current_ebitda?: number | null
          ebitda_margin?: number | null
          id?: string
          net_income?: number | null
          pe_readiness_score?: number | null
          revenue?: number | null
          updated_at?: string
        }
        Update: {
          adjusted_ebitda?: number | null
          assessment_status?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          current_ebitda?: number | null
          ebitda_margin?: number | null
          id?: string
          net_income?: number | null
          pe_readiness_score?: number | null
          revenue?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_assessments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "contact_inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      industry_benchmarks: {
        Row: {
          created_at: string
          id: string
          industry: string
          margin_excellent: number
          margin_fair: number
          margin_good: number
          multiple_high: number
          multiple_low: number
          multiple_mid: number
        }
        Insert: {
          created_at?: string
          id?: string
          industry: string
          margin_excellent: number
          margin_fair: number
          margin_good: number
          multiple_high: number
          multiple_low: number
          multiple_mid: number
        }
        Update: {
          created_at?: string
          id?: string
          industry?: string
          margin_excellent?: number
          margin_fair?: number
          margin_good?: number
          multiple_high?: number
          multiple_low?: number
          multiple_mid?: number
        }
        Relationships: []
      }
      kpi_metrics: {
        Row: {
          category: string | null
          created_at: string | null
          current_value: number | null
          department: string | null
          ebitda_impact: number | null
          id: string
          last_updated: string | null
          measurement_frequency: string | null
          metric_name: string
          metric_type: string | null
          owner: string | null
          start_date: string | null
          status: string | null
          strategic_initiative_link: string | null
          target_date: string | null
          target_value: number | null
          unit_of_measure: string | null
          updated_at: string | null
          user_id: string | null
          valuation_impact: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          current_value?: number | null
          department?: string | null
          ebitda_impact?: number | null
          id?: string
          last_updated?: string | null
          measurement_frequency?: string | null
          metric_name: string
          metric_type?: string | null
          owner?: string | null
          start_date?: string | null
          status?: string | null
          strategic_initiative_link?: string | null
          target_date?: string | null
          target_value?: number | null
          unit_of_measure?: string | null
          updated_at?: string | null
          user_id?: string | null
          valuation_impact?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          current_value?: number | null
          department?: string | null
          ebitda_impact?: number | null
          id?: string
          last_updated?: string | null
          measurement_frequency?: string | null
          metric_name?: string
          metric_type?: string | null
          owner?: string | null
          start_date?: string | null
          status?: string | null
          strategic_initiative_link?: string | null
          target_date?: string | null
          target_value?: number | null
          unit_of_measure?: string | null
          updated_at?: string | null
          user_id?: string | null
          valuation_impact?: string | null
        }
        Relationships: []
      }
      okr_key_results: {
        Row: {
          created_at: string | null
          current_progress: number | null
          id: string
          key_result: string
          objective_id: string | null
          status: string | null
          target_progress: number | null
        }
        Insert: {
          created_at?: string | null
          current_progress?: number | null
          id?: string
          key_result: string
          objective_id?: string | null
          status?: string | null
          target_progress?: number | null
        }
        Update: {
          created_at?: string | null
          current_progress?: number | null
          id?: string
          key_result?: string
          objective_id?: string | null
          status?: string | null
          target_progress?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "okr_key_results_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "kpi_metrics"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_wins_progress: {
        Row: {
          completed_items: Json | null
          created_at: string
          custom_items: Json | null
          id: string
          multiple: number | null
          notes: Json | null
          updated_at: string
          user_id: string
          values: Json | null
          vehicle_assets: Json | null
        }
        Insert: {
          completed_items?: Json | null
          created_at?: string
          custom_items?: Json | null
          id?: string
          multiple?: number | null
          notes?: Json | null
          updated_at?: string
          user_id: string
          values?: Json | null
          vehicle_assets?: Json | null
        }
        Update: {
          completed_items?: Json | null
          created_at?: string
          custom_items?: Json | null
          id?: string
          multiple?: number | null
          notes?: Json | null
          updated_at?: string
          user_id?: string
          values?: Json | null
          vehicle_assets?: Json | null
        }
        Relationships: []
      }
      strategy_documents: {
        Row: {
          core_values: Json | null
          created_at: string | null
          ebitda_year1: number | null
          ebitda_year2: number | null
          ebitda_year3: number | null
          ebitda_year4: number | null
          ebitda_year5: number | null
          goals_12_month: Json | null
          goals_24_month: Json | null
          id: string
          initiatives_90_day: Json | null
          last_saved: string | null
          mission_statement: string | null
          opportunities: Json | null
          revenue_year1: number | null
          revenue_year2: number | null
          revenue_year3: number | null
          revenue_year4: number | null
          revenue_year5: number | null
          strengths: Json | null
          threats: Json | null
          updated_at: string | null
          user_id: string | null
          vision_5_year: string | null
          vision_statement: string | null
          weaknesses: Json | null
        }
        Insert: {
          core_values?: Json | null
          created_at?: string | null
          ebitda_year1?: number | null
          ebitda_year2?: number | null
          ebitda_year3?: number | null
          ebitda_year4?: number | null
          ebitda_year5?: number | null
          goals_12_month?: Json | null
          goals_24_month?: Json | null
          id?: string
          initiatives_90_day?: Json | null
          last_saved?: string | null
          mission_statement?: string | null
          opportunities?: Json | null
          revenue_year1?: number | null
          revenue_year2?: number | null
          revenue_year3?: number | null
          revenue_year4?: number | null
          revenue_year5?: number | null
          strengths?: Json | null
          threats?: Json | null
          updated_at?: string | null
          user_id?: string | null
          vision_5_year?: string | null
          vision_statement?: string | null
          weaknesses?: Json | null
        }
        Update: {
          core_values?: Json | null
          created_at?: string | null
          ebitda_year1?: number | null
          ebitda_year2?: number | null
          ebitda_year3?: number | null
          ebitda_year4?: number | null
          ebitda_year5?: number | null
          goals_12_month?: Json | null
          goals_24_month?: Json | null
          id?: string
          initiatives_90_day?: Json | null
          last_saved?: string | null
          mission_statement?: string | null
          opportunities?: Json | null
          revenue_year1?: number | null
          revenue_year2?: number | null
          revenue_year3?: number | null
          revenue_year4?: number | null
          revenue_year5?: number | null
          strengths?: Json | null
          threats?: Json | null
          updated_at?: string | null
          user_id?: string | null
          vision_5_year?: string | null
          vision_statement?: string | null
          weaknesses?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          name: string
          permissions: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          permissions?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          permissions?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
