"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { maxAdditionalMembersByType, membershipApplicationTypes } from "@/lib/membership-application-schema";
import { getRecaptchaToken } from "@/lib/recaptcha-client";

type MembershipType = (typeof membershipApplicationTypes)[number];

const inputClass =
  "w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

const typeOptions: { value: MembershipType; label: string; detail: string }[] = [
  { value: "personal", label: "Individual — KES 3,000/yr", detail: "One member." },
  { value: "household", label: "Family — KES 5,000/yr", detail: "Up to 2 members hold voting rights." },
  { value: "corporate", label: "Corporate — KES 10,000/yr", detail: "Up to 4 nominated members hold voting rights." },
];

type AdditionalMemberRow = { surname: string; firstName: string; phone: string; email: string };

const emptyRow: AdditionalMemberRow = { surname: "", firstName: "", phone: "", email: "" };

export function MembershipApplicationForm() {
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("type");
  const initialType = (membershipApplicationTypes as readonly string[]).includes(
    requestedType ?? ""
  )
    ? (requestedType as MembershipType)
    : "personal";
  const [type, setType] = useState<MembershipType>(initialType);
  const [additionalMembers, setAdditionalMembers] = useState<AdditionalMemberRow[]>([
    { ...emptyRow },
    { ...emptyRow },
    { ...emptyRow },
  ]);
  const maxAdditional = maxAdditionalMembersByType[type];
  const visibleRows = additionalMembers.slice(0, maxAdditional);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ membershipNumber: string } | null>(null);
  const renderedAt = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  function updateMember(index: number, field: keyof AdditionalMemberRow, value: string) {
    setAdditionalMembers((rows) => rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = new FormData(e.currentTarget);
    let recaptchaToken: string;
    try {
      recaptchaToken = await getRecaptchaToken("membership_application");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
      return;
    }

    const payload = {
      website: form.get("website"),
      renderedAt: renderedAt.current ?? 0,
      recaptchaToken,
      type,
      surname: form.get("surname"),
      firstName: form.get("firstName"),
      phone: form.get("phone"),
      email: form.get("email"),
      postalAddress: form.get("postalAddress"),
      town: form.get("town"),
      postalCode: form.get("postalCode"),
      corporateBusinessName: form.get("corporateBusinessName"),
      additionalMembers: visibleRows.filter((m) => m.surname.trim() && m.firstName.trim()),
      paymentMethod: form.get("paymentMethod"),
    };

    try {
      const res = await fetch("/api/membership-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setResult({ membershipNumber: json.membershipNumber });
      formRef.current?.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
      return;
    }
    setStatus("idle");
  }

  if (result) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
          Application Received
        </p>
        <h2 className="text-primary text-2xl mb-4">Membership No. {result.membershipNumber}</h2>
        <p className="text-muted-foreground text-sm mb-4">
          We&apos;ve recorded your application. Once the secretariat confirms your payment, your
          membership activates automatically and you&apos;ll receive an email with a link to sign in
          to the Member Portal — no password needed.
        </p>
        <p className="text-muted-foreground text-sm">
          Questions in the meantime? Reach us via our{" "}
          <a href="/contact" className="text-secondary hover:underline">
            Contact page
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-card rounded-lg shadow-sm p-8 space-y-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className={labelClass}>Membership Type</label>
        <div className="grid gap-3 sm:grid-cols-3">
          {typeOptions.map((opt) => (
            <label
              key={opt.value}
              className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                type === opt.value ? "border-primary bg-primary/5" : "border-input"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={opt.value}
                checked={type === opt.value}
                onChange={() => setType(opt.value)}
                className="sr-only"
              />
              <span className="block text-sm font-semibold text-primary mb-1">{opt.label}</span>
              <span className="block text-xs text-muted-foreground">{opt.detail}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="surname" className={labelClass}>
            Surname
          </label>
          <input id="surname" name="surname" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First Name
          </label>
          <input id="firstName" name="firstName" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
          <p className="text-xs text-muted-foreground mt-1">
            Used to send your Member Portal sign-in link once payment is confirmed.
          </p>
        </div>
      </div>

      {type === "corporate" && (
        <div>
          <label htmlFor="corporateBusinessName" className={labelClass}>
            Business Name
          </label>
          <input id="corporateBusinessName" name="corporateBusinessName" type="text" required className={inputClass} />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="postalAddress" className={labelClass}>
            Postal Address
          </label>
          <input id="postalAddress" name="postalAddress" type="text" className={inputClass} />
        </div>
        <div>
          <label htmlFor="town" className={labelClass}>
            Town
          </label>
          <input id="town" name="town" type="text" className={inputClass} />
        </div>
        <div>
          <label htmlFor="postalCode" className={labelClass}>
            Postal Code
          </label>
          <input id="postalCode" name="postalCode" type="text" className={inputClass} />
        </div>
      </div>

      {maxAdditional > 0 && (
        <div>
          <label className={labelClass}>
            {type === "corporate" ? "Nominated Corporate Members (up to 4 total)" : "Additional Family Member (up to 2 total)"}
          </label>
          <div className="space-y-3">
            {visibleRows.map((row, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-4 border border-input rounded-md p-3">
                <input
                  placeholder="Surname"
                  value={row.surname}
                  onChange={(e) => updateMember(i, "surname", e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="First name"
                  value={row.firstName}
                  onChange={(e) => updateMember(i, "firstName", e.target.value)}
                  className={inputClass}
                />
                {type === "corporate" && (
                  <>
                    <input
                      placeholder="Phone (optional)"
                      value={row.phone}
                      onChange={(e) => updateMember(i, "phone", e.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder="Email (optional)"
                      value={row.email}
                      onChange={(e) => updateMember(i, "email", e.target.value)}
                      className={inputClass}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className={labelClass}>How will you pay?</label>
        <div className="flex items-center gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" name="paymentMethod" value="bank_transfer" defaultChecked required />
            M-Pesa / Bank Transfer
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="paymentMethod" value="cash" />
            Cash (in person)
          </label>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Submitting this form doesn&apos;t charge you anything — it records your application so the
          secretariat can match your payment once made. See payment details below.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-6 py-3 hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
