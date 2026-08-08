import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Facebook01Icon,
  Call02Icon,
  Mail01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/issues", label: "Issues" },
  { href: "/news", label: "Newsroom" },
  { href: "/events", label: "Events" },
];

const resourceLinks = [
  { href: "/documents", label: "Knowledge Centre" },
  { href: "/directory", label: "Community Directory" },
  { href: "/areas", label: "Area Guides" },
  { href: "/report-issue", label: "Report an Issue" },
  { href: "/membership/apply", label: "Apply for Membership" },
  { href: "/portal/login", label: "Member Login" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteFooter() {
  return (
    <footer className="bg-primary text-white border-t border-white/15">
      <div className="mx-auto w-[min(1280px,92%)] py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/api/media/file/logo-scra.jpg"
              alt="South Coast Residents' Association"
              className="h-12 w-auto rounded"
            />
            <span className="font-heading font-bold leading-tight text-white">
              South Coast
              <br />
              Residents&apos; Association
            </span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Representing residents, property owners and businesses from
            Likoni to Lunga Lunga since 1983.
          </p>
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
            <li className="flex items-start gap-2 text-white/75">
              <HugeiconsIcon icon={Location01Icon} size={18} strokeWidth={2} className="shrink-0 mt-0.5" />
              <span>Diani, Kenya</span>
            </li>
            <li className="flex items-start gap-2">
              <HugeiconsIcon icon={Call02Icon} size={18} strokeWidth={2} className="shrink-0 mt-0.5 text-white/75" />
              <a href="tel:+254720998258" className="text-white/75 hover:text-white transition-colors">
                +254 720 998258
              </a>
            </li>
            <li className="flex items-start gap-2">
              <HugeiconsIcon icon={Mail01Icon} size={18} strokeWidth={2} className="shrink-0 mt-0.5 text-white/75" />
              <a href="mailto:chair@scra.co.ke" className="text-white/75 hover:text-white transition-colors">
                chair@scra.co.ke
              </a>
            </li>
            <li className="flex items-center gap-3 mt-1">
              <a
                href="https://www.facebook.com/groups/228531647320531/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SCRA on Facebook"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <HugeiconsIcon icon={Facebook01Icon} size={18} strokeWidth={2} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto w-[min(1280px,92%)] py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>© {new Date().getFullYear()} South Coast Residents&apos; Association. All rights reserved.</p>
          <p>Representing residents, property owners and businesses from Likoni to Lunga Lunga.</p>
        </div>
      </div>
    </footer>
  );
}
