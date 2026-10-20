# NEXUS Roadmap

This roadmap describes intended work. Items are not complete until implemented and verified.

## Phase 0 — Repository and engineering baseline

- [x] Initialize repository README.
- [ ] Add architecture, roadmap, security, and ignore-file documentation.
- [ ] Choose package manager and pin runtime/tool versions.
- [ ] Add formatting, linting, type-checking, and test commands.
- [ ] Add a safe example environment file with placeholders only.
- [ ] Add CI for lint, type-check, and tests.

## Phase 1 — Minimal application foundation

- [ ] Create the TypeScript/NestJS application.
- [ ] Add Docker Compose for the application and PostgreSQL.
- [ ] Add configuration validation and health/readiness endpoints.
- [ ] Add database migrations and a minimal persistence layer.
- [ ] Add structured logging and request/task correlation IDs.
- [ ] Document local setup and verify it from a clean checkout.

## Phase 2 — Secure personal assistant core

- [ ] Implement authentication and a single-owner deployment mode.
- [ ] Define task, conversation, tool, approval, and audit data models.
- [ ] Add model-provider adapters with timeouts and usage/cost tracking.
- [ ] Implement a bounded tool registry with explicit permissions.
- [ ] Add approval gates for sensitive or irreversible actions.
- [ ] Add unit and integration tests for policy enforcement.

## Phase 3 — Telegram channel

- [ ] Add Telegram bot adapter and secure webhook/polling configuration.
- [ ] Restrict access to explicitly authorized Telegram user IDs.
- [ ] Support text conversations and task status messages.
- [ ] Verify retries, duplicate updates, and error reporting.

## Phase 4 — Scheduling and memory

- [ ] Add durable background jobs, recurring schedules, retries, and cancellation.
- [ ] Add user-visible task history and execution status.
- [ ] Add scoped memory with provenance, correction, and deletion workflows.
- [ ] Test timezone handling and duplicate-job prevention.

## Phase 5 — Business workflows and administration

- [ ] Add a private admin panel and role/access controls.
- [ ] Add a workspace for Galeri Tala Yousefi workflows.
- [ ] Add content planning and draft generation with human approval before publishing.
- [ ] Add analytics integrations only after access, privacy, and data limitations are documented.

## Phase 6 — Voice and always-on deployment

- [ ] Add speech input/output behind replaceable adapters.
- [ ] Add an explicit hands-free activation and privacy model before always-listening features.
- [ ] Deploy to a secured VPS with TLS, backups, monitoring, and restart policies.
- [ ] Test restore procedures, resource limits, and incident recovery.

## Release rule

Do not mark a phase complete based on intention or a successful build alone. Require tests and a documented end-to-end verification. Prioritize a small reliable core over broad, unverified autonomy.
