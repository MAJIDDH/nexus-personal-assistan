# ADR 0008: Authentication and API Access Boundary

- Status: Proposed
- Date: 2026-10-23
- Decision owner: User

## Context and problem

The current API is a local-only prototype bound to `127.0.0.1`. It has no end-user authentication or account ownership model. This is acceptable only for the documented local synthetic-data scope; it is not ready for public hosting, multi-user access, or trusted Telegram/web clients.

The product requirements call for one user account accessible through both Telegram and email/password, with account recovery through the configured channels. Authentication must be designed before exposing private APIs or connecting external clients.

## Requirements and constraints

- Keep the current loopback-only binding until an authenticated deployment design is accepted and implemented.
- Never treat a Telegram username, display name, model output, or caller-supplied approval object as proof of identity or permission.
- Bind every private record and query to an authenticated internal user ID before multi-user data is introduced.
- Keep passwords out of logs and store only an appropriately slow password hash using a maintained password-hashing library.
- Use short-lived access credentials and revocable sessions; store browser credentials in secure, HTTP-only cookies if a browser-session design is selected.
- Link Telegram to an existing account only through a verified, one-time linking flow. Do not merge accounts based only on a matching email or username.
- Apply rate limits to login, password recovery, and Telegram linking; avoid responses that reveal whether an account exists.
- Keep secrets in environment configuration, never source control. No paid identity provider or external service is authorized by this proposal.
- Authentication does not replace per-action authorization, approval gates, auditability, or CSRF protections where cookie-based browser sessions are used.

## Options considered

1. **Keep local-only access temporarily.** Lowest risk for the current prototype, but does not enable remote web or Telegram clients.
2. **Implement a small first-party identity/session layer.** More implementation and security-review effort; preserves control and avoids a mandatory paid provider.
3. **Adopt a hosted identity provider.** Could reduce some maintenance burden, but adds a vendor, external data processing, network dependency, and possible cost/payment constraints.

## Proposed direction

Keep option 1 active now and evaluate option 2 for a later, explicitly approved implementation. Do not implement authentication, expose the API publicly, or connect Telegram as part of this proposed ADR alone.

Before implementation, specify and test:
- account and session schema, password hashing, login and logout;
- secure session/token rotation, expiry, revocation, and recovery;
- verified Telegram account linking and prevention of account takeover;
- authorization guards and per-user data scoping for every private endpoint;
- login/linking rate limits, safe error responses, and security event logging;
- browser CSRF/session protections if cookies are used;
- migration and rollback, including the no-auth local development mode boundary.

## Consequences and trade-offs

- The prototype remains usable locally without a new login flow.
- Remote access and real Telegram integration remain blocked until implementation and review are complete.
- The proposal deliberately avoids prematurely selecting a token format, session store, or dependency before a threat model and tests are reviewed.
- See [Authentication Threat Model (Pre-Implementation)](../THREAT_MODEL_AUTHENTICATION.md) for threats, proposed Telegram linking flow, release-blocking tests, and unresolved decisions.

## Security and privacy impact

The largest current risk is mistaking a local prototype for a remotely safe service. The API must remain bound to loopback and must not be exposed through public tunnels or webhooks. Tests should prove unauthenticated requests are denied once private access is enabled, users cannot access another user's records, sessions can be revoked, and Telegram linking requires verified possession.

## Operations and cost impact

No additional service or recurring cost is proposed. Prefer local tests and maintained open-source dependencies; any paid provider requires separate explicit approval.

## Migration, rollback, and exit strategy

Implement behind a dedicated branch and feature boundary after approval. Preserve local-only development as an explicit mode that cannot be selected accidentally in production. If identity checks or account linking fail closed, deny access; do not fall back to anonymous access in a remotely reachable environment.

## Verification and follow-up

- [ ] Review and accept or reject this ADR.
- [x] Draft a threat model and account-linking flow in [THREAT_MODEL_AUTHENTICATION.md](../THREAT_MODEL_AUTHENTICATION.md); review and acceptance are still pending.
- [ ] Select session/token handling and password-hashing implementation after dependency review.
- [ ] Add negative tests for unauthenticated access, cross-user access, invalid/expired/revoked sessions, and unverified Telegram linking.
- [ ] Verify production configuration refuses unsafe anonymous mode and non-loopback binding before any remote deployment.
