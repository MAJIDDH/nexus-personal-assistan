# Task API Review Findings

**Review date:** 2026-10-23  
**Scope:** Read-only review of `apps/api/src/tasks/tasks.controller.ts`, `apps/api/src/tasks/tasks.service.ts`, and `apps/api/src/config/env.validation.ts` on `feat/task-priority-hardening`.  
**Limitations:** This is a source review, not a fresh local test run. Findings must be rechecked against the implementation branch before changes are made.

## Findings

### 1. Critical release blocker: task routes have no identity or owner scope

The task controller exposes list, create, update, and status-transition routes without an authentication guard. Service queries select or mutate rows by project/status or task UUID, not by authenticated owner.

**Impact:** If the API were reachable by an untrusted client, that client could list or alter task records. UUIDs do not replace authorization.

**Required action:** Keep API bound to loopback only. After ADR 0008 is explicitly accepted, derive identity from the verified session and owner-scope every task query and relationship. Add anonymous-denial and cross-user tests for list/create/update/transition before any remote access.

### 2. Stale project allowlist includes the sold business

`TASK_PROJECTS` includes `bache-mahal`, despite the product context identifying Galeri Tala Yousefi as the user's only current business.

**Impact:** The API still permits new tasks to be categorized under a former business, which can mislead the user and downstream reports.

**Recommended action:** Remove `bache-mahal` from the *new-task* project allowlist after checking whether existing synthetic/local rows use it. Preserve historical rows if any exist; do not perform a destructive migration merely to clean up the selectable list. Add a validation test that rejects the retired project key for new task creation and updates.

### 3. Environment validation currently accepts the prototype database URL

The active base branch's `env.validation.ts` defaults `DATABASE_URL` to the local prototype URL and does not itself require an explicit production URL or reject that exact prototype URL when `NODE_ENV=production`.

**Impact:** Production misconfiguration could point at the local prototype database or fail in a confusing way. Proposed PRs #17 and #22 address this, but neither is part of the base branch.

**Required action:** Review PR #17 and dependent PR #22 together. Confirm fresh CI after the final base/head arrangement before considering the guard verified. Do not merge automatically.

### 4. Task status transition uses a two-step read/update

`transition()` reads the current status, checks the transition map in application code, then updates with `WHERE id = $1 AND status = $3`. The conditional update protects against a simple lost update and returns a conflict-style error when the row changed concurrently.

**Assessment:** The optimistic concurrency check is useful. However, the read and update are separate database statements, and status-transition audit behavior should be tested against the actual API/service path, not only direct SQL or database-trigger snapshots. PR #18's scope should be checked against that requirement.

**Recommended tests:** Concurrent competing transitions; invalid terminal-state transitions; completed_at set on completion and cleared when reopened/cancelled; audit snapshot matches the accepted final transition; no state mutation on rejected transitions.

## Suggested next implementation slice

1. Keep this API local-only while authentication is absent.
2. Address the stale project key in a narrowly scoped Draft PR, preserving existing records.
3. Reconcile PRs #17 and #22 and verify CI on the final commit graph.
4. Strengthen task transition integration tests through the service/API path.
5. Begin auth/owner-scoping code only after explicit ADR 0008 acceptance.

## Non-actions

This review does not authorize merging any PR, implementing authentication, changing production configuration, deploying a VPS, enabling public access, or connecting external services.
