import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM || "SCRA <no-reply@scra.co.ke>";

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Used both for a brand-new portal account's first login and for every
 * return visit — accounts are magic-link only, there is no separate
 * "set your password" email to send.
 */
export async function sendMagicLinkEmail(email: string, url: string) {
  const resend = getClient();
  if (!resend) {
    console.log(`[email] RESEND_API_KEY not set — magic link for ${email}: ${url}`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your SCRA Member Portal sign-in link",
    html: `
      <p>Click below to access your SCRA Member Portal account:</p>
      <p><a href="${url}">${url}</a></p>
      <p>This link expires shortly and can only be used once. If you didn't request it, you can ignore this email.</p>
    `,
  });
}

export async function sendRenewalReminderEmail(
  email: string,
  data: { name: string; stage: "30day" | "7day" | "dueday" | "lapsed"; expiryDate: string; membershipNumber: string },
) {
  const resend = getClient();
  const subjectByStage: Record<typeof data.stage, string> = {
    "30day": "Your SCRA membership renews in 30 days",
    "7day": "Your SCRA membership renews in 7 days",
    dueday: "Your SCRA membership renews today",
    lapsed: "Your SCRA membership has lapsed",
  };
  const subject = subjectByStage[data.stage];

  if (!resend) {
    console.log(`[email] RESEND_API_KEY not set — renewal reminder (${data.stage}) for ${email}`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject,
    html: `
      <p>Dear ${data.name},</p>
      <p>Your SCRA membership (No. ${data.membershipNumber}) ${
        data.stage === "lapsed" ? "lapsed on" : "expires on"
      } ${data.expiryDate}.</p>
      <p><a href="${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || ""}/portal/renew">Renew your membership</a></p>
    `,
  });
}
