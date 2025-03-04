CREATE TABLE IF NOT EXISTS "invoice_templates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "content" text NOT NULL,
  "is_default" boolean NOT NULL DEFAULT false,
  "category" text NOT NULL,
  "organization_id" text NOT NULL,
  "user_id" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
); 