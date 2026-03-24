"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { useAuth } from "@/components/auth-provider";

type Mode = "login" | "register";

export function AuthPanel() {
  const router = useRouter();
  const { isReady, session, login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isReady) {
    return (
      <section className="auth-panel-shell">
        <article className="auth-card">
          <h2>Loading...</h2>
        </article>
      </section>
    );
  }

  if (session) {
    return (
      <section className="auth-panel-shell">
        <article className="auth-card">
          <p className="card-tag">Signed in</p>
          <h2>{session.user.username}</h2>
          <div className="inline-actions">
            <button className="button-accent" onClick={() => router.push("/sessions")}>
              Discover
            </button>
            <button className="button-outline" onClick={() => router.push("/sessions/new")}>
              Host
            </button>
          </div>
        </article>
      </section>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        if (mode === "login") {
          await login(username, password);
        } else {
          await register(username, password);
        }

        router.push("/sessions");
      } catch (submitError) {
        const message =
          submitError instanceof Error ? submitError.message : "Unable to continue.";
        setError(message);
      }
    });
  }

  return (
    <section className="auth-panel-shell">
      <article className="auth-card">
        <div className="pill-switch" role="tablist" aria-label="Authentication mode">
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
            type="button"
          >
            Register
          </button>
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Username</span>
            <input
              autoComplete="username"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="your tag"
              required
              value={username}
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
              required
              type="password"
              value={password}
            />
          </label>
          {error ? <p className="message-banner error">{error}</p> : null}
          <button className="button-accent full-width" disabled={isPending} type="submit">
            {isPending ? "Working..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </article>
    </section>
  );
}
