"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { getAppAuth } from "@/lib/getAppAuth";

import "bootstrap/dist/css/bootstrap.css";
import BootstrapClient from "@/components/BootstrapClient";
import { Nav } from "@/components/Nav";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user] = useAuthState(getAppAuth());

  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="mt-3">
           <Nav />
          </header>
          <main>{children}</main>
        </div>
        <BootstrapClient />
      </body>
    </html>
  );
}
