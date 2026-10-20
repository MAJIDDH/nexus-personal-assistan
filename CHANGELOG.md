# NEXUS Changelog

This changelog records meaningful project milestones and verification evidence. It does not replace the project constitution, ADRs, or phase records.

## Unreleased — Discovery and AI collaboration

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
- Extended disposable PostgreSQL integration checks to verify the fourth migration and task audit trigger; current head CI is running.
- Added API end-to-end and unit coverage for task creation, filtering, invalid fields, and explicit status transitions. Task reminders and external notifications are not enabled.
- Added an API CI workflow for build, unit tests, and end-to-end tests.
- Fixed the migration filename matcher so numbered SQL migrations are discovered.
- Expanded end-to-end tests for liveness/readiness and content-idea create/list input behavior.
- Updated setup, API, and governance documentation to match implementation.

## Verification status

- Latest known review-workflow CI runs #53 (API CI) and #21 (disposable PostgreSQL integration) passed before task-engine commits; the task-engine head must be verified by fresh CI before claiming it passes.
- PostgreSQL integration uses a disposable database and synthetic records only.
- Work remains on `feat/local-prototype-foundation`; PR #1 is open, draft, and unmerged.
- No production database, real gallery/customer data, paid API, public server, or external integration was added.
