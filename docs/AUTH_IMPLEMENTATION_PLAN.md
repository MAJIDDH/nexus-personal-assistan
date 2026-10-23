# Authentication Implementation Plan

**Status:** Proposed plan only. No authentication code is implemented by this document.
**Prerequisite:** The decision owner must explicitly accept ADR 0008 before implementation begins.
**Exposure rule:** Keep API and n8n loopback-only. This plan does not authorize a public tunnel, VPS deployment, real Telegram webhook, or paid provider.

## 1. Scope for the first implementation

Build a single-owner-capable first-party account/session layer for the current local prototype, designed so a later second account cannot see the first account's data. Do not build multi-user employee administration, OAuth, public registration, email delivery, Telegram webhooks, or a hosted identity integration in this phase.

Initial account creation should be an explicit local setup/bootstrap operation, not an open public registration endpoint. Bootstrap must be one-time, fail closed if an account already exists, avoid printing secrets, and require deliberate local operator action.

## 2. Proposed defaults to confirm with ADR 0008

- Passwords: maintained Argon2id implementation with documented parameters; never plaintext, reversible encryption, or custom hashing.
- Browser session: cryptographically random opaque token in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie for HTTPS deployments. Persist only a cryptographic hash of the token server-side.
- Session lifecycle: rotate at login and privilege changes; explicit logout/revocation; bounded expiry; reject expired/revoked sessions.
- CSRF: synchronizer token or equivalent robust CSRF defense for cookie-authenticated state-changing requests, plus Origin checks. Configure strict CORS only if cross-origin use is actually required.
- Identity: derive internal `user_id` only from the validated session. Never accept user identity from body, query, headers, project keys, or model output.
- Data access: add ownership and scope every read, update, transition, and feedback relationship. Use indistinguishable not-found/forbidden responses where practical to reduce record enumeration.
- Rate limits: login, bootstrap, recovery, and future Telegram linking. Keep account existence private.
- Audit: record security events without passwords, raw session tokens, recovery tokens, or other secrets.
- Telegram: explicitly out of scope until web/account identity and route-level ownership tests pass. Later linking must use a short-lived, single-use challenge and verified immutable Telegram user ID, not username/display name.
- Deployment: production startup fails closed when required session/auth configuration is missing; no anonymous fallback.

## 3. Implementation sequence

1. Add migrations for account and session records with unique constraints, expiry/revocation fields, and indexes.
2. Implement password hashing and constant-shape login failures; add brute-force throttling.
3. Implement opaque sessions, hashed token storage, cookie flags, rotation, expiry, logout, and revocation.
4. Add authentication guard and a single trusted request identity source.
5. Add owner identity to task, content idea, feedback, and audit data; migrate existing synthetic local rows using an explicit, reversible local-only strategy.
6. Scope every service query and relationship check to the authenticated owner. Never rely only on UUID unpredictability.
7. Add CSRF protection and strict Origin validation for cookie-based writes.
8. Add route-by-route anonymous, invalid-session, expired-session, revoked-session, same-owner, and cross-owner tests.
9. Add production environment validation tests and secret-redaction checks.
10. Update route inventory and threat model from actual code; run unit, e2e, and PostgreSQL integration CI.
11. Review results and rollback plan before considering any non-loopback deployment. Exposure remains a separate explicit decision.

## 4. Release-blocking acceptance criteria

- Every private route in `PRIVATE_API_ROUTE_INVENTORY.md` denies anonymous access.
- Every private data read and write is owner-scoped, including task status changes, idea review transitions, feedback linked by task ID, and audit filters.
- A request body containing `user_id`, `owner_id`, or other unapproved fields is rejected; the server never uses client-supplied ownership.
- Tests prove User A cannot list, fetch, update, transition, or create feedback for User B's records.
- Invalid, expired, and revoked sessions fail; logout invalidates the session.
- Passwords and tokens never appear in application logs or audit payloads.
- CSRF/Origin protections are tested for cookie-authenticated mutations.
- Production configuration without required auth/session secrets fails startup; local development remains explicitly loopback-only.
- A clean checkout passes unit, e2e, and PostgreSQL integration tests.
- No real Telegram/webhook, external tunnel, public bind, paid provider, or VPS is enabled by this plan.

## 5. Rollback and local compatibility

- Preserve the current loopback-only synthetic-data workflow while implementation is under review.
- Keep schema changes in numbered migrations and document rollback limitations for destructive changes.
- Do not silently treat existing rows as belonging to an authenticated user. Any local data assignment must be explicit, local-only, tested, and documented.
- If auth/session initialization fails, fail closed; do not bypass guards to make the UI appear functional.

## 6. Decision required

The user must explicitly accept or reject ADR 0008 and this proposed implementation direction. Until that decision, this document is planning only; do not start authentication code, merge the PR, or expose services externally.
