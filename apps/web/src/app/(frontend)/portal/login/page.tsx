"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getRecaptchaToken } from "@/lib/recaptcha-client";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const recaptchaToken = await getRecaptchaToken("portal_login");
      const { error } = await authClient.signIn.email(
        { email, password, callbackURL: "/portal" },
        { body: { recaptchaToken } },
      );
      if (error) {
        setStatus("error");
      } else {
        window.location.href = "/portal";
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-[min(480px,92%)]">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2 text-center">
          Member Portal
        </p>
        <h1 className="mb-4 text-center">Sign In</h1>
        <p className="text-muted-foreground text-center mb-8">
          Portal accounts are created automatically once your membership payment is confirmed.
        </p>

        <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-sm p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <a href="/portal/forgot-password" className="text-sm text-secondary hover:underline">
                Forgot your password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {status === "error" && (
            <p className="text-sm text-destructive">
              Incorrect email or password. Please try again.
            </p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {status === "sending" ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-muted-foreground text-sm text-center mt-8">
          Not a member yet?{" "}
          <a href="/membership" className="text-secondary hover:underline">
            Join SCRA
          </a>
        </p>
      </div>
    </section>
  );
}
