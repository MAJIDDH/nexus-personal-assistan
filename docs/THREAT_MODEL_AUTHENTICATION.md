# NEXUS Authentication Threat Model (Pre-Implementation)

**Status:** Draft for architecture review. This document describes risks and required controls; it does not claim that authentication exists.

## Assets to protect

- Account credentials, sessions, and account-recovery channels.
- Private tasks, memory, business records, content drafts, and audit events.
- Tool permissions, user approvals, and integration credentials.
- Integrity and availability of the PostgreSQL database and scheduled workflows.

## Trust boundaries

1. Browser or Telegram client → public HTTPS/reverse proxy.
2. Reverse proxy → private API service.
3. API → PostgreSQL and background workers.
4. User intent/approval → server-side authorization and tool execution.
5. External messages, imported files, web pages, model output, and connector responses → untrusted input.

The current prototype has no end-user identity layer and must remain loopback-only. Do not enable a public listener, tunnel, or real Telegram webhook as part of this draft.

## Threats and required mitigations

| Threat | Required mitigation and verification |
|---|---|
| Credential guessing or credential stuffing | Slow password hashing; login and recovery rate limits; generic failure responses; tests for throttling and no account enumeration. |
| Session theft or replay | TLS; secure, HTTP-only, SameSite cookies if cookie sessions are chosen; expiry, rotation, logout and server-side revocation; tests for expired/revoked sessions. |
| Cross-account data access (IDOR) | Derive the internal user ID from the verified session; scope every read/write query to that ID; negative tests attempting to read/update another user's records. |
| Telegram account takeover or wrong account linking | One-time, short-lived, single-use linking challenge initiated by an authenticated session and confirmed by verified Telegram user ID; do not trust usernames, display names, or matching emails. Test replay, expiry, wrong-user, and already-linked cases. |
| Forged approval or privilege escalation | Server-issued, single-use approval bound to the authenticated user, exact tool/action/version and relevant parameters; reject caller-created approval objects; audit authorization denials. |
| Prompt injection or malicious imported content | Treat model output and external content as untrusted; enforce tool allowlists and authorization in application code, never in prompt text alone. |
| Secret leakage | Environment/secret store injection; redact credentials from logs; scan repository and build artifacts; rotate any exposed secret. |
| Denial of service | Request/body limits, bounded database pools/timeouts, rate limits, health checks and alerting. |
| Recovery-channel compromise | Verify control of the recovery channel; notify the existing account through an independent channel where feasible; require a deliberate re-link flow after recovery. |
| Audit tampering or false attribution | Record authenticated internal actor IDs and operation source server-side; restrict mutation of audit rows; clearly document that ordinary database audit tables are not tamper-proof against host/database administrators. |

## Account and Telegram linking flow (proposed)

1. User registers or signs in through the first-party account flow.
2. API creates a cryptographically random, short-lived linking challenge tied to that account and stores only a hash of the challenge.
3. User completes the challenge through the official Telegram bot interaction; the server verifies the Telegram platform identity and exact challenge.
4. The API atomically consumes the challenge, links the verified immutable Telegram user ID to the internal account, and rejects reuse or conflicting links.
5. The server records a security audit event and notifies the account through the existing verified channel.
6. Unlinking or relinking requires authenticated confirmation and revokes any Telegram-derived sessions/credentials as applicable.

This is a proposed flow, not implemented behavior. The exact protocol and storage model must be reviewed before coding.

## Release-blocking tests

- Anonymous requests cannot access private API routes.
- User A cannot list, read, update, or delete User B's records by changing IDs or project keys.
- Expired, malformed, rotated, and revoked sessions are rejected.
- Password and linking endpoints are rate-limited and do not reveal whether an account exists.
- Telegram linking rejects unverified identities, expired/replayed challenges, and already-linked conflicting identities.
- Caller-supplied approval metadata never grants permission.
- Production configuration refuses anonymous mode and unsafe public binding.
- Logs and audit events contain no passwords, tokens, raw linking challenges, or database credentials.

## Open decisions before implementation

- First-party session strategy and maintained password-hashing library.
- Whether browser authentication uses server-side sessions and secure cookies.
- CSRF approach if cookies are used.
- Session storage and invalidation behavior across restarts.
- Email verification and account-recovery policy.
- Exact Telegram bot identity and one-time linking protocol.
- Data ownership model and migration plan for existing local synthetic records.

No paid identity provider or external service is authorized by this draft.
