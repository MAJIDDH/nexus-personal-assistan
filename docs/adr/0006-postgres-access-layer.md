# ADR 0006: PostgreSQL Access Layer for the Local Prototype

- Status: Accepted
- Date: 2026-10-20
- Decision owner: User

## Context and problem

ADR 0005 accepts PostgreSQL as the intended local relational database, but it does not choose how application code will access it. The API currently validates a database URL but does not connect to PostgreSQL. A persistence approach affects migrations, type safety, testing, dependency weight, and long-term maintainability, so implementation must wait for an explicit decision.

## Requirements and constraints

- Local prototype only; synthetic fixtures only.
- No external database, server, paid service, or real gallery/customer records.
- Keep PostgreSQL access behind a persistence module boundary.
- Make schema changes versioned and reproducible.
- Keep unit tests runnable without requiring a live database; database integration tests may be separately gated on local PostgreSQL.
- Avoid unnecessary abstraction and preserve a credible exit path from the selected library.

## Options considered

### Option A — pg (node-postgres) plus versioned SQL migrations

Use the PostgreSQL driver directly, with parameterized SQL and a small migration runner or tracked SQL migration scripts.

**Advantages**
- Small conceptual surface and direct control over SQL.
- No ORM-generated query layer.
- Straightforward to inspect database behavior and optimize queries.
- Low dependency and lock-in footprint.

**Trade-offs**
- Query result typing and mapping require discipline.
- The team owns more repository/query conventions and must consistently use parameterized queries.
- Migration execution and rollback conventions need to be defined explicitly.

### Option B — Prisma

Use a schema-first ORM with generated TypeScript client and migration tooling.

**Advantages**
- Strong developer ergonomics and typed query API.
- Schema and migration workflow are explicit.
- Can speed up routine CRUD development and onboarding.

**Trade-offs**
- Adds code generation and another schema representation to maintain.
- More framework-specific behavior and migration conventions to learn.
- Generated-client/runtime compatibility must be verified in the actual Node environment.

### Option C — TypeORM with NestJS integration

Use entities, repositories, and NestJS integration.

**Advantages**
- Familiar NestJS dependency-injection integration and repository patterns.
- Entity-based data access and migration support.

**Trade-offs**
- Adds ORM conventions and decorators.
- Entity modeling and runtime behavior need careful testing.
- May introduce more abstraction than this small prototype currently needs.

## Decision

**Accepted option A: pg with parameterized SQL and versioned SQL migrations**, provided the initial domain schema remains small. This minimizes framework lock-in and keeps SQL and database behavior explicit. If CRUD complexity or schema volume grows enough to justify code generation, revisit Prisma through a superseding ADR rather than adding it preemptively.

Acceptance record: the user explicitly approved Option A in ChatGPT on 2026-10-20. Scope remains local prototype with synthetic data only.

## Consequences and trade-offs

- Repositories/data-access modules will own SQL; controllers and domain services should not issue raw SQL directly.
- All values in SQL statements must be parameterized. Never build SQL by interpolating untrusted input.
- Migrations must be ordered, reviewable, and tested against a disposable local database.
- Unit tests should use fakes or mocks where appropriate; integration tests must use a clearly disposable local database and synthetic fixtures.
- Connection pooling, startup failure behavior, shutdown cleanup, and migration execution need explicit implementation and tests.

## Security and privacy impact

- Do not log database URLs, passwords, query parameters containing sensitive values, or full customer records.
- Do not seed real gallery or customer data.
- Keep database port binding local-only in Compose.
- Use parameterized queries and least-privilege database credentials.
- Do not run destructive migrations against any non-test database.

## Operations and cost impact

- pg is an open-source package and introduces no paid-service requirement.
- Local PostgreSQL remains optional for unit tests but is required for database integration tests.
- No server or hosting decision is included.

## Migration, rollback, and exit strategy

- Store schema changes as numbered SQL migrations.
- Use additive changes where possible and document rollback or restore requirements for destructive changes.
- Keep the data-access interface small so a future ORM or alternative driver can be introduced behind it.
- Use only disposable local data while the prototype is in this phase.

## Verification and follow-up

If accepted, implement a minimal connection provider, a persistence module, one small synthetic example table only if needed by a defined feature, and tests for configuration, query parameterization, connection failure, and migration behavior. Run build and test commands in an available Node environment; do not claim success before observing actual results.
