import Link from "next/link";

import { landingHeroImage, playerAvatars } from "@/lib/demo-visuals";

export default function HomePage() {
  return (
    <main className="page-shell landing-page">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="landing-kicker">Student game nights</p>
          <h1>
            Find Your Next
            <br />
            Games Night
          </h1>
          <p className="landing-subcopy">Live sessions. Fast joins. Easy hosting.</p>
          <div className="inline-actions">
            <Link className="button-accent" href="/auth">
              Register
            </Link>
            <Link className="button-outline" href="/sessions">
              Discover
            </Link>
          </div>
          <div className="avatar-strip">
            <div className="avatar-stack">
              {playerAvatars.map((avatar) => (
                <img alt="" className="avatar-badge" key={avatar} src={avatar} />
              ))}
            </div>
            <span>+500 active students</span>
          </div>
        </div>

        <div className="landing-visual">
          <div className="hero-image-frame tilt-right">
            <img alt="" src={landingHeroImage} />
            <div className="floating-chip">
              <span>Trending Now</span>
              <strong>Main Hall Poker Night</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-grid">
        <article className="marketing-card large">
          <p className="card-tag">Discover</p>
          <h2>Campus sessions, live now.</h2>
        </article>
        <article className="marketing-card accent">
          <p className="card-tag">Host</p>
          <h2>Post your own night.</h2>
        </article>
        <article className="marketing-card stats">
          <strong>12K+</strong>
          <span>Seats claimed</span>
        </article>
      </section>

      <section className="landing-cta">
        <h2>Ready to play?</h2>
        <div className="inline-actions">
          <Link className="button-accent" href="/sessions">
            Explore
          </Link>
          <Link className="button-outline" href="/sessions/new">
            Create Event
          </Link>
        </div>
      </section>
    </main>
  );
}
