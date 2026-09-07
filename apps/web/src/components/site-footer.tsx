import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon, Mail01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { ICON_MAP } from "@/lib/icon-options";
import type { MainNavigation, SiteSetting } from "@/payload-types";

const SOCIAL_ICON_MAP: Record<string, string> = {
  facebook: "facebook-01",
};

export function SiteFooter({
  settings,
  navigation,
}: {
  settings: SiteSetting;
  navigation: MainNavigation;
}) {
  const logoUrl =
    (typeof settings.logo === "object" && settings.logo?.url) || "/api/media/file/logo-scra.jpg";
  const orgName = settings.orgName || "South Coast Residents' Association";
  const quickLinks = navigation.footerQuickLinks ?? [];
  const resourceLinks = navigation.footerResourceLinks ?? [];
  const legalLinks = navigation.footerLegalLinks ?? [];
  const social = settings.social ?? [];

  return (
    <footer className="bg-primary text-white border-t border-white/15">
      <div className="mx-auto w-[min(1280px,92%)] py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img src={logoUrl} alt={orgName} className="h-12 w-auto rounded" />
            <span className="font-heading font-bold leading-tight text-white">{orgName}</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{settings.tagline}</p>
        </div>

        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-wide mb-4">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/75 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-wide mb-4">
            Resources
          </h3>
          <ul className="flex flex-col gap-2.5">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/75 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-wide mb-4">
            Get in Touch
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            {settings.contact?.addressLine1 && (
              <li className="flex items-start gap-2 text-white/75">
                <HugeiconsIcon icon={Location01Icon} size={18} strokeWidth={2} className="shrink-0 mt-0.5" />
                <span>{settings.contact.addressLine1}</span>
              </li>
            )}
            {settings.contact?.phone && (
              <li className="flex items-start gap-2">
                <HugeiconsIcon icon={Call02Icon} size={18} strokeWidth={2} className="shrink-0 mt-0.5 text-white/75" />
                <a
                  href={`tel:${settings.contact.phone.replace(/\s+/g, "")}`}
                  className="text-white/75 hover:text-white transition-colors"
                >
                  {settings.contact.phone}
                </a>
              </li>
            )}
            {settings.contact?.email && (
              <li className="flex items-start gap-2">
                <HugeiconsIcon icon={Mail01Icon} size={18} strokeWidth={2} className="shrink-0 mt-0.5 text-white/75" />
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="text-white/75 hover:text-white transition-colors"
                >
                  {settings.contact.email}
                </a>
              </li>
            )}
            {social.length > 0 && (
              <li className="flex items-center gap-3 mt-1">
                {social.map((entry) => {
                  const icon = ICON_MAP[SOCIAL_ICON_MAP[entry.platform] ?? ""];
                  if (!icon) return null;
                  return (
                    <a
                      key={entry.id ?? entry.url}
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${orgName} on ${entry.platform}`}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <HugeiconsIcon icon={icon} size={18} strokeWidth={2} />
                    </a>
                  );
                })}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto w-[min(1280px,92%)] py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} {settings.footerLegal?.copyrightName || orgName}. All
            rights reserved.
          </p>
          <p className="flex items-center gap-2">
            {legalLinks.map((link, i) => (
              <span key={link.href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">|</span>}
                <Link href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </span>
            ))}
            {settings.footerLegal?.builtByText && (
              <>
                <span aria-hidden="true">|</span>
                <span>{settings.footerLegal.builtByText}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
