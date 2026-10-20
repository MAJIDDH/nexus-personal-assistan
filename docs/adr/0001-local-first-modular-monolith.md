# ADR 0001: Local-First Modular Monolith Baseline

- Status: Accepted
- Date: 2026-10-20
- Decision owner: User

## Context and problem
NEXUS has no current server. The public repository contains governance and discovery documents but no application scaffold. We need a low-cost path to implement and test without committing to paid hosting or exposing private data.

## Requirements and constraints
- Keep initial deployment and operations simple.
- No server purchase or public deployment before explicit approval.
- Use synthetic data during development.
- Preserve replaceability of external providers and integrations.
- Do not claim a component is implemented until verified.

## Options considered
1. Build and test locally first, then decide hosting after resource and access needs are measured.
2. Buy a VPS immediately and develop directly on it.
3. Use a managed application/database platform from the start.

## Decision
Proposed: use option 1. Build a modular monolith and run it locally first. Keep deployment container-friendly, but do not provision infrastructure yet. The initial technical direction may use TypeScript/NestJS, PostgreSQL, and Docker Compose, subject to review of the current environment and accepted stack decision.

## Consequences and trade-offs
- Avoids immediate recurring cost and makes development reversible.
- Delays remote access, scheduled jobs, and always-on bot availability until hosting is approved.
- Local tests cannot prove production networking, backup restoration, or provider availability.

## Security and privacy impact
Use synthetic data only; keep credentials out of Git. Any local environment files must be ignored by Git and contain no production data.

## Operations and cost impact
No hosting spend is authorized by this proposal. Local development has no new server fee but still depends on the user's computer and internet.

## Migration, rollback, and exit strategy
Because this is local-first, no data migration is needed. Keep Docker and configuration documented so deployment can later target a chosen provider.

## Verification and follow-up
Before implementation, verify the repository tree and local tooling assumptions. Before production deployment, create and accept a separate hosting/backup ADR and test restore procedures.

## Acceptance record

Accepted by the user in ChatGPT on 2026-10-20, within the bounded scope of a local prototype using synthetic data. This acceptance does not authorize server purchase, paid API activation, real business/customer data storage, external integrations, or production deployment.

## Approval required
User approval is required before treating this proposal as the binding initial development/deployment direction.