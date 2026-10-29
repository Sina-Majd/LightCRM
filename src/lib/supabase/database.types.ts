// Generated from the connected project's public schema. Regenerate after schema changes.
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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          body: string
          call_result: string | null
          created_at: string
          created_by: string | null
          happened_at: string
          id: string
          kind: string
          subject_id: string
          subject_type: string
          workspace_id: string
        }
        Insert: {
          body?: string
          call_result?: string | null
          created_at?: string
          created_by?: string | null
          happened_at?: string
          id?: string
          kind: string
          subject_id: string
          subject_type: string
          workspace_id: string
        }
        Update: {
          body?: string
          call_result?: string | null
          created_at?: string
          created_by?: string | null
          happened_at?: string
          id?: string
          kind?: string
          subject_id?: string
          subject_type?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      cheques: {
        Row: {
          account_owner: string
          amount: number
          bank_name: string
          branch_name: string | null
          created_at: string
          customer_id: string | null
          due_date: string
          id: string
          payment_id: string | null
          sayad_number: string
          status: string
          status_updated_at: string
          workspace_id: string
        }
        Insert: {
          account_owner: string
          amount?: number
          bank_name: string
          branch_name?: string | null
          created_at?: string
          customer_id?: string | null
          due_date: string
          id?: string
          payment_id?: string | null
          sayad_number: string
          status?: string
          status_updated_at?: string
          workspace_id: string
        }
        Update: {
          account_owner?: string
          amount?: number
          bank_name?: string
          branch_name?: string | null
          created_at?: string
          customer_id?: string | null
          due_date?: string
          id?: string
          payment_id?: string | null
          sayad_number?: string
          status?: string
          status_updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cheques_customer_id_fkey"
            columns: ["customer_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id", "workspace_id"]
          },
          {
            foreignKeyName: "cheques_payment_id_fkey"
            columns: ["payment_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id", "workspace_id"]
          },
          {
            foreignKeyName: "cheques_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          active_deals_count: number
          company: string
          created_at: string
          created_by: string | null
          customer_type: string | null
          economic_code: string | null
          email: string
          health_score: number
          health_status: string
          id: string
          industry: string
          last_touch: string
          location: string
          ltv: number
          name: string
          national_id: string | null
          phone: string | null
          renewal_date: string
          segment: string | null
          tier: string
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          active_deals_count?: number
          company?: string
          created_at?: string
          created_by?: string | null
          customer_type?: string | null
          economic_code?: string | null
          email?: string
          health_score?: number
          health_status?: string
          id?: string
          industry?: string
          last_touch?: string
          location?: string
          ltv?: number
          name: string
          national_id?: string | null
          phone?: string | null
          renewal_date?: string
          segment?: string | null
          tier?: string
          updated_at?: string
          user_id?: string
          workspace_id: string
        }
        Update: {
          active_deals_count?: number
          company?: string
          created_at?: string
          created_by?: string | null
          customer_type?: string | null
          economic_code?: string | null
          email?: string
          health_score?: number
          health_status?: string
          id?: string
          industry?: string
          last_touch?: string
          location?: string
          ltv?: number
          name?: string
          national_id?: string | null
          phone?: string | null
          renewal_date?: string
          segment?: string | null
          tier?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          assignee_avatar: string
          assignee_name: string
          company: string
          contact: string
          created_at: string
          created_by: string | null
          days_in_stage: number
          email: string | null
          id: string
          last_activity: string
          next_action_due: string | null
          next_action_title: string | null
          notes: string
          phone: string | null
          priority: string
          probability: number
          stage_id: string
          tags: string[]
          title: string
          updated_at: string
          user_id: string
          value: number
          workspace_id: string
        }
        Insert: {
          assignee_avatar?: string
          assignee_name?: string
          company?: string
          contact?: string
          created_at?: string
          created_by?: string | null
          days_in_stage?: number
          email?: string | null
          id?: string
          last_activity?: string
          next_action_due?: string | null
          next_action_title?: string | null
          notes?: string
          phone?: string | null
          priority?: string
          probability?: number
          stage_id?: string
          tags?: string[]
          title: string
          updated_at?: string
          user_id?: string
          value?: number
          workspace_id: string
        }
        Update: {
          assignee_avatar?: string
          assignee_name?: string
          company?: string
          contact?: string
          created_at?: string
          created_by?: string | null
          days_in_stage?: number
          email?: string | null
          id?: string
          last_activity?: string
          next_action_due?: string | null
          next_action_title?: string | null
          notes?: string
          phone?: string | null
          priority?: string
          probability?: number
          stage_id?: string
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
          value?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_workspace_stage_fkey"
            columns: ["workspace_id", "stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["workspace_id", "stage_key"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          discount: number
          id: string
          invoice_id: string
          item_order: number
          quantity: number
          tax_rate: number
          total: number
          unit_price: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          description: string
          discount?: number
          id?: string
          invoice_id: string
          item_order?: number
          quantity?: number
          tax_rate?: number
          total?: number
          unit_price?: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          description?: string
          discount?: number
          id?: string
          invoice_id?: string
          item_order?: number
          quantity?: number
          tax_rate?: number
          total?: number
          unit_price?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id", "workspace_id"]
          },
          {
            foreignKeyName: "invoice_items_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          customer_name: string
          discount: number
          due_date: string | null
          id: string
          issue_date: string
          notes: string
          number: number
          status: string
          subtotal: number
          tax: number
          total: number
          type: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          customer_name?: string
          discount?: number
          due_date?: string | null
          id?: string
          issue_date?: string
          notes?: string
          number: number
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          type?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          customer_name?: string
          discount?: number
          due_date?: string | null
          id?: string
          issue_date?: string
          notes?: string
          number?: number
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          type?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id", "workspace_id"]
          },
          {
            foreignKeyName: "invoices_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string
          company: string
          created_at: string
          created_by: string | null
          email: string
          estimated_value: number
          id: string
          name: string
          notes: string
          phone: string | null
          score: number
          source: string
          status: string
          title: string | null
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          assigned_to?: string
          company: string
          created_at?: string
          created_by?: string | null
          email: string
          estimated_value?: number
          id?: string
          name: string
          notes?: string
          phone?: string | null
          score?: number
          source?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
          workspace_id: string
        }
        Update: {
          assigned_to?: string
          company?: string
          created_at?: string
          created_by?: string | null
          email?: string
          estimated_value?: number
          id?: string
          name?: string
          notes?: string
          phone?: string | null
          score?: number
          source?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          description: string
          id: string
          read: boolean
          time: string
          title: string
          type: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          read?: boolean
          time?: string
          title: string
          type?: string
          user_id?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          read?: boolean
          time?: string
          title?: string
          type?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          customer_id: string | null
          id: string
          invoice_id: string | null
          method: string
          notes: string
          paid_at: string
          reference: string
          workspace_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          method?: string
          notes?: string
          paid_at?: string
          reference?: string
          workspace_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          method?: string
          notes?: string
          paid_at?: string
          reference?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id", "workspace_id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id", "workspace_id"]
          },
          {
            foreignKeyName: "payments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          created_at: string
          id: string
          position: number
          stage_key: string
          title: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          position?: number
          stage_key: string
          title: string
          user_id?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: number
          stage_key?: string
          title?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          plan: string | null
          role: string | null
          status: string | null
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          plan?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          plan?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed: boolean
          created_at: string
          created_by: string | null
          due_category: string
          due_date: string
          id: string
          priority: string
          related_to: string
          related_type: string
          title: string
          type: string
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          created_by?: string | null
          due_category?: string
          due_date?: string
          id?: string
          priority?: string
          related_to?: string
          related_type?: string
          title: string
          type?: string
          updated_at?: string
          user_id?: string
          workspace_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          created_by?: string | null
          due_category?: string
          due_date?: string
          id?: string
          priority?: string
          related_to?: string
          related_type?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          joined_at: string
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          joined_at?: string
          role?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          joined_at?: string
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          invoice_tax_rate: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_tax_rate?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          invoice_tax_rate?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_invoice_with_items: {
        Args: { header: Json; lines: Json; workspace: string }
        Returns: Json
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
