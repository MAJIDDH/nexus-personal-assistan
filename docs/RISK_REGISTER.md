# NEXUS Risk Register

This is an initial qualitative register, not a claim that controls are implemented. Status and risk ratings must be reviewed as discovery progresses.

| Risk | Initial level | Preventive control / next action | Evidence required | Status |
|---|---|---|---|---|
| Public repository exposes a credential | Critical | Ignore real environment files; inspect history and archive contents; rotate exposed credentials | Secret scan and repository review record | Open |
| Agent performs an unauthorized external action | Critical | Server-side policy, tool allowlist, scoped permissions, explicit approval binding | Negative authorization tests and audit evidence | Open |
| Prompt injection changes agent behavior | High | Treat external text as untrusted; enforce tool policy outside the model | Adversarial tests and blocked-action evidence | Open |
| Duplicate execution after retry or timeout | High | Idempotency keys and reconciliation for state-changing operations | Duplicate-delivery and uncertain-outcome tests | Open |
| Personal memory stores incorrect or unwanted facts | High | Provenance, user correction, retention, export and deletion workflows | Memory lifecycle acceptance tests | Open |
| Model/API costs exceed expectations | High | Budget limits, usage attribution, bounded retries/loops, cost alerts and safe stop | Cost tests and configured limits | Open |
| External provider outage interrupts work | Medium/High | Timeouts, bounded retries, clear degraded state and recoverable task records | Failure injection and recovery tests | Open |
| Backups cannot be restored | High | Document backup/restore plan and perform restore drills before production | Successful restore evidence | Open |
| Business data mixes with personal assistant context | High | Define data scopes and authorization boundaries before persistence | Isolation and access-control tests | Open |
| Feature is reported complete without end-to-end proof | High | Use explicit status vocabulary and require recorded verification evidence | Delivery report and test output | Open |
| User cannot revoke an agent or integration safely | High | Define revocation, cancellation, and kill-switch behavior | Revocation and cancellation tests | Open |

## Review cadence

Review this register during Phase 1 discovery, before enabling new autonomous actions, after a security incident or provider-policy change, and before production deployment.

A risk may be closed or downgraded only when the control is implemented and supporting evidence is recorded. Risk acceptance requires explicit user approval.
