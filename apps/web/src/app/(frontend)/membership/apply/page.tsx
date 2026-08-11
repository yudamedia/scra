import { Suspense } from "react";
import { MembershipApplicationForm } from "@/components/membership-application-form";

export default function MembershipApplyPage() {
  return (
    <section className="py-16">
      <div className="mx-auto w-[min(760px,92%)]">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
          Membership
        </p>
        <h1 className="mb-4">Apply for Membership</h1>
        <p className="text-muted-foreground mb-8">
          Fill in your details below, then pay via M-Pesa/bank transfer or in person. The
          secretariat confirms your payment and activates your membership — you&apos;ll get an email
          with a link to sign in to the Member Portal, no password required.
        </p>

        <Suspense fallback={null}>
          <MembershipApplicationForm />
        </Suspense>

        <div className="bg-primary text-white rounded-lg p-6 mt-8">
          <h2 className="text-white text-lg mb-4">Payment Details</h2>
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-white text-sm font-semibold mb-1">Pay In Person</h3>
              <p className="text-white/85 leading-relaxed">
                Visit the Safarilink Office at Diani Beach Shopping Centre (1st floor) to pay and
                receive an immediate receipt and membership card.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-white text-sm font-semibold mb-1">Pay via M-Pesa</h3>
              <p className="text-white/85 leading-relaxed">
                Make a payment via M-Pesa to Paybill Number{" "}
                <span className="font-semibold">880100</span> with account{" "}
                <span className="font-semibold">PAYSCRA</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
