"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getRecaptchaToken } from "@/lib/recaptcha-client";

export default function PortalForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const recaptchaToken = await getRecaptchaToken("portal_forgot_password");
      const { error } = await authClient.requestPasswordReset(
        { email, redirectTo: "/portal/reset-password" },
        { body: { recaptchaToken } },
      );
      setStatus(error ? "error" : "sent");
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
        <h1 className="mb-4 text-center">Reset Your Password</h1>
        <p className="text-muted-foreground text-center mb-8">
          Enter the email on file for your membership to receive a password reset link.
        </p>

        {status === "sent" ? (
          <div className="bg-card rounded-lg shadow-sm p-6 text-center">
            <p className="text-foreground">
              If that email is linked to a Member Portal account, a reset link is on its way.
              Check your inbox.
            </p>
          </div>
        ) : (
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
            {status === "error" && (
              <p className="text-sm text-destructive">
                Something went wrong sending your reset link. Please try again.
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {status === "sending" ? "Sending link…" : "Email me a reset link"}
            </button>
          </form>
        )}

        <p className="text-muted-foreground text-sm text-center mt-8">
          <a href="/portal/login" className="text-secondary hover:underline">
            Back to sign in
          </a>
        </p>
      </div>
    </section>
  );
}
