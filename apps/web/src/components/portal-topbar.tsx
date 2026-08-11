"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

// Rendered sitewide from the root layout — visible on every page while a
// member session exists (not just inside /portal/*), hidden entirely
// otherwise. `useSession()` drives visibility instantly on sign-in/out; the
// membership number is fetched separately since it lives in Payload, not
// the Better Auth session.
export function PortalTopbar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [membershipNumber, setMembershipNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setMembershipNumber(null);
      return;
    }
    let cancelled = false;
    fetch("/api/portal/session-summary")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setMembershipNumber(data?.membershipNumber ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [session]);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/portal/login");
    router.refresh();
  }

  if (!session) return null;

  return (
    <div className="bg-primary text-white">
      <div className="mx-auto w-[min(1280px,92%)] h-14 flex items-center justify-between text-sm">
        <nav className="flex items-center gap-6">
          <Link href="/portal" className="font-semibold hover:text-white/80">
            Member Portal
          </Link>
          <Link href="/portal/account" className="hover:text-white/80">
            Account
          </Link>
          <Link href="/portal/renew" className="hover:text-white/80">
            Renew
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {membershipNumber && <span className="text-white/70">No. {membershipNumber}</span>}
          <button type="button" onClick={handleSignOut} className="hover:text-white/80">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
