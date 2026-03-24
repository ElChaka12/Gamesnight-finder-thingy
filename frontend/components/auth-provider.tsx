"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/api";
import type { AuthResponse } from "@/lib/types";

const STORAGE_KEY = "gamesnight-auth";

type AuthContextValue = {
  session: AuthResponse | null;
  isReady: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persistSession(nextSession: AuthResponse | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (nextSession) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedSession = window.localStorage.getItem(STORAGE_KEY);

    if (!savedSession) {
      const frame = window.requestAnimationFrame(() => {
        setIsReady(true);
      });

      return () => window.cancelAnimationFrame(frame);
    }

    let parsedSession: AuthResponse;

    try {
      parsedSession = JSON.parse(savedSession) as AuthResponse;
      void getCurrentUser(parsedSession.token)
        .then((user) => {
          const hydratedSession = { token: parsedSession.token, user };
          setSession(hydratedSession);
          persistSession(hydratedSession);
        })
        .catch(() => {
          setSession(null);
          persistSession(null);
        })
        .finally(() => {
          setIsReady(true);
        });
    } catch {
      persistSession(null);
      const frame = window.requestAnimationFrame(() => {
        setSession(null);
        setIsReady(true);
      });

      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  async function login(username: string, password: string) {
    const nextSession = await loginUser(username, password);
    setSession(nextSession);
    persistSession(nextSession);
    setIsReady(true);
  }

  async function register(username: string, password: string) {
    const nextSession = await registerUser(username, password);
    setSession(nextSession);
    persistSession(nextSession);
    setIsReady(true);
  }

  async function logout() {
    if (session) {
      try {
        await logoutUser(session.token);
      } catch {
        // Clear local state even if the backend token cannot be deleted.
      }
    }

    setSession(null);
    persistSession(null);
    setIsReady(true);
  }

  return (
    <AuthContext.Provider value={{ session, isReady, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
