import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { HugeiconsIcon } from "@hugeicons/react";
import { ICON_MAP } from "@/lib/icon-options";
import { renderInlineLinks } from "@/lib/inline-links";

export const revalidate = 60;

export default async function MembershipPage() {
  const payload = await getPayloadClient();
  const [{ docs: partners }, membershipPage, siteSettings] = await Promise.all([
    payload.find({
      collection: "directory-entries",
      where: { category: { equals: "member-business" } },
      limit: 50,
      sort: "name",
    }),
    payload.findGlobal({ slug: "membership-page" }),
    payload.findGlobal({ slug: "site-settings" }),
  ]);

  const tiers = membershipPage.tiers ?? [];
  const benefits = membershipPage.benefits ?? [];
  const payInPersonText = membershipPage.howToJoin?.payInPersonText || siteSettings.payment?.payInPersonText;

  return (
    <>
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto w-[min(1280px,92%)]">
          {membershipPage.hero?.eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
              {membershipPage.hero.eyebrow}
            </p>
          )}
          <h1 className="mb-4">{membershipPage.hero?.heading}</h1>
          {membershipPage.hero?.paragraph && (
            <p className="max-w-2xl text-muted-foreground text-lg">{membershipPage.hero.paragraph}</p>
          )}
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
                {tier.period && (
                  <p className={`text-sm mb-4 ${tier.featured ? "text-white/70" : "text-muted-foreground"}`}>
                    {tier.period}
                  </p>
                )}
                {tier.detail && (
                  <p className={`text-sm ${tier.featured ? "text-white/90" : "text-muted-foreground"}`}>
                    {tier.detail}
                  </p>
                )}
                <Link
                  href={`/membership/apply?type=${tier.type}`}
                  className={`inline-flex items-center justify-center rounded-md font-semibold text-sm px-5 py-2.5 mt-6 transition-colors ${
                    tier.featured
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  Apply
                </Link>
              </div>
            ))}
          </div>
          {membershipPage.tiersFootnote && (
            <p className="text-center text-muted-foreground text-sm mt-6">
              {membershipPage.tiersFootnote}
            </p>
          )}
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="mx-auto w-[min(1280px,92%)]">
          <h2 className="mb-10 text-center">Member Benefits</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="bg-card rounded-lg shadow-sm p-6">
                {b.icon && ICON_MAP[b.icon] && (
                  <HugeiconsIcon icon={ICON_MAP[b.icon]} size={26} strokeWidth={1.8} className="text-secondary mb-3" />
                )}
                <h3 className="text-primary text-lg mb-2">{b.title}</h3>
                {b.text && <p className="text-muted-foreground text-sm">{b.text}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {partners.length > 0 && (
        <section className="py-16">
          <div className="mx-auto w-[min(1280px,92%)]">
            <h2 className="mb-2">{membershipPage.discounts?.heading}</h2>
            {membershipPage.discounts?.intro && (
              <p className="text-muted-foreground mb-8 max-w-2xl">{membershipPage.discounts.intro}</p>
            )}
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
          <h2 className="text-white mb-6">{membershipPage.howToJoin?.heading}</h2>
          <Link
            href="/membership/apply"
            className="inline-flex items-center justify-center rounded-md bg-white text-primary font-semibold text-sm px-6 py-3 hover:bg-white/90 transition-colors mb-8"
          >
            {membershipPage.howToJoin?.applyButtonLabel}
          </Link>
          <div className="grid gap-6 sm:grid-cols-2">
            {payInPersonText && (
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-white text-lg mb-2">Pay In Person</h3>
                <p className="text-white/85 text-sm leading-relaxed">{payInPersonText}</p>
              </div>
            )}
            {siteSettings.payment?.paybillNumber && (
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-white text-lg mb-2">Pay via M-Pesa</h3>
                <p className="text-white/85 text-sm leading-relaxed">
                  Make a payment via M-Pesa to Paybill Number{" "}
                  <span className="font-semibold">{siteSettings.payment.paybillNumber}</span> with
                  account <span className="font-semibold">{siteSettings.payment.paybillAccount}</span>.
                </p>
              </div>
            )}
          </div>
          {membershipPage.howToJoin?.footerNote && (
            <p className="text-white/70 text-sm mt-8">
              {renderInlineLinks(membershipPage.howToJoin.footerNote)}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
