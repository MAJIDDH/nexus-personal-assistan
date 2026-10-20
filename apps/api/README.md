# NEXUS API — Local Prototype

This is a local-only prototype, not a production service.

## Requirements

- Node.js LTS (Node.js 20 or newer).
- npm.
- Docker Compose for the local PostgreSQL container.

## Install and start

From this directory:

```sh
cp .env.example .env
npm install
npm test
npm run build
npm run test:e2e
```

From the repository root, start the local database:

```sh
docker compose up -d postgres
```

Then from this directory apply migrations and start the API:

```sh
npm run migrate
npm run start:dev
```

The API binds to `127.0.0.1` only.

## Routes

- `GET /api` — local prototype status.
- `GET /api/health` — liveness check; confirms the API handler responds, not database connectivity.
- `GET /api/health/ready` — readiness check; returns ready only when PostgreSQL responds to `SELECT 1`, otherwise HTTP 503 without exposing driver details.
- `GET /api/content-ideas` — list up to 100 newest locally stored content ideas.
- `GET /api/tasks?project=golddyousefi&status=open` — list up to 200 tasks, optionally filtered by an allowed project and status.
- `POST /api/tasks` — create a task with title, optional description, project (`personal`, `nexus`, `golddyousefi`, `bache-mahal`), importance/urgency from 1–5, and optional ISO `due_at`.
- `PATCH /api/tasks/:id` — edit open or in-progress tasks.
- `POST /api/tasks/:id/status` — explicitly transition an open task to in-progress, completed, or cancelled; in-progress tasks can return to open or become completed/cancelled. Completed and cancelled tasks are terminal.
- `GET /api/audit-events?entity_type=task&entity_id=<uuid>&limit=50` — read-only audit history, optionally filtered by entity and bounded to 1–200 events.
- `POST /api/feedback` — save structured user feedback for an existing task (`task_id`, `rating`: `useful` / `not_useful` / `needs_adjustment`, optional `note` up to 2,000 characters).
- `GET /api/feedback?task_id=<uuid>&limit=50` — retrieve recent feedback, optionally for one task; limit is bounded to 1–200.
- `POST /api/content-ideas` — create a draft content idea. JSON fields: `title` (1–160 characters), `concept` (1–5000 characters), optional `objective` (`grow_followers`, `increase_sales`, `increase_engagement`, or `educate`; defaults to `grow_followers`). Unsupported fields and values are rejected.

Example request:

```sh
curl -i -X POST http://127.0.0.1:3000/api/content-ideas \
  -H 'Content-Type: application/json' \
  -d '{"title":"Choose your style","concept":"Compare three synthetic necklace concepts and invite viewers to choose.","objective":"grow_followers"}'
```

The content-idea API stores, lists, edits drafts, and supports an explicit transition from draft to in-review. The task API manages local tasks only. Task priority score is derived from importance, urgency, and approaching/overdue due dates; it is a transparent heuristic, not an AI decision. No reminders, background jobs, external notifications, approvals, publishing, scheduling, customer messaging, or Instagram calls run. Audit history currently covers task writes only; it is a local operational trail, not a tamper-proof security ledger or authenticated attribution system. Feedback is explicitly recorded by the caller and stored for later review; it does not automatically train or change model behavior.

## Database migrations

The migration runner fails fast when `DATABASE_URL` is missing, applies ordered SQL files once, records them in `schema_migrations`, and wraps each migration in a transaction. The migrations create the ledger, content-idea table, task table, audit history, and structured task feedback. A PostgreSQL trigger records task creation and updates in the same transaction as the task write; each event stores before/after snapshots and a server-defined local actor/source. Use synthetic test data only.

The Compose credentials are disposable local-development placeholders. Never reuse them outside this local synthetic-data environment. Database queries use parameterized values (for example, `$1`) rather than interpolating request input into SQL.

## Safety limits

- No real gallery/customer records or production credentials.
- No paid model provider or external API is configured.
- The model provider is deterministic mock behavior only.
- Tool policy is default-deny except for the exact `demo.read_status@v1` capability.
- Caller-supplied approval objects are not trusted; no trusted approval issuer exists yet.
- Do not expose the API publicly or deploy this prototype.

## Verification status

Latest verified GitHub Actions runs on commit `5e59f6689672385f5cab9323b2cedc3c325f20a2` passed API build, unit tests, API end-to-end tests, and disposable PostgreSQL migration/persistence checks. Feedback migration changes are newer and require fresh CI verification.
