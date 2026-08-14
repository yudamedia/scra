import { betterAuth } from "better-auth";
import { admin, magicLink } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { Pool } from "pg";

import { sendMagicLinkEmail } from "./email";
import { portalTestLogin } from "./portal-test-login";
import { verifyRecaptcha } from "./recaptcha";

export const auth = betterAuth({
  database: new Pool({
    // Neon's pooled (pgbouncer) endpoint rejects the `-c search_path=...`
    // startup parameter outright ("unsupported startup parameter in
    // options"), so this must go over the unpooled/direct connection
    // string, not DATABASE_URI. Locally both point at the same
    // non-pooled Postgres container, so AUTH_DATABASE_URI can be left
    // unset and this falls back to DATABASE_URI. See CLAUDE.md.
    connectionString: process.env.AUTH_DATABASE_URI || process.env.DATABASE_URI,
    options: "-c search_path=auth,public",
  }),
  user: {
    modelName: "member_user",
  },
  session: {
    modelName: "member_session",
  },
  account: {
    modelName: "member_account",
  },
  verification: {
    modelName: "member_verification",
  },
  emailAndPassword: {
    // Kept enabled because Better Auth needs the credential provider
    // registered at all, but disableSignUp closes the public self-serve
    // /sign-up/email route. Portal accounts are never created this way —
    // see admin.createUser() calls in membership-activation.ts, which use a
    // separate code path unaffected by this flag and create passwordless,
    // magic-link-only accounts.
    enabled: true,
    disableSignUp: true,
  },
  hooks: {
    // Better Auth has no per-endpoint lifecycle hook for the magicLink
    // plugin, so this is scoped manually by path — it runs before the
    // magic-link endpoint's own handler, so a rejection here means no
    // email is ever sent. See CLAUDE.md's reCAPTCHA section.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-in/magic-link") return;

      const recaptcha = await verifyRecaptcha(ctx.body?.recaptchaToken, { action: "portal_login" });
      if (!recaptcha.ok) {
        throw new APIError("FORBIDDEN", { message: "Verification failed. Please try again." });
      }
    }),
  },
  plugins: [
    // Lets trusted server code (membership-activation.ts) create a member
    // account post-payment via auth.api.createUser(), with no password and
    // no HTTP session required — that's the only account-creation path.
    admin(),
    magicLink({
      // Only pre-created (post-payment) accounts can sign in — a magic-link
      // request for an unknown email never provisions a new account.
      disableSignUp: true,
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail(email, url);
      },
    }),
    // Permanent sign-in link for member 466's personal test account only —
    // see portal-test-login.ts. Inert unless PORTAL_TEST_LOGIN_SECRET is set.
    portalTestLogin(),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
