-- Scope operational records to the local owner account.
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE RESTRICT;
ALTER TABLE content_ideas ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE RESTRICT;
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS tasks_user_status_idx ON tasks (user_id, status, due_at);
CREATE INDEX IF NOT EXISTS content_ideas_user_created_idx ON content_ideas (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_events_user_occurred_idx ON audit_events (user_id, occurred_at DESC);

-- Carry ownership into every new audit event emitted by the task trigger.
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

  INSERT INTO audit_events (user_id, entity_type, entity_id, action, before_data, after_data)
  VALUES (NEW.user_id, 'task', NEW.id, action_name, before_json, after_json);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
