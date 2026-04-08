export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          slug: string;
          name: string;
          initials: string;
          role_title: string;
          category: string;
          superpower: string;
          photo_file: string;
          is_alumni: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          initials?: string;
          role_title?: string;
          category?: string;
          superpower?: string;
          photo_file?: string;
          is_alumni?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
        Relationships: [];
      };
      page_content: {
        Row: {
          id: string;
          page_slug: string;
          section_key: string;
          body: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_slug: string;
          section_key: string;
          body?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["page_content"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      admin_list_app_users: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          email: string | null;
          name: string | null;
          role: string | null;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
