-- The migration runner owns this ledger and records successfully applied files.
-- No real business or customer data is stored by this migration.
CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
