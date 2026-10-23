# ADR 0009: Local Development and VPS Deployment Portability

- **Status:** Proposed
- **Date:** 2026-10-23

## Context

NEXUS is currently being designed and tested as a local-first prototype on Windows with Node.js, NestJS, PostgreSQL, Docker Compose, and local n8n workflows. The intended production deployment is a continuously available VPS. Local development is a stage of the same product, not a separate architecture that may be discarded.

We must avoid a migration that depends on a developer's machine, local-only paths, localhost assumptions, manually created database state, or secrets embedded in source files. At the same time, local services must not become internet-accessible just to imitate production.

## Decision proposed

Treat local development and VPS production as two configurations of one portable application.

### 1. Configuration and network boundaries

- Keep application configuration in environment variables, validated at startup; commit only a documented `.env.example` containing placeholders and safe local defaults.
- Never commit real passwords, tokens, session secrets, private keys, or production connection strings.
- Preserve loopback-only binding for the local prototype. Before VPS deployment, make the API bind address configurable (for example, `HOST`), with an explicit production configuration; do not expose the API directly to the public internet by default.
- In production, publish web traffic through a TLS-terminating reverse proxy. Keep PostgreSQL private to the Docker network or host firewall; do not publish its port publicly.
- Avoid embedding `localhost`, machine-specific drive paths, or environment-specific URLs in application logic. A URL that is intentionally loopback-only in local development must be configured explicitly for the deployment environment.

### 2. Containers and persistence

- Keep Docker Compose as the reproducible local path and make the production Compose/deployment configuration explicit rather than relying on a developer's current containers.
- Pin service major versions and use a reviewed upgrade process; do not rely on floating `latest` tags for production.
- Persist PostgreSQL data in a named volume or managed storage and define a tested backup/restore procedure before real user data is stored.
- Apply versioned SQL migrations consistently in local, CI, and production deployment. Production startup must not silently create or reset databases, erase data, or run destructive migrations without an explicit reviewed release step.
- Keep application containers replaceable: durable state belongs in PostgreSQL or explicitly configured persistent storage, not in the container filesystem.

### 3. Runtime and health

- Keep API process startup deterministic and driven by validated configuration.
- Distinguish liveness from readiness: liveness indicates the process is running; readiness checks required dependencies such as PostgreSQL.
- Configure graceful shutdown and bounded database connection pools/timeouts before production.
- Keep logs on stdout/stderr for container collection, avoid secrets and sensitive payloads in logs, and use UTC timestamps or explicit timezone-aware values internally. User-facing schedules such as NEXUS quiet hours remain explicitly configured for Asia/Tehran.
- Background jobs and n8n schedules must be documented as separate runtime responsibilities. A schedule must not depend on a personal computer being awake after production migration.

### 4. Security and access

- The local prototype remains local-only and uses synthetic/test data.
- Production is not approved until authentication, per-user authorization/data isolation, secret management, rate limiting where appropriate, audit actor/source attribution, backups, and HTTPS are implemented and reviewed.
- Never trust caller-supplied approval metadata as proof of consent. Sensitive actions require server-verified approval bound to the exact action and version.
- Do not enable production tool execution or external account integrations merely because the application is hosted on a VPS.

### 5. Portability checks required before deployment

Before the first production release, verify all of the following in a staging environment configured like the target VPS:

1. A clean checkout can build and start without files from a developer's machine.
2. Configuration validation fails safely when required production settings are missing.
3. Database migrations work from an empty database and from the previous supported schema version.
4. Restart/recreate of application containers preserves durable data.
5. A backup can be restored to a clean database and verified.
6. Readiness becomes unhealthy when a required dependency is unavailable and recovers when it returns.
7. Public traffic reaches the app only through HTTPS/reverse proxy; PostgreSQL and internal services are not publicly exposed.
8. Logs and audit events do not expose secrets, and authenticated actor/source attribution is accurate.
9. Scheduled jobs run on the server's timezone configuration and do not depend on a local workstation.
10. Deployment and rollback steps are documented and rehearsed before real business data is introduced.

## Consequences

- Local development remains simple and private while using the same application code and migration history as production.
- A VPS deployment becomes a configuration and operations change, not a rewrite.
- Some production requirements—especially authentication, backups, TLS, secret handling, and monitoring—must be completed before go-live; this ADR does not claim they already exist.
- This decision does not authorize deployment, opening public ports, connecting real accounts, or incurring paid hosting costs.

## Related decisions

- ADR 0005: Local prototype stack
- ADR 0006: PostgreSQL access layer
- ADR 0007: Local n8n automation
- ADR 0008: Authentication and API access boundary (proposed)
