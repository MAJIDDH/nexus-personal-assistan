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
