# Private API Route Inventory (Pre-Authentication)

**Status:** Inventory of the current `feat/task-priority-hardening` prototype, reviewed on 2026-10-23. This is a security-planning document, not evidence that routes are authenticated. Re-check it against the exact implementation branch before coding and keep it updated as routes change.

## Current controller inventory

The current prototype has no end-user identity/session guard on the routes below. Treat all routes as local-only and private unless explicitly classified as health-only. Do not expose this API to a LAN, reverse proxy, tunnel, or public internet.

| Controller | Method and route | Data/action | Required release tests |
|---|---|---|---|
| `TasksController` | `GET /tasks` | List tasks, optionally filtered by project/status | Anonymous denied; User A list never includes User B tasks; filter tampering cannot bypass owner scope |
| `TasksController` | `POST /tasks` | Create task | Anonymous denied; authenticated creator owns task; caller cannot set/impersonate owner |
| `TasksController` | `PATCH /tasks/:id` | Update task by UUID | Anonymous denied; cross-user UUID update denied without leaking data |
| `TasksController` | `POST /tasks/:id/status` | Transition task status | Anonymous denied; cross-user transition denied; authorization failure audited |
| `ContentIdeasController` | `GET /content-ideas` | List content ideas | Anonymous denied; User A cannot list User B ideas |
| `ContentIdeasController` | `POST /content-ideas` | Create content idea | Anonymous denied; creator ownership set server-side |
| `ContentIdeasController` | `PATCH /content-ideas/:id` | Update draft | Anonymous denied; cross-user update denied |
| `ContentIdeasController` | `POST /content-ideas/:id/submit-for-review` | Change idea workflow state | Anonymous denied; cross-user state transition denied; any later publishing/approval permission must be checked separately |
| `AuditController` | `GET /audit-events` | Read audit history | Anonymous denied; only authorized owner's events returned; caller cannot query another owner's entity IDs |
| `FeedbackController` | `GET /feedback` | Read task feedback | Anonymous denied; owner scoping enforced even when task ID is supplied |
| `FeedbackController` | `POST /feedback` | Create feedback for task | Anonymous denied; referenced task must belong to authenticated user |
| `HealthController` | `GET /health` | Basic process health | May remain unauthenticated only if response contains no private/configuration data |
| `HealthController` | `GET /health/ready` | Dependency readiness | May remain unauthenticated only if response remains coarse and reveals no secrets or sensitive internals |

## Future endpoints that must be added before release

- Registration, login, logout, session refresh/revocation, password recovery, and email verification.
- Telegram link challenge creation/confirmation/unlinking.
- Memory read/write/search and memory-management controls.
- Tool execution, approval creation/consumption, integration settings, and any publishing/scheduling endpoints.
- File upload/download and any future business/customer/accounting endpoints.
- Any admin, diagnostics, export, or background-job management endpoints.

Every new private route must be added here before merge and covered by tests.

## Minimum test matrix

For each private route, tests must demonstrate:

1. No session → denied (normally 401; 403 is acceptable where deliberately specified).
2. Invalid, expired, revoked, or malformed session → denied.
3. User A session cannot read or mutate User B's record, including by guessing/changing UUIDs, project keys, filters, or request body fields.
4. Owner identity comes from verified server-side session, never from request body/query/path supplied by the client.
5. Denials do not leak record existence or private data; security-relevant denials are audited without logging secrets.
6. For writes, authorization is checked before side effects and within a transaction where needed to avoid race conditions.

## Production startup and exposure gate

- Production must fail closed if approved authentication/session configuration is missing or invalid.
- No implicit anonymous fallback in production.
- Keep the listener bound to `127.0.0.1` until route inventory and tests are complete and separately reviewed.
- CI success alone does not authorize public exposure.
- Do not enable real Telegram webhooks, reverse proxy, tunnel, or remote browser clients until every release gate is checked and deployment is explicitly approved.

## Maintenance

Update this file whenever a controller/route is added, removed, renamed, or changes its data ownership. Review against NestJS decorators and the e2e route tests, not only documentation. This inventory is based on the prototype base branch and must be re-verified against the final authentication implementation.
