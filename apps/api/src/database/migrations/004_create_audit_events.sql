-- Append-only local audit trail for task creation and state changes.
CREATE TABLE IF NOT EXISTS audit_events (
  id bigserial PRIMARY KEY,
  entity_type text NOT NULL CHECK (entity_type IN ('task')),
  entity_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('created', 'updated', 'status_changed')),
  actor text NOT NULL DEFAULT 'local-user',
  source text NOT NULL DEFAULT 'local-api',
  before_data jsonb,
  after_data jsonb NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_events_entity_idx ON audit_events (entity_type, entity_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS audit_events_occurred_at_idx ON audit_events (occurred_at DESC);

CREATE OR REPLACE FUNCTION record_task_audit_event() RETURNS trigger AS $$
DECLARE
  before_json jsonb;
  after_json jsonb;
  action_name text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    before_json := NULL;
    after_json := to_jsonb(NEW);
    action_name := 'created';
  ELSE
    before_json := to_jsonb(OLD);
    after_json := to_jsonb(NEW);
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      action_name := 'status_changed';
    ELSE
      action_name := 'updated';
    END IF;
  END IF;

  INSERT INTO audit_events (entity_type, entity_id, action, before_data, after_data)
  VALUES ('task', NEW.id, action_name, before_json, after_json);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tasks_audit_after_write ON tasks;
CREATE TRIGGER tasks_audit_after_write
AFTER INSERT OR UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION record_task_audit_event();
