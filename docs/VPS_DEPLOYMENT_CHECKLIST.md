# VPS Deployment Readiness Checklist

**Status: planning only. NEXUS is not approved for production deployment.** This checklist is a release gate, not a set of instructions to expose the current prototype to the internet.

## A. Before selecting a VPS

- [ ] Confirm the expected user count, storage, availability, and recovery objectives.
- [ ] Compare provider cost, payment feasibility, region, support, and backup pricing; obtain explicit approval before purchase.
- [ ] Choose a supported Linux distribution and record its patching/support window.
- [ ] Decide whether PostgreSQL stays on the same private host/network or uses a managed database. Do not expose PostgreSQL publicly.
- [ ] Define who holds provider credentials and how emergency access and recovery will work.

## B. Application portability

- [ ] Clean checkout builds without files or secrets from the development PC.
- [ ] All environment-specific values are configurable; production startup fails if required values are missing.
- [ ] Local-only defaults and placeholder credentials cannot silently be reused in production.
- [ ] API binding is explicit per environment: loopback for local development; private/internal binding behind a reverse proxy in production.
- [ ] Container image versions are pinned and reviewed; images are updated through a tested change.
- [ ] Compose configuration validates in CI for the branches that change deployment files.
- [ ] No production deployment relies on manual edits inside a running container.

## C. Identity and network

- [ ] HTTPS certificate and reverse-proxy configuration are tested.
- [ ] Only intended web entry points are public; database, n8n editor, metrics, and administration interfaces remain private or are protected by strong authentication and network restrictions.
- [ ] Authentication, session expiry/revocation, password recovery, and per-user authorization are implemented and tested.
- [ ] Telegram account linking proves control of the intended Telegram identity; user IDs are allowlisted where appropriate.
- [ ] Rate limits, request size limits, secure headers, and abuse handling are configured.
- [ ] No open webhook or external integration can trigger consequential actions without server-side authorization.

## D. Database and recovery

- [ ] Production credentials are unique, strong, injected through a secret mechanism, and absent from Git and logs.
- [ ] Migration history is applied to staging from an empty database and from the last supported schema.
- [ ] Destructive schema changes have a reviewed backup and rollback/recovery plan.
- [ ] Automated backups are encrypted, access-restricted, and stored independently from the main host.
- [ ] A restore drill to a clean database has succeeded and its result is recorded.
- [ ] Retention, deletion, export, and correction behavior is documented for user data.
- [ ] Audit events accurately identify authenticated actors and operation sources; limits of the audit trail are documented.

## E. Reliability and operations

- [ ] Liveness and readiness endpoints have distinct meanings; readiness checks required dependencies.
- [ ] Restart policies, graceful shutdown, process health, database connection limits, and timeouts are verified.
- [ ] Logs are collected centrally or durably, use consistent timestamps, and exclude secrets and unnecessary sensitive content.
- [ ] Monitoring and alerting cover service unavailability, database capacity, disk space, backup failures, and repeated authentication failures.
- [ ] Host updates, firewall policy, SSH access, and emergency credential rotation are documented.
- [ ] n8n encryption key, credentials, workflows, persistent storage, timezone, and public webhook policy are configured deliberately before any real workflow is enabled.
- [ ] Scheduled tasks continue when the developer's computer is off and behave correctly across restarts and daylight/timezone changes.

## F. Release, rollback, and go-live

- [ ] Staging uses the same deployment shape as production but only synthetic or sanitized data.
- [ ] End-to-end smoke tests, negative authorization tests, and backup restore are successful.
- [ ] A deployment runbook, rollback steps, responsible owner, and incident contact are documented.
- [ ] No payment, publishing, deletion, customer messaging, or other consequential tool is enabled before its approval and audit path is verified.
- [ ] Explicit go-live approval is obtained after the release evidence is reviewed.

## Current known blockers

- The API has no production-ready authentication or per-user data isolation yet.
- The local API currently binds to `127.0.0.1`; production binding/reverse-proxy behavior is not implemented.
- Audit rows currently use server-defined local actor/source values and are not a tamper-proof security ledger.
- The current Compose file is a local development configuration with disposable credentials and loopback-published PostgreSQL/n8n ports. It is not a production deployment file.
- Production backup/restore, monitoring, secrets management, and deployment/rollback procedures have not yet been verified.

Do not check a box based on documentation alone. Record the test evidence or configuration review that satisfies each item.
