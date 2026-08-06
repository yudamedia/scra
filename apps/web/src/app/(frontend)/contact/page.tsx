import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Call02Icon,
  Mail01Icon,
  Location01Icon,
  Facebook01Icon,
} from "@hugeicons/core-free-icons";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact — South Coast Residents' Association",
};

export default function ContactPage() {
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
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80 mb-2">
            Contact
          </p>
          <h1 className="text-white mb-4">Get in Touch</h1>
          <p className="max-w-2xl text-white/90 text-lg">
            Questions, concerns, or want to get involved? Reach out to SCRA
            using the details below.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)] grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <a
              href="tel:+254720998258"
              className="flex items-start gap-4 bg-card rounded-lg shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-secondary/10 text-secondary shrink-0">
                <HugeiconsIcon icon={Call02Icon} size={22} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-primary text-base mb-0.5">Phone</h3>
                <p className="text-muted-foreground text-sm">+254 720 998258</p>
              </div>
            </a>

            <a
              href="mailto:chair@scra.co.ke"
              className="flex items-start gap-4 bg-card rounded-lg shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-secondary/10 text-secondary shrink-0">
                <HugeiconsIcon icon={Mail01Icon} size={22} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-primary text-base mb-0.5">Email</h3>
                <p className="text-muted-foreground text-sm">chair@scra.co.ke</p>
              </div>
            </a>

            <div className="flex items-start gap-4 bg-card rounded-lg shadow-sm p-6">
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-secondary/10 text-secondary shrink-0">
                <HugeiconsIcon icon={Location01Icon} size={22} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-primary text-base mb-0.5">Location</h3>
                <p className="text-muted-foreground text-sm">
                  Diani, Kenya
                </p>
                <p className="text-muted-foreground text-xs mt-1 italic">
                  A specific office address will be published here once
                  confirmed.
                </p>
              </div>
            </div>

            <a
              href="https://www.facebook.com/groups/228531647320531/"
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

            <div className="bg-primary rounded-lg p-6 text-white">
              <h3 className="text-white text-base mb-1.5">Membership queries?</h3>
              <p className="text-white/80 text-sm">
                Visit the{" "}
                <Link href="/membership" className="underline hover:text-white">
                  Membership page
                </Link>{" "}
                for how to join, renew, or pay by M-Pesa.
              </p>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
