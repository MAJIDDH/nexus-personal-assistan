# Consolidated Documentation and Delivery Status

**Review date:** 2026-10-23  
**Baseline:** `feat/task-priority-hardening` at `2ee53a2aefe0d23755c8b236e27545694bcf66c5`  
**Purpose:** A single operational index for the currently open proposal and hardening PRs. This is a snapshot, not an approval to merge or deploy.

## Executive status

NEXUS remains a **local prototype**, not production-ready. The task API and PostgreSQL persistence exist; authentication and per-user authorization are not implemented. Keep the API bound to `127.0.0.1`, use synthetic data, and do not connect public channels or expose the API remotely until the security gates below are satisfied.

All PRs listed in this review must remain unmerged until explicitly authorized by the user. PRs are Draft proposals; a green CI run is evidence for that commit only and does not imply approval or production readiness.

## Open PR index

| PR | Area | Current documented scope | Dependency / caution |
|---|---|---|---|
| [#16](https://github.com/MAJIDDH/nexus-personal-assistan/pull/16) | Authentication boundary | ADR 0008, threat model, route inventory, implementation plan | Documentation proposal only. User acceptance is required before authentication implementation. |
| [#17](https://github.com/MAJIDDH/nexus-personal-assistan/pull/17) | Production database config | Require explicit PostgreSQL `DATABASE_URL` in production | Draft; validation-only. |
| [#18](https://github.com/MAJIDDH/nexus-personal-assistan/pull/18) | Audit integration test | PostgreSQL trigger audit snapshots for task changes | Does not by itself prove the NestJS service/API path is covered. |
| [#19](https://github.com/MAJIDDH/nexus-personal-assistan/pull/19) | Deployment portability | Local-to-VPS ADR/checklist proposal | Documentation only; no deployment authorization. |
| [#20](https://github.com/MAJIDDH/nexus-personal-assistan/pull/20) | Compose CI | Validate Compose configuration on the active development branch | CI validation is not a deployment test. |
| [#21](https://github.com/MAJIDDH/nexus-personal-assistan/pull/21) | Roadmap | Reconcile roadmap with verified implementation state | Documentation-only; no CI run was returned for its current head in the latest lookup. |
| [#22](https://github.com/MAJIDDH/nexus-personal-assistan/pull/22) | Production database config | Reject the exact local prototype URL in production | Stacked on #17; evaluate the final combined commit graph before considering either change verified together. |
| [#23](https://github.com/MAJIDDH/nexus-personal-assistan/pull/23) | Security/code review | Document task API risks and suggested work | Read-only source review; not a fresh local test run. |
| [#24](https://github.com/MAJIDDH/nexus-personal-assistan/pull/24) | Project allowlist | Remove former business key `bache-mahal` from supported task project options | Preserves historical rows; does not delete/migrate task records. |
| [#25](https://github.com/MAJIDDH/nexus-personal-assistan/pull/25) | Task transition correctness | Conflict, terminal-state, completion timestamp, PostgreSQL concurrency tests | Latest reviewed head had successful API CI and PostgreSQL Integration checks. |

## Evidence and known limits

- PR #17 head `7cb7ddbfc80eef6ae963fe3daa64b5780f7c0485`: API CI and PostgreSQL Integration reported success.
- PR #22 head `2866a2f2c6fc125dfe8da8d36a1a44792be57445`: API CI and PostgreSQL Integration reported success.
- PR #24 head `372bc4a4445efe1f6f2af7563e08abfc46b3791f`: API CI and PostgreSQL Integration reported success.
- PR #25 head `1d320dc1e209c63a60f8d8a47691929597535fe6`: API CI and PostgreSQL Integration reported success.
- These results are commit-specific. Re-run checks if a PR head/base changes.
- PR #25's PostgreSQL test is conditional on `DATABASE_URL`; the CI integration workflow is intended to set up PostgreSQL, apply migrations, and run the API suite. A local run without the variable may skip the integration test.
- PR #18's direct SQL/trigger-oriented tests are not a substitute for service/API-path tests of authorization and status transitions.
- A source review, written plan, CI green check, or mergeability signal is not proof of security readiness.

## Required gates before remote access or deployment

1. Explicitly review and accept or reject ADR 0008 before implementing authentication.
2. Keep the API loopback-only while routes lack authenticated identity and owner scoping.
3. After an approved identity design, enforce owner scope in every list/read/create/update/transition query and related records; never trust a client-supplied owner ID.
4. Add negative tests for anonymous access, cross-owner reads/writes, invalid/revoked sessions, CSRF/Origin protections where applicable, and permission checks for every private route.
5. Confirm session creation, expiry, revocation, secret redaction, rate limits, and account recovery/linking behavior before connecting Telegram or a web client.
6. Verify production configuration rejects missing and prototype database URLs; store real credentials only in environment/secret management, never in source control.
7. Before deployment, verify TLS, network restrictions, backups and restore, monitoring, incident response, safe shutdown, and a tested rollback plan.
8. Obtain explicit user approval for deployment and any external integration. No PR in this index grants that approval.

## Recommended dependency-aware review sequence

This is a review order, not permission to merge:

1. Review narrow correctness changes: #24 and #25.
2. Review the database-configuration pair together: #17 then dependent #22; re-run CI on the final intended head/base graph.
3. Review audit coverage: #18 alongside the service/API-path tests in #25, and document what each test does and does not prove.
4. Review Compose validation #20 and deployment-boundary documentation #19, keeping runtime and deployment claims separate.
5. Review findings #23 and reconcile the roadmap #21 with verified evidence.
6. Review ADR 0008 and its threat model in #16. Do not begin authentication implementation until the user explicitly accepts the design.

## Documentation maintenance rules

- Update this index when PR scope, dependency, head commit, or verification evidence changes.
- Keep `README.md`, `docs/ROADMAP.md`, the security baseline, ADR index, API setup docs, and changelog consistent with the current implementation.
- Label each claim as proposal, implemented, verified, or blocked; include commit-specific evidence for verification.
- Preserve historical task data when retiring a selectable project key unless a separate, approved migration is designed.
- Never claim a feature, test, integration, or deployment is complete solely because its PR exists or is mergeable.
