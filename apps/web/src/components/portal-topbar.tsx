"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { authClient } from "@/lib/auth-client";

const portalLinks = [
  { href: "/portal", label: "Member Portal" },
  { href: "/portal/account", label: "Account" },
  { href: "/portal/renew", label: "Renew" },
];

// Rendered sitewide from the root layout — visible on every page while a
// member session exists (not just inside /portal/*), hidden entirely
// otherwise. `useSession()` drives visibility instantly on sign-in/out; the
// membership number is fetched separately since it lives in Payload, not
// the Better Auth session.
export function PortalTopbar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [membershipNumber, setMembershipNumber] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  useEffect(() => {
    setMobileOpen(false);
  }, [session]);

  if (!session) return null;

  return (
    <div className="bg-primary text-white">
      <div className="mx-auto w-[min(1280px,92%)] h-14 flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden p-1 -ml-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close member menu" : "Open member menu"}
            aria-expanded={mobileOpen}
          >
            <HugeiconsIcon
              icon={mobileOpen ? Cancel01Icon : Menu01Icon}
              size={20}
              strokeWidth={2}
            />
          </button>
          <nav className="hidden lg:flex items-center gap-6">
            {portalLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-white/80 ${i === 0 ? "font-semibold" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {membershipNumber && (
            <span className="text-white/70 whitespace-nowrap">No. {membershipNumber}</span>
          )}
          <button type="button" onClick={handleSignOut} className="hover:text-white/80">
            Sign out
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-white/20">
          <div className="mx-auto w-[min(1280px,92%)] py-2 flex flex-col">
            {portalLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 hover:text-white/80 ${i === 0 ? "font-semibold" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
