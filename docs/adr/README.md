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
