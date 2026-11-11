import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { account, members, notifications, session, user, verification } from "@/lib/db/schema";
import {
  sendAdminNewUserEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "@/lib/email";
import { EMPTY_BIODATA } from "@/lib/types/biodata";

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  return { firstName: parts[0].slice(0, 80), lastName: parts.slice(1).join(" ").slice(0, 80) };
}

/**
 * Create the matrimony profile row (members) for a newly registered login,
 * plus the welcome notifications and emails that /api/auth/sync used to send.
 */
async function onUserCreated(u: { id: string; email: string; name: string; createdAt: Date }) {
  const { firstName, lastName } = splitName(u.name ?? "");
  await db
    .insert(members)
    .values({ uid: u.id, email: u.email, provider: "email", firstName, lastName, biodata: EMPTY_BIODATA })
    .onConflictDoNothing({ target: members.uid });

  await db.insert(notifications).values([
    {
      recipientUid: u.id,
      type: "welcome",
      title: "Assalamu Alaikum!",
      message:
        "Welcome to BanglaNikahCanada. Complete your biodata so families can find the right match for you, In Sha Allah.",
    },
    {
      recipientUid: u.id,
      type: "profile_incomplete",
      title: "Complete Your Profile",
      message:
        "Your biodata is incomplete. Fill in your personal details, family info, and Wali contact to appear in search results.",
    },
  ]);

  Promise.all([
    sendWelcomeEmail(u.email, firstName),
    sendAdminNewUserEmail({ email: u.email, firstName, lastName, provider: "email", createdAt: u.createdAt }),
  ]).catch((err) => console.error("Signup email error:", err));
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user: u, url }) => {
      await sendPasswordResetEmail(u.email, u.name, url);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh daily
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (u) => {
          try {
            await onUserCreated(u);
          } catch (err) {
            console.error("[auth] failed to create member profile:", err);
          }
        },
      },
    },
  },
  plugins: [nextCookies()],
});
