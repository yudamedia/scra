import { betterAuth } from "better-auth";
import { admin, magicLink } from "better-auth/plugins";
import { Pool } from "pg";

import { sendMagicLinkEmail } from "./email";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URI,
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
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
