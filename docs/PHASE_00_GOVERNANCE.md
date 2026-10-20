# Phase 0 — Governance Foundation

## Objective

Establish the project constitution, decision process, development workflow, security baseline, and evidence-based status reporting before application implementation.

## Scope

Included: governance documentation, repository hygiene, phase/decision rules, and a reviewed list of open product and technical questions.

Excluded: application code, dependency installation, framework scaffolding, infrastructure, credentials, and external provider integrations.

## Deliverables

- `PROJECT_MANIFEST.md` as the normative constitution.
- `docs/adr/README.md` as the decision workflow.
- `docs/DEVELOPMENT_WORKFLOW.md` as the work-item and verification process.
- `docs/SECURITY.md` aligned with the public-repository and least-privilege rules.
- Updated README and roadmap reflecting the true project status.

## Exit criteria

- Documents agree with one another and all internal links resolve.
- Product requirements, technology choices, and implementation status are clearly distinguished.
- No real secrets, credentials, or private user data are introduced.
- Open questions are recorded rather than silently assumed.
- The user reviews and accepts the governance baseline.
- No application code or dependencies are added during this phase.

## Risks

- Governance can become excessive; keep requirements proportional and revise them through the documented decision process.
- Existing drafts may accidentally imply a technology choice or capability is already approved.
- Public repository contents may expose secrets if changes are not checked.

## Rollback

Documentation changes can be reverted through a focused commit after checking dependent links and decisions. Do not delete decision history to make a rollback appear as though the decision never existed.

## Evidence and status

Status: **In progress — user review required**.

Evidence required for closure: document/link review, sensitive-content review, and explicit user acceptance. This file does not itself declare Phase 0 complete.


## Review evidence (2026-10-20)

- Retrieved the governance documents from the GitHub default branch and confirmed the expected files exist.
- Checked relative Markdown links across the current governance document set; no missing local targets were found.
- Inspected the tracked repository tree: it currently contains governance documentation and `.gitignore`, with no application source or committed real environment files.
- Added [ADR-0001](adr/0001-governance-workflow.md) as **Proposed** to record the adapted governance process. It is not accepted yet.
- The uploaded previous-project archive contains `.env.development` and `.env.production` files with populated configuration values. Their values were not reproduced here. This is an archive-handling observation, not evidence of a leak in the current NEXUS repository.

## Remaining before Phase 0 exit

- User review and explicit acceptance of the constitution, security/approval baseline, and Proposed ADR-0001.
- Resolve any governance open questions that affect the Phase 1 scope.
- Record the user's acceptance and close the phase only after the exit criteria are satisfied.
