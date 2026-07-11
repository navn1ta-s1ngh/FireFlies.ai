"use client";

import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Login submit placeholder", { email, password });
    // Replace with real auth wiring when backend/auth flow is ready.
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-lg border border-border bg-navbar p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <Logo className="h-10 w-10" />
          <h1 className="mt-4 text-2xl font-semibold text-text-primary">Log in</h1>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-text-primary">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              className="rounded-md border border-border bg-button-dark px-4 py-2.5 text-text-primary outline-none transition focus:border-primary-purple"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-text-primary">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="rounded-md border border-border bg-button-dark px-4 py-2.5 text-text-primary outline-none transition focus:border-primary-purple"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary-purple px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-secondary-purple"
          >
            Log in
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm">
          <Link href="/placeholder" className="text-text-secondary transition-colors hover:text-text-primary">
            Forgot password?
          </Link>
          <Link href="/placeholder" className="text-text-secondary transition-colors hover:text-text-primary">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
