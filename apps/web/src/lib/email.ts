import { Resend } from "resend";

import { membershipTypeLabels, issueReportCategoryLabels, formatLabel } from "./format";

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

export async function sendMembershipApplicationConfirmationEmail(
  email: string,
  data: { name: string; membershipNumber: string; type: string; amount: number; paymentMethod: "bank_transfer" | "cash" },
) {
  const resend = getClient();
  const typeLabel = membershipTypeLabels[data.type] ?? data.type;
  const paymentMethodLabel = data.paymentMethod === "cash" ? "cash (in person)" : "M-Pesa / bank transfer";

  if (!resend) {
    console.log(
      `[email] RESEND_API_KEY not set — membership application confirmation (No. ${data.membershipNumber}) for ${email}`,
    );
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your SCRA membership application has been received",
    html: `
      <p>Dear ${data.name},</p>
      <p>Thank you for applying for ${typeLabel} membership with SCRA. Your application has been recorded
      as membership No. ${data.membershipNumber}.</p>
      <p>You indicated you'll pay by ${paymentMethodLabel} — the amount due is KES ${data.amount.toLocaleString()}.
      Your membership will be activated once the secretariat confirms your payment, at which point you'll
      receive a separate email with a link to sign in to the Member Portal.</p>
      <p>No action is needed from you right now unless you haven't yet made payment.</p>
    `,
  });
}

export async function sendIssueReportConfirmationEmail(
  email: string,
  data: { name: string; referenceCode: string; category: string },
) {
  const resend = getClient();
  const categoryLabel = issueReportCategoryLabels[data.category] ?? data.category;

  if (!resend) {
    console.log(`[email] RESEND_API_KEY not set — issue report confirmation (${data.referenceCode}) for ${email}`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your SCRA issue report has been received (${data.referenceCode})`,
    html: `
      <p>Dear ${data.name},</p>
      <p>Thank you for reporting a ${categoryLabel.toLowerCase()} issue. Your report has been logged with
      reference code <strong>${data.referenceCode}</strong>.</p>
      <p>Keep this code to check on progress at any time:
      <a href="${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || ""}/report-issue/status">${
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL || ""
      }/report-issue/status</a></p>
    `,
  });
}

export async function sendPaymentConfirmedEmail(
  email: string,
  data: {
    name: string;
    membershipNumber: string;
    type: string;
    amount: number;
    expiryDate: string;
    paymentType: "new" | "renewal";
  },
) {
  const resend = getClient();
  const typeLabel = membershipTypeLabels[data.type] ?? data.type;

  if (!resend) {
    console.log(
      `[email] RESEND_API_KEY not set — payment confirmed (No. ${data.membershipNumber}) for ${email}`,
    );
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: data.paymentType === "renewal" ? "Your SCRA membership renewal is confirmed" : "Your SCRA membership is now active",
    html: `
      <p>Dear ${data.name},</p>
      <p>We've confirmed your payment of KES ${data.amount.toLocaleString()} for your ${typeLabel} membership
      (No. ${data.membershipNumber}). Your membership is now active until ${data.expiryDate}.</p>
      ${
        data.paymentType === "renewal"
          ? `<p><a href="${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || ""}/portal">Visit the Member Portal</a></p>`
          : `<p>Look out for a separate email with a link to sign in to the Member Portal.</p>`
      }
    `,
  });
}

export async function sendIssueStatusChangedEmail(
  email: string,
  data: { name: string; referenceCode: string; status: string; note?: string | null },
) {
  const resend = getClient();
  const statusLabel = formatLabel(data.status.replace(/_/g, "-"));

  if (!resend) {
    console.log(
      `[email] RESEND_API_KEY not set — issue status changed (${data.referenceCode} -> ${data.status}) for ${email}`,
    );
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Update on your SCRA issue report (${data.referenceCode})`,
    html: `
      <p>Dear ${data.name},</p>
      <p>Your issue report <strong>${data.referenceCode}</strong> has been updated to: <strong>${statusLabel}</strong>.</p>
      ${data.note ? `<p>${data.note}</p>` : ""}
      <p>Check the full timeline any time:
      <a href="${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || ""}/report-issue/status">${
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL || ""
      }/report-issue/status</a></p>
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
