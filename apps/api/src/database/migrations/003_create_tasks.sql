-- Local task management only; no reminders or external actions are executed.
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(trim(title)) BETWEEN 1 AND 200),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 5000),
  project_key text NOT NULL DEFAULT 'personal'
    CHECK (project_key IN ('personal', 'nexus', 'golddyousefi', 'bache-mahal')),
  importance smallint NOT NULL DEFAULT 3 CHECK (importance BETWEEN 1 AND 5),
  urgency smallint NOT NULL DEFAULT 3 CHECK (urgency BETWEEN 1 AND 5),
  due_at timestamptz,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS tasks_status_due_at_idx ON tasks (status, due_at ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS tasks_project_status_idx ON tasks (project_key, status);
