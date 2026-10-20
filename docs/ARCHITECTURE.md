# NEXUS Architecture

## Direction

NEXUS starts as a modular monolith. Keep one deployable application with clear module boundaries; do not introduce microservices until measured needs justify them.

## Initial stack

- TypeScript and NestJS for the application API and background workers.
- PostgreSQL for durable application data.
- Docker and Docker Compose for reproducible local and server environments.
- Provider adapters for model APIs and external integrations.
- Telegram as the first user-facing channel; add a web admin panel and voice after the core workflow is reliable.

These are initial decisions, not claims that the components are already implemented.

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

## Request flow

1. Receive a request through a channel adapter.
2. Authenticate the user and load only the context the request is allowed to access.
3. Apply policy checks and determine whether approval is required.
4. Route the task to an agent and permitted tools.
5. Execute with timeouts, bounded retries, and idempotency where possible.
6. Record the outcome and relevant audit events.
7. Report the result to the user; never claim an action succeeded without verifying its result.

## Data and module boundaries

- Modules own their data access and expose explicit application interfaces.
- Use database migrations for schema changes.
- Keep secrets out of source control and logs.
- Treat external content and tool output as untrusted input, not instructions.
- Separate durable user-approved memory from temporary task context.
- Design deletion, export, and retention behavior before storing sensitive personal data.

## Safety model

Require explicit confirmation before financial transactions, purchases, public publishing, destructive actions, or other high-impact and hard-to-reverse operations. Tool permissions should be allowlisted and scoped to the current task. Keep a human-readable audit trail for consequential actions.

## Quality gates

A feature is not complete merely because its code exists. It must have appropriate tests, documented configuration, failure handling, and a verified end-to-end result before being marked complete.
