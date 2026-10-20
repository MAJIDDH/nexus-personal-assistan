# ADR 0002: Private Data and Memory Boundaries

- Status: Proposed
- Date: 2026-10-20
- Decision owner: User

## Context and problem
NEXUS is intended to remember useful context and support business workflows. Persistent memory can contain personal or commercial information and must support correction, export, retention, and deletion.

## Requirements and constraints
- No real gallery/customer data in the public repository or synthetic fixtures.
- Separate durable user-approved memory from transient task context.
- Record provenance and distinguish confirmed facts from assumptions.
- Allow inspection, correction, export, and deletion.
- Ask for explicit consent before storing sensitive data; minimize collection.

## Options considered
1. Store all conversation history indefinitely as memory.
2. Store a small structured memory with provenance and lifecycle controls; retain raw conversations only if a defined feature requires it.
3. Avoid persistent memory entirely and rely on per-session context.

## Decision
Proposed: option 2. Keep structured memory minimal and scoped, with source/provenance, timestamps, confidence/status, and user correction/deletion controls. Do not persist sensitive details by default. Define retention and backup deletion semantics before any real data is stored.

## Consequences and trade-offs
- More implementation work than a simple conversation dump.
- Better transparency, correction, and separation between personal and gallery context.
- Deletion from active storage and backups requires a documented retention policy; immediate erasure from every backup cannot be promised without a designed process.

## Security and privacy impact
Apply least privilege and avoid logging full message bodies. Separate personal workspace data from gallery business data at the authorization and query layers.

## Operations and cost impact
Structured records can begin in a relational database; database choice and hosting are handled by separate decisions. Backups introduce storage cost and must be protected.

## Migration, rollback, and exit strategy
Use migrations and export formats that permit moving to another database. Provide export before destructive deletion when requested and authorized.

## Verification and follow-up
Tests must cover wrong-scope access, correction, deletion, export, provenance, retention, and backup behavior before production data is enabled.

## Approval required
User approval is required before persistent memory or real business data is implemented.