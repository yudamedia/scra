import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Notification01Icon,
  Discount01Icon,
  Megaphone01Icon,
  IdeaIcon,
  DocumentAttachmentIcon,
} from "@hugeicons/core-free-icons";

export const revalidate = 60;

const tiers = [
  {
    name: "Individual",
    price: "KES 3,000",
    period: "per year",
    detail: "One member.",
  },
  {
    name: "Family",
    price: "KES 5,000",
    period: "per year",
    detail: "2 family members hold voting rights at meetings.",
    featured: true,
  },
  {
    name: "Corporate",
    price: "KES 10,000",
    period: "per year",
    detail: "4 corporate members hold voting rights at meetings.",
  },
];

const benefits = [
  {
    icon: Notification01Icon,
    title: "Stay Informed",
    text: "Regular emails on upcoming events, special offers, and security threats or issues affecting the South Coast.",
  },
  {
    icon: Discount01Icon,
    title: "Member Discounts",
    text: "Discounts with local hotels, resorts, pharmacies, gyms and service providers across Diani and the South Coast.",
  },
  {
    icon: Megaphone01Icon,
    title: "Have Your Voice Heard",
    text: "Participate in community decisions and use SCRA as a platform to raise environmental or legal concerns.",
  },
  {
    icon: DocumentAttachmentIcon,
    title: "Minutes & Newsletters",
    text: "Minutes of General Meetings held every other month, plus copies of the SCRA newsletter.",
  },
  {
    icon: IdeaIcon,
    title: "Advisory Services",
    text: "Advisory support and updates on regulatory changes affecting residents and property owners.",
  },
  {
    icon: CheckmarkCircle02Icon,
    title: "Advertising Discounts",
    text: "Discounted advertising rates for member businesses through SCRA channels.",
  },
];

export default async function MembershipPage() {
  const payload = await getPayloadClient();
  const { docs: partners } = await payload.find({
    collection: "directory-entries",
    where: { category: { equals: "member-business" } },
    limit: 50,
    sort: "name",
  });

  return (
    <>
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto w-[min(1280px,92%)]">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
            Membership
          </p>
          <h1 className="mb-4">Stronger Together. Become a Member.</h1>
          <p className="max-w-2xl text-muted-foreground text-lg">
            Your membership supports SCRA&apos;s advocacy, strengthens our
            collective voice, and helps build a better South Coast for
            everyone who lives, works and invests here.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)]">
          <h2 className="mb-8 text-center">Membership Categories</h2>
          <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg p-8 text-center ${
                  tier.featured
                    ? "bg-primary text-white shadow-lg sm:-translate-y-2"
                    : "bg-card shadow-sm text-foreground"
                }`}
              >
                <h3 className={`text-lg mb-1 ${tier.featured ? "text-white" : "text-primary"}`}>
                  {tier.name}
                </h3>
                <p className="font-heading font-bold text-3xl mb-1">{tier.price}</p>
                <p className={`text-sm mb-4 ${tier.featured ? "text-white/70" : "text-muted-foreground"}`}>
                  {tier.period}
                </p>
                <p className={`text-sm ${tier.featured ? "text-white/90" : "text-muted-foreground"}`}>
                  {tier.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm mt-6">
            Membership renews annually.
          </p>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="mx-auto w-[min(1280px,92%)]">
          <h2 className="mb-10 text-center">Member Benefits</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="bg-card rounded-lg shadow-sm p-6">
                <HugeiconsIcon icon={b.icon} size={26} strokeWidth={1.8} className="text-secondary mb-3" />
                <h3 className="text-primary text-lg mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {partners.length > 0 && (
        <section className="py-16">
          <div className="mx-auto w-[min(1280px,92%)]">
            <h2 className="mb-2">Current Member Discounts</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              A selection of the local businesses currently offering
              discounts to SCRA members.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner) => (
                <div key={partner.id} className="bg-card rounded-lg shadow-sm p-6">
                  <h3 className="text-primary text-base mb-1">{partner.name}</h3>
                  {partner.description && (
                    <p className="text-muted-foreground text-sm">{partner.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-primary text-white">
        <div className="mx-auto w-[min(1280px,92%)] max-w-3xl">
          <h2 className="text-white mb-6">How to Join or Renew</h2>
          <Link
            href="/membership/apply"
            className="inline-flex items-center justify-center rounded-md bg-white text-primary font-semibold text-sm px-6 py-3 hover:bg-white/90 transition-colors mb-8"
          >
            Apply for Membership Online
          </Link>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-white text-lg mb-2">Pay In Person</h3>
              <p className="text-white/85 text-sm leading-relaxed">
                Visit the Safarilink Office at Diani Beach Shopping Centre
                (1st floor) to pay and receive an immediate receipt and
                membership card.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-white text-lg mb-2">Pay via M-Pesa</h3>
              <p className="text-white/85 text-sm leading-relaxed">
                Make a payment via M-Pesa to Paybill Number{" "}
                <span className="font-semibold">880100</span> with account{" "}
                <span className="font-semibold">PAYSCRA</span>.
              </p>
            </div>
          </div>
          <p className="text-white/70 text-sm mt-8">
            Questions about membership? Get in touch via our{" "}
            <Link href="/contact" className="underline hover:text-white">
              Contact page
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
