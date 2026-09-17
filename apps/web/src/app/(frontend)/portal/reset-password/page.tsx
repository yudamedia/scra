"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const invalidToken = searchParams.get("error") === "INVALID_TOKEN" || !token;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "mismatch" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus("mismatch");
      return;
    }
    if (!token) return;

    setStatus("saving");
    try {
      const { error } = await authClient.resetPassword({ newPassword, token });
      if (error) {
        setStatus("error");
      } else {
        setStatus("done");
      }
    } catch {
      setStatus("error");
    }
  }

  if (invalidToken) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-6 text-center">
        <p className="text-foreground mb-4">
          This password reset link is invalid or has expired.
        </p>
        <a href="/portal/forgot-password" className="text-secondary hover:underline">
          Request a new link
        </a>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="bg-card rounded-lg shadow-sm p-6 text-center">
        <p className="text-foreground mb-4">Your password has been set.</p>
        <a href="/portal/login" className="text-secondary hover:underline">
          Sign in
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-sm p-6 space-y-4">
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1.5">
          New password
        </label>
        <input
          id="newPassword"
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      {status === "mismatch" && (
        <p className="text-sm text-destructive">Passwords don&apos;t match.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">
          Something went wrong setting your password. Please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Set password"}
      </button>
    </form>
  );
}

export default function PortalResetPasswordPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-[min(480px,92%)]">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2 text-center">
          Member Portal
        </p>
        <h1 className="mb-8 text-center">Set Your Password</h1>

        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </section>
  );
}
