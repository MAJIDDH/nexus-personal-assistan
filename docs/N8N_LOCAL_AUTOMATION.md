# Local n8n Automation — NEXUS

## Status and scope

The local n8n service is an isolated automation experiment. It is **not yet connected to the NEXUS API**, and no workflow is imported or activated by the repository. Use synthetic data only.

- n8n image: `n8nio/n8n:2.44.5` (pinned stable release as of 2026-10-22).
- Local editor: `http://localhost:5678`.
- Host port is bound to `127.0.0.1` only.
- n8n persists its settings and workflow data in the separate Docker volume `nexus_n8n_data`; NEXUS application data remains in PostgreSQL.
- Telemetry, personalization, and workflow templates are disabled.
- Timezone is set to `Asia/Tehran`.
- No external credentials, public webhooks, tunnels, or real business/customer data are configured.

See [ADR 0007](adr/0007-local-n8n-automation.md) for the accepted scope and security boundaries.

## Start on Windows PowerShell

From the existing local repository:

```powershell
cd "$HOME\NEXUS"
docker compose config
docker compose pull n8n
docker compose up -d postgres n8n
docker compose ps
```

Open `http://localhost:5678` and complete n8n's first-run owner setup. Use a unique local password; never commit it or put it in a workflow. If the page does not load, inspect:

```powershell
docker compose logs --tail 100 n8n
```

The first image pull needs internet access. After the image is available, n8n can run locally without configuring any external integration.

## Safe first test

Before connecting NEXUS, create a temporary workflow in the n8n UI using only a Manual Trigger and an Edit Fields/Set node with clearly synthetic values, for example:

- `project_key`: `demo`
- `task_title`: `Synthetic NEXUS automation test`
- `source`: `local-demo`

Run it manually and confirm the output contains only those test values. Do not add HTTP Request, Execute Command, community nodes, credentials, external messaging, or publishing nodes for this first test. Do not activate the workflow.

## Security boundaries

- Keep the editor local; do not port-forward 5678, expose it through a reverse proxy, use a tunnel, or configure public webhook URLs.
- `N8N_SECURE_COOKIE=false` is set only so the local HTTP editor can be used. This configuration is not suitable for an internet-facing deployment.
- Do not connect Instagram, Telegram, email, model providers, customer records, or real gallery data at this stage.
- Do not treat an n8n workflow as an approval mechanism. NEXUS must remain the source of truth for permissions and explicit confirmation of public, financial, destructive, or otherwise consequential actions.
- Do not export credentials or commit n8n's runtime directory. Workflow exports must be reviewed for secrets before they are committed.
- Before broader use, run n8n's security audit and review node permissions, webhook exposure, credential storage, backups, and update policy.

## Stop and rollback

Stop n8n without deleting its saved state:

```powershell
docker compose stop n8n
```

Remove the stopped n8n container while preserving its named volume:

```powershell
docker compose rm -f n8n
```

Do **not** run `docker compose down -v` unless you intentionally want to delete all Compose-managed persistent data. Do not remove `nexus_n8n_data` without an explicit decision to discard n8n workflows and settings.

## Verification checklist

After startup, verify manually:

1. `docker compose config` succeeds.
2. `docker compose ps` shows n8n running and PostgreSQL healthy.
3. `http://localhost:5678` opens from the local machine.
4. The published port is `127.0.0.1:5678`, not `0.0.0.0:5678`.
5. The NEXUS API readiness check still succeeds at `http://127.0.0.1:3000/api/health/ready`.
6. No external credentials or active workflows have been configured.

Repository configuration is committed, but runtime verification must be performed on the user's machine before this integration is marked verified.
