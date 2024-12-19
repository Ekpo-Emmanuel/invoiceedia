DO $$ BEGIN
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customerId_customers_id_fk"
  FOREIGN KEY ("customerId") REFERENCES "customers"("id")
  ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
