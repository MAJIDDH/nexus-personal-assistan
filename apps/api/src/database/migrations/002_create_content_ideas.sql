-- Synthetic/local content planning records only; this does not publish externally.
CREATE TABLE IF NOT EXISTS content_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(trim(title)) BETWEEN 1 AND 160),
  concept text NOT NULL CHECK (char_length(trim(concept)) BETWEEN 1 AND 5000),
  objective text NOT NULL DEFAULT 'grow_followers'
    CHECK (objective IN ('grow_followers', 'increase_sales', 'increase_engagement', 'educate')),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_review', 'approved', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_ideas_status_created_at_idx
  ON content_ideas (status, created_at DESC);
