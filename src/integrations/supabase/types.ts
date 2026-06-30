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
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Relationships: []
      }
      clinic_admin_notes: {
        Row: {
          clinic_id: string
          notes: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          clinic_id: string
          notes?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          clinic_id?: string
          notes?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinic_admin_notes_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: true
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_submissions: {
        Row: {
          city: string | null
          clinic_name: string
          country: string | null
          created_at: string
          id: string
          notes: string | null
          phone: string | null
          status: string | null
          submitted_by: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          city?: string | null
          clinic_name: string
          country?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          submitted_by?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          city?: string | null
          clinic_name?: string
          country?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          submitted_by?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      clinics: {
        Row: {
          address: string | null
          before_after: boolean | null
          branch_name: string | null
          brand_name: string | null
          city: string
          cons: string[] | null
          consultation_fee: number | null
          contact: string | null
          country: string
          created_at: string
          created_by: string | null
          currency: string | null
          data_confidence: string | null
          data_source: string | null
          doctor_led: boolean | null
          doctors: string[] | null
          emi_available: boolean | null
          google_maps_url: string | null
          google_place_id: string | null
          google_rating: number | null
          google_rating_count: number | null
          id: string
          last_synced_at: string | null
          last_verified_at: string | null
          min_package_price: number | null
          name: string
          notes: string | null
          package_price_high: number | null
          package_price_low: number | null
          price_per_graft_high: number | null
          price_per_graft_low: number | null
          pros: string[] | null
          red_flags: string[] | null
          review_count: number | null
          state: string | null
          status: string
          supports_beard: boolean | null
          supports_crown: boolean | null
          supports_female: boolean | null
          supports_mega_session: boolean | null
          surgeon_led: boolean | null
          techniques: string[] | null
          updated_at: string
          verified_reviews: number | null
          website: string | null
        }
        Insert: {
          address?: string | null
          before_after?: boolean | null
          branch_name?: string | null
          brand_name?: string | null
          city: string
          cons?: string[] | null
          consultation_fee?: number | null
          contact?: string | null
          country: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          data_confidence?: string | null
          data_source?: string | null
          doctor_led?: boolean | null
          doctors?: string[] | null
          emi_available?: boolean | null
          google_maps_url?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_rating_count?: number | null
          id?: string
          last_synced_at?: string | null
          last_verified_at?: string | null
          min_package_price?: number | null
          name: string
          notes?: string | null
          package_price_high?: number | null
          package_price_low?: number | null
          price_per_graft_high?: number | null
          price_per_graft_low?: number | null
          pros?: string[] | null
          red_flags?: string[] | null
          review_count?: number | null
          state?: string | null
          status?: string
          supports_beard?: boolean | null
          supports_crown?: boolean | null
          supports_female?: boolean | null
          supports_mega_session?: boolean | null
          surgeon_led?: boolean | null
          techniques?: string[] | null
          updated_at?: string
          verified_reviews?: number | null
          website?: string | null
        }
        Update: {
          address?: string | null
          before_after?: boolean | null
          branch_name?: string | null
          brand_name?: string | null
          city?: string
          cons?: string[] | null
          consultation_fee?: number | null
          contact?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          data_confidence?: string | null
          data_source?: string | null
          doctor_led?: boolean | null
          doctors?: string[] | null
          emi_available?: boolean | null
          google_maps_url?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_rating_count?: number | null
          id?: string
          last_synced_at?: string | null
          last_verified_at?: string | null
          min_package_price?: number | null
          name?: string
          notes?: string | null
          package_price_high?: number | null
          package_price_low?: number | null
          price_per_graft_high?: number | null
          price_per_graft_low?: number | null
          pros?: string[] | null
          red_flags?: string[] | null
          review_count?: number | null
          state?: string | null
          status?: string
          supports_beard?: boolean | null
          supports_crown?: boolean | null
          supports_female?: boolean | null
          supports_mega_session?: boolean | null
          surgeon_led?: boolean | null
          techniques?: string[] | null
          updated_at?: string
          verified_reviews?: number | null
          website?: string | null
        }
        Relationships: []
      }
      doctor_admin_notes: {
        Row: {
          created_at: string
          doctor_id: string
          reputation_notes: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          reputation_notes?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          reputation_notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_admin_notes_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: true
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          bio: string | null
          city: string | null
          clinic_id: string | null
          country: string | null
          created_at: string
          full_name: string
          id: string
          photo_url: string | null
          profile_url: string | null
          qualification: string | null
          techniques: string[] | null
          updated_at: string
          verification_status: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          clinic_id?: string | null
          country?: string | null
          created_at?: string
          full_name: string
          id?: string
          photo_url?: string | null
          profile_url?: string | null
          qualification?: string | null
          techniques?: string[] | null
          updated_at?: string
          verification_status?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          clinic_id?: string | null
          country?: string | null
          created_at?: string
          full_name?: string
          id?: string
          photo_url?: string | null
          profile_url?: string | null
          qualification?: string | null
          techniques?: string[] | null
          updated_at?: string
          verification_status?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      image_quality_scores: {
        Row: {
          angle_score: number | null
          blur_score: number | null
          created_at: string
          id: string
          issues: string[] | null
          job_id: string | null
          lighting_score: number | null
          overall_score: number | null
          photo_id: string | null
          scalp_visibility_score: number | null
          user_id: string | null
        }
        Insert: {
          angle_score?: number | null
          blur_score?: number | null
          created_at?: string
          id?: string
          issues?: string[] | null
          job_id?: string | null
          lighting_score?: number | null
          overall_score?: number | null
          photo_id?: string | null
          scalp_visibility_score?: number | null
          user_id?: string | null
        }
        Update: {
          angle_score?: number | null
          blur_score?: number | null
          created_at?: string
          id?: string
          issues?: string[] | null
          job_id?: string | null
          lighting_score?: number | null
          overall_score?: number | null
          photo_id?: string | null
          scalp_visibility_score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "image_quality_scores_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "photo_analysis_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "image_quality_scores_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "scalp_photos"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          active: boolean | null
          created_at: string
          doctor_instruction: string | null
          dose: string | null
          frequency: string | null
          id: string
          name: string
          reminder_time: string | null
          side_effects: string | null
          start_date: string | null
          stop_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          doctor_instruction?: string | null
          dose?: string | null
          frequency?: string | null
          id?: string
          name: string
          reminder_time?: string | null
          side_effects?: string | null
          start_date?: string | null
          stop_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          doctor_instruction?: string | null
          dose?: string | null
          frequency?: string | null
          id?: string
          name?: string
          reminder_time?: string | null
          side_effects?: string | null
          start_date?: string | null
          stop_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      photo_analysis_jobs: {
        Row: {
          created_at: string
          error: string | null
          id: string
          inputs: Json | null
          source: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          inputs?: Json | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          inputs?: Json | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      photo_analysis_results: {
        Row: {
          affected_zones: string[] | null
          confidence_score: number | null
          created_at: string
          donor_quality: string | null
          graft_estimate_high: number | null
          graft_estimate_low: number | null
          id: string
          is_demo: boolean | null
          job_id: string | null
          ludwig_stage: string | null
          norwood_stage: string | null
          notes: string | null
          pattern: string | null
          raw_response: Json | null
          risk_flags: string[] | null
          sessions_required: number | null
          user_id: string | null
          zone_split: Json | null
        }
        Insert: {
          affected_zones?: string[] | null
          confidence_score?: number | null
          created_at?: string
          donor_quality?: string | null
          graft_estimate_high?: number | null
          graft_estimate_low?: number | null
          id?: string
          is_demo?: boolean | null
          job_id?: string | null
          ludwig_stage?: string | null
          norwood_stage?: string | null
          notes?: string | null
          pattern?: string | null
          raw_response?: Json | null
          risk_flags?: string[] | null
          sessions_required?: number | null
          user_id?: string | null
          zone_split?: Json | null
        }
        Update: {
          affected_zones?: string[] | null
          confidence_score?: number | null
          created_at?: string
          donor_quality?: string | null
          graft_estimate_high?: number | null
          graft_estimate_low?: number | null
          id?: string
          is_demo?: boolean | null
          job_id?: string | null
          ludwig_stage?: string | null
          norwood_stage?: string | null
          notes?: string | null
          pattern?: string | null
          raw_response?: Json | null
          risk_flags?: string[] | null
          sessions_required?: number | null
          user_id?: string | null
          zone_split?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_analysis_results_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "photo_analysis_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          alcohol_status: string | null
          allergies: string | null
          budget_range: string | null
          city: string | null
          concern_areas: string[] | null
          country: string | null
          created_at: string
          current_medications: string[] | null
          doctor_notes: string | null
          family_history: string | null
          full_name: string | null
          gender: string | null
          hair_loss_duration: string | null
          medical_conditions: string | null
          preferred_treatment_location: string | null
          previous_transplant: boolean | null
          previous_transplant_notes: string | null
          smoking_status: string | null
          state: string | null
          treatment_timeline: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          alcohol_status?: string | null
          allergies?: string | null
          budget_range?: string | null
          city?: string | null
          concern_areas?: string[] | null
          country?: string | null
          created_at?: string
          current_medications?: string[] | null
          doctor_notes?: string | null
          family_history?: string | null
          full_name?: string | null
          gender?: string | null
          hair_loss_duration?: string | null
          medical_conditions?: string | null
          preferred_treatment_location?: string | null
          previous_transplant?: boolean | null
          previous_transplant_notes?: string | null
          smoking_status?: string | null
          state?: string | null
          treatment_timeline?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          alcohol_status?: string | null
          allergies?: string | null
          budget_range?: string | null
          city?: string | null
          concern_areas?: string[] | null
          country?: string | null
          created_at?: string
          current_medications?: string[] | null
          doctor_notes?: string | null
          family_history?: string | null
          full_name?: string | null
          gender?: string | null
          hair_loss_duration?: string | null
          medical_conditions?: string | null
          preferred_treatment_location?: string | null
          previous_transplant?: boolean | null
          previous_transplant_notes?: string | null
          smoking_status?: string | null
          state?: string | null
          treatment_timeline?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recovery_logs: {
        Row: {
          created_at: string
          day_number: number | null
          id: string
          itching: number | null
          log_date: string
          medicines_taken: boolean | null
          notes: string | null
          pain: number | null
          photo_uploaded: boolean | null
          redness: number | null
          scab_status: string | null
          shedding_status: string | null
          swelling: number | null
          user_id: string
          wash_done: boolean | null
        }
        Insert: {
          created_at?: string
          day_number?: number | null
          id?: string
          itching?: number | null
          log_date: string
          medicines_taken?: boolean | null
          notes?: string | null
          pain?: number | null
          photo_uploaded?: boolean | null
          redness?: number | null
          scab_status?: string | null
          shedding_status?: string | null
          swelling?: number | null
          user_id: string
          wash_done?: boolean | null
        }
        Update: {
          created_at?: string
          day_number?: number | null
          id?: string
          itching?: number | null
          log_date?: string
          medicines_taken?: boolean | null
          notes?: string | null
          pain?: number | null
          photo_uploaded?: boolean | null
          redness?: number | null
          scab_status?: string | null
          shedding_status?: string | null
          swelling?: number | null
          user_id?: string
          wash_done?: boolean | null
        }
        Relationships: []
      }
      scalp_photos: {
        Row: {
          area: string
          created_at: string
          id: string
          notes: string | null
          severity: number | null
          storage_path: string
          user_id: string
        }
        Insert: {
          area: string
          created_at?: string
          id?: string
          notes?: string | null
          severity?: number | null
          storage_path: string
          user_id: string
        }
        Update: {
          area?: string
          created_at?: string
          id?: string
          notes?: string | null
          severity?: number | null
          storage_path?: string
          user_id?: string
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
