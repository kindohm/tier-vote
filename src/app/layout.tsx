"use client";

// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAppAuth } from "@/lib/getAppAuth";
import { SignOut } from "@/components/SignOut";
import { SignIn } from "@/components/SignIn";

// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user] = useAuthState(getAppAuth());

  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif" }}>
        <header>
          <ul>
            <li>
              <a href="/">home</a>
            </li>
            <li>
              <a href="/create">create</a>
            </li>
            <li>{user ? <SignOut /> : <SignIn />}</li>
          </ul>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
