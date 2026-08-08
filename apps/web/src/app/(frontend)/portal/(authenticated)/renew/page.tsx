"use client";

import { useState } from "react";

export default function PortalRenewPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "recorded" | "error">("idle");
  const [method, setMethod] = useState<"bank_transfer" | "cash">("bank_transfer");

  async function recordManualPayment() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/portal/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("recorded");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-16">
      <div className="mx-auto w-[min(720px,92%)]">
        <h1 className="mb-8">Renew Membership</h1>

        <div className="bg-card rounded-lg shadow-sm p-6 mb-6 opacity-60">
          <h2 className="text-primary text-lg mb-2">Pay with M-Pesa (via Tuma)</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Instant renewal by STK push is coming soon.
          </p>
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-2.5 cursor-not-allowed"
          >
            Coming soon
          </button>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <h2 className="text-primary text-lg mb-4">Pay by Bank Transfer or Cash</h2>

          {status === "recorded" ? (
            <p className="text-sm text-foreground">
              Thanks — we&apos;ve recorded your renewal request. Once the secretariat confirms your
              payment, your membership expiry date extends automatically and you&apos;ll get a
              confirmation email.
            </p>
          ) : (
            <>
              <p className="text-muted-foreground text-sm mb-4">
                Make a payment via M-Pesa to Paybill Number{" "}
                <span className="font-semibold text-foreground">880100</span> with account{" "}
                <span className="font-semibold text-foreground">PAYSCRA</span>, or pay by cash at the
                Safarilink Office, Diani Beach Shopping Centre (1st floor). Then let us know below so
                the secretariat can match your payment.
              </p>
              <div className="flex items-center gap-4 mb-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={method === "bank_transfer"}
                    onChange={() => setMethod("bank_transfer")}
                  />
                  M-Pesa / Bank Transfer
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={method === "cash"} onChange={() => setMethod("cash")} />
                  Cash (paid in person)
                </label>
              </div>
              {status === "error" && (
                <p className="text-sm text-destructive mb-4">Something went wrong. Please try again.</p>
              )}
              <button
                type="button"
                onClick={recordManualPayment}
                disabled={status === "submitting"}
                className="inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                {status === "submitting" ? "Recording…" : "I've made this payment"}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
