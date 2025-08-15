"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { getAppAuth } from "@/lib/getAppAuth";

import "bootstrap/dist/css/bootstrap.css";
import BootstrapClient from "@/components/BootstrapClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(getAppAuth());

  return (
    <html lang="en">
      <head>
        <title>Tier Vote</title>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>
        {loading ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
          >
            <div
              className="spinner-border text-secondary mb-3"
              role="status"
              aria-label="Loading"
            />
            <div className="text-muted small">Loading...</div>
          </div>
        ) : (
          <div className="container">
            <header className="mt-3">
              <Nav />
            </header>
            <main>{children}</main>
            <Footer />
          </div>
        )}
        <BootstrapClient />
      </body>
    </html>
  );
}
