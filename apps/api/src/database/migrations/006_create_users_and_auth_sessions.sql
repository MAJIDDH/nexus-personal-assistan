-- Local email/password identity and revocable opaque sessions.
-- Authentication is not a production-ready multi-tenant boundary until every
-- data endpoint enforces the authenticated user scope.
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  disabled_at timestamptz,
  CONSTRAINT users_email_normalized CHECK (email = lower(btrim(email))),
  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  last_seen_at timestamptz,
  CONSTRAINT auth_sessions_expiry CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS auth_sessions_user_active_idx
  ON auth_sessions(user_id, expires_at)
  WHERE revoked_at IS NULL;
