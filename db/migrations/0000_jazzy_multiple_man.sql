DO $$ BEGIN
 CREATE TYPE "public"."payment_terms" AS ENUM('due_on_receipt', 'net_15', 'net_30', 'net_60');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('open', 'paid', 'void', 'uncollectible', 'canceled', 'pending', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"company_name" text,
	"email" text NOT NULL,
	"phone" text,
	"street" text,
	"city" text,
	"zip" text,
	"state" text,
	"country" text,
	"notes" text,
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"create_ts" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"type" text NOT NULL,
	"days" integer NOT NULL,
	"email_template" text NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"sent_date" timestamp,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"create_ts" timestamp DEFAULT now() NOT NULL,
	"issue_date" date NOT NULL,
	"due_date" date NOT NULL,
	"payment_terms" "payment_terms" NOT NULL,
	"notes" text,
	"line_items" jsonb NOT NULL,
	"subtotal" integer NOT NULL,
	"tax_rate" numeric(5, 2),
	"tax_amount" integer,
	"total" integer NOT NULL,
	"description" text NOT NULL,
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"customer_id" uuid NOT NULL,
	"status" "status" NOT NULL,
	"payment_date" date
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_reminders" ADD CONSTRAINT "email_reminders_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
