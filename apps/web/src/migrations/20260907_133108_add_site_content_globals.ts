import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_social_platform" AS ENUM('facebook', 'instagram', 'x', 'youtube');
  CREATE TYPE "public"."enum_issue_categories_categories_value" AS ENUM('roads-infrastructure', 'security', 'water-supply', 'electricity', 'waste-management', 'environment', 'beach-access', 'planning-development');
  CREATE TYPE "public"."enum_issue_categories_categories_icon" AS ENUM('information-circle', 'shield-01', 'news', 'calendar-01', 'folder-01', 'call-02', 'road', 'shield-02', 'droplet', 'leaf-01', 'building-01', 'recycle-01', 'checkmark-circle-02', 'notification-01', 'discount-01', 'megaphone-01', 'idea', 'document-attachment', 'target-02', 'shield-user', 'user-group', 'facebook-01', 'mail-01', 'location-01');
  CREATE TYPE "public"."enum_homepage_hero_cta_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_homepage_quick_links_icon" AS ENUM('information-circle', 'shield-01', 'news', 'calendar-01', 'folder-01', 'call-02', 'road', 'shield-02', 'droplet', 'leaf-01', 'building-01', 'recycle-01', 'checkmark-circle-02', 'notification-01', 'discount-01', 'megaphone-01', 'idea', 'document-attachment', 'target-02', 'shield-user', 'user-group', 'facebook-01', 'mail-01', 'location-01');
  CREATE TYPE "public"."enum_homepage_membership_cta_benefits_icon" AS ENUM('information-circle', 'shield-01', 'news', 'calendar-01', 'folder-01', 'call-02', 'road', 'shield-02', 'droplet', 'leaf-01', 'building-01', 'recycle-01', 'checkmark-circle-02', 'notification-01', 'discount-01', 'megaphone-01', 'idea', 'document-attachment', 'target-02', 'shield-user', 'user-group', 'facebook-01', 'mail-01', 'location-01');
  CREATE TYPE "public"."enum_about_page_what_we_do_icon" AS ENUM('information-circle', 'shield-01', 'news', 'calendar-01', 'folder-01', 'call-02', 'road', 'shield-02', 'droplet', 'leaf-01', 'building-01', 'recycle-01', 'checkmark-circle-02', 'notification-01', 'discount-01', 'megaphone-01', 'idea', 'document-attachment', 'target-02', 'shield-user', 'user-group', 'facebook-01', 'mail-01', 'location-01');
  CREATE TYPE "public"."enum_membership_page_tiers_type" AS ENUM('personal', 'household', 'corporate');
  CREATE TYPE "public"."enum_membership_page_benefits_icon" AS ENUM('information-circle', 'shield-01', 'news', 'calendar-01', 'folder-01', 'call-02', 'road', 'shield-02', 'droplet', 'leaf-01', 'building-01', 'recycle-01', 'checkmark-circle-02', 'notification-01', 'discount-01', 'megaphone-01', 'idea', 'document-attachment', 'target-02', 'shield-user', 'user-group', 'facebook-01', 'mail-01', 'location-01');
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"org_name" varchar NOT NULL,
  	"tagline" varchar NOT NULL,
  	"logo_id" integer,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"contact_address_line1" varchar,
  	"contact_address_detail" varchar,
  	"payment_paybill_number" varchar,
  	"payment_paybill_account" varchar,
  	"payment_pay_in_person_text" varchar,
  	"seo_defaults_default_title" varchar,
  	"seo_defaults_default_description" varchar,
  	"footer_legal_copyright_name" varchar,
  	"footer_legal_built_by_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "main_navigation_header_links_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "main_navigation_header_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "main_navigation_footer_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "main_navigation_footer_resource_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "main_navigation_footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "main_navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "issue_categories_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" "enum_issue_categories_categories_value" NOT NULL,
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"icon" "enum_issue_categories_categories_icon",
  	"featured_on_homepage" boolean DEFAULT false
  );
  
  CREATE TABLE "issue_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_hero_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"style" "enum_homepage_hero_cta_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "homepage_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"sub" varchar,
  	"href" varchar NOT NULL,
  	"icon" "enum_homepage_quick_links_icon"
  );
  
  CREATE TABLE "homepage_membership_cta_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_homepage_membership_cta_benefits_icon",
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_heading" varchar NOT NULL,
  	"hero_subtext" varchar,
  	"hero_image_id" integer,
  	"news_section_eyebrow" varchar,
  	"news_section_heading" varchar,
  	"issues_section_eyebrow" varchar,
  	"issues_section_heading" varchar,
  	"membership_cta_heading" varchar,
  	"membership_cta_paragraph" varchar,
  	"membership_cta_button_label" varchar,
  	"events_empty_state_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_what_we_do" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_about_page_what_we_do_icon",
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "about_page_bottom_cta_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"href" varchar NOT NULL,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar NOT NULL,
  	"hero_paragraph" varchar,
  	"hero_image_id" integer,
  	"stats_founded_year" varchar,
  	"stats_members_value" varchar,
  	"stats_members_label" varchar,
  	"stats_areas_served_label" varchar,
  	"stats_issues_tracked_label" varchar,
  	"history" jsonb,
  	"who_we_represent" jsonb,
  	"what_we_do_intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "membership_page_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_membership_page_tiers_type" NOT NULL,
  	"price" varchar NOT NULL,
  	"period" varchar,
  	"detail" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "membership_page_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_membership_page_benefits_icon",
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "membership_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar NOT NULL,
  	"hero_paragraph" varchar,
  	"tiers_footnote" varchar,
  	"discounts_heading" varchar,
  	"discounts_intro" varchar,
  	"how_to_join_heading" varchar,
  	"how_to_join_apply_button_label" varchar,
  	"how_to_join_pay_in_person_text" varchar,
  	"how_to_join_footer_note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_intros" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_eyebrow" varchar,
  	"contact_heading" varchar,
  	"contact_paragraph" varchar,
  	"contact_image_id" integer,
  	"contact_membership_callout_text" varchar,
  	"leadership_eyebrow" varchar,
  	"leadership_heading" varchar,
  	"leadership_paragraph" varchar,
  	"leadership_image_id" integer,
  	"committees_eyebrow" varchar,
  	"committees_heading" varchar,
  	"committees_paragraph" varchar,
  	"committees_image_id" integer,
  	"directory_eyebrow" varchar,
  	"directory_heading" varchar,
  	"directory_paragraph" varchar,
  	"directory_image_id" integer,
  	"issues_eyebrow" varchar,
  	"issues_heading" varchar,
  	"issues_paragraph" varchar,
  	"issues_image_id" integer,
  	"news_eyebrow" varchar,
  	"news_heading" varchar,
  	"news_paragraph" varchar,
  	"news_image_id" integer,
  	"areas_eyebrow" varchar,
  	"areas_heading" varchar,
  	"areas_paragraph" varchar,
  	"areas_image_id" integer,
  	"documents_eyebrow" varchar,
  	"documents_heading" varchar,
  	"documents_paragraph" varchar,
  	"documents_image_id" integer,
  	"documents_empty_state_text" varchar,
  	"events_eyebrow" varchar,
  	"events_heading" varchar,
  	"events_paragraph" varchar,
  	"events_image_id" integer,
  	"events_empty_state_heading" varchar,
  	"events_empty_state_text" varchar,
  	"map_eyebrow" varchar,
  	"map_heading" varchar,
  	"map_paragraph" varchar,
  	"map_image_id" integer,
  	"report_issue_eyebrow" varchar,
  	"report_issue_heading" varchar,
  	"report_issue_paragraph" varchar,
  	"report_issue_image_id" integer,
  	"membership_apply_eyebrow" varchar,
  	"membership_apply_heading" varchar,
  	"membership_apply_paragraph" varchar,
  	"membership_apply_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "legal_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"privacy_policy_markdown" varchar,
  	"terms_of_service_markdown" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "main_navigation_header_links_children" ADD CONSTRAINT "main_navigation_header_links_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation_header_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_header_links" ADD CONSTRAINT "main_navigation_header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_footer_quick_links" ADD CONSTRAINT "main_navigation_footer_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_footer_resource_links" ADD CONSTRAINT "main_navigation_footer_resource_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_footer_legal_links" ADD CONSTRAINT "main_navigation_footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "issue_categories_categories" ADD CONSTRAINT "issue_categories_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."issue_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_cta_buttons" ADD CONSTRAINT "homepage_hero_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_quick_links" ADD CONSTRAINT "homepage_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_membership_cta_benefits" ADD CONSTRAINT "homepage_membership_cta_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_what_we_do" ADD CONSTRAINT "about_page_what_we_do_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_bottom_cta_cards" ADD CONSTRAINT "about_page_bottom_cta_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "membership_page_tiers" ADD CONSTRAINT "membership_page_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_page_benefits" ADD CONSTRAINT "membership_page_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_intros" ADD CONSTRAINT "page_intros_contact_image_id_media_id_fk" FOREIGN KEY ("contact_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_intros" ADD CONSTRAINT "page_intros_leadership_image_id_media_id_fk" FOREIGN KEY ("leadership_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_intros" ADD CONSTRAINT "page_intros_committees_image_id_media_id_fk" FOREIGN KEY ("committees_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_intros" ADD CONSTRAINT "page_intros_directory_image_id_media_id_fk" FOREIGN KEY ("directory_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_intros" ADD CONSTRAINT "page_intros_issues_image_id_media_id_fk" FOREIGN KEY ("issues_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_intros" ADD CONSTRAINT "page_intros_news_image_id_media_id_fk" FOREIGN KEY ("news_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_intros" ADD CONSTRAINT "page_intros_areas_image_id_media_id_fk" FOREIGN KEY ("areas_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_intros" ADD CONSTRAINT "page_intros_documents_image_id_media_id_fk" FOREIGN KEY ("documents_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_intros" ADD CONSTRAINT "page_intros_events_image_id_media_id_fk" FOREIGN KEY ("events_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_intros" ADD CONSTRAINT "page_intros_map_image_id_media_id_fk" FOREIGN KEY ("map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_intros" ADD CONSTRAINT "page_intros_report_issue_image_id_media_id_fk" FOREIGN KEY ("report_issue_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_intros" ADD CONSTRAINT "page_intros_membership_apply_image_id_media_id_fk" FOREIGN KEY ("membership_apply_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "main_navigation_header_links_children_order_idx" ON "main_navigation_header_links_children" USING btree ("_order");
  CREATE INDEX "main_navigation_header_links_children_parent_id_idx" ON "main_navigation_header_links_children" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_header_links_order_idx" ON "main_navigation_header_links" USING btree ("_order");
  CREATE INDEX "main_navigation_header_links_parent_id_idx" ON "main_navigation_header_links" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_footer_quick_links_order_idx" ON "main_navigation_footer_quick_links" USING btree ("_order");
  CREATE INDEX "main_navigation_footer_quick_links_parent_id_idx" ON "main_navigation_footer_quick_links" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_footer_resource_links_order_idx" ON "main_navigation_footer_resource_links" USING btree ("_order");
  CREATE INDEX "main_navigation_footer_resource_links_parent_id_idx" ON "main_navigation_footer_resource_links" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_footer_legal_links_order_idx" ON "main_navigation_footer_legal_links" USING btree ("_order");
  CREATE INDEX "main_navigation_footer_legal_links_parent_id_idx" ON "main_navigation_footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "issue_categories_categories_order_idx" ON "issue_categories_categories" USING btree ("_order");
  CREATE INDEX "issue_categories_categories_parent_id_idx" ON "issue_categories_categories" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_cta_buttons_order_idx" ON "homepage_hero_cta_buttons" USING btree ("_order");
  CREATE INDEX "homepage_hero_cta_buttons_parent_id_idx" ON "homepage_hero_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "homepage_quick_links_order_idx" ON "homepage_quick_links" USING btree ("_order");
  CREATE INDEX "homepage_quick_links_parent_id_idx" ON "homepage_quick_links" USING btree ("_parent_id");
  CREATE INDEX "homepage_membership_cta_benefits_order_idx" ON "homepage_membership_cta_benefits" USING btree ("_order");
  CREATE INDEX "homepage_membership_cta_benefits_parent_id_idx" ON "homepage_membership_cta_benefits" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_hero_image_idx" ON "homepage" USING btree ("hero_image_id");
  CREATE INDEX "about_page_what_we_do_order_idx" ON "about_page_what_we_do" USING btree ("_order");
  CREATE INDEX "about_page_what_we_do_parent_id_idx" ON "about_page_what_we_do" USING btree ("_parent_id");
  CREATE INDEX "about_page_bottom_cta_cards_order_idx" ON "about_page_bottom_cta_cards" USING btree ("_order");
  CREATE INDEX "about_page_bottom_cta_cards_parent_id_idx" ON "about_page_bottom_cta_cards" USING btree ("_parent_id");
  CREATE INDEX "about_page_hero_hero_image_idx" ON "about_page" USING btree ("hero_image_id");
  CREATE INDEX "membership_page_tiers_order_idx" ON "membership_page_tiers" USING btree ("_order");
  CREATE INDEX "membership_page_tiers_parent_id_idx" ON "membership_page_tiers" USING btree ("_parent_id");
  CREATE INDEX "membership_page_benefits_order_idx" ON "membership_page_benefits" USING btree ("_order");
  CREATE INDEX "membership_page_benefits_parent_id_idx" ON "membership_page_benefits" USING btree ("_parent_id");
  CREATE INDEX "page_intros_contact_contact_image_idx" ON "page_intros" USING btree ("contact_image_id");
  CREATE INDEX "page_intros_leadership_leadership_image_idx" ON "page_intros" USING btree ("leadership_image_id");
  CREATE INDEX "page_intros_committees_committees_image_idx" ON "page_intros" USING btree ("committees_image_id");
  CREATE INDEX "page_intros_directory_directory_image_idx" ON "page_intros" USING btree ("directory_image_id");
  CREATE INDEX "page_intros_issues_issues_image_idx" ON "page_intros" USING btree ("issues_image_id");
  CREATE INDEX "page_intros_news_news_image_idx" ON "page_intros" USING btree ("news_image_id");
  CREATE INDEX "page_intros_areas_areas_image_idx" ON "page_intros" USING btree ("areas_image_id");
  CREATE INDEX "page_intros_documents_documents_image_idx" ON "page_intros" USING btree ("documents_image_id");
  CREATE INDEX "page_intros_events_events_image_idx" ON "page_intros" USING btree ("events_image_id");
  CREATE INDEX "page_intros_map_map_image_idx" ON "page_intros" USING btree ("map_image_id");
  CREATE INDEX "page_intros_report_issue_report_issue_image_idx" ON "page_intros" USING btree ("report_issue_image_id");
  CREATE INDEX "page_intros_membership_apply_membership_apply_image_idx" ON "page_intros" USING btree ("membership_apply_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "main_navigation_header_links_children" CASCADE;
  DROP TABLE "main_navigation_header_links" CASCADE;
  DROP TABLE "main_navigation_footer_quick_links" CASCADE;
  DROP TABLE "main_navigation_footer_resource_links" CASCADE;
  DROP TABLE "main_navigation_footer_legal_links" CASCADE;
  DROP TABLE "main_navigation" CASCADE;
  DROP TABLE "issue_categories_categories" CASCADE;
  DROP TABLE "issue_categories" CASCADE;
  DROP TABLE "homepage_hero_cta_buttons" CASCADE;
  DROP TABLE "homepage_quick_links" CASCADE;
  DROP TABLE "homepage_membership_cta_benefits" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "about_page_what_we_do" CASCADE;
  DROP TABLE "about_page_bottom_cta_cards" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "membership_page_tiers" CASCADE;
  DROP TABLE "membership_page_benefits" CASCADE;
  DROP TABLE "membership_page" CASCADE;
  DROP TABLE "page_intros" CASCADE;
  DROP TABLE "legal_pages" CASCADE;
  DROP TYPE "public"."enum_site_settings_social_platform";
  DROP TYPE "public"."enum_issue_categories_categories_value";
  DROP TYPE "public"."enum_issue_categories_categories_icon";
  DROP TYPE "public"."enum_homepage_hero_cta_buttons_style";
  DROP TYPE "public"."enum_homepage_quick_links_icon";
  DROP TYPE "public"."enum_homepage_membership_cta_benefits_icon";
  DROP TYPE "public"."enum_about_page_what_we_do_icon";
  DROP TYPE "public"."enum_membership_page_tiers_type";
  DROP TYPE "public"."enum_membership_page_benefits_icon";`)
}
