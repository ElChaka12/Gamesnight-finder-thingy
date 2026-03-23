import { getGameNights } from "@/lib/api";

function formatEventWindow(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const date = new Intl.DateTimeFormat("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(start);

  const time = new Intl.DateTimeFormat("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date} · ${time.format(start)} - ${time.format(end)}`;
}

export default async function Home() {
  const { apiAvailable, apiBaseUrl, gameNights } = await getGameNights();
  const featuredGameNights = gameNights.filter((gameNight) => gameNight.is_featured);
  const totalOpenSeats = gameNights.reduce(
    (seatCount, gameNight) => seatCount + gameNight.available_spots,
    0,
  );
  const campuses = [...new Set(gameNights.map((gameNight) => gameNight.campus_name))];

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">College socials without the group-chat scramble</p>
          <h1>Find a campus game night before the good seats disappear.</h1>
          <p className="lead">
            Gamesnight Finder gives student hosts a clean way to publish their next table,
            and gives everyone else one place to browse what is happening across campus.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#browse">
              Browse upcoming nights
            </a>
            <a className="secondary-link" href="http://127.0.0.1:8000/admin/">
              Open Django admin
            </a>
          </div>
        </div>

        <aside className="hero-panel">
          <div className="panel-stat">
            <span>Featured nights</span>
            <strong>{featuredGameNights.length}</strong>
          </div>
          <div className="panel-stat">
            <span>Open seats right now</span>
            <strong>{totalOpenSeats}</strong>
          </div>
          <div className="panel-stat">
            <span>Campuses represented</span>
            <strong>{campuses.length}</strong>
          </div>
          <div className="panel-detail">
            <p>Launch path</p>
            <ul>
              <li>Start with board-game meetups and social tables.</li>
              <li>Add host accounts and RSVP tracking next.</li>
              <li>Expand into tournaments, clubs, and study-break events.</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="status-row">
        <div className={`status-card ${apiAvailable ? "online" : "offline"}`}>
          <span className="status-pill">{apiAvailable ? "API live" : "Preview mode"}</span>
          <p>
            {apiAvailable
              ? `Frontend is reading live Django data from ${apiBaseUrl}.`
              : `Backend not detected at ${apiBaseUrl}, so the page is showing local preview events.`}
          </p>
        </div>
        <div className="campus-strip">
          {campuses.map((campus) => (
            <span key={campus}>{campus}</span>
          ))}
        </div>
      </section>

      <section className="section-heading" id="browse">
        <div>
          <p className="eyebrow">Upcoming sessions</p>
          <h2>Game nights students can join this week.</h2>
        </div>
        <p className="section-copy">
          The first version is intentionally simple: clean listings, visible seat counts, and
          enough personality to make a hosted table feel real before you add sign-in and booking.
        </p>
      </section>

      <section className="cards-grid">
        {gameNights.map((gameNight) => (
          <article className="game-card" key={gameNight.id}>
            <div className="card-topline">
              <span>{gameNight.campus_name}</span>
              <span>{gameNight.skill_level_label}</span>
            </div>
            <div className="card-header">
              <div>
                <p className="game-name">{gameNight.game_title}</p>
                <h3>{gameNight.title}</h3>
              </div>
              {gameNight.is_featured ? <span className="featured-badge">Featured</span> : null}
            </div>
            <p className="card-description">{gameNight.description}</p>
            <dl className="card-meta">
              <div>
                <dt>When</dt>
                <dd>{formatEventWindow(gameNight.starts_at, gameNight.ends_at)}</dd>
              </div>
              <div>
                <dt>Where</dt>
                <dd>{gameNight.venue}</dd>
              </div>
              <div>
                <dt>Host</dt>
                <dd>{gameNight.host_name}</dd>
              </div>
              <div>
                <dt>Seats left</dt>
                <dd>{gameNight.available_spots}</dd>
              </div>
            </dl>
            <div className="card-footer">
              <span>
                {gameNight.spots_taken}/{gameNight.spots_total} seats claimed
              </span>
              <a href={gameNight.contact_link} target="_blank" rel="noreferrer">
                Reserve interest
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="info-grid">
        <article className="info-card">
          <p className="eyebrow">For hosts</p>
          <h3>Post a table in under a minute.</h3>
          <p>
            Start with a title, venue, time, seat count, and one line that tells people what kind
            of night they are walking into.
          </p>
        </article>
        <article className="info-card accent-card">
          <p className="eyebrow">For students</p>
          <h3>Find the right vibe before you leave your room.</h3>
          <p>
            Beginner-friendly tables, louder social sessions, and more competitive nights can live
            side by side without forcing everyone into the same event format.
          </p>
        </article>
        <article className="info-card">
          <p className="eyebrow">For the roadmap</p>
          <h3>Next features already have a place to land.</h3>
          <p>
            The backend is ready for authentication, RSVP records, host ownership, and search
            filters when you move past the initial launch.
          </p>
        </article>
      </section>
    </main>
  );
}
