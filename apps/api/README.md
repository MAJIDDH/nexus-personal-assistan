# NEXUS API — Local Prototype

This is an early local-only scaffold, not a production service.

## Requirements

- Node.js LTS (Node.js 20 or newer).
- npm.
- Docker Compose for the optional local PostgreSQL container.

## Install and test the API

From this directory:

```sh
cp .env.example .env
npm install
npm test
npm run build
npm run start:dev
```

The API binds to `127.0.0.1` only. Routes:

- `GET http://127.0.0.1:3000/api` — local prototype status.
- `GET http://127.0.0.1:3000/api/health` — liveness check; confirms the API handler responds, not database connectivity.
- `GET http://127.0.0.1:3000/api/health/ready` — readiness check; returns ready only when PostgreSQL responds to `SELECT 1`, otherwise returns HTTP 503 without exposing driver details.

## Start PostgreSQL and apply migrations

From the repository root:

```sh
docker compose up -d postgres
```

Then, from this directory, ensure `.env` contains the local-only connection string shown in `.env.example`, and run:

```sh
npm run migrate
```

The migration runner fails fast when `DATABASE_URL` is missing. It creates a `schema_migrations` ledger, applies ordered SQL files once, and wraps each migration in a transaction. The current migration only establishes the ledger table; no business tables or real data are created.

The Compose credentials are disposable local-development placeholders. Do not reuse them outside this local synthetic-data environment. Creating a connection pool does not prove that PostgreSQL is reachable. Database queries must use parameterized values (for example, `$1`) and must not interpolate untrusted input into SQL.

## Safety limits

- Use synthetic test data only.
- No real gallery/customer records or production credentials.
- No paid model provider or external API is configured.
- The model provider is deterministic mock behavior only.
- Tool policy is default-deny except for the exact `demo.read_status@v1` capability.
- Caller-supplied approval objects are not trusted; no trusted approval issuer exists yet.
- Do not expose the API publicly or deploy this prototype.

## Verification status

Unit and e2e test definitions are present, but the test suite, build, and database migration have not been executed in the available environment. Run the commands above on a machine with the required tooling and record the actual results before describing the prototype as runnable.
