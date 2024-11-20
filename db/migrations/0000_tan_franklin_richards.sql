DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('open', 'canceled', 'uncollectible', 'pending', 'paid', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"create_ts" timestamp DEFAULT now() NOT NULL,
	"value" integer NOT NULL,
	"description" text NOT NULL,
	"status" text NOT NULL
);
