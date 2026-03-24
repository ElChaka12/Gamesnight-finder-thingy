import type { Metadata } from "next";

import { AuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: "Gamesnight Finder",
  description: "Find board-game sessions, open seats, and hosts across campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="app-body">
        <AuthProvider>
          <div className="app-frame">
            <SiteHeader />
            {children}
            <footer className="site-footer">
              <span className="footer-brand">Gamesnight Finder</span>
              <div className="footer-links">
                <span>Discover</span>
                <span>Host</span>
                <span>Campus</span>
                <span>Support</span>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
