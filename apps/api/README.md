# NEXUS API — Local Prototype

This is an early local-only scaffold, not a production service.

## Requirements

- Node.js LTS (Node.js 20 or newer).
- npm.
- Docker Compose only if you want to start the local PostgreSQL container.

## Run the API

From this directory:

```sh
cp .env.example .env
npm install
npm test
npm run build
npm run start:dev
```

The API binds to `127.0.0.1` only. Expected routes:

- `GET http://127.0.0.1:3000/api` — local prototype status.
- `GET http://127.0.0.1:3000/api/health` — minimal health response.

The health route checks that the API handler responds; it does not claim PostgreSQL is connected.

## Start PostgreSQL locally (optional at this milestone)

From the repository root:

```sh
docker compose up -d postgres
```

Database credentials in the compose file are disposable local-development placeholders. Do not reuse them outside the local synthetic-data environment. No database integration is wired into the API yet.

## Safety limits

- Use synthetic test data only.
- No real gallery/customer records or production credentials.
- No paid model provider or external API is configured.
- The model provider is deterministic mock behavior only.
- Tool policy is default-deny except for the exact `demo.read_status@v1` capability.
- Caller-supplied approval objects are not trusted; no trusted approval issuer exists yet.
- Do not expose the API publicly or deploy this prototype.

## Verification status

Unit and e2e test definitions are present, but neither the test suite nor the build has been executed in the available environment. Run the commands above on a machine with the required tooling and record the actual results before describing the prototype as runnable.
