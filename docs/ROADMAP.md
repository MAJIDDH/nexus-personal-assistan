# NEXUS Roadmap

This roadmap records intended work and verified project state, not aspirations presented as completed capabilities. It is subordinate to `PROJECT_MANIFEST.md`; cross-cutting or costly-to-reverse choices require accepted ADRs. A pull request is not part of the base branch until merged, and a green CI run proves only the checks that actually ran.

## Verified status — 2026-10-23

NEXUS has progressed beyond the original governance-only stage. The active development branch `feat/task-priority-hardening` contains a local-first NestJS/TypeScript API, PostgreSQL persistence and migrations, task/content-idea/audit/feedback workflows, health/readiness endpoints, tool-policy checks, and API CI workflows. Local setup and earlier tests were reported by the developer; this roadmap does not claim a fresh local test run.

The following work is still proposed in open, Draft, unmerged pull requests:

- [PR #16 — Authentication and API access boundary](https://github.com/MAJIDDH/nexus-personal-assistan/pull/16): threat model and proposed account/session/Telegram-linking design. Documentation only; no authentication implementation.
- [PR #17 — Require explicit database URL in production](https://github.com/MAJIDDH/nexus-personal-assistan/pull/17): production database URL validation. API CI and PostgreSQL integration checks passed for the PR head, but this guard is not in the base branch.
- [PR #18 — Verify task update and status audit snapshots](https://github.com/MAJIDDH/nexus-personal-assistan/pull/18): PostgreSQL integration assertions passed for the PR head; tests are not yet part of the base branch.
- [PR #19 — Local-to-VPS deployment portability](https://github.com/MAJIDDH/nexus-personal-assistan/pull/19): proposed deployment portability ADR and checklist. Documentation only; no deployment has occurred.
- [PR #20 — Compose validation on the active branch](https://github.com/MAJIDDH/nexus-personal-assistan/pull/20): Compose Configuration checks passed for its PR head; workflow changes are not yet in the base branch.

All of these PRs must remain Draft until reviewed. No PR may be merged without the user's explicit permission. No VPS, public listener, real Telegram integration, paid service, or production data use is authorized by this roadmap.

## Phase 0 — Governance foundation — Complete (2026-10-20)

- [x] Establish the project constitution, authority boundaries, ADR process, and development workflow.
- [x] Record initial architecture, roadmap, security documents, and Phase 0 exit criteria.
- [x] Obtain explicit user acceptance of the governance baseline and ADR-0001.

**Historical exit evidence:** governance documents and internal links were reviewed and the user accepted the baseline on 2026-10-20. The earlier statement that the repository contained no application code was true only at that historical stage and is not a description of the current repository.

## Phase 1 — Product discovery and architecture — In progress

- [x] Record initial product priorities and the first operational focus: Instagram content operations for Galeri Tala Yousefi.
- [x] Accept ADR 0005 for the local prototype stack: Node.js/TypeScript, NestJS, PostgreSQL, and Docker Compose.
- [x] Accept ADR 0006 for PostgreSQL access via `pg`, parameterized SQL, and versioned migrations.
- [x] Accept ADR 0007 for a local-only n8n experiment.
- [ ] Review and accept or reject ADR 0008 for authentication/API access boundaries (currently proposed in PR #16).
- [ ] Review and accept or reject ADR 0009 for local-to-VPS portability (currently proposed in PR #19).
- [ ] Finalize the account, recovery, session, authorization, approval, audit-attribution, and memory-lifecycle requirements before implementing remote access.
- [ ] Define a thin end-to-end milestone with acceptance tests and verified evidence.

## Phase 2 — Local application foundation — Implemented in part

- [x] Establish the API application, database migrations, task and content-idea persistence, audit events, feedback workflow, and readiness checks on the active branch.
- [x] Add API CI and disposable-PostgreSQL integration workflows.
- [x] Keep the API and local supporting services loopback-only in the local prototype.
- [ ] Land and verify production configuration validation before considering production configuration usable (PR #17 is not merged).
- [ ] Reconcile the base-branch test suite with the additional audit snapshot coverage proposed in PR #18.
- [ ] Ensure Compose configuration checks reliably run on the active development branch (workflow change proposed in PR #20).
- [ ] Verify a clean checkout setup and a fresh full test run; record exact commands and outcomes rather than inferring them from prior runs.

## Phase 3 — Secure assistant core — Blocked on reviewed security design

- [ ] Accept the authentication/access ADR before implementing account identity or remote API access.
- [ ] Implement login, logout, recovery, session expiry/revocation, and per-user authorization with negative tests.
- [ ] Verify that every private record query is scoped to the authenticated internal user.
- [ ] Bind approvals to the exact action and parameters; reject caller-supplied approval claims.
- [ ] Record trustworthy server-side actor/source attribution and document audit limitations.
- [ ] Add rate limits, safe error behavior, secret redaction, and security regression tests.
- [ ] Keep public listeners, tunnels, and real Telegram webhooks disabled until these controls are reviewed and verified.

## Phase 4 — First interaction channel

- [ ] Implement the approved web account experience after the identity design is accepted.
- [ ] Implement Telegram identity linking only after the one-time challenge protocol and authorization tests are accepted.
- [ ] Support text conversations and truthful task-status reporting.
- [ ] Test retries, duplicate inbound events, failure handling, and account unlinking.

## Phase 5 — Scheduling and memory

- [ ] Add durable jobs, schedules, cancellation, and bounded retries.
- [ ] Add user-visible task history and actual execution outcomes.
- [ ] Add scoped memory with provenance, correction, review, export, and deletion workflows.
- [ ] Verify timezone handling, duplicate-task prevention, quiet hours, and restart recovery.

## Phase 6 — Gallery workflow and content operations

- [ ] Build the research-to-idea-to-draft workflow using public/authorized sources only.
- [ ] Clearly separate verified observations, interpretation, and hypotheses; do not invent metrics or links.
- [ ] Create content scripts, captions, and calendar drafts for user review.
- [ ] Keep prices, discounts, sensitive claims, and consequential publishing behind the explicit approval policy.
- [ ] Evaluate official Instagram publishing and analytics access only after permissions, privacy, platform terms, and cost are assessed.
- [ ] Do not describe any content as published unless the publication was actually performed and verified.

## Phase 7 — Voice and reliable VPS deployment

- [ ] Evaluate speech input/output through replaceable adapters, with explicit privacy and recording rules.
- [ ] Accept the deployment portability ADR before implementing a production deployment path.
- [ ] Complete authentication, TLS/reverse proxy, secrets management, network isolation, backups, restore drills, monitoring, resource limits, and rollback documentation.
- [ ] Verify migrations, persistent data, health behavior, scheduled jobs, restart recovery, and restore in a staging environment.
- [ ] Obtain explicit user approval before purchasing hosting, opening public access, connecting real accounts, or going live.

## Release rule

A phase is not complete because a document exists, a commit was created, or a workflow passed. Require accepted scope, passing relevant checks on the intended commit, documented verification evidence, updated documentation, and explicit recording of unresolved limitations. Keep all changes in Draft PRs and do not merge without the user's explicit permission.
