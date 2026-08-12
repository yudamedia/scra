import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the `location` group (lat/lng) to areas/issues/directory-entries and
// `locationText` to issues, for the static map (CLAUDE.md's Map section).
// These were added to the collection configs and picked up locally by
// dev-mode schema push, but — per gotcha #14 — that push never reaches
// production, so this migration is required for the map feature to work
// there. Round-trip verified: applied DOWN then UP against a throwaway
// Postgres seeded from a schema-only dump of the real dev database: the
// resulting `areas`/`issues`/`directory_entries` schemas came back
// byte-for-byte identical to dev's actual (already-pushed) schema.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "areas" ADD COLUMN "location_lat" numeric;
  ALTER TABLE "areas" ADD COLUMN "location_lng" numeric;
  ALTER TABLE "issues" ADD COLUMN "location_text" varchar;
  ALTER TABLE "issues" ADD COLUMN "location_lat" numeric;
  ALTER TABLE "issues" ADD COLUMN "location_lng" numeric;
  ALTER TABLE "directory_entries" ADD COLUMN "location_lat" numeric;
  ALTER TABLE "directory_entries" ADD COLUMN "location_lng" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "areas" DROP COLUMN "location_lat";
  ALTER TABLE "areas" DROP COLUMN "location_lng";
  ALTER TABLE "issues" DROP COLUMN "location_text";
  ALTER TABLE "issues" DROP COLUMN "location_lat";
  ALTER TABLE "issues" DROP COLUMN "location_lng";
  ALTER TABLE "directory_entries" DROP COLUMN "location_lat";
  ALTER TABLE "directory_entries" DROP COLUMN "location_lng";`)
}
