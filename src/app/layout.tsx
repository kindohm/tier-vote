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
          <header>
            <nav>
              <ul>
                <li>
                  <a href="/">home</a>
                </li>
                <li>
                  <a href="/create">create</a>
                </li>
                <li>{user ? <SignOut /> : <SignIn />}</li>
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
