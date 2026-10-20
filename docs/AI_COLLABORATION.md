# AI Collaboration Workflow — NEXUS

**Status:** Operating procedure; no direct ChatGPT–Claude connection is implied or configured by this document.  
**Source of truth:** The current repository on GitHub, especially `PROJECT_MANIFEST.md`, accepted ADRs, product requirements, phase records, and the current code.

## 1. Purpose and limits

NEXUS work may use the user, ChatGPT, and Claude as complementary collaborators. They do not automatically share conversations, private context, tool access, or execution state. Information passes through repository files, commits, pull requests, and explicit handoff notes unless a separately configured integration is implemented and verified.

Never claim the other model has inspected a file, run a test, or performed an action unless the handoff contains verifiable evidence. Treat model-generated conclusions as proposals until checked against repository state, sources, or test output.

## 2. Collaboration roles

### User — authority and approval
- Owns product direction and approves material decisions.
- Explicitly approves financial actions/commitments, important deletion, security/access-control changes, paid commitments, and actions outside pre-approved external-publication rules.
- May approve a bounded task once, with clear scope and safeguards, rather than approving every routine step.

### ChatGPT — planning, synthesis, and review
- Consolidates requirements, discovery, acceptance criteria, architecture proposals, ADRs, and next-step plans.
- Reviews Claude's proposed changes for consistency with governance, requirements, security, cost, and evidence.
- Does not treat its own or Claude's unverified statements as proof of execution.

### Claude — repository implementation and technical investigation
- May inspect the assigned repository scope, propose changes, implement bounded tasks, and run available checks when the user's configured Claude environment permits.
- Must report changed paths, commit/PR references, exact checks run, results, limitations, and any decisions that need approval.
- Must not expand task scope, commit secrets, bypass approval boundaries, or claim unsupported success.

These are default work allocations, not technical guarantees. Either model may help with another role when useful, but the same verification and approval rules apply.

## 3. Repository and task workflow

1. **Read before acting.** Read `PROJECT_MANIFEST.md`, `docs/DEVELOPMENT_WORKFLOW.md`, the relevant requirements/phase document, and applicable ADRs.
2. **Choose one bounded task.** State the goal, non-goals, affected paths, acceptance criteria, risk, and expected cost.
3. **Check current state.** Inspect the current branch and latest file contents before editing. Do not rely on stale pasted copies.
4. **Avoid concurrent edits.** Only one collaborator should edit a given file at a time. If work overlaps, stop and reconcile the latest version before writing.
5. **Propose material decisions first.** For cross-cutting architecture, security, autonomy, paid services, provider lock-in, or hard-to-reverse choices, write an ADR and wait for the required acceptance before implementation.
6. **Implement minimally.** Keep changes focused and preserve unrelated content.
7. **Verify honestly.** Run relevant tests and inspect the diff. If tests cannot run, explain why and mark them unverified.
8. **Review and hand off.** Provide the evidence-based report described below. ChatGPT or the user reviews material changes before merge/adoption.
9. **Update documentation.** Keep requirements, roadmap, phase status, ADRs, and changelog consistent with actual repository state.

For meaningful code changes, prefer a feature branch and pull request when the available workflow supports them. Do not rewrite shared history or force-push without explicit approval. A successful commit is not proof that software works.

## 4. Security, privacy, and external actions

- Never commit API keys, passwords, tokens, cookies, private keys, real `.env` files, customer data, private conversation exports, or production data.
- Do not copy secrets into prompts, issues, PRs, test fixtures, logs, or documentation. Use placeholders and sanitized examples.
- If a credential may have been exposed, stop, report the affected location without reproducing the secret, and recommend revocation/rotation.
- Use public sources and authorized integrations only. Verify access, permissions, terms, security, and cost before depending on an integration.
- Do not publish, send external messages, purchase, pay, delete important data, or alter security/access controls unless the existing authorization policy explicitly permits it. Where explicit confirmation is required, stop and request it.
- Keep least-privilege access, auditable actions, safe failure, and reversible changes as defaults.
- Do not use unverified customer/product facts, prices, discounts, or business metrics in public content.

## 5. Evidence and status language

Use the project's status vocabulary consistently:
- **Proposed:** a suggestion only.
- **Accepted:** an authorized decision.
- **Implemented, unverified:** a change exists but evidence is incomplete.
- **Verified:** the relevant acceptance criteria passed with recorded evidence.
- **Blocked:** a named issue prevents progress.
- **Deferred/Rejected:** postponed or not selected with rationale.

Distinguish observations, interpretations, hypotheses, and missing data. Never fabricate URLs, metrics, commands, test results, permissions, publication status, or deployment status. Scheduling is not publication; publication is not verified until evidence exists.

## 6. Required handoff report

Every implementation or investigation handoff should include:

- **Task and scope:** what was attempted, and what was intentionally excluded.
- **Repository state:** branch, changed paths, commit SHA, PR URL, where applicable.
- **Changes:** concise summary and rationale.
- **Verification:** exact commands/checks actually run and their outcomes.
- **Unverified items:** checks not run, inaccessible systems, missing permissions, and assumptions.
- **Security/privacy/cost impact:** include “none identified” only after review.
- **Decisions needed:** clearly distinguish mandatory approvals from optional recommendations.
- **Next step:** one bounded, actionable continuation.

## 7. Copy-ready task prompt for Claude

> Work in the existing NEXUS GitHub repository. First read `PROJECT_MANIFEST.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/AI_COLLABORATION.md`, the relevant product requirements/phase record, and applicable accepted ADRs.
>
> Task: [one bounded task]
>
> Scope/non-goals: [explicit boundaries]
>
> Acceptance criteria: [observable outcomes]
>
> Constraints: preserve user authority and security/privacy rules; do not commit secrets or private data; do not make paid commitments; do not perform external publication, financial actions, important deletion, or security/access-control changes without the required explicit approval. Do not implement material architectural decisions before their ADR is accepted.
>
> Inspect the latest repository state before editing. Avoid overwriting concurrent work. Make the smallest coherent change. Run available relevant checks, inspect the diff, and report exact evidence. If a check cannot run, mark it unverified. Do not claim success without evidence.
>
> Return the complete handoff report using Section 6. Do not assume ChatGPT has direct access to this Claude session; communicate through repository artifacts and the handoff report.

## 8. Current integration status

This document defines a collaboration process only. It does **not** establish a direct model-to-model connection, grant Claude repository access, configure credentials, or prove that Claude has read these instructions. Those capabilities must be configured in the user's chosen environment and tested separately before being described as active.
