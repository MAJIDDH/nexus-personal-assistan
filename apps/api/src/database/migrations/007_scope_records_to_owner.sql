-- Scope operational records to the local owner account.
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE RESTRICT;
ALTER TABLE content_ideas ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE RESTRICT;
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS tasks_user_status_idx ON tasks (user_id, status, due_at);
CREATE INDEX IF NOT EXISTS content_ideas_user_created_idx ON content_ideas (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_events_user_occurred_idx ON audit_events (user_id, occurred_at DESC);
