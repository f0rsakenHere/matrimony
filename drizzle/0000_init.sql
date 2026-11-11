CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "biodata_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"biodata" jsonb NOT NULL,
	"moderation_status" text DEFAULT 'pending' NOT NULL,
	"moderation_note" text DEFAULT '' NOT NULL,
	"moderated_by_uid" text,
	"moderated_at" timestamp with time zone,
	"submitter_first_name" text DEFAULT '' NOT NULL,
	"submitter_last_name" text DEFAULT '' NOT NULL,
	"ip_hash" text NOT NULL,
	"user_agent" text DEFAULT '' NOT NULL,
	"email" text,
	"phone" text DEFAULT '' NOT NULL,
	"how_heard" text DEFAULT '' NOT NULL,
	"faith_declaration_accepted" boolean DEFAULT false NOT NULL,
	"faith_declaration_accepted_at" timestamp with time zone,
	"claimed_by_uid" text,
	"shadow_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_uid" text NOT NULL,
	"sender_name" text NOT NULL,
	"sender_profile_id" text NOT NULL,
	"receiver_uid" text NOT NULL,
	"receiver_name" text NOT NULL,
	"receiver_profile_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manual_matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user1_id" text NOT NULL,
	"user1_uid" text NOT NULL,
	"user1_name" text NOT NULL,
	"user2_id" text NOT NULL,
	"user2_uid" text NOT NULL,
	"user2_name" text NOT NULL,
	"status" text DEFAULT 'matched' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"matched_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" text NOT NULL,
	"email" text NOT NULL,
	"provider" text DEFAULT 'email' NOT NULL,
	"photo_url" text,
	"first_name" text DEFAULT '' NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"profile_name" text DEFAULT '' NOT NULL,
	"partner_preferences" jsonb DEFAULT '{"qualification":[],"religiousHistory":"","sect":"","prayerRoutine":"","modesty":""}'::jsonb NOT NULL,
	"biodata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"onboarding_step" integer DEFAULT 0 NOT NULL,
	"onboarding_complete" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"invites_remaining" integer DEFAULT 3 NOT NULL,
	"is_premium" boolean DEFAULT false NOT NULL,
	"is_shadow" boolean DEFAULT false NOT NULL,
	"source_submission_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "members_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_uid" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"actor_uid" text,
	"actor_name" text,
	"actor_profile_id" text,
	"day_bucket" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "submissions_status_created_idx" ON "biodata_submissions" USING btree ("moderation_status","created_at");--> statement-breakpoint
CREATE INDEX "submissions_created_idx" ON "biodata_submissions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "submissions_ip_hash_idx" ON "biodata_submissions" USING btree ("ip_hash");--> statement-breakpoint
CREATE INDEX "invitations_pair_idx" ON "invitations" USING btree ("sender_uid","receiver_uid");--> statement-breakpoint
CREATE INDEX "invitations_receiver_status_idx" ON "invitations" USING btree ("receiver_uid","status");--> statement-breakpoint
CREATE INDEX "invitations_sender_status_idx" ON "invitations" USING btree ("sender_uid","status");--> statement-breakpoint
CREATE INDEX "matches_user1_idx" ON "manual_matches" USING btree ("user1_uid");--> statement-breakpoint
CREATE INDEX "matches_user2_idx" ON "manual_matches" USING btree ("user2_uid");--> statement-breakpoint
CREATE INDEX "matches_status_idx" ON "manual_matches" USING btree ("status");--> statement-breakpoint
CREATE INDEX "members_is_shadow_idx" ON "members" USING btree ("is_shadow");--> statement-breakpoint
CREATE INDEX "members_updated_at_idx" ON "members" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "members_gender_idx" ON "members" USING btree (("biodata"->'personal'->>'gender'));--> statement-breakpoint
CREATE INDEX "notifications_recipient_created_idx" ON "notifications" USING btree ("recipient_uid","created_at");--> statement-breakpoint
CREATE INDEX "notifications_recipient_read_idx" ON "notifications" USING btree ("recipient_uid","read");--> statement-breakpoint
CREATE UNIQUE INDEX "notifications_dedupe_idx" ON "notifications" USING btree ("recipient_uid","type","actor_uid","day_bucket");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");