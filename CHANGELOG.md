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
- Implemented `GET /api/content-ideas` and `POST /api/content-ideas`. Creation validates input, defaults to draft, and rejects unsupported fields/objectives. This API only stores drafts; it does not publish to Instagram or contact anyone.
- Added an API CI workflow for build, unit tests, and end-to-end tests.
- Fixed the migration filename matcher so numbered SQL migrations are discovered.
- Expanded end-to-end tests for liveness/readiness and content-idea create/list input behavior.
- Updated setup, API, and governance documentation to match implementation.

## Verification status

- GitHub Actions run #8 completed successfully for the earlier scaffold commit: API build and unit tests passed.
- Content-idea persistence, the latest end-to-end tests, and the updated CI workflow have not yet been confirmed by a successful run against the latest commit.
- A real PostgreSQL migration run remains unverified.
- Work remains on `feat/local-prototype-foundation`; PR #1 is open, draft, and unmerged.
- No production database, real gallery/customer data, paid API, public server, or external integration was added.
