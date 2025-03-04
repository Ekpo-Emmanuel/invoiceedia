CREATE TABLE IF NOT EXISTS "email_reminders" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "invoice_id" uuid REFERENCES "invoices"("id") ON DELETE CASCADE,
    "type" text NOT NULL CHECK ("type" IN ('before_due', 'on_due', 'after_due')),
    "days" integer NOT NULL,
    "email_template" text NOT NULL,
    "scheduled_date" timestamp NOT NULL,
    "sent_date" timestamp,
    "status" text NOT NULL CHECK ("status" IN ('scheduled', 'sent', 'failed', 'cancelled')),
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
); 