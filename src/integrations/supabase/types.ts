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
      clinics: {
        Row: {
          address: string | null
          before_after: boolean | null
          city: string
          cons: string[] | null
          consultation_fee: number | null
          contact: string | null
          country: string
          created_at: string
          created_by: string | null
          currency: string | null
          doctors: string[] | null
          emi_available: boolean | null
          google_rating: number | null
          id: string
          min_package_price: number | null
          name: string
          notes: string | null
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
          city: string
          cons?: string[] | null
          consultation_fee?: number | null
          contact?: string | null
          country: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          doctors?: string[] | null
          emi_available?: boolean | null
          google_rating?: number | null
          id?: string
          min_package_price?: number | null
          name: string
          notes?: string | null
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
          city?: string
          cons?: string[] | null
          consultation_fee?: number | null
          contact?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          doctors?: string[] | null
          emi_available?: boolean | null
          google_rating?: number | null
          id?: string
          min_package_price?: number | null
          name?: string
          notes?: string | null
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
