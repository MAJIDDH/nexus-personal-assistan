# Architecture Decision Records (ADRs)

ADRs record material technical and product-boundary decisions. They refine `PROJECT_MANIFEST.md` but cannot silently override it.

## When an ADR is required

Create an ADR for decisions that are cross-cutting, expensive to reverse, security- or privacy-sensitive, vendor-binding, affect agent autonomy, materially affect operating cost, or change persistence, deployment, public APIs, or trust boundaries.

## Workflow

1. Use the next sequential number: `NNNN-short-title.md`.
2. Start with status `Proposed`; describe context, requirements, options, decision, consequences, security/privacy, operations/cost, and migration or rollback.
3. Link the ADR to the relevant work item and review record when available.
4. Obtain explicit user approval for material choices; obtain additional specialist review where relevant.
5. Mark the final status `Accepted`, `Rejected`, `Superseded`, or `Deprecated`.
6. Implement a material decision only after it is accepted, except for clearly isolated experiments that cannot affect production or user data.
7. Preserve history. A new decision supersedes an earlier ADR by linking it, not silently rewriting the accepted decision.

## Statuses

- **Proposed:** under review; implementation is not authorized.
- **Accepted:** approved and binding within its scope.
- **Rejected:** considered and not selected.
- **Superseded:** replaced by a later decision.
- **Deprecated:** no longer recommended or applicable, retained for history.

## Minimum template

```markdown
# ADR NNNN: Short title

- Status: Proposed
- Date: YYYY-MM-DD
- Decision owner: TBD

## Context and problem
## Requirements and constraints
## Options considered
## Decision
## Consequences and trade-offs
## Security and privacy impact
## Operations and cost impact
## Migration, rollback, and exit strategy
## Verification and follow-up
```

## Current decisions

- [ADR 0001 — Local-first modular monolith](0001-local-first-modular-monolith.md): build and test locally before any server purchase.
- [ADR 0002 — Private data and memory boundaries](0002-private-data-and-memory.md): structured, scoped memory with correction/export/deletion controls.
- [ADR 0003 — Replaceable model provider and spend controls](0003-model-provider-and-spend-controls.md): mock provider first; compare live providers before paid use.
- [ADR 0004 — Agent tool permissions and approval gates](0004-agent-tool-permissions-and-approvals.md): server-side authorization and explicit approval for high-impact actions.
- [ADR 0005 — Concrete local prototype stack](0005-local-prototype-stack.md): Node.js LTS, TypeScript, NestJS, PostgreSQL, and local Docker Compose.
- [ADR 0006 — PostgreSQL access layer](0006-postgres-access-layer.md): accepted `pg` plus parameterized SQL and versioned migrations for the local prototype.
- [ADR 0007 — Local n8n workflow automation](0007-local-n8n-automation.md): accepted n8n as a loopback-only, local automation experiment with synthetic data and no active external workflows.

ADRs 0001–0007 are **Accepted within their documented scopes**. ADR 0007 permits only a local n8n experiment; it does not authorize paid services, server purchase, real-data storage, external integrations, public webhooks, consequential workflows, or production deployment.
