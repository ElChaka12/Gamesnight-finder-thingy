import { AuthPanel } from "@/components/auth-panel";
import { landingHeroImage } from "@/lib/demo-visuals";

export default function AuthPage() {
  return (
    <main className="page-shell auth-page">
      <section className="auth-hero">
        <div className="auth-copy">
          <p className="landing-kicker">Join Tonight</p>
          <h1>
            Find Your
            <br />
            Crew.
          </h1>
          <p className="landing-subcopy">Register or login.</p>
        </div>
        <div className="auth-visual">
          <div className="hero-image-frame">
            <img alt="" src={landingHeroImage} />
          </div>
        </div>
      </section>
      <AuthPanel />
    </main>
  );
}
