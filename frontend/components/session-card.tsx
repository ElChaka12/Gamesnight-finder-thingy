import { getSessionArt } from "@/lib/demo-visuals";
import { formatEventWindow } from "@/lib/formatters";
import type { GameNight } from "@/lib/types";

type SessionCardVariant = "featured" | "spotlight" | "compact" | "wide" | "flash";

type SessionCardProps = {
  gameNight: GameNight;
  index: number;
  isJoining: boolean;
  onJoin: (gameNightId: number) => void;
  showAuthPrompt: boolean;
  variant: SessionCardVariant;
};

function getActionLabel(gameNight: GameNight, isJoining: boolean, showAuthPrompt: boolean) {
  if (isJoining) {
    return "Joining...";
  }
  if (gameNight.is_host) {
    return "Hosting";
  }
  if (gameNight.is_joined) {
    return "Joined";
  }
  if (gameNight.available_spots < 1) {
    return "Full";
  }
  if (showAuthPrompt) {
    return "Login";
  }
  return variantLabel(gameNight);
}

function variantLabel(gameNight: GameNight) {
  return gameNight.available_spots < 2 ? "Quick Join" : "Join Night";
}

export function SessionCard({
  gameNight,
  index,
  isJoining,
  onJoin,
  showAuthPrompt,
  variant,
}: SessionCardProps) {
  const image = getSessionArt(index);
  const actionLabel = getActionLabel(gameNight, isJoining, showAuthPrompt);
  const actionDisabled =
    isJoining || gameNight.is_host || gameNight.is_joined || gameNight.available_spots < 1;

  if (variant === "featured") {
    return (
      <article className="discovery-card featured-card">
        <img alt="" className="card-visual" src={image} />
        <div className="featured-overlay">
          <div className="featured-meta">
            <span className="card-tag">Hype Event</span>
            <span>{gameNight.spots_taken} Players Joined</span>
          </div>
          <h2>{gameNight.title}</h2>
          <p>{formatEventWindow(gameNight.starts_at, gameNight.ends_at)}</p>
          <button
            className="button-accent"
            disabled={actionDisabled}
            onClick={() => onJoin(gameNight.id)}
            type="button"
          >
            {actionLabel}
          </button>
        </div>
      </article>
    );
  }

  if (variant === "spotlight") {
    return (
      <article className="discovery-card spotlight-card">
        <div className="spotlight-image">
          <img alt="" src={image} />
        </div>
        <div>
          <h3>{gameNight.title}</h3>
          <p>{formatEventWindow(gameNight.starts_at, gameNight.ends_at)}</p>
        </div>
        <div className="card-action-row">
          <div className="mini-meter">
            <div className="mini-meter-fill" style={{ width: `${(gameNight.spots_taken / gameNight.spots_total) * 100}%` }} />
          </div>
          <button
            className="button-link"
            disabled={actionDisabled}
            onClick={() => onJoin(gameNight.id)}
            type="button"
          >
            {actionLabel}
          </button>
        </div>
      </article>
    );
  }

  if (variant === "wide") {
    return (
      <article className="discovery-card wide-card">
        <div className="wide-image">
          <img alt="" src={image} />
        </div>
        <div className="wide-content">
          <p className="card-tag">{gameNight.skill_level_label}</p>
          <h3>{gameNight.title}</h3>
          <p>{gameNight.description}</p>
          <div className="card-action-row">
            <button
              className="button-accent"
              disabled={actionDisabled}
              onClick={() => onJoin(gameNight.id)}
              type="button"
            >
              {actionLabel}
            </button>
            <span>{gameNight.available_spots} seats left</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "flash") {
    return (
      <article className="discovery-card flash-card">
        <span className="card-tag">Flash Event</span>
        <h3>{gameNight.title}</h3>
        <button
          className="button-outline"
          disabled={actionDisabled}
          onClick={() => onJoin(gameNight.id)}
          type="button"
        >
          {actionLabel}
        </button>
      </article>
    );
  }

  return (
    <article className="discovery-card compact-card">
      <div className="compact-image">
        <img alt="" src={image} />
      </div>
      <h3>{gameNight.title}</h3>
      <p>{gameNight.game_title}</p>
      <div className="card-action-row">
        <span>{gameNight.campus_name}</span>
        <button
          className="button-link"
          disabled={actionDisabled}
          onClick={() => onJoin(gameNight.id)}
          type="button"
        >
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
