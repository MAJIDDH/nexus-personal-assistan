# ADR 0003: Replaceable Model Provider and Spend Controls

- Status: Accepted
- Date: 2026-10-20
- Decision owner: User

## Context and problem
NEXUS needs language-model capabilities, but provider availability, payment, data handling, and recurring usage cost are not yet verified. A ChatGPT subscription must not be assumed to include API credits.

## Requirements and constraints
- Keep the provider replaceable behind an application interface.
- Do not make paid API calls until provider, billing, and usage limits are explicitly authorized.
- Never send unnecessary personal/business data to a model.
- Bound retries, loops, context sizes, and audio/image use.
- Record usage and surface estimated cost without inventing unobserved spend.

## Options considered
1. Bind the application directly to one model vendor.
2. Define a provider interface and begin with a mock/fake provider for local tests; select a live provider only after cost, quality, access, and privacy comparison.
3. Self-host a model immediately.

## Decision
Proposed: option 2. Use a provider interface with a deterministic mock implementation for early tests. Compare one or two live providers with synthetic tasks before choosing one. Default to text-first; treat transcription and realtime voice as separate optional capabilities.

## Consequences and trade-offs
- A small abstraction layer adds work but reduces vendor lock-in.
- The mock provider enables testing without keys or cost but cannot establish real answer quality or latency.
- Self-hosting is deferred until measured usage or privacy requirements justify operational complexity.

## Security and privacy impact
Secrets must be provided through protected runtime configuration and never committed. Redact sensitive data, restrict provider input, and review data retention terms before live use.

## Operations and cost impact
No provider or paid commitment is authorized by this proposal. Before live use, define per-task and monthly budgets, rate limits, alerts, a stop switch, and low/expected/high usage estimates.

## Migration, rollback, and exit strategy
Provider-specific requests and responses stay inside adapters. Keep a mock provider and allow switching providers without rewriting business workflows.

## Verification and follow-up
Test timeout, provider failure, usage limit, cost limit, malformed output, and cancellation. Verify a provider's current official pricing, access, data terms, and billing route before activation.

## Acceptance record

Accepted by the user in ChatGPT on 2026-10-20, within the bounded scope of a local prototype using synthetic data. This acceptance does not authorize server purchase, paid API activation, real business/customer data storage, external integrations, or production deployment.

## Approval required
User approval is required before selecting or activating a paid provider.