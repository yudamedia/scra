import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Call02Icon,
  Mail01Icon,
  Location01Icon,
  Facebook01Icon,
} from "@hugeicons/core-free-icons";
import { ContactForm } from "@/components/contact-form";
import { renderInlineLinks } from "@/lib/inline-links";

export const revalidate = 60;

export const metadata = {
  title: "Contact — South Coast Residents' Association",
};

export default async function ContactPage() {
  const payload = await getPayloadClient();
  const [pageIntros, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: "page-intros" }),
    payload.findGlobal({ slug: "site-settings" }),
  ]);
  const intro = pageIntros.contact;
  const contact = siteSettings.contact;
  const facebook = (siteSettings.social ?? []).find((s) => s.platform === "facebook");

  return (
    <>
      <section
        className="text-white py-16 md:py-20"
        style={{
          background:
            "linear-gradient(rgba(13,43,91,.72), rgba(7,28,61,.85)), url(/hero/homepage.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-[min(1280px,92%)]">
          {intro?.eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80 mb-2">
              {intro.eyebrow}
            </p>
          )}
          <h1 className="text-white mb-4">{intro?.heading}</h1>
          {intro?.paragraph && <p className="max-w-2xl text-white/90 text-lg">{intro.paragraph}</p>}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)] grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {contact?.phone && (
              <a
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                className="flex items-start gap-4 bg-card rounded-lg shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-secondary/10 text-secondary shrink-0">
                  <HugeiconsIcon icon={Call02Icon} size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-primary text-base mb-0.5">Phone</h3>
                  <p className="text-muted-foreground text-sm">{contact.phone}</p>
                </div>
              </a>
            )}

            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-start gap-4 bg-card rounded-lg shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-secondary/10 text-secondary shrink-0">
                  <HugeiconsIcon icon={Mail01Icon} size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-primary text-base mb-0.5">Email</h3>
                  <p className="text-muted-foreground text-sm">{contact.email}</p>
                </div>
              </a>
            )}

            {contact?.addressLine1 && (
              <div className="flex items-start gap-4 bg-card rounded-lg shadow-sm p-6">
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-secondary/10 text-secondary shrink-0">
                  <HugeiconsIcon icon={Location01Icon} size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-primary text-base mb-0.5">Location</h3>
                  <p className="text-muted-foreground text-sm">{contact.addressLine1}</p>
                  {contact.addressDetail && (
                    <p className="text-muted-foreground text-xs mt-1 italic">{contact.addressDetail}</p>
                  )}
                </div>
              </div>
            )}

            {facebook && (
              <a
                href={facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 bg-card rounded-lg shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-secondary/10 text-secondary shrink-0">
                  <HugeiconsIcon icon={Facebook01Icon} size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-primary text-base mb-0.5">Facebook</h3>
                  <p className="text-muted-foreground text-sm">SCRA Community Group</p>
                </div>
              </a>
            )}

            {intro?.membershipCalloutText && (
              <div className="bg-primary rounded-lg p-6 text-white">
                <h3 className="text-white text-base mb-1.5">Membership queries?</h3>
                <p className="text-white/80 text-sm">{renderInlineLinks(intro.membershipCalloutText)}</p>
              </div>
            )}
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
