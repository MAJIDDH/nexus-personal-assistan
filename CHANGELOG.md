# NEXUS Changelog

This changelog records meaningful project milestones and verification evidence. It does not replace the project constitution, ADRs, or phase records. Verification claims are tied to specific commits; a historical green run does not verify later changes.

## Unreleased — Documentation reconciliation

- Added a consolidated delivery-status index and reconciled the roadmap with the local prototype and open draft pull requests.
- Clarified that the architecture is partly implemented and partly a target design; Telegram, web/voice channels, authentication, scheduling, notifications, Instagram integration, and deployment are not established as working features.
- Corrected the API documentation's selectable project keys to exclude the retired `bache-mahal` key. This does not claim that historical database rows were deleted.
- Tightened API verification wording so older green CI runs are not presented as evidence for newer changes.
- Documentation changes are under review in PR #26. Do not treat the PR as adopted until it is reviewed and merged.

## Unreleased — Discovery and AI collaboration

- Accepted ADR 0007 for a local-only n8n automation experiment; added a pinned n8n 2.44.5 Compose service bound to loopback with a separate persistent volume and telemetry/personalization/templates disabled.
- Added local setup, synthetic-data smoke-test, security-boundary, and rollback documentation. n8n is not connected to the NEXUS API; no workflows or external credentials are configured. Runtime verification remains pending on the user's machine.
- Added the NEXUS project constitution and authority hierarchy.
- Added persistent collaboration guidance for ChatGPT/Claude handoffs, verification, and repository security.
- Added product requirements, Phase 1 discovery, risk register, development workflow, and content-operations workflow.
- Added research notes comparing Instagram API routes, product-reference formats, local recordkeeping, and preliminary hosting/model/voice/Telegram costs.
- Recorded user acceptance of ADRs 0001–0006 within the local, synthetic-data prototype scope only.
- No server purchase, paid API use, real business data, external integration, or production deployment is authorized.

## 2026-10-20 — Local API and content-idea prototype (feature branch)

- Added a NestJS API with validated environment configuration, liveness and PostgreSQL-readiness endpoints.
- Added a bounded PostgreSQL pool, parameterized query boundary, and ordered SQL migration runner.
- Added local PostgreSQL Compose configuration and a migration for a content-idea table with constrained objectives and draft/review/approved/archived states.
- Implemented content-idea list/create/edit and explicit draft-to-review submission, with validation and guarded transitions.
- Added a task engine with PostgreSQL persistence, validated CRUD/status APIs, project filters, importance/urgency fields, due-date-aware priority scoring, and terminal completed/cancelled states.
- Added PostgreSQL-triggered audit events for task creation and updates, capturing before/after snapshots transactionally, plus a bounded read-only audit-history endpoint.
- Extended disposable PostgreSQL integration checks to verify task audit events and structured feedback persistence; later changes require their own fresh CI evidence.
- Added API end-to-end and unit coverage for task creation, filtering, invalid fields, and explicit status transitions. Task reminders and external notifications are not enabled.
- Added an API CI workflow for build, unit tests, and end-to-end tests.
- Fixed the migration filename matcher so numbered SQL migrations are discovered.
- Expanded end-to-end tests for liveness/readiness and content-idea create/list input behavior.
- Updated setup, API, and governance documentation to match implementation.

## Historical verification note

Commit `5e59f6689672385f5cab9323b2cedc3c325f20a2` passed API CI and disposable PostgreSQL integration checks at the time recorded. Subsequent changes must be assessed using their own commit-specific workflow results. PostgreSQL integration uses a disposable database and synthetic records only.

No production database, real gallery/customer data, paid API, public server, or external integration was authorized by the local prototype work.
