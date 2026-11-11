import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { BiodataSection } from "@/lib/types/biodata";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/* ───────────────────────── Better Auth tables ─────────────────────────
 * Shapes follow Better Auth's core schema. Don't rename columns without
 * updating the adapter mapping in lib/auth-server.ts.
 */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_id_idx").on(t.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("account_user_id_idx").on(t.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)]
);

/* ───────────────────────── App tables ───────────────────────── */

export interface PartnerPreferences {
  qualification: string[];
  religiousHistory: string;
  sect: string;
  prayerRoutine: string;
  modesty: string;
}

export const EMPTY_PARTNER_PREFERENCES: PartnerPreferences = {
  qualification: [],
  religiousHistory: "",
  sect: "",
  prayerRoutine: "",
  modesty: "",
};

/**
 * A matrimony profile. `uid` is the Better Auth user id for real members, or
 * "shadow:<submissionId>" for shadow profiles created from approved
 * anonymous submissions (those have isShadow = true and no login).
 */
export const members = pgTable(
  "members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    uid: text("uid").notNull().unique(),
    email: text("email").notNull(),
    provider: text("provider").notNull().default("email"),
    photoURL: text("photo_url"),
    firstName: text("first_name").notNull().default(""),
    lastName: text("last_name").notNull().default(""),
    profileName: text("profile_name").notNull().default(""),
    partnerPreferences: jsonb("partner_preferences")
      .$type<PartnerPreferences>()
      .notNull()
      .default(EMPTY_PARTNER_PREFERENCES),
    biodata: jsonb("biodata").$type<BiodataSection>().notNull().default(sql`'{}'::jsonb`),
    onboardingStep: integer("onboarding_step").notNull().default(0),
    onboardingComplete: boolean("onboarding_complete").notNull().default(false),
    isAdmin: boolean("is_admin").notNull().default(false),
    invitesRemaining: integer("invites_remaining").notNull().default(3),
    isPremium: boolean("is_premium").notNull().default(false),
    isShadow: boolean("is_shadow").notNull().default(false),
    sourceSubmissionId: uuid("source_submission_id"),
    ...timestamps,
  },
  (t) => [
    index("members_is_shadow_idx").on(t.isShadow),
    index("members_updated_at_idx").on(t.updatedAt),
    index("members_gender_idx").on(sql`(${t.biodata}->'personal'->>'gender')`),
  ]
);

export type ModerationStatus = "pending" | "approved" | "rejected" | "spam";

export const biodataSubmissions = pgTable(
  "biodata_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    biodata: jsonb("biodata").$type<BiodataSection>().notNull(),
    moderationStatus: text("moderation_status")
      .$type<ModerationStatus>()
      .notNull()
      .default("pending"),
    moderationNote: text("moderation_note").notNull().default(""),
    moderatedByUid: text("moderated_by_uid"),
    moderatedAt: timestamp("moderated_at", { withTimezone: true }),
    submitterFirstName: text("submitter_first_name").notNull().default(""),
    submitterLastName: text("submitter_last_name").notNull().default(""),
    ipHash: text("ip_hash").notNull(),
    userAgent: text("user_agent").notNull().default(""),
    email: text("email"),
    phone: text("phone").notNull().default(""),
    howHeard: text("how_heard").notNull().default(""),
    faithDeclarationAccepted: boolean("faith_declaration_accepted").notNull().default(false),
    faithDeclarationAcceptedAt: timestamp("faith_declaration_accepted_at", { withTimezone: true }),
    claimedByUid: text("claimed_by_uid"),
    shadowUserId: uuid("shadow_user_id"),
    ...timestamps,
  },
  (t) => [
    index("submissions_status_created_idx").on(t.moderationStatus, t.createdAt),
    index("submissions_created_idx").on(t.createdAt),
    index("submissions_ip_hash_idx").on(t.ipHash),
  ]
);

export type InvitationStatus = "pending" | "accepted" | "declined";

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderUid: text("sender_uid").notNull(),
    senderName: text("sender_name").notNull(),
    senderProfileId: text("sender_profile_id").notNull(),
    receiverUid: text("receiver_uid").notNull(),
    receiverName: text("receiver_name").notNull(),
    receiverProfileId: text("receiver_profile_id").notNull(),
    status: text("status").$type<InvitationStatus>().notNull().default("pending"),
    ...timestamps,
  },
  (t) => [
    index("invitations_pair_idx").on(t.senderUid, t.receiverUid),
    index("invitations_receiver_status_idx").on(t.receiverUid, t.status),
    index("invitations_sender_status_idx").on(t.senderUid, t.status),
  ]
);

export type MatchStatus = "matched" | "contacted" | "successful" | "unsuccessful";

export const manualMatches = pgTable(
  "manual_matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user1Id: text("user1_id").notNull(),
    user1Uid: text("user1_uid").notNull(),
    user1Name: text("user1_name").notNull(),
    user2Id: text("user2_id").notNull(),
    user2Uid: text("user2_uid").notNull(),
    user2Name: text("user2_name").notNull(),
    status: text("status").$type<MatchStatus>().notNull().default("matched"),
    notes: text("notes").notNull().default(""),
    matchedBy: text("matched_by").notNull(),
    ...timestamps,
  },
  (t) => [
    index("matches_user1_idx").on(t.user1Uid),
    index("matches_user2_idx").on(t.user2Uid),
    index("matches_status_idx").on(t.status),
  ]
);

export type NotificationType =
  | "profile_view"
  | "new_match"
  | "system"
  | "welcome"
  | "profile_incomplete";

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipientUid: text("recipient_uid").notNull(),
    type: text("type").$type<NotificationType>().notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    read: boolean("read").notNull().default(false),
    actorUid: text("actor_uid"),
    actorName: text("actor_name"),
    actorProfileId: text("actor_profile_id"),
    dayBucket: text("day_bucket"),
    ...timestamps,
  },
  (t) => [
    index("notifications_recipient_created_idx").on(t.recipientUid, t.createdAt),
    index("notifications_recipient_read_idx").on(t.recipientUid, t.read),
    // Race-safe profile_view dedupe. NULL day_bucket rows never conflict.
    uniqueIndex("notifications_dedupe_idx").on(t.recipientUid, t.type, t.actorUid, t.dayBucket),
  ]
);

export type Member = typeof members.$inferSelect;
export type BiodataSubmission = typeof biodataSubmissions.$inferSelect;
