DO $$ BEGIN
  CREATE TYPE status AS ENUM ('open', 'paid', 'void', 'uncollectible', 'canceled', 'pending', 'failed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
