import { betterAuth } from "better-auth";
import { Pool } from "pg";

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
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
