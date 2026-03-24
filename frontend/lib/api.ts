import type {
  AuthResponse,
  CreateGameNightPayload,
  GameNight,
  User,
} from "@/lib/types";

type ApiRequestOptions = {
  method?: "GET" | "POST";
  token?: string;
  body?: object;
};

function parseApiError(payload: unknown) {
  if (typeof payload === "string" && payload) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    if ("detail" in payload && typeof payload.detail === "string") {
      return payload.detail;
    }

    for (const value of Object.values(payload)) {
      if (Array.isArray(value) && value.length) {
        return String(value[0]);
      }
    }
  }

  return "Request failed.";
}

async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers();

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Token ${options.token}`);
  }

  const response = await fetch(path, {
    method: options.method ?? (options.body ? "POST" : "GET"),
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as T | Record<string, unknown> | string;

  if (!response.ok) {
    throw new Error(parseApiError(payload));
  }

  return payload as T;
}

export function listGameNights(token?: string) {
  return apiRequest<GameNight[]>("/api/game-nights", { token });
}

export function joinGameNight(gameNightId: number, token: string) {
  return apiRequest<GameNight>(`/api/game-nights/${gameNightId}/join`, {
    method: "POST",
    token,
  });
}

export function createGameNight(payload: CreateGameNightPayload, token: string) {
  return apiRequest<GameNight>("/api/game-nights", {
    method: "POST",
    token,
    body: payload,
  });
}

export function loginUser(username: string, password: string) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { username, password },
  });
}

export function registerUser(username: string, password: string) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: { username, password },
  });
}

export function getCurrentUser(token: string) {
  return apiRequest<User>("/api/auth/me", { token });
}

export function logoutUser(token: string) {
  return apiRequest<void>("/api/auth/logout", {
    method: "POST",
    token,
  });
}
