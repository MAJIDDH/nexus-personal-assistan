# ADR 0008: Local authentication boundary

- Status: Accepted for local prototype only
- Date: 2026-10-23
- Decision owner: User
- Approval: User explicitly approved implementation in ChatGPT conversation on 2026-10-23.

## Context and problem

The current API has no user identity or authenticated sessions. Before adding user-specific interfaces or private memory, NEXUS needs a small, auditable authentication foundation.

## Decision

Implement a local email/password authentication foundation using PostgreSQL, Node's built-in cryptography, opaque random session tokens, and server-side token hashes. Store only normalized email and password hashes; never store plaintext passwords or session tokens. Session cookies must be HttpOnly, SameSite=Strict, path-scoped, and Secure in production. Session expiry and revocation are server-enforced. Authentication remains loopback-only for the local prototype.

This acceptance authorizes the local implementation only. It does not authorize public deployment, adding paid services, connecting Telegram, or claiming that existing business/task data is isolated by user.

## Required security properties

- Passwords are derived with a unique random salt and a deliberately expensive password KDF.
- Login failures do not disclose whether an email exists.
- Session secrets are cryptographically random; only hashes are persisted.
- Expired, revoked, or disabled-user sessions are rejected.
- Logout revokes the server-side session and clears the cookie.
- Authentication endpoints have bounded input validation and basic abuse controls.
- No credentials or tokens appear in logs or API responses.
- The API continues to bind to 127.0.0.1 by default.

## Important limitation

Adding authentication endpoints alone does not protect existing API resources. Before any multi-user or remote use, every private endpoint must enforce user ownership, data migrations must assign explicit owners or isolate legacy data, and negative authorization tests must prove cross-user access is denied. Until then, this remains a local single-user authentication foundation, not a complete access-control boundary.

## Verification and follow-up

- Unit tests for password derivation/verification, invalid login, expiry, revocation, and cookie behavior.
- Integration tests for migration, registration uniqueness, login/logout, and session lookup.
- Follow-up work: owner-scoped data access, rate limiting, CSRF analysis for browser clients, account recovery, and deployment hardening.
