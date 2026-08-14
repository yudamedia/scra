const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const DEFAULT_MIN_SCORE = 0.5;

type SiteVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

export async function verifyRecaptcha(
  token: unknown,
  { action, minScore }: { action: string; minScore?: number },
): Promise<{ ok: boolean; reason?: string }> {
  if (typeof token !== "string" || !token) {
    return { ok: false, reason: "Missing reCAPTCHA token" };
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error("[recaptcha] RECAPTCHA_SECRET_KEY not set — refusing to verify");
    return { ok: false, reason: "reCAPTCHA not configured" };
  }

  const threshold = minScore ?? Number(process.env.RECAPTCHA_MIN_SCORE ?? DEFAULT_MIN_SCORE);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const result = (await res.json()) as SiteVerifyResponse;

    if (!result.success) {
      return { ok: false, reason: result["error-codes"]?.join(",") ?? "verification failed" };
    }
    if (result.action !== action) {
      return { ok: false, reason: `action mismatch: expected ${action}, got ${result.action}` };
    }
    if (typeof result.score === "number" && result.score < threshold) {
      return { ok: false, reason: `score ${result.score} below threshold ${threshold}` };
    }

    return { ok: true };
  } catch (err) {
    console.error("[recaptcha] verification request failed:", err);
    return { ok: false, reason: "verification request failed" };
  }
}
