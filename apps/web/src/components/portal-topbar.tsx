"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function PortalTopbar({ membershipNumber }: { membershipNumber?: string | null }) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/portal/login");
    router.refresh();
  }

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
