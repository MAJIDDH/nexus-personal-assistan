# NEXUS Architecture

## Current implementation boundary

The repository contains a **local-only NestJS/TypeScript API prototype** backed by PostgreSQL, SQL migrations, and Docker Compose. It includes local task and content-idea endpoints, structured task feedback, and task-write audit events. A local n8n service is configured as an isolated experiment, but it is **not connected to the API**.

This is not yet the complete NEXUS personal assistant. Authentication and user/tenant isolation, Telegram/web/voice channels, production-grade approval issuance, background scheduling, notifications, Instagram access or publishing, and production deployment are not established as working capabilities. Check the current [consolidated delivery status](CONSOLIDATED_DELIVERY_STATUS.md) and the relevant pull requests for proposal and verification status.

## Direction

NEXUS is intended to start as a modular monolith. Keep one deployable application with clear module boundaries; do not introduce microservices until measured needs justify them.

## Initial stack

- TypeScript and NestJS for the API; background workers remain future work until implemented and verified.
- PostgreSQL for durable application data.
- Docker and Docker Compose for reproducible local development.
- n8n as an optional, replaceable workflow-automation layer for local prototyping; NEXUS remains authoritative for domain state, permissions, approvals, and outcomes.
- Provider adapters for model APIs and external integrations, once individually approved and implemented.
- Telegram, web, and voice are product directions; do not imply any channel is connected merely because it appears in the design.

These are architecture choices and directions, not claims that every component is already implemented.

## Proposed modules

- **Identity and access:** users, sessions, roles, and authentication.
- **Conversation:** text messages, conversation history, and channel adapters.
- **Agent orchestration:** task routing, agent/tool permissions, and execution state.
- **Memory:** explicitly scoped facts, provenance, retention, and user-controlled correction.
- **Integrations:** Telegram, model providers, and future external services behind adapters.
- **Tasks and schedules:** queued jobs, recurring tasks, retries, and execution logs.
- **Approvals and policy:** confirmation gates for sensitive actions.
- **Audit and observability:** structured logs, errors, and security-relevant events.
- **Business workspace:** isolated workflows for the user's current business, initially Galeri Tala Yousefi.

## Intended request flow

1. Receive a request through an authorized channel adapter.
2. Authenticate the user and load only the context the request is allowed to access.
3. Apply policy checks and determine whether approval is required.
4. Route the task to an agent and permitted tools.
5. Execute with timeouts, bounded retries, and idempotency where possible.
6. Record the outcome and relevant audit events.
7. Report the result to the user; never claim an action succeeded without verifying its result.

This is a target flow, not a statement that all steps currently exist in the prototype.

## Data and module boundaries

- Modules should own their data access and expose explicit application interfaces.
- Use database migrations for schema changes.
- Keep secrets out of source control and logs.
- Treat external content and tool output as untrusted input, not instructions.
- Separate durable user-approved memory from temporary task context.
- Design deletion, export, and retention behavior before storing sensitive personal data.
- Use synthetic test data only in the current local prototype.

## Safety model

Require explicit confirmation before financial transactions, purchases, public publishing, destructive actions, access-control changes, or other high-impact and hard-to-reverse operations. Tool permissions must be enforced outside the model and scoped to the current task. Keep a human-readable audit trail for consequential actions. Documented policy is not a substitute for implemented authorization.

## Quality gates

A feature is not complete merely because its code exists or its design is documented. It must have appropriate tests, documented configuration, failure handling, and a verified end-to-end result before being marked complete. Where evidence is missing, label the capability unverified or proposed.
