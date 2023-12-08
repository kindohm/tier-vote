"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { getAppAuth } from "@/lib/getAppAuth";
import { SignOut } from "@/components/SignOut";
import { SignIn } from "@/components/SignIn";

import "bootstrap/dist/css/bootstrap.css";
import BootstrapClient from "@/components/BootstrapClient";
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
            <nav>
              <ul className="nav">
                <li className="nav-item">
                  <a href="/" className="nav-link">
                    home
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/create" className="nav-link">
                    create
                  </a>
                </li>
                <li className="nav-item">{user ? <SignOut /> : <SignIn />}</li>
              </ul>
            </nav>
          </header>
          <main>{children}</main>
        </div>
        <BootstrapClient />
      </body>
    </html>
  );
}
