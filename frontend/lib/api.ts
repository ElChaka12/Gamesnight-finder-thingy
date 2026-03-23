export type GameNight = {
  id: number;
  title: string;
  game_title: string;
  description: string;
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
};

const FALLBACK_GAME_NIGHTS: GameNight[] = [
  {
    id: 1,
    title: "Residence Hall Kickoff",
    game_title: "Codenames",
    description: "A light, loud opener for students trying to meet new people on week one.",
    host_name: "Lebo",
    campus_name: "Main Campus",
    venue: "Tutu Hall Common Room",
    starts_at: "2026-03-25T18:00:00+02:00",
    ends_at: "2026-03-25T20:00:00+02:00",
    skill_level: "beginner",
    skill_level_label: "Beginner friendly",
    spots_total: 10,
    spots_taken: 4,
    available_spots: 6,
    is_featured: true,
    contact_link: "https://example.com/gamenight/codenames",
  },
  {
    id: 2,
    title: "Strategy Society Friday Table",
    game_title: "Catan",
    description: "A strategy night with just enough chaos to feel like a proper campus rivalry.",
    host_name: "Aiden",
    campus_name: "Engineering Campus",
    venue: "Innovation Hub Atrium",
    starts_at: "2026-03-27T18:00:00+02:00",
    ends_at: "2026-03-27T21:00:00+02:00",
    skill_level: "mixed",
    skill_level_label: "Mixed skill levels",
    spots_total: 6,
    spots_taken: 5,
    available_spots: 1,
    is_featured: true,
    contact_link: "https://example.com/gamenight/catan",
  },
  {
    id: 3,
    title: "Late-Night Bluffing Club",
    game_title: "Blood on the Clocktower",
    description: "A bigger social-deduction table for students who want an event with some theatre.",
    host_name: "Nandi",
    campus_name: "South Campus",
    venue: "Student Centre Rooftop",
    starts_at: "2026-03-29T19:00:00+02:00",
    ends_at: "2026-03-29T22:00:00+02:00",
    skill_level: "competitive",
    skill_level_label: "Competitive table",
    spots_total: 12,
    spots_taken: 7,
    available_spots: 5,
    is_featured: false,
    contact_link: "https://example.com/gamenight/clocktower",
  },
];

export function getApiBaseUrl() {
  return process.env.API_BASE_URL ?? "http://127.0.0.1:8000/api";
}

export async function getGameNights() {
  const apiBaseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${apiBaseUrl}/game-nights/`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const gameNights = (await response.json()) as GameNight[];

    return {
      apiAvailable: true,
      apiBaseUrl,
      gameNights,
    };
  } catch {
    return {
      apiAvailable: false,
      apiBaseUrl,
      gameNights: FALLBACK_GAME_NIGHTS,
    };
  }
}
