import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { Pool } from "pg";

import { sendSetPasswordEmail } from "./email";
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
    // see auth.api.createUser() calls in membership-activation.ts, which use
    // a separate code path unaffected by this flag. Accounts are created
    // passwordless there; sendResetPassword below is how they (and anyone
    // who forgets their password later) actually set one.
    enabled: true,
    disableSignUp: true,
    sendResetPassword: async ({ user, url }) => {
      await sendSetPasswordEmail(user.email, url);
    },
  },
  hooks: {
    // Better Auth has no per-endpoint lifecycle hook for these, so this is
    // scoped manually by path — it runs before the endpoint's own handler,
    // so a rejection here means no sign-in / no reset email. See CLAUDE.md's
    // reCAPTCHA section.
    before: createAuthMiddleware(async (ctx) => {
      const action =
        ctx.path === "/sign-in/email"
          ? "portal_login"
          : ctx.path === "/request-password-reset"
            ? "portal_forgot_password"
            : null;
      if (!action) return;

      const recaptcha = await verifyRecaptcha(ctx.body?.recaptchaToken, { action });
      if (!recaptcha.ok) {
        console.error(`[auth] reCAPTCHA rejected ${ctx.path} (action=${action}):`, recaptcha.reason);
        throw new APIError("FORBIDDEN", { message: "Verification failed. Please try again." });
      }
    }),
  },
  plugins: [
    // Lets trusted server code (membership-activation.ts) create a member
    // account post-payment via auth.api.createUser(), with no password and
    // no HTTP session required — that's the only account-creation path.
    admin(),
    // Permanent sign-in link for member 466's personal test account only —
    // see portal-test-login.ts. Inert unless PORTAL_TEST_LOGIN_SECRET is set.
    portalTestLogin(),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
