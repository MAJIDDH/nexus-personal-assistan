# NEXUS — Personal Assistant

NEXUS is a personal-assistant project intended to support conversations, approved workflows, scheduled tasks, and specialized agents.

## Current status

**Local prototype in progress; not production-ready.** The repository contains a NestJS API, PostgreSQL-backed task/content-idea endpoints, a React dashboard, and a loopback-only n8n experiment. The dashboard build has CI coverage; the n8n service is not yet connected to the API and still requires local runtime verification. Use synthetic data only.

## Start here

- [Project Constitution](PROJECT_MANIFEST.md) — normative rules and authority boundaries.
- [Architecture](docs/ARCHITECTURE.md) — current direction; proposals remain provisional until accepted.
- [Roadmap](docs/ROADMAP.md) — phases and exit conditions.
- [Security Baseline](docs/SECURITY.md) — security and approval requirements.
- [VPS Deployment Readiness Checklist](docs/VPS_DEPLOYMENT_CHECKLIST.md) — explicit pre-production gates; planning only, not deployment authorization.
- [Development Workflow](docs/DEVELOPMENT_WORKFLOW.md) — implementation, verification, and reporting.
- [AI Collaboration Workflow](docs/AI_COLLABORATION.md) — shared handoffs for ChatGPT and Claude; GitHub is the source of truth, not a direct model-to-model connection.
- [Product Requirements](docs/PRODUCT_REQUIREMENTS.md) — current user needs, confirmed decisions, and open items.
- [Phase 1 Discovery](docs/PHASE_01_DISCOVERY.md) — discovery sequence and provisional defaults.
- [Discovery Options 01](docs/DISCOVERY_OPTIONS_01.md) — preliminary research on Instagram API routes, product-reference formats, and recordkeeping.
- [Discovery Options 02 — Costs](docs/DISCOVERY_OPTIONS_02_COSTS.md) — preliminary hosting, model/voice, Telegram, and Instagram cost baseline.
- [Content Operations Workflow](docs/CONTENT_OPERATIONS_WORKFLOW.md) — proposed evidence, idea lifecycle, approval, and measurement workflow.
- [Claude Phase 1 Handoff](docs/CLAUDE_HANDOFF_PHASE1.md) — bounded task brief to finish discovery review before implementation.
- [Risk Register](docs/RISK_REGISTER.md) — open risks and evidence needed to reduce them.
- [Changelog](CHANGELOG.md) — meaningful milestones and verification notes.
- [Phase 0 Governance](docs/PHASE_00_GOVERNANCE.md) — current governance phase.
- [Architecture Decision Records](docs/adr/README.md) — material decision process and accepted prototype ADRs.
- [NEXUS API prototype](apps/api/README.md) — local setup, routes, tests, and safety limits.
- [Local n8n automation](docs/N8N_LOCAL_AUTOMATION.md) — loopback-only setup, synthetic-data test, security boundaries, and rollback.
- [Local-first ADR 0001](docs/adr/0001-local-first-modular-monolith.md)
- [Private data and memory ADR 0002](docs/adr/0002-private-data-and-memory.md)
- [Model provider and spend controls ADR 0003](docs/adr/0003-model-provider-and-spend-controls.md)
- [Tool permissions and approval gates ADR 0004](docs/adr/0004-agent-tool-permissions-and-approvals.md)

## Principles

- User authority, least privilege, privacy, and safe failure.
- Prefer a simple modular monolith until evidence supports more complexity.
- Keep model providers and external integrations replaceable where useful.
- Require explicit confirmation for sensitive, financial, externally visible, destructive, or hard-to-reverse actions.
- Keep secrets, real environment files, and private user data out of this public repository.
- Distinguish proposals, implementation, and verified outcomes.

Material changes should have clear scope, acceptance criteria, tests, documentation, and rollback or containment guidance. Cross-cutting, costly, security-sensitive, or difficult-to-reverse decisions require an accepted ADR before implementation.
