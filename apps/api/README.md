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
- `POST /api/content-ideas` — create a draft content idea. JSON fields: `title` (1–160 characters), `concept` (1–5000 characters), optional `objective` (`grow_followers`, `increase_sales`, `increase_engagement`, or `educate`; defaults to `grow_followers`). Unsupported fields and values are rejected.

Example request:

```sh
curl -i -X POST http://127.0.0.1:3000/api/content-ideas \
  -H 'Content-Type: application/json' \
  -d '{"title":"Choose your style","concept":"Compare three synthetic necklace concepts and invite viewers to choose.","objective":"grow_followers"}'
```

The content-idea API stores, lists, and edits drafts only. It does not approve, publish, schedule, message customers, or call Instagram.

## Database migrations

The migration runner fails fast when `DATABASE_URL` is missing, applies ordered SQL files once, records them in `schema_migrations`, and wraps each migration in a transaction. The migrations create the ledger and content-idea table. Use synthetic test data only.

The Compose credentials are disposable local-development placeholders. Never reuse them outside this local synthetic-data environment. Database queries use parameterized values (for example, `$1`) rather than interpolating request input into SQL.

## Safety limits

- No real gallery/customer records or production credentials.
- No paid model provider or external API is configured.
- The model provider is deterministic mock behavior only.
- Tool policy is default-deny except for the exact `demo.read_status@v1` capability.
- Caller-supplied approval objects are not trusted; no trusted approval issuer exists yet.
- Do not expose the API publicly or deploy this prototype.

## Verification status

GitHub Actions run #28 passed the API build, all 18 unit tests, and all 8 API end-to-end tests. The tests use mocks for the database; a real PostgreSQL migration and database-backed API run have not yet been executed.
