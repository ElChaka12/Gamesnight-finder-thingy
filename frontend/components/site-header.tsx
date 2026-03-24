"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

import { useAuth } from "@/components/auth-provider";

const NAV_ITEMS = [
  { href: "/sessions", label: "Discover" },
  { href: "/sessions/new", label: "Host" },
  { href: "/", label: "Campus" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { isReady, session, logout } = useAuth();
  const [isPending, startTransition] = useTransition();

  return (
    <header className="site-header">
      <Link className="brand-link" href="/">
        <span className="brand-mark">GN</span>
        <div>
          <strong>Gamesnight Finder</strong>
          <p>Student nights, live seats.</p>
        </div>
      </Link>

      <nav className="site-nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <Link
            className={pathname === item.href ? "nav-link active" : "nav-link"}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="auth-chip">
        {isReady && session ? (
          <>
            <span className="user-dot">{session.user.username.slice(0, 1).toUpperCase()}</span>
            <span>{session.user.username}</span>
            <button
              className="button-ghost"
              disabled={isPending}
              onClick={() => startTransition(async () => logout())}
              type="button"
            >
              {isPending ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <>
            <Link className="header-link" href="/auth">
              Login
            </Link>
            <Link className="header-cta" href="/auth">
              Join Now
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
