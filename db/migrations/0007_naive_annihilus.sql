ALTER TABLE "customers" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "customerId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "company_name" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "street" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "zip" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN IF EXISTS "organizationId";