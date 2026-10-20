# ADR 0004: Agent Tool Permissions and Approval Gates

- Status: Proposed
- Date: 2026-10-20
- Decision owner: User

## Context and problem
NEXUS may coordinate tools and agents, but model-generated text cannot authorize a consequential external action. Policy must be enforced in application code.

## Requirements and constraints
- Default deny for unlisted tools and actions.
- Server-side authorization independent of model prompts.
- Explicit approval for purchases, financial transactions, public publishing, important deletion, security/access changes, and consequential external messages unless a narrowly scoped pre-approved rule applies.
- Record audit events without secrets or unnecessary personal data.
- Support cancellation, revocation, timeouts, bounded retries, and safe handling of uncertain outcomes.

## Options considered
1. Rely on model instructions to decide whether an action is allowed.
2. Enforce an allowlist and policy checks in application services; require approval tokens bound to the exact action parameters and content version.
3. Disable all external tools permanently.

## Decision
Proposed: option 2. Use server-side policy checks and explicit capability scopes. Approval must bind to the exact proposed action/version; material changes invalidate approval. Start with read-only/mock tools and no real external side effects.

## Consequences and trade-offs
- Requires policy code, audit records, and negative tests.
- Adds a confirmation step for high-impact actions but reduces unauthorized execution risk.
- Read-only/mock tools allow early testing without external credentials.

## Security and privacy impact
Treat external content as untrusted. Validate arguments server-side. Do not let model output change permissions. Keep tool credentials scoped and revocable.

## Operations and cost impact
Minimal direct cost; some implementation and test effort. External API usage remains separately gated by provider and cost approval.

## Migration, rollback, and exit strategy
Tools can be disabled through a global kill switch and per-tool permission flags. If policy behavior is uncertain, deny the action and report the blocker.

## Verification and follow-up
Tests must cover unauthorized calls, stale approval, changed action parameters after approval, duplicate retries, provider timeouts, cancellation, and audit record integrity.

## Approval required
User approval is required before implementing external-action permissions or enabling any real side-effecting integration.