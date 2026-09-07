import { Suspense } from "react";
import { getPayloadClient } from "@/lib/payload";
import { MembershipApplicationForm } from "@/components/membership-application-form";

export const revalidate = 60;

export default async function MembershipApplyPage() {
  const payload = await getPayloadClient();
  const [pageIntros, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: "page-intros" }),
    payload.findGlobal({ slug: "site-settings" }),
  ]);
  const intro = pageIntros.membershipApply;
  const payInPersonText = siteSettings.payment?.payInPersonText;

  return (
    <section className="py-16">
      <div className="mx-auto w-[min(760px,92%)]">
        {intro?.eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
            {intro.eyebrow}
          </p>
        )}
        <h1 className="mb-4">{intro?.heading}</h1>
        {intro?.paragraph && <p className="text-muted-foreground mb-8">{intro.paragraph}</p>}

        <Suspense fallback={null}>
          <MembershipApplicationForm />
        </Suspense>

        <div className="bg-primary text-white rounded-lg p-6 mt-8">
          <h2 className="text-white text-lg mb-4">Payment Details</h2>
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            {payInPersonText && (
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-white text-sm font-semibold mb-1">Pay In Person</h3>
                <p className="text-white/85 leading-relaxed">{payInPersonText}</p>
              </div>
            )}
            {siteSettings.payment?.paybillNumber && (
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-white text-sm font-semibold mb-1">Pay via M-Pesa</h3>
                <p className="text-white/85 leading-relaxed">
                  Make a payment via M-Pesa to Paybill Number{" "}
                  <span className="font-semibold">{siteSettings.payment.paybillNumber}</span> with
                  account <span className="font-semibold">{siteSettings.payment.paybillAccount}</span>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
