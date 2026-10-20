# ADR 0005: Concrete Stack for the Local Prototype

- Status: Accepted
- Date: 2026-10-20
- Decision owner: User

## Context and problem
ADRs 0001–0004 have been accepted for a local-only, synthetic-data prototype. ADR 0001 intentionally left the exact application stack subject to a separate review. A concrete stack is required before creating framework-specific application code.

## Requirements and constraints
- No server purchase, public deployment, paid API activation, or production data.
- Run locally on a developer machine and keep setup reproducible.
- Start with a modular monolith rather than microservices.
- Provide automated tests, safe configuration validation, a health endpoint, and a deterministic mock model provider.
- Keep model and integration adapters replaceable.
- Avoid committing secrets or requiring external credentials for the first test run.

## Options considered
1. TypeScript with NestJS, PostgreSQL, and Docker Compose for local infrastructure.
2. A lighter TypeScript HTTP framework with a file-based local store.
3. Python with FastAPI and PostgreSQL.

## Decision
**Accepted option 1**, staged so the first milestone remains usable without any external service credentials:
- Node.js LTS and TypeScript.
- NestJS modular monolith for the API.
- PostgreSQL as the intended relational store, run locally through Docker Compose when Docker is available.
- Automated unit/e2e tests.
- A deterministic mock model provider and mock/read-only tools only.
- Environment-variable configuration with validation; provide a safe example file containing placeholders only.
- No production migrations, real business data, or live integrations in the first milestone.

If Docker/PostgreSQL is unavailable on the user's development machine, document that blocker rather than claiming the full stack was run. Do not silently substitute a different production database.

## Consequences and trade-offs
- NestJS conventions and TypeScript improve module boundaries and testability, but add more scaffolding than a minimal server.
- PostgreSQL supports later structured memory and business records, but local setup requires a database runtime.
- Docker Compose can improve reproducibility but is not guaranteed to be installed.
- A mock model provider allows tests without keys or spend but does not validate real model quality or latency.

## Security and privacy impact
Use synthetic fixtures only. Keep real credentials out of Git. Deny external actions by default and do not expose private configuration through health or error responses.

## Operations and cost impact
No paid provider, hosting, domain, or server commitment is authorized. Local tooling may require installation; no install has been verified on the user's machine.

## Migration, rollback, and exit strategy
Keep database access behind a module boundary and migrations versioned. Revisit the stack only through a superseding ADR if actual environment constraints or measured needs justify it.

## Verification and follow-up
After acceptance, create a small scaffold with config validation, health endpoint, default-deny policy, mock provider, and tests. Report files created separately from tests actually executed. Run tests only in an available environment and record exact results.

## Acceptance record

Accepted by the user in ChatGPT on 2026-10-20 for the bounded local prototype: Node.js LTS, TypeScript, NestJS, PostgreSQL, and Docker Compose; synthetic data only; no server, paid API, real data, or external connections.

