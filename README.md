# NEXUS — Personal Assistant

NEXUS is a personal-assistant project intended to support conversations, approved workflows, scheduled tasks, and specialized agents.

## Current status

**Phase 0 — Governance foundation; user review required.** This repository currently contains planning and governance documents. Do not assume application capabilities are implemented. Features are complete only after implementation and recorded verification evidence.

## Start here

- [Project Constitution](PROJECT_MANIFEST.md) — normative rules and authority boundaries.
- [Architecture](docs/ARCHITECTURE.md) — current direction; proposals remain provisional until accepted.
- [Roadmap](docs/ROADMAP.md) — phases and exit conditions.
- [Security Baseline](docs/SECURITY.md) — security and approval requirements.
- [Development Workflow](docs/DEVELOPMENT_WORKFLOW.md) — implementation, verification, and reporting.
- [Risk Register](docs/RISK_REGISTER.md) — open risks and evidence needed to reduce them.
- [Changelog](CHANGELOG.md) — meaningful milestones and verification notes.
- [Phase 0 Governance](docs/PHASE_00_GOVERNANCE.md) — current governance phase.
- [Architecture Decision Records](docs/adr/README.md) — material decision process.

## Principles

- User authority, least privilege, privacy, and safe failure.
- Prefer a simple modular monolith until evidence supports more complexity.
- Keep model providers and external integrations replaceable where useful.
- Require explicit confirmation for sensitive, financial, externally visible, destructive, or hard-to-reverse actions.
- Keep secrets, real environment files, and private user data out of this public repository.
- Distinguish proposals, implementation, and verified outcomes.

Material changes should have clear scope, acceptance criteria, tests, documentation, and rollback or containment guidance. Cross-cutting, costly, security-sensitive, or difficult-to-reverse decisions require an accepted ADR before implementation.
