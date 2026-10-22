# ADR 0007: Local n8n Workflow Automation Layer

- Status: Accepted
- Date: 2026-10-22
- Decision owner: User

## Context and problem

NEXUS already has a local NestJS API, PostgreSQL, and a web dashboard. It needs a low-code way to prototype repeatable routines without moving domain policy, permissions, or durable business logic out of NEXUS.

## Requirements and constraints

- Local development only; use synthetic/test data.
- No public deployment, paid service, real customer/gallery records, or external integrations are authorized by this ADR.
- Preserve NEXUS as the authority for domain state, policy, approvals, and audit semantics.
- Keep the automation engine replaceable and its persistent data separate from NEXUS application data.
- Bind the editor only to loopback and do not enable externally reachable webhooks.
- Do not import or activate workflows that publish content, send messages, spend money, change accounts, or disclose data.
- No secrets or real credentials in source control.

## Options considered

1. Implement every schedule and connector directly inside the NestJS application.
2. Add self-hosted n8n as a local, replaceable workflow execution layer.
3. Use a hosted automation provider.

## Decision

Accept option 2 for a bounded local experiment. Add n8n to Docker Compose using a pinned stable image tag, a dedicated persistent volume, and a loopback-only host port. Keep NEXUS responsible for domain data, authorization, approval requirements, and user-facing outcomes. Initially, use n8n only for manually triggered demonstrations with synthetic data. Any authenticated API integration, webhook exposure, external provider, or consequential workflow requires a separate scoped review and explicit approval before activation.

## Consequences and trade-offs

- Low-code workflow prototyping becomes possible without expanding the NestJS codebase for every routine.
- A second runtime adds resource use, version maintenance, workflow-specific failure modes, and another administrative surface.
- Workflow definitions and credentials need their own review and backup/restore plan before real use.
- n8n is an execution tool, not NEXUS's source of truth or policy engine.

## Security and privacy impact

- Publish port 5678 only on 127.0.0.1; do not configure public URLs, tunnels, or inbound webhooks.
- Use n8n's first-run owner setup and keep its encryption/configuration data in the dedicated ignored Docker volume.
- Do not connect Instagram, Telegram, email, model APIs, customer records, or other external services in this phase.
- Treat workflow inputs and external content as untrusted; do not allow a workflow to bypass NEXUS approval rules.
- Keep credentials out of workflow exports and Git. Run the n8n security audit before considering broader use.

## Operations and cost impact

- Local Community self-hosting is the initial route; no subscription or hosting purchase is approved.
- Docker must download the pinned image, so setup requires internet access for that image pull, but no workflow is authorized to call external services.
- The n8n data volume persists workflows and instance configuration separately from PostgreSQL application data.

## Migration, rollback, and exit strategy

Start and stop n8n independently with Docker Compose. To stop it without deleting workflows, run `docker compose stop n8n`. To remove the service container but preserve its named volume, run `docker compose rm -f n8n`. Do not delete `nexus_n8n_data` unless the user explicitly chooses to discard n8n's saved state. Removing the service from Compose is the code rollback; preserve or separately export any workflow definitions needed before deleting persistent data.

## Verification and follow-up

- Verify Compose configuration with `docker compose config`.
- Start n8n and PostgreSQL, then confirm the n8n UI is reachable only at `http://localhost:5678` and the NEXUS API readiness endpoint remains healthy.
- Confirm no public bind, no activated workflow, no external credential, and no new NEXUS API permission has been added.
- Record exact test outcomes; until these checks run on the user's machine, this integration is implemented but unverified.

## Acceptance record

Accepted by the user in ChatGPT on 2026-10-22 to begin a local-only n8n integration, subject to the limits above.
