CREATE TABLE IF NOT EXISTS "customers" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "create_ts" TIMESTAMP DEFAULT now() NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "userId" TEXT NOT NULL
);

CREATE TABLE "invoices" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "create_ts" TIMESTAMP DEFAULT now() NOT NULL,
  "value" INTEGER NOT NULL,
  "description" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "customerId" INTEGER NOT NULL REFERENCES customers(id),
  "status" status NOT NULL
);
