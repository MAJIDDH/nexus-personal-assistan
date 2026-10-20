# Development Workflow

This document operationalizes `PROJECT_MANIFEST.md`; it does not override it.

## Work-item lifecycle

1. **Discover:** state the user need, known facts, unknowns, constraints, and sources.
2. **Propose:** define scope, exclusions, acceptance criteria, dependencies, risk, and rollback.
3. **Decide:** write an ADR when the choice is cross-cutting, costly, security-sensitive, vendor-binding, or difficult to reverse. Wait for acceptance before implementation.
4. **Implement:** make the smallest coherent change within the approved scope.
5. **Verify:** run the relevant tests and inspect the diff. Include negative, failure, and permission-boundary cases where applicable.
6. **Document:** update architecture, roadmap, operations, and changelog when affected.
7. **Report:** state what changed, evidence obtained, what remains unverified, known risks, and the next decision/action.

## Required change record

Each work item should identify:
- Goal and non-goals
- Acceptance criteria
- Affected modules/data/interfaces
- Security, privacy, autonomy, and cost impact
- Test plan and actual results
- Failure handling and rollback
- Documentation to update
- Open questions and owner

## Verification rules

- Do not infer successful execution from generated code, a successful commit, or a static review.
- Report exact commands and outcomes when available; never invent test results.
- Review the diff for unrelated changes, secrets, accidental data, and undocumented behavior.
- If a check cannot run, state the blocker and classify the result as unverified.
- Keep acceptance criteria unchecked until evidence supports checking them.
- Do not mark a phase complete until its exit criteria and review evidence are satisfied.

## Git and repository hygiene

- Prefer small, logically focused commits with clear imperative messages.
- Do not rewrite shared history or force-push without explicit approval.
- Never commit real `.env` files, credentials, customer records, production exports, or private logs.
- Keep sanitized examples and document required environment variables without real values.
- For material changes, use a pull request or equivalent review record even when the project is maintained by one person.

## Status vocabulary

- **Proposed:** suggested, not approved.
- **Accepted:** approved decision or scope.
- **In progress:** implementation has started.
- **Implemented, unverified:** code exists but verification evidence is incomplete.
- **Verified:** acceptance criteria and relevant checks passed.
- **Blocked:** a named dependency or decision prevents progress.
- **Deferred:** intentionally postponed with rationale.
- **Rejected:** explicitly not selected.

## Progress report template

- Current phase/status
- Work completed (with file/commit references)
- Tests/checks actually run and results
- Decisions made and pending
- Risks/blockers
- Next bounded step

A report must distinguish repository state from plans and must not claim access, deployment, external actions, or test results that were not directly verified.
