import { env } from "@news-aggrigator/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client";
import { account, session, user, verification } from "../db/schema";
import { mailer } from "../lib/mailer";
import { passwordResetEmail } from "./emails";

const ONE_HOUR_IN_SECONDS = 60 * 60;

export const auth = betterAuth({
  appName: "Brief",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.WEB_ORIGIN],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    resetPasswordTokenExpiresIn: ONE_HOUR_IN_SECONDS,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user: recipient, url }) => {
      await mailer.send(passwordResetEmail({ to: recipient.email, name: recipient.name, url }));
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;
