import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/areas", label: "Area Guides" },
  { href: "/issues", label: "Issues" },
  { href: "/directory", label: "Directory" },
  { href: "/committees", label: "Committees" },
  { href: "/leadership", label: "Leadership" },
];

export function SiteHeader() {
  return (
    <header className="h-[90px] bg-card shadow-sm sticky top-0 z-40 flex items-center">
      <div className="mx-auto w-[min(1280px,92%)] flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-lg text-primary leading-tight">
          South Coast Residents&apos; Association
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-primary hover:text-secondary transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
