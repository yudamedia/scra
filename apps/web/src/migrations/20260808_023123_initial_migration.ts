import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Hand-pruned from Payload's auto-generated output: `payload migrate:create`
// has no prior migration to diff against in this project (schema has always
// been synced via dev-mode push), so its first run emits a "create the
// entire schema from scratch" migration — which collides with tables that
// already exist in production. This file keeps only the actual diff:
// the 3 new collections (memberships, payments, issue-reports), the new
// `visibility` column on documents/events, and the 3 new relation columns
// that `payload_locked_documents_rels` needs to support locking documents
// in the 3 new collections.
//
// Verified equivalent: applying this migration on top of a fresh
// reconstruction of the pre-existing schema produces a byte-for-byte
// identical `pg_dump --schema-only` to the fully-migrated dev database.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_documents_visibility" AS ENUM('public', 'membersOnly');
  CREATE TYPE "public"."enum_events_visibility" AS ENUM('public', 'membersOnly');
  CREATE TYPE "public"."enum_memberships_type" AS ENUM('personal', 'household', 'corporate', 'free');
  CREATE TYPE "public"."enum_memberships_import_status" AS ENUM('native', 'imported');
  CREATE TYPE "public"."enum_memberships_last_reminder_stage" AS ENUM('none', '30day', '7day', 'dueday', 'lapsed');
  CREATE TYPE "public"."enum_payments_method" AS ENUM('stk_push', 'bank_transfer', 'cash', 'other');
  CREATE TYPE "public"."enum_payments_provider" AS ENUM('tuma', 'manual');
  CREATE TYPE "public"."enum_payments_payment_status" AS ENUM('pending', 'confirmed', 'failed');
  CREATE TYPE "public"."enum_payments_payment_type" AS ENUM('new', 'renewal');
  CREATE TYPE "public"."enum_issue_reports_status_history_status" AS ENUM('received', 'under_review', 'in_progress', 'resolved');
  CREATE TYPE "public"."enum_issue_reports_category" AS ENUM('roads', 'security', 'street_lighting', 'illegal_development', 'environmental', 'other');
  CREATE TYPE "public"."enum_issue_reports_status" AS ENUM('received', 'under_review', 'in_progress', 'resolved');

  CREATE TABLE "memberships_additional_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"surname" varchar NOT NULL,
  	"first_name" varchar,
  	"phone" varchar,
  	"email" varchar
  );

  CREATE TABLE "memberships_linked_auth_users" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"auth_user_id" varchar NOT NULL,
  	"email" varchar NOT NULL
  );

  CREATE TABLE "memberships" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"membership_number" varchar,
  	"type" "enum_memberships_type" NOT NULL,
  	"admin_revoked" boolean DEFAULT false,
  	"revoked_reason" varchar,
  	"primary_contact_surname" varchar NOT NULL,
  	"primary_contact_first_name" varchar,
  	"primary_contact_phone" varchar,
  	"primary_contact_email" varchar,
  	"postal_address" varchar,
  	"town" varchar,
  	"postal_code" varchar,
  	"corporate_business_name" varchar,
  	"subscription_amount" numeric,
  	"expiry_date" timestamp(3) with time zone NOT NULL,
  	"import_status" "enum_memberships_import_status" DEFAULT 'native' NOT NULL,
  	"import_flags" varchar,
  	"last_reminder_stage" "enum_memberships_last_reminder_stage" DEFAULT 'none',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"membership_id" integer NOT NULL,
  	"amount" numeric NOT NULL,
  	"method" "enum_payments_method" NOT NULL,
  	"provider" "enum_payments_provider" NOT NULL,
  	"tuma_payment_id" varchar,
  	"payment_status" "enum_payments_payment_status" DEFAULT 'pending' NOT NULL,
  	"confirmed_at" timestamp(3) with time zone,
  	"confirmed_by_id" integer,
  	"raw_webhook_payload" jsonb,
  	"payment_type" "enum_payments_payment_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "issue_reports_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );

  CREATE TABLE "issue_reports_status_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"status" "enum_issue_reports_status_history_status" NOT NULL,
  	"changed_at" timestamp(3) with time zone NOT NULL,
  	"changed_by_id" integer,
  	"note" varchar
  );

  CREATE TABLE "issue_reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference_code" varchar,
  	"reporter_name" varchar NOT NULL,
  	"reporter_phone" varchar,
  	"reporter_email" varchar,
  	"reported_by" varchar,
  	"category" "enum_issue_reports_category" NOT NULL,
  	"description" varchar NOT NULL,
  	"location_lat" numeric,
  	"location_lng" numeric,
  	"location_address_text" varchar,
  	"status" "enum_issue_reports_status" DEFAULT 'received' NOT NULL,
  	"linked_issue_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "documents" ADD COLUMN "visibility" "enum_documents_visibility" DEFAULT 'public' NOT NULL;
  ALTER TABLE "events" ADD COLUMN "visibility" "enum_events_visibility" DEFAULT 'public' NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "memberships_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payments_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "issue_reports_id" integer;

  ALTER TABLE "memberships_additional_members" ADD CONSTRAINT "memberships_additional_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."memberships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "memberships_linked_auth_users" ADD CONSTRAINT "memberships_linked_auth_users_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."memberships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_confirmed_by_id_users_id_fk" FOREIGN KEY ("confirmed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "issue_reports_photos" ADD CONSTRAINT "issue_reports_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "issue_reports_photos" ADD CONSTRAINT "issue_reports_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."issue_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "issue_reports_status_history" ADD CONSTRAINT "issue_reports_status_history_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "issue_reports_status_history" ADD CONSTRAINT "issue_reports_status_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."issue_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "issue_reports" ADD CONSTRAINT "issue_reports_linked_issue_id_issues_id_fk" FOREIGN KEY ("linked_issue_id") REFERENCES "public"."issues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_memberships_fk" FOREIGN KEY ("memberships_id") REFERENCES "public"."memberships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_issue_reports_fk" FOREIGN KEY ("issue_reports_id") REFERENCES "public"."issue_reports"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "memberships_additional_members_order_idx" ON "memberships_additional_members" USING btree ("_order");
  CREATE INDEX "memberships_additional_members_parent_id_idx" ON "memberships_additional_members" USING btree ("_parent_id");
  CREATE INDEX "memberships_linked_auth_users_order_idx" ON "memberships_linked_auth_users" USING btree ("_order");
  CREATE INDEX "memberships_linked_auth_users_parent_id_idx" ON "memberships_linked_auth_users" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "memberships_membership_number_idx" ON "memberships" USING btree ("membership_number");
  CREATE INDEX "memberships_updated_at_idx" ON "memberships" USING btree ("updated_at");
  CREATE INDEX "memberships_created_at_idx" ON "memberships" USING btree ("created_at");
  CREATE INDEX "payments_membership_idx" ON "payments" USING btree ("membership_id");
  CREATE INDEX "payments_confirmed_by_idx" ON "payments" USING btree ("confirmed_by_id");
  CREATE INDEX "payments_updated_at_idx" ON "payments" USING btree ("updated_at");
  CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");
  CREATE INDEX "issue_reports_photos_order_idx" ON "issue_reports_photos" USING btree ("_order");
  CREATE INDEX "issue_reports_photos_parent_id_idx" ON "issue_reports_photos" USING btree ("_parent_id");
  CREATE INDEX "issue_reports_photos_image_idx" ON "issue_reports_photos" USING btree ("image_id");
  CREATE INDEX "issue_reports_status_history_order_idx" ON "issue_reports_status_history" USING btree ("_order");
  CREATE INDEX "issue_reports_status_history_parent_id_idx" ON "issue_reports_status_history" USING btree ("_parent_id");
  CREATE INDEX "issue_reports_status_history_changed_by_idx" ON "issue_reports_status_history" USING btree ("changed_by_id");
  CREATE UNIQUE INDEX "issue_reports_reference_code_idx" ON "issue_reports" USING btree ("reference_code");
  CREATE INDEX "issue_reports_linked_issue_idx" ON "issue_reports" USING btree ("linked_issue_id");
  CREATE INDEX "issue_reports_updated_at_idx" ON "issue_reports" USING btree ("updated_at");
  CREATE INDEX "issue_reports_created_at_idx" ON "issue_reports" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_memberships_id_idx" ON "payload_locked_documents_rels" USING btree ("memberships_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
  CREATE INDEX "payload_locked_documents_rels_issue_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("issue_reports_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_memberships_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payments_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_issue_reports_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "memberships_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payments_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "issue_reports_id";
  ALTER TABLE "events" DROP COLUMN "visibility";
  ALTER TABLE "documents" DROP COLUMN "visibility";
  DROP TABLE "memberships_additional_members" CASCADE;
  DROP TABLE "memberships_linked_auth_users" CASCADE;
  DROP TABLE "memberships" CASCADE;
  DROP TABLE "payments" CASCADE;
  DROP TABLE "issue_reports_photos" CASCADE;
  DROP TABLE "issue_reports_status_history" CASCADE;
  DROP TABLE "issue_reports" CASCADE;
  DROP TYPE "public"."enum_documents_visibility";
  DROP TYPE "public"."enum_events_visibility";
  DROP TYPE "public"."enum_memberships_type";
  DROP TYPE "public"."enum_memberships_import_status";
  DROP TYPE "public"."enum_memberships_last_reminder_stage";
  DROP TYPE "public"."enum_payments_method";
  DROP TYPE "public"."enum_payments_provider";
  DROP TYPE "public"."enum_payments_payment_status";
  DROP TYPE "public"."enum_payments_payment_type";
  DROP TYPE "public"."enum_issue_reports_status_history_status";
  DROP TYPE "public"."enum_issue_reports_category";
  DROP TYPE "public"."enum_issue_reports_status";`)
}
