"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronDownIcon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { authClient } from "@/lib/auth-client";
import type { MainNavigation, SiteSetting } from "@/payload-types";

type NavItem = NonNullable<MainNavigation["headerLinks"]>[number];

export function SiteHeader({
  settings,
  navigation,
}: {
  settings: SiteSetting;
  navigation: MainNavigation;
}) {
  const navLinks: NavItem[] = navigation.headerLinks ?? [];
  const logoUrl =
    (typeof settings.logo === "object" && settings.logo?.url) || "/api/media/file/logo-scra.jpg";
  const orgName = settings.orgName || "South Coast Residents' Association";

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    setMobileOpen(false);
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  function openDropdown(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  }

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="mx-auto w-[min(1280px,92%)] h-[90px] flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center shrink-0">
          <img src={logoUrl} alt={orgName} className="h-16 md:h-20 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.children?.length && openDropdown(link.label)}
              onMouseLeave={() => link.children?.length && scheduleClose()}
            >
              <Link
                href={link.href}
                className="flex items-center gap-1 font-medium text-primary hover:text-secondary transition-colors text-sm px-3 py-2 rounded-md hover:bg-muted"
                aria-expanded={link.children?.length ? openMenu === link.label : undefined}
              >
                {link.label}
                {!!link.children?.length && (
                  <HugeiconsIcon icon={ChevronDownIcon} size={14} strokeWidth={2} />
                )}
              </Link>
              {!!link.children?.length && openMenu === link.label && (
                <div className="absolute left-0 top-full pt-2 w-64 z-50">
                  <div className="bg-card rounded-lg shadow-lg border border-border py-2 grid">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-secondary transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {session ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/portal/login"
              className="inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors"
            >
              Member Login
            </Link>
          )}
        </div>

        <button
          type="button"
          className="lg:hidden text-primary p-2 -mr-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <HugeiconsIcon icon={mobileOpen ? Cancel01Icon : Menu01Icon} size={26} strokeWidth={2} />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card max-h-[calc(100vh-90px)] overflow-y-auto">
          <nav className="mx-auto w-[min(1280px,92%)] py-4 flex flex-col">
            {navLinks.map((link) => (
              <div key={link.href} className="border-b border-border last:border-0">
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    className="flex-1 py-3 font-medium text-primary text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {!!link.children?.length && (
                    <button
                      type="button"
                      className="p-3 text-primary"
                      onClick={() =>
                        setMobileSubOpen((v) => (v === link.label ? null : link.label))
                      }
                      aria-label={`Toggle ${link.label} submenu`}
                      aria-expanded={mobileSubOpen === link.label}
                    >
                      <HugeiconsIcon
                        icon={ChevronDownIcon}
                        size={18}
                        strokeWidth={2}
                        className={`transition-transform ${mobileSubOpen === link.label ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>
                {!!link.children?.length && mobileSubOpen === link.label && (
                  <div className="pb-2 pl-4 flex flex-col">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="py-2 text-sm text-muted-foreground hover:text-secondary transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleSignOut();
                }}
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-3 hover:bg-primary-dark transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/portal/login"
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-3 hover:bg-primary-dark transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Member Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
