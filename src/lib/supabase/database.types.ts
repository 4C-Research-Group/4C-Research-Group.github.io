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
          team_member_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          role?: string | null;
          team_member_id?: string | null;
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
          bio: string;
          email: string;
          linkedin_url: string;
          degree: string;
          orcid_url: string;
          google_scholar_url: string;
          researchgate_url: string;
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
          bio?: string;
          email?: string;
          linkedin_url?: string;
          degree?: string;
          orcid_url?: string;
          google_scholar_url?: string;
          researchgate_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
        Relationships: [];
      };
      team_member_publications: {
        Row: {
          id: string;
          team_member_id: string;
          title: string;
          authors: string;
          venue: string;
          year: string;
          url: string;
          notes: string;
          status: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_member_id: string;
          title: string;
          authors?: string;
          venue?: string;
          year?: string;
          url?: string;
          notes?: string;
          status?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["team_member_publications"]["Insert"]
        >;
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
      homepage_settings: {
        Row: {
          id: string;
          payload: Json;
          updated_at: string;
        };
        Insert: {
          id: string;
          payload: Json;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["homepage_settings"]["Insert"]
        >;
        Relationships: [];
      };
      about_page_settings: {
        Row: {
          id: string;
          payload: Json;
          updated_at: string;
        };
        Insert: {
          id: string;
          payload: Json;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["about_page_settings"]["Insert"]
        >;
        Relationships: [];
      };
      about_pi_page_settings: {
        Row: {
          id: string;
          payload: Json;
          updated_at: string;
        };
        Insert: {
          id: string;
          payload: Json;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["about_pi_page_settings"]["Insert"]
        >;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          category: string;
          created_at: string;
          updated_at: string;
          read_time: string;
          image_url: string;
          tags: Json;
          featured: boolean;
          published: boolean;
          author_name: string;
          author_role: string;
          author_image_url: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string;
          content?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
          read_time?: string;
          image_url?: string;
          tags?: Json;
          featured?: boolean;
          published?: boolean;
          author_name?: string;
          author_role?: string;
          author_image_url?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [];
      };
      team_member_testimonials: {
        Row: {
          id: string;
          team_member_id: string;
          quote: string;
          testimonial_bio: string;
          education: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_member_id: string;
          quote: string;
          testimonial_bio: string;
          education: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["team_member_testimonials"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "team_member_testimonials_team_member_id_fkey";
            columns: ["team_member_id"];
            isOneToOne: true;
            referencedRelation: "team_members";
            referencedColumns: ["id"];
          },
        ];
      };
      research_projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          long_description: string;
          category: string;
          status: string;
          start_date: string;
          end_date: string | null;
          link: string;
          funding: string;
          additional_info: string;
          tags: string[];
          objectives: string[];
          team_members: Json;
          publications: Json;
          gallery_urls: string[];
          published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string;
          long_description?: string;
          category?: string;
          status?: string;
          start_date: string;
          end_date?: string | null;
          link?: string;
          funding?: string;
          additional_info?: string;
          tags?: string[];
          objectives?: string[];
          team_members?: Json;
          publications?: Json;
          gallery_urls?: string[];
          published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["research_projects"]["Insert"]>;
        Relationships: [];
      };
      km_modules: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["km_modules"]["Insert"]>;
        Relationships: [];
      };
      km_topics: {
        Row: {
          id: string;
          module_id: string;
          topic_key: string;
          sort_order: number;
          topic_type: string;
          title: string;
          paragraphs: Json;
          embed_url: string | null;
          video_caption: string | null;
        };
        Insert: {
          id?: string;
          module_id: string;
          topic_key: string;
          sort_order?: number;
          topic_type: string;
          title: string;
          paragraphs?: Json;
          embed_url?: string | null;
          video_caption?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["km_topics"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "km_topics_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "km_modules";
            referencedColumns: ["id"];
          },
        ];
      };
      km_questions: {
        Row: {
          id: string;
          module_id: string;
          question_key: string;
          sort_order: number;
          prompt: string;
          options: Json;
          correct_index: number;
        };
        Insert: {
          id?: string;
          module_id: string;
          question_key: string;
          sort_order?: number;
          prompt: string;
          options: Json;
          correct_index: number;
        };
        Update: Partial<Database["public"]["Tables"]["km_questions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "km_questions_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "km_modules";
            referencedColumns: ["id"];
          },
        ];
      };
      km_user_progress: {
        Row: {
          user_id: string;
          payload: Json;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          payload?: Json;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["km_user_progress"]["Insert"]>;
        Relationships: [];
      };
      research_page: {
        Row: {
          id: string;
          slug: string;
          document: Json;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug?: string;
          document?: Json;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["research_page"]["Insert"]>;
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
