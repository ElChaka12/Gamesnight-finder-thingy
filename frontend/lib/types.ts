export type User = {
  id: number;
  username: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type GameNight = {
  id: number;
  title: string;
  game_title: string;
  description: string;
  host_username: string | null;
  host_name: string;
  campus_name: string;
  venue: string;
  starts_at: string;
  ends_at: string;
  skill_level: string;
  skill_level_label: string;
  spots_total: number;
  spots_taken: number;
  available_spots: number;
  is_featured: boolean;
  contact_link: string;
  is_joined: boolean;
  is_host: boolean;
};

export type CreateGameNightPayload = {
  title: string;
  game_title: string;
  description: string;
  campus_name: string;
  venue: string;
  starts_at: string;
  ends_at: string;
  skill_level: string;
  spots_total: number;
  contact_link: string;
};
