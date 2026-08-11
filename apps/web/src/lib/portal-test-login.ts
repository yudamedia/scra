import { timingSafeEqual } from "node:crypto";
import { APIError, createAuthEndpoint } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import type { BetterAuthPlugin } from "better-auth";
import * as z from "zod";

// Member 466 (Yuda Muyinza) — SCRA's own permanent portal test account.
// Hardcoded rather than read from the request so PORTAL_TEST_LOGIN_SECRET
// can never be reused to sign in as any other account.
const TEST_LOGIN_EMAIL = "yudamedia@gmail.com";
// 400 days is the hard ceiling browsers/RFC 6265bis allow for a cookie's
// Max-Age — the link itself never expires and can be reused to mint a fresh
// 400-day cookie any time the old one runs out.
const MAX_COOKIE_AGE_SECONDS = 400 * 24 * 60 * 60;

function secretsMatch(provided: string, expected: string) {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * GET /api/auth/portal-test-login?token=... — a standing (non-expiring,
 * reusable) sign-in link scoped to a single hardcoded test account.
 * Inert unless PORTAL_TEST_LOGIN_SECRET is set; never wired to any UI link.
 */
export function portalTestLogin(): BetterAuthPlugin {
  return {
    id: "portal-test-login",
    endpoints: {
      portalTestLogin: createAuthEndpoint(
        "/portal-test-login",
        { method: "GET", query: z.object({ token: z.string() }) },
        async (ctx) => {
          const secret = process.env.PORTAL_TEST_LOGIN_SECRET;
          if (!secret || !secretsMatch(ctx.query.token, secret)) {
            throw new APIError("UNAUTHORIZED", { message: "Invalid or disabled test login link" });
          }

          const existing = await ctx.context.internalAdapter.findUserByEmail(TEST_LOGIN_EMAIL);
          if (!existing) {
            throw new APIError("NOT_FOUND", { message: "Test account not provisioned yet" });
          }

          const session = await ctx.context.internalAdapter.createSession(
            existing.user.id,
            false,
            { expiresAt: new Date(Date.now() + MAX_COOKIE_AGE_SECONDS * 1000) },
            true
          );

          await setSessionCookie(ctx, { session, user: existing.user }, false, {
            maxAge: MAX_COOKIE_AGE_SECONDS,
          });

          throw ctx.redirect(new URL("/portal", ctx.context.baseURL).toString());
        }
      ),
    },
  };
}
