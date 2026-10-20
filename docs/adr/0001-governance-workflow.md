# ADR-0001: Governance and architecture-decision workflow

- **Status:** Proposed
- **Date:** 2026-10-20
- **Decision owner:** User
- **Related work:** Phase 0 governance foundation
- **Supersedes / superseded by:** None

## Context and problem

NEXUS needs a consistent way to record material technical decisions before implementation. The previous `instagram-ai-platform` project used a constitution, sequential ADRs, explicit statuses, review requirements, and phase gates. NEXUS should preserve those controls without importing Instagram-specific architecture or business assumptions.

## Constraints and decision drivers

- NEXUS is a personal assistant with potentially sensitive memory and real-world action capabilities.
- The GitHub repository is public.
- The user prefers low-cost, incremental, carefully governed development.
- No application implementation is authorized until Phase 0 is explicitly accepted.
- The workflow must distinguish proposed, accepted, implemented, verified, and operational states.

## Options considered

1. **No ADR workflow:** simplest initially, but material decisions become difficult to audit and may be implemented before review.
2. **Adopt the previous project's workflow verbatim:** strong governance, but carries over organization- and product-specific roles and assumptions that do not fit NEXUS.
3. **Adapt a lightweight ADR workflow to NEXUS:** retain sequential records, options, trade-offs, security/privacy, cost, rollback, and explicit acceptance while keeping ownership appropriate to a user-led project.

## Proposed decision

Adopt option 3. Use `PROJECT_MANIFEST.md` as the normative authority, `docs/adr/README.md` for workflow, and `docs/adr/TEMPLATE.md` for new records. Material, costly, security-sensitive, provider-binding, autonomy-affecting, or difficult-to-reverse decisions must be documented before implementation. An ADR remains Proposed until explicitly accepted by the user. This ADR itself remains Proposed pending user review.

## Consequences and trade-offs

- Material decisions become traceable and reviewable.
- Some work takes longer because decisions must be written and accepted first.
- Reversible low-risk implementation details do not require an ADR.
- Organization-specific ownership roles from the previous project are not assumed; NEXUS uses the user as decision owner unless changed through an approved process.

## Security, privacy, and autonomy impact

ADRs must explicitly address permission boundaries, sensitive data, approval gates, prompt-injection exposure, and failure-safe behavior where relevant. An ADR cannot authorize behavior that conflicts with the constitution.

## Cost and operational impact

The process adds documentation overhead but no runtime dependency or infrastructure cost.

## Migration, rollback, and failure handling

The workflow is documentation-only and can be amended through reviewed changes. Accepted decisions are superseded by new linked ADRs rather than silently rewritten.

## Acceptance criteria

- [ ] User reviews and accepts this ADR and the associated governance baseline.
- [ ] Phase 0 exit criteria are satisfied.
- [ ] The first implementation ADR is accepted before the related implementation begins.

## References

- [Project Constitution](../../PROJECT_MANIFEST.md)
- [ADR workflow](README.md)
- [ADR template](TEMPLATE.md)
- [Phase 0 governance](../PHASE_00_GOVERNANCE.md)
