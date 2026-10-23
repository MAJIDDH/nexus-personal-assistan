# NEXUS Roadmap

**Last reconciled:** 2026-10-23  
This roadmap describes repository state and intended work separately. A PR, green CI run, written checklist, or mergeable branch does not by itself mean a feature is accepted or production-ready. This document is subordinate to `PROJECT_MANIFEST.md`; material decisions require accepted ADRs.

## Current phase — Local prototype hardening

The project has progressed beyond documentation-only governance. The repository includes a NestJS API, PostgreSQL schema/migrations, task and content-idea endpoints, a React dashboard, and a loopback-only n8n experiment. Some hardening changes are proposed in open Draft PRs and therefore are **not part of the baseline branch unless explicitly stated**.

### Existing prototype capabilities (verify against the active branch before release)
- API health/readiness endpoint and PostgreSQL persistence/migrations.
- Task create/list/update/status-transition service and audit-event persistence.
- Content-idea endpoint/schema groundwork.
- React dashboard source and CI build coverage.
- Local n8n experiment; it is not yet connected to the API and needs local runtime verification.
- GitHub Actions workflows for API and PostgreSQL integration checks.

Use synthetic data only. No real business records, external account connections, or production secrets should be introduced during this phase.

## Open hardening/documentation work

See [Consolidated Delivery Status](CONSOLIDATED_DELIVERY_STATUS.md) for the PR index, commit-specific CI evidence, and dependencies.

- [ ] Review PR #24: retire the former-business project key from selectable task projects while preserving historical records.
- [ ] Review PR #25: task-transition conflict, terminal-state, completion timestamp, and PostgreSQL concurrency coverage.
- [ ] Review PR #17 and dependent PR #22 together: explicit production database URL validation and rejection of the local prototype URL.
- [ ] Review PR #18: create/update/status audit snapshots from the PostgreSQL integration workflow; this does not replace service/API-path authorization tests.
- [ ] Review PR #20: Compose configuration workflow branch coverage.
- [ ] Review PR #19: local-to-VPS portability checklist and proposed ADR 0009.
- [ ] Review PR #23: task API security/correctness findings.
- [ ] Review PR #21: ensure roadmap statements match current code and evidence.
- [ ] Review PR #16: proposed authentication boundary and threat model; do not implement authentication before explicit user acceptance of ADR 0008.
- [ ] Review PR #26: consolidated documentation index and this roadmap reconciliation.

No PR is authorized to merge merely by being listed here. User approval is required before any merge.

## Release blockers — must remain blocked

- [ ] Authentication and verified server-side identity.
- [ ] Per-user ownership checks on every private read/write/transition and related record.
- [ ] Negative tests for anonymous access and cross-user data access.
- [ ] Session lifecycle, revocation, recovery, CSRF/Origin defenses where applicable, rate limiting, and safe secret redaction.
- [ ] Production-safe database configuration and secret injection verified on the final release commit graph.
- [ ] Production TLS/reverse proxy and private network policy.
- [ ] Tested backups and restore, monitoring, incident response, and rollback.
- [ ] Verified n8n runtime/security behavior and any approved external workflow.
- [ ] Explicit user approval for deployment and each external account integration.

The API must remain bound to `127.0.0.1` while authentication and owner-scoping are absent. Do not expose it to the internet or connect real accounts. ADR 0008 and ADR 0009 are proposals; their existence does not authorize implementation or deployment.

## Next phases

### Phase 1 — Product and security decisions
- [ ] Confirm initial use cases, non-goals, channels, and priorities.
- [ ] Finalize identity, authentication, authorization, approval, and audit requirements.
- [ ] Define memory provenance, retention, correction, export, and deletion behavior.
- [ ] Establish cost, privacy, availability, backup, and recovery expectations.
- [ ] Accept/reject material ADRs before implementing the decisions they govern.

### Phase 2 — Secure assistant core
- [ ] Implement the approved identity and access model after ADR 0008 is accepted.
- [ ] Enforce server-derived identity and owner-scoped persistence operations.
- [ ] Define task, conversation, tool, approval, and audit contracts.
- [ ] Add bounded tool permissions, timeouts, usage/cost controls, idempotency, and failure handling.
- [ ] Test authorization boundaries, refusal, timeout, duplicate execution, concurrency, and recovery.

### Phase 3 — First interaction channel
- [ ] Select and approve the first channel.
- [ ] Implement secure identity binding and restrict access to authorized users.
- [ ] Support text conversations and truthful task-status reporting.
- [ ] Verify retries, duplicate inbound events, and error reporting before enabling real integrations.

### Phase 4 — Scheduling and memory
- [ ] Add durable background tasks, schedules, cancellation, and bounded retries.
- [ ] Add user-visible task history and actual execution outcomes.
- [ ] Add scoped memory with provenance, correction, export, and deletion workflows.
- [ ] Test timezone handling, duplicate-task prevention, and restart recovery.

### Phase 5 — Approved business workflows
- [ ] Define and approve business-specific workflows before implementation.
- [ ] Generate content drafts and proposals with evidence and approval state.
- [ ] Require confirmation before public publishing, sensitive price/discount claims, financial actions, or consequential external actions.
- [ ] Add analytics integrations only after access, privacy, data limitations, and provider terms are documented.

### Phase 6 — Voice and reliable deployment
- [ ] Evaluate speech input/output behind replaceable adapters.
- [ ] Define activation, consent, recording, retention, and privacy before hands-free features.
- [ ] Deploy only after all release blockers are verified and explicit go-live approval is recorded.
- [ ] Test restore, resource limits, incident response, and safe shutdown.

## Release rule

A phase is complete only when acceptance criteria, relevant tests, documentation, security/privacy review, operational implications, and unresolved limitations are recorded. Never infer completion from code generation, a commit, a successful CI run for a different commit, or a checklist alone.
