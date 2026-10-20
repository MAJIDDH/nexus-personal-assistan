# NEXUS Roadmap

This roadmap records intended work, not completed capabilities. Items remain unchecked until acceptance criteria and evidence are reviewed. The roadmap is subordinate to `PROJECT_MANIFEST.md`; material choices require accepted ADRs.

## Phase 0 — Governance foundation

- [x] Create the initial README.
- [x] Create initial architecture, roadmap, and security documents.
- [x] Establish the project constitution and authority boundaries.
- [x] Establish ADR and development-workflow guidance.
- [x] Record Phase 0 scope and exit criteria.
- [ ] Review cross-document consistency, links, and public-repository safety.
- [ ] Resolve governance-related open questions and confirm the baseline with the user.
- [ ] Close Phase 0 only after review evidence and explicit user acceptance.

**Exit gate:** no application code, framework scaffolding, dependency installation, or infrastructure work until Phase 0 is reviewed and accepted.

## Phase 1 — Product discovery and technical decisions

- [ ] Confirm initial use cases, non-goals, channels, and priorities.
- [ ] Define identity, authentication, authorization, approval, and audit requirements.
- [ ] Define memory categories, provenance, retention, correction, export, and deletion behavior.
- [ ] Establish cost, privacy, availability, backup, and recovery expectations.
- [ ] Compare candidate runtimes, frameworks, database, job scheduling, model providers, and deployment options.
- [ ] Record accepted ADRs for material architecture and provider choices.
- [ ] Define a thin vertical-slice milestone with explicit acceptance tests.

## Phase 2 — Minimal application foundation

Start only after Phase 1 decisions are accepted.

- [ ] Create the application foundation using the accepted stack.
- [ ] Add reproducible local development and configuration validation.
- [ ] Add health/readiness checks, safe structured logging, and correlation IDs.
- [ ] Add persistence and migrations only after the data model is reviewed.
- [ ] Add CI for formatting, linting, type-checking, tests, and secret scanning where feasible.
- [ ] Verify setup from a clean checkout and document actual results.

## Phase 3 — Secure assistant core

- [ ] Implement the approved identity and access model.
- [ ] Define task, conversation, tool, approval, and audit contracts.
- [ ] Add model-provider adapters with timeouts and usage/cost tracking.
- [ ] Implement a bounded tool registry with independently enforced permissions.
- [ ] Add deterministic approval gates for sensitive or irreversible actions.
- [ ] Test authorization, refusal, timeout, duplicate execution, and failure cases.

## Phase 4 — First interaction channel

- [ ] Select and approve the first channel through requirements and an ADR if material.
- [ ] Implement secure identity binding and restrict access to explicitly authorized users.
- [ ] Support text conversations and truthful task-status reporting.
- [ ] Verify retries, duplicate inbound events, and error reporting.

## Phase 5 — Scheduling and memory

- [ ] Add durable background tasks, schedules, cancellation, and bounded retries.
- [ ] Add user-visible task history and actual execution outcomes.
- [ ] Add scoped memory with provenance, correction, export, and deletion workflows.
- [ ] Test timezone handling, duplicate-task prevention, and restart recovery.

## Phase 6 — Business workflows and administration

- [ ] Define and approve business-specific workflows before implementation.
- [ ] Add private administration and access controls only for agreed needs.
- [ ] Generate drafts and proposals; require confirmation before public publishing or consequential external actions.
- [ ] Add analytics integrations only after access, privacy, data limitations, and provider terms are documented.

## Phase 7 — Voice and reliable deployment

- [ ] Evaluate speech input/output behind replaceable adapters.
- [ ] Define activation, consent, recording, retention, and privacy behavior before hands-free features.
- [ ] Deploy only after secrets management, TLS, access restrictions, backups, monitoring, and recovery procedures are ready.
- [ ] Test restore, resource limits, incident response, and safe shutdown.

## Release rule

A phase is not complete because code compiles, a commit exists, or a checklist was written. Require accepted scope, passing relevant checks, documented verification evidence, updated documentation, and explicit recording of unresolved limitations.
