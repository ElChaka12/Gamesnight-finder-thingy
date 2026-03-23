import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
