"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { SessionCard } from "@/components/session-card";
import { joinGameNight, listGameNights } from "@/lib/api";
import type { GameNight } from "@/lib/types";

const FILTER_OPTIONS = [
  { value: "all", label: "All Events" },
  { value: "beginner", label: "Beginner" },
  { value: "mixed", label: "Mixed" },
  { value: "competitive", label: "Competitive" },
];

export function SessionBrowser() {
  const router = useRouter();
  const { isReady, session } = useAuth();
  const [gameNights, setGameNights] = useState<GameNight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const deferredSearch = useDeferredValue(search);

  async function handleRefresh() {
    setIsLoading(true);
    setError(null);

    try {
      const nextGameNights = await listGameNights(session?.token);
      setGameNights(nextGameNights);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Could not load sessions.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let isActive = true;

    async function hydrateGameNights() {
      setIsLoading(true);
      setError(null);

      try {
        const nextGameNights = await listGameNights(session?.token);

        if (isActive) {
          setGameNights(nextGameNights);
        }
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Could not load sessions.";

        if (isActive) {
          setError(message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void hydrateGameNights();

    return () => {
      isActive = false;
    };
  }, [isReady, session?.token]);

  async function handleJoin(gameNightId: number) {
    if (!session) {
      router.push("/auth");
      return;
    }

    setJoiningId(gameNightId);
    setError(null);
    setNotice(null);

    try {
      const updatedGameNight = await joinGameNight(gameNightId, session.token);
      setGameNights((currentGameNights) =>
        currentGameNights.map((gameNight) =>
          gameNight.id === updatedGameNight.id ? updatedGameNight : gameNight,
        ),
      );
      setNotice("Seat claimed.");
    } catch (joinError) {
      const message =
        joinError instanceof Error ? joinError.message : "Could not join the session.";
      setError(message);
    } finally {
      setJoiningId(null);
    }
  }

  const searchText = deferredSearch.trim().toLowerCase();
  const filteredGameNights = gameNights.filter((gameNight) => {
    const matchesSearch =
      !searchText ||
      [gameNight.title, gameNight.game_title, gameNight.campus_name, gameNight.venue]
        .join(" ")
        .toLowerCase()
        .includes(searchText);

    const matchesSkill =
      skillFilter === "all" || gameNight.skill_level.toLowerCase() === skillFilter;

    return matchesSearch && matchesSkill;
  });

  return (
    <section className="discover-shell">
      <div className="discover-head">
        <div>
          <h1>
            Find Your Vibe,
            <br />
            Play The Game.
          </h1>
        </div>
        <div className="search-pill">
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search games or hosts..."
            value={search}
          />
          <button className="button-accent" onClick={() => void handleRefresh()} type="button">
            Explore
          </button>
        </div>
      </div>

      <div className="filter-bar">
        {FILTER_OPTIONS.map((option) => (
          <button
            className={skillFilter === option.value ? "filter-chip active" : "filter-chip"}
            key={option.value}
            onClick={() => setSkillFilter(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      {notice ? <p className="message-banner success">{notice}</p> : null}
      {error ? <p className="message-banner error">{error}</p> : null}

      {isLoading ? (
        <div className="discover-empty">
          <h2>Loading sessions...</h2>
        </div>
      ) : filteredGameNights.length ? (
        <div className="discover-grid">
          {filteredGameNights[0] ? (
            <SessionCard
              gameNight={filteredGameNights[0]}
              index={0}
              isJoining={joiningId === filteredGameNights[0].id}
              onJoin={handleJoin}
              showAuthPrompt={!session}
              variant="featured"
            />
          ) : null}
          {filteredGameNights[1] ? (
            <SessionCard
              gameNight={filteredGameNights[1]}
              index={1}
              isJoining={joiningId === filteredGameNights[1].id}
              onJoin={handleJoin}
              showAuthPrompt={!session}
              variant="spotlight"
            />
          ) : null}
          {filteredGameNights[2] ? (
            <SessionCard
              gameNight={filteredGameNights[2]}
              index={2}
              isJoining={joiningId === filteredGameNights[2].id}
              onJoin={handleJoin}
              showAuthPrompt={!session}
              variant="compact"
            />
          ) : null}
          {filteredGameNights[3] ? (
            <SessionCard
              gameNight={filteredGameNights[3]}
              index={3}
              isJoining={joiningId === filteredGameNights[3].id}
              onJoin={handleJoin}
              showAuthPrompt={!session}
              variant="wide"
            />
          ) : null}
          {filteredGameNights[4] ? (
            <SessionCard
              gameNight={filteredGameNights[4]}
              index={4}
              isJoining={joiningId === filteredGameNights[4].id}
              onJoin={handleJoin}
              showAuthPrompt={!session}
              variant="flash"
            />
          ) : null}

          <article className="create-cta-card">
            <h3>Host Your Own Night?</h3>
            <Link className="button-accent" href="/sessions/new">
              Create Event
            </Link>
          </article>

          {filteredGameNights.slice(5).map((gameNight, index) => (
            <SessionCard
              gameNight={gameNight}
              index={index + 5}
              isJoining={joiningId === gameNight.id}
              key={gameNight.id}
              onJoin={handleJoin}
              showAuthPrompt={!session}
              variant="compact"
            />
          ))}
        </div>
      ) : (
        <div className="discover-empty">
          <h2>No sessions right now.</h2>
        </div>
      )}
    </section>
  );
}
