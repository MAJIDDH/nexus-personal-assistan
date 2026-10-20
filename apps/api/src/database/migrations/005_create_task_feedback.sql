-- Structured, user-provided feedback for operational review; this does not train a model.
CREATE TABLE IF NOT EXISTS task_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,
  rating text NOT NULL CHECK (rating IN ('useful', 'not_useful', 'needs_adjustment')),
  note text NOT NULL DEFAULT '' CHECK (char_length(note) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS task_feedback_task_created_idx ON task_feedback (task_id, created_at DESC);
CREATE INDEX IF NOT EXISTS task_feedback_rating_created_idx ON task_feedback (rating, created_at DESC);
