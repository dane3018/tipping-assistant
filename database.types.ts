export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      games: {
        Row: {
          abehinds: number | null;
          agoals: number | null;
          ascore: number;
          ateamid: number;
          complete: number;
          created_at: string;
          date: string | null;
          hbehinds: number | null;
          hgoals: number | null;
          hscore: number;
          hteamid: number;
          id: number;
          is_final: number;
          is_grand_final: number;
          localtime: string;
          round: number;
          venue: string;
          winnerteamid: number | null;
          year: number;
        };
        Insert: {
          abehinds?: number | null;
          agoals?: number | null;
          ascore?: number;
          ateamid?: number;
          complete?: number;
          created_at?: string;
          date?: string | null;
          hbehinds?: number | null;
          hgoals?: number | null;
          hscore?: number;
          hteamid?: number;
          id?: number;
          is_final?: number;
          is_grand_final?: number;
          localtime: string;
          round?: number;
          venue: string;
          winnerteamid?: number | null;
          year?: number;
        };
        Update: {
          abehinds?: number | null;
          agoals?: number | null;
          ascore?: number;
          ateamid?: number;
          complete?: number;
          created_at?: string;
          date?: string | null;
          hbehinds?: number | null;
          hgoals?: number | null;
          hscore?: number;
          hteamid?: number;
          id?: number;
          is_final?: number;
          is_grand_final?: number;
          localtime?: string;
          round?: number;
          venue?: string;
          winnerteamid?: number | null;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "games_ateamid_fkey";
            columns: ["ateamid"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "games_hteamid_fkey";
            columns: ["hteamid"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "games_winnerteamid_fkey";
            columns: ["winnerteamid"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      models: {
        Row: {
          ateamid: number;
          confidence: number | null;
          created_at: string;
          err: number | null;
          gameid: number;
          hteamid: number;
          round: number;
          source: string | null;
          sourceid: number;
          tipteamid: number;
        };
        Insert: {
          ateamid: number;
          confidence?: number | null;
          created_at?: string;
          err?: number | null;
          gameid: number;
          hteamid: number;
          round: number;
          source?: string | null;
          sourceid: number;
          tipteamid: number;
        };
        Update: {
          ateamid?: number;
          confidence?: number | null;
          created_at?: string;
          err?: number | null;
          gameid?: number;
          hteamid?: number;
          round?: number;
          source?: string | null;
          sourceid?: number;
          tipteamid?: number;
        };
        Relationships: [
          {
            foreignKeyName: "models_ateamid_fkey";
            columns: ["ateamid"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "models_gameid_fkey";
            columns: ["gameid"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "models_hteamid_fkey";
            columns: ["hteamid"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "models_tipteamid_fkey";
            columns: ["tipteamid"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      settings: {
        Row: {
          id: string;
          updated: string;
          value: string;
        };
        Insert: {
          id: string;
          updated?: string;
          value: string;
        };
        Update: {
          id?: string;
          updated?: string;
          value?: string;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          abbrev: string;
          debut: number | null;
          id: number;
          logo: string | null;
          name: string;
          retirement: number | null;
        };
        Insert: {
          abbrev: string;
          debut?: number | null;
          id?: number;
          logo?: string | null;
          name: string;
          retirement?: number | null;
        };
        Update: {
          abbrev?: string;
          debut?: number | null;
          id?: number;
          logo?: string | null;
          name?: string;
          retirement?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_focused_h2h: {
        Args: { gameid: number };
        Returns: {
          abehinds: number | null;
          agoals: number | null;
          ascore: number;
          ateamid: number;
          complete: number;
          created_at: string;
          date: string | null;
          hbehinds: number | null;
          hgoals: number | null;
          hscore: number;
          hteamid: number;
          id: number;
          is_final: number;
          is_grand_final: number;
          localtime: string;
          round: number;
          venue: string;
          winnerteamid: number | null;
          year: number;
        }[];
      };
      get_focused_venue_h2h: {
        Args: { teamid: number; limit_arg: number; venue_arg: string };
        Returns: {
          abehinds: number | null;
          agoals: number | null;
          ascore: number;
          ateamid: number;
          complete: number;
          created_at: string;
          date: string | null;
          hbehinds: number | null;
          hgoals: number | null;
          hscore: number;
          hteamid: number;
          id: number;
          is_final: number;
          is_grand_final: number;
          localtime: string;
          round: number;
          venue: string;
          winnerteamid: number | null;
          year: number;
        }[];
      };
      get_games_by_teams: {
        Args: { hteamid_arg: number; ateamid_arg: number };
        Returns: {
          id: number;
          hteamid: number;
          ateamid: number;
          date: string;
          winnerteamid: number;
        }[];
      };
      getfocusedh2h: {
        Args: { hteamid_arg: number; ateamid_arg: number };
        Returns: {
          abehinds: number | null;
          agoals: number | null;
          ascore: number;
          ateamid: number;
          complete: number;
          created_at: string;
          date: string | null;
          hbehinds: number | null;
          hgoals: number | null;
          hscore: number;
          hteamid: number;
          id: number;
          is_final: number;
          is_grand_final: number;
          localtime: string;
          round: number;
          venue: string;
          winnerteamid: number | null;
          year: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
