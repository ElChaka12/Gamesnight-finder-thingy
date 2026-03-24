"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { useAuth } from "@/components/auth-provider";
import { createGameNight } from "@/lib/api";
import { hostSetupImage } from "@/lib/demo-visuals";
import type { GameNight } from "@/lib/types";

const INITIAL_FORM = {
  title: "",
  game_title: "",
  description: "",
  campus_name: "",
  venue: "",
  starts_at: "",
  ends_at: "",
  skill_level: "mixed",
  spots_total: "10",
  contact_link: "",
};

export function CreateSessionForm() {
  const { isReady, session } = useAuth();
  const [formState, setFormState] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [createdSession, setCreatedSession] = useState<GameNight | null>(null);
  const [isPending, startTransition] = useTransition();
  const hypeWidth = Math.min(Math.max(Number(formState.spots_total) * 8, 18), 100);

  if (!isReady) {
    return (
      <section className="host-shell">
        <article className="host-form-card">
          <h2>Loading...</h2>
        </article>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="host-shell single-column">
        <article className="host-form-card">
          <p className="card-tag">Login required</p>
          <h2>Sign in before you host.</h2>
          <div className="inline-actions">
            <Link className="button-accent" href="/auth">
              Login
            </Link>
            <Link className="button-outline" href="/sessions">
              Back
            </Link>
          </div>
        </article>
      </section>
    );
  }

  function updateField(name: string, value: string) {
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCreatedSession(null);

    const currentSession = session;

    if (!currentSession) {
      return;
    }

    startTransition(async () => {
      try {
        const nextSession = await createGameNight(
          {
            ...formState,
            spots_total: Number(formState.spots_total),
          },
          currentSession.token,
        );

        setCreatedSession(nextSession);
        setFormState(INITIAL_FORM);
      } catch (submitError) {
        const message =
          submitError instanceof Error ? submitError.message : "Could not create the session.";
        setError(message);
      }
    });
  }

  return (
    <section className="host-shell">
      <aside className="host-preview">
        <div className="host-image-card">
          <img alt="" src={hostSetupImage} />
          <div className="host-float-card">
            <h2>READY TO HOST?</h2>
            <p>Set the vibe. Open the seats.</p>
          </div>
        </div>
        <div className="host-mini-grid">
          <article className="host-mini-card">
            <span>Instant matching</span>
          </article>
          <article className="host-mini-card">
            <span>Campus-safe meetups</span>
          </article>
        </div>
      </aside>

      <article className="host-form-card">
        <div className="host-heading">
          <p className="card-tag">Host</p>
          <h1>Host a Games Night</h1>
        </div>

        <form className="host-form-grid" onSubmit={handleSubmit}>
          <label className="field full-span">
            <span>Event title</span>
            <input
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Super Smash Night"
              required
              value={formState.title}
            />
          </label>
          <label className="field">
            <span>Game</span>
            <input
              onChange={(event) => updateField("game_title", event.target.value)}
              placeholder="Catan"
              required
              value={formState.game_title}
            />
          </label>
          <label className="field">
            <span>Max players</span>
            <input
              min="1"
              onChange={(event) => updateField("spots_total", event.target.value)}
              required
              type="number"
              value={formState.spots_total}
            />
          </label>
          <label className="field">
            <span>Date and time</span>
            <input
              onChange={(event) => updateField("starts_at", event.target.value)}
              required
              type="datetime-local"
              value={formState.starts_at}
            />
          </label>
          <label className="field">
            <span>Ends</span>
            <input
              onChange={(event) => updateField("ends_at", event.target.value)}
              required
              type="datetime-local"
              value={formState.ends_at}
            />
          </label>
          <label className="field">
            <span>Location</span>
            <input
              onChange={(event) => updateField("venue", event.target.value)}
              placeholder="Student Union, Room 402"
              required
              value={formState.venue}
            />
          </label>
          <label className="field">
            <span>Campus</span>
            <input
              onChange={(event) => updateField("campus_name", event.target.value)}
              placeholder="Main Campus"
              required
              value={formState.campus_name}
            />
          </label>
          <label className="field">
            <span>Skill</span>
            <select
              onChange={(event) => updateField("skill_level", event.target.value)}
              value={formState.skill_level}
            >
              <option value="beginner">Beginner friendly</option>
              <option value="mixed">Mixed skill levels</option>
              <option value="competitive">Competitive table</option>
            </select>
          </label>
          <label className="field full-span">
            <span>Description</span>
            <textarea
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="What kind of table is this?"
              required
              rows={4}
              value={formState.description}
            />
          </label>
          <label className="field full-span">
            <span>Contact link</span>
            <input
              onChange={(event) => updateField("contact_link", event.target.value)}
              placeholder="Optional signup link"
              type="url"
              value={formState.contact_link}
            />
          </label>

          <div className="hype-meter full-span">
            <div className="hype-copy">
              <span>Hype potential</span>
              <strong>Max capacity</strong>
            </div>
            <div className="hype-track">
              <div className="hype-fill" style={{ width: `${hypeWidth}%` }} />
            </div>
          </div>

          {error ? <p className="message-banner error full-span">{error}</p> : null}
          {createdSession ? (
            <p className="message-banner success full-span">
              Created: {createdSession.title}
            </p>
          ) : null}

          <button className="button-accent full-width" disabled={isPending} type="submit">
            {isPending ? "Creating..." : "Create Event"}
          </button>
        </form>
      </article>
    </section>
  );
}
