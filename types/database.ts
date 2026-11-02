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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          id: string
          image_path: string | null
          is_active: boolean
          name_ar: string
          name_en: string | null
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          image_path?: string | null
          is_active?: boolean
          name_ar: string
          name_en?: string | null
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          image_path?: string | null
          is_active?: boolean
          name_ar?: string
          name_en?: string | null
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_image_cleanup_jobs: {
        Row: {
          category_id: string
          created_at: string
          id: string
          src: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          src: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          src?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          discount_percent: number
          id: string
          line_total: number | null
          order_id: string
          original_unit_price: number | null
          product_id: string | null
          product_name: string
          product_sku: string | null
          product_slug: string
          quantity: number
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          discount_percent?: number
          id?: string
          line_total?: number | null
          order_id: string
          original_unit_price?: number | null
          product_id?: string | null
          product_name: string
          product_sku?: string | null
          product_slug: string
          quantity: number
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          discount_percent?: number
          id?: string
          line_total?: number | null
          order_id?: string
          original_unit_price?: number | null
          product_id?: string | null
          product_name?: string
          product_sku?: string | null
          product_slug?: string
          quantity?: number
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_events: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_status: string
          order_id: string
          previous_status: string
          reason: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status: string
          order_id: string
          previous_status: string
          reason?: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status?: string
          order_id?: string
          previous_status?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string | null
          archived_at: string | null
          archived_by: string | null
          city: string | null
          created_at: string
          customer_name: string
          customer_notes: string
          customer_phone: string
          fulfillment_method: string
          governorate: string | null
          id: string
          idempotency_key: string
          order_number: number
          request_hash: string
          status: string
          tracking_code_hash: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          archived_at?: string | null
          archived_by?: string | null
          city?: string | null
          created_at?: string
          customer_name: string
          customer_notes?: string
          customer_phone: string
          fulfillment_method: string
          governorate?: string | null
          id?: string
          idempotency_key: string
          order_number?: never
          request_hash: string
          status?: string
          tracking_code_hash: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          archived_at?: string | null
          archived_by?: string | null
          city?: string | null
          created_at?: string
          customer_name?: string
          customer_notes?: string
          customer_phone?: string
          fulfillment_method?: string
          governorate?: string | null
          id?: string
          idempotency_key?: string
          order_number?: never
          request_hash?: string
          status?: string
          tracking_code_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_image_cleanup_jobs: {
        Row: {
          created_at: string
          id: string
          product_id: string
          src: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          src: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          src?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: string
          created_at: string
          id: string
          product_id: string
          sort_order: number
          src: string
          updated_at: string
        }
        Insert: {
          alt?: string
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number
          src: string
          updated_at?: string
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number
          src?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string
          created_at: string
          description_ar: string
          description_en: string | null
          discount_percent: number
          id: string
          is_active: boolean
          is_featured: boolean
          is_popular: boolean
          name_ar: string
          name_en: string | null
          price: number | null
          sale_price: number | null
          search_text: string | null
          sku: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description_ar?: string
          description_en?: string | null
          discount_percent?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          is_popular?: boolean
          name_ar: string
          name_en?: string | null
          price?: number | null
          sale_price?: number | null
          search_text?: string | null
          sku?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description_ar?: string
          description_en?: string | null
          discount_percent?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          is_popular?: boolean
          name_ar?: string
          name_en?: string | null
          price?: number | null
          sale_price?: number | null
          search_text?: string | null
          sku?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      project_image_cleanup_jobs: {
        Row: {
          created_at: string
          id: string
          project_id: string
          src: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          src: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          src?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          alt: string
          created_at: string
          id: string
          project_id: string
          sort_order: number
          src: string
          updated_at: string
        }
        Insert: {
          alt?: string
          created_at?: string
          id?: string
          project_id: string
          sort_order?: number
          src: string
          updated_at?: string
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          project_id?: string
          sort_order?: number
          src?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category_ar: string
          category_en: string | null
          created_at: string
          description_ar: string
          description_en: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          sort_order: number
          title_ar: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          category_ar: string
          category_en?: string | null
          created_at?: string
          description_ar?: string
          description_en?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          sort_order?: number
          title_ar: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          category_ar?: string
          category_en?: string | null
          created_at?: string
          description_ar?: string
          description_en?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          sort_order?: number
          title_ar?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_order_rate_limit: {
        Args: { p_scope: string; p_subject_hash: string }
        Returns: {
          allowed: boolean
          retry_after_seconds: number
        }[]
      }
      create_customer_order: {
        Args: {
          p_address?: string
          p_city?: string
          p_customer_name: string
          p_customer_notes?: string
          p_customer_phone: string
          p_fulfillment_method: string
          p_governorate?: string
          p_idempotency_key: string
          p_items: Json
          p_tracking_code_hash: string
        }
        Returns: {
          created_at: string
          order_id: string
          order_number: number
          reused: boolean
        }[]
      }
      create_customer_order_guarded: {
        Args: {
          p_address?: string
          p_city?: string
          p_client_hash: string
          p_customer_name: string
          p_customer_notes?: string
          p_customer_phone: string
          p_fulfillment_method: string
          p_governorate?: string
          p_idempotency_key: string
          p_items: Json
          p_phone_hash: string
          p_tracking_code_hash: string
        }
        Returns: {
          created_at: string
          order_id: string
          order_number: number
          reused: boolean
        }[]
      }
      current_user_is_admin: { Args: never; Returns: boolean }
      current_user_is_owner: { Args: never; Returns: boolean }
      delete_catalog_product: {
        Args: { p_product_id: string }
        Returns: string
      }
      delete_catalog_project: {
        Args: { p_project_id: string }
        Returns: string
      }
      get_admin_users: {
        Args: never
        Returns: {
          created_at: string
          email: string
          is_active: boolean
          last_sign_in_at: string
          role: string
          user_id: string
        }[]
      }
      get_catalog_category_counts: {
        Args: never
        Returns: {
          category_id: string
          product_count: number
          total_products: number
        }[]
      }
      get_customer_order_tracking: {
        Args: { p_tracking_code_hash: string }
        Returns: {
          created_at: string
          fulfillment_method: string
          order_number: string
          status: string
          updated_at: string
        }[]
      }
      manage_product_image: {
        Args: { p_action: string; p_image_id: string; p_product_id: string }
        Returns: string
      }
      manage_project_image: {
        Args: { p_action: string; p_image_id: string; p_project_id: string }
        Returns: boolean
      }
      normalize_catalog_search: { Args: { input: string }; Returns: string }
      recover_customer_order_submission: {
        Args: { p_idempotency_key: string; p_tracking_code_hash: string }
        Returns: {
          created_at: string
          order_id: string
          order_number: string
        }[]
      }
      set_catalog_admin_active: {
        Args: { p_is_active: boolean; p_user_id: string }
        Returns: boolean
      }
      set_category_image: {
        Args: {
          p_category_id: string
          p_expected_src: string
          p_new_src: string
        }
        Returns: boolean
      }
      set_customer_order_archived: {
        Args: {
          p_archived: boolean
          p_expected_archived: boolean
          p_order_id: string
        }
        Returns: boolean
      }
      set_product_publication: {
        Args: { p_is_active: boolean; p_product_id: string }
        Returns: boolean
      }
      set_project_publication: {
        Args: { p_is_active: boolean; p_project_id: string }
        Returns: boolean
      }
      update_customer_order_status: {
        Args: {
          p_expected_status: string
          p_new_status: string
          p_order_id: string
          p_reason?: string
        }
        Returns: string
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
