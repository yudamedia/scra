import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_permissions_resource" AS ENUM('media', 'documents', 'areas', 'issues', 'directory-entries', 'committees', 'people', 'posts', 'events', 'memberships', 'payments', 'issue-reports', 'site-settings', 'main-navigation', 'issue-categories', 'homepage', 'about-page', 'membership-page', 'page-intros', 'legal-pages');
  CREATE TYPE "public"."enum_users_role" AS ENUM('superAdmin', 'admin');
  CREATE TABLE "users_permissions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"resource" "enum_users_permissions_resource",
  	"read" boolean DEFAULT true,
  	"create" boolean DEFAULT false,
  	"update" boolean DEFAULT false,
  	"delete" boolean DEFAULT false
  );
  
  ALTER TABLE "users" ADD COLUMN "name" varchar;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'admin' NOT NULL;
  ALTER TABLE "users_permissions" ADD CONSTRAINT "users_permissions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_permissions_order_idx" ON "users_permissions" USING btree ("_order");
  CREATE INDEX "users_permissions_parent_id_idx" ON "users_permissions" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_permissions" CASCADE;
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "users" DROP COLUMN "role";
  DROP TYPE "public"."enum_users_permissions_resource";
  DROP TYPE "public"."enum_users_role";`)
}
