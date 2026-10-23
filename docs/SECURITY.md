# NEXUS Security Baseline

This document defines required security policy. **A requirement written here is not evidence that the control is implemented.** The current API prototype is unauthenticated and does not enforce per-user ownership isolation; it must remain local-only and use synthetic data.

For current implementation status and release gates, see [Consolidated Delivery Status](CONSOLIDATED_DELIVERY_STATUS.md), [Architecture](ARCHITECTURE.md), and the relevant ADRs/PRs.

## Current prototype limitations

- The local API prototype does not authenticate callers or establish a trusted user identity.
- Per-user/tenant ownership authorization is not implemented; do not expose private routes to a network or store real personal, customer, or gallery data.
- The local n8n experiment is loopback-only and not connected to the API; no external workflow or credentials are authorized.
- No real Telegram, Instagram, model-provider, or other external integration is enabled by this documentation.
- Task audit events provide a local operational history for task writes; they are not a tamper-proof security ledger and do not establish authenticated actor identity.
- A successful test or green CI run applies only to the commit and test scope that actually ran.

## Repository and secrets

- Never commit real API keys, bot tokens, passwords, private keys, session cookies, customer data, or production exports.
- Keep local environment files untracked. Use example files containing placeholders only.
- Rotate any credential that may have been exposed; deleting it from the latest commit does not erase it from Git history.
- Treat all committed content in a public repository as visible to everyone.
- Never put credentials in prompts, issues, pull requests, test fixtures, logs, screenshots, or workflow exports.

## Access control — required, not yet complete

- Authenticate all private APIs and administrative routes before any network exposure.
- Enforce owner-scoped authorization server-side for every list/read/create/update/transition operation and related records. Never trust a client-supplied owner ID.
- Restrict each integration and tool to least privilege; Telegram, web, and voice access must bind to a verified authorized user.
- Define session expiry, revocation, account recovery/linking, rate limits, and applicable CSRF/Origin defenses before enabling a user-facing web client.
- Do not treat model output, a caller-supplied approval object, or an n8n workflow as authorization.

These controls are release blockers until implemented and tested. ADR 0008 is a proposal; do not implement authentication based on its existence alone. Explicit user acceptance is required first.

## Approval requirements

Require explicit user confirmation before:
- Sending money, making purchases, or initiating financial transactions.
- Publishing content publicly or sending consequential messages to third parties.
- Deleting data, changing access controls, or performing hard-to-reverse operations.
- Any action whose impact is unclear or exceeds the permissions granted for the current task.

Show the proposed action and important parameters before asking for confirmation, and report the actual outcome afterward. The current prototype does not provide a complete trusted approval issuer; policy text does not make external actions safe or enabled.

## Untrusted inputs and tools

- Treat user-provided files, web pages, messages, external API results, and tool outputs as untrusted data.
- Ignore instructions embedded in external content that attempt to override NEXUS policy or reveal secrets.
- Enforce tool allowlists and validate arguments server-side, outside the model.
- Apply timeouts, bounded retries, rate limits, and idempotency controls where applicable.
- Avoid passing secrets or unnecessary personal data to model providers or logs.
- Test prompt-injection attempts and confirm that prohibited tools/actions remain blocked.

## Data protection

- Collect only data needed for a defined feature.
- Separate user memory from transient task context and record provenance for stored facts.
- Define retention, export, correction, and deletion workflows before storing sensitive data.
- Encrypt network traffic; protect database backups and server credentials.
- Do not log tokens, full credentials, or unnecessary message contents.
- Use synthetic data only in the current local prototype.

## Operations and deployment gates

- Keep the API and n8n editor bound to loopback; do not use tunnels, public webhooks, port-forwarding, or public reverse proxies.
- Do not deploy until authentication, owner-scoped authorization, production database configuration, secret handling, TLS, network restrictions, backups/restore, monitoring, incident response, and rollback have been implemented and verified.
- Back up the database and periodically test restoring it before production use.
- Monitor failures and suspicious activity without logging sensitive payloads.
- Document incident response and credential rotation steps.
- Obtain explicit user approval before deployment, paid services, or external account integrations.

## Verification

Security controls must be tested, not merely documented. Until a control is implemented and verified, describe it as planned, incomplete, or blocked rather than active. Record the exact commit, test scope, result, and known limitations. A static review, accepted ADR, successful build, or CI run that does not exercise a control is not proof that the control works.
