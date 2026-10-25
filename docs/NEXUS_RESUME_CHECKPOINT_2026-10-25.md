# NEXUS Resume Checkpoint — 2026-10-25

This document records the verified stopping point for the next work session. It is a checkpoint only; it does not authorize merging any pull request or activating automation.

## User's explicit preferences
- Be candid and practical; do not agree merely to please.
- Keep progress and avoid repeatedly asking the user to repeat established details.
- For n8n workflows, prepare a complete importable workflow file rather than asking the user to repeatedly add/edit nodes manually.
- Keep existing test workflows untouched.
- Never merge a PR without the user's explicit approval.
- No paid services or external actions without approval.

## Local services and verified task-report test
- Repository: `MAJIDDH/nexus-personal-assistan`
- Local repo path: `C:\Users\DELL\NEXUS`
- API: `http://127.0.0.1:3000`
- n8n: `http://127.0.0.1:5678`
- PostgreSQL: `127.0.0.1:5432`
- Inside Docker Compose, n8n must call the API using `http://api:3000`, not localhost.
- Health endpoint: `GET /api/health/ready`
- Tasks endpoint: `GET /api/tasks`
- User manually fixed the Code node named `Build Priority Report` to process all incoming n8n items. The latest observed output is correct:
  - `ok: true`
  - `totalTasks: 2`
  - `openTaskCount: 1`
  - open task `Test necklace reel idea`, project `golddyousefi`, priority 12, status open, no due date.
- This proves report parsing/formatting in the currently imported workflow works with the current API response. It does NOT prove Telegram delivery, dashboard persistence, or scheduled production execution.

## Desired production workflow
Target name: `NEXUS - Production Daily Priority Report (09:00 Tehran)`.

Target behavior:
1. Schedule daily at 09:00, timezone `Asia/Tehran`.
2. Check API readiness.
3. Fetch actual tasks, parse the observed n8n multiple-items response robustly, sort open tasks by priority, and fail visibly on unexpected response rather than silently reporting zero.
4. Send the report to Telegram.
5. Persist the same report through a verified NEXUS API endpoint so the dashboard can display it.
6. Log/report failures visibly.
7. Keep inactive until all required paths are tested.

## Telegram setup not yet done
- User has not created the NEXUS Telegram bot yet.
- Next: open `https://t.me/BotFather`, send `/newbot`, choose a display name and a unique username ending in `bot`, then press Start in the new bot's chat.
- Store the bot token only in n8n Credentials (Telegram API); never ask the user to paste it into chat or commit it to Git.
- Obtain the chat ID through a safe method and replace the placeholder in the workflow.
- Do not add credentials, tokens, or chat IDs to tracked workflow files.

## Dashboard destination
- User wants both Telegram and the NEXUS dashboard.
- Dashboard persistence is NOT implemented/verified for reports. Before wiring it, inspect the current API and dashboard code and add a documented, tested report storage/read endpoint or another verified persistence design. Do not assume an endpoint exists.
- The Lovable-based dashboard remains demo-only/not yet connected to the local API according to PR #30. Preserve its visual design while integrating.

## Workflow state and safety
- Existing experimental workflows must remain untouched:
  - `NEXUS - Daily Priority Report (09:00 Tehran)`
  - `NEXUS - Daily Priority Report (Local)`
- Do not activate the production workflow yet.
- No Telegram/email delivery is configured yet.
- A prior attempt to generate an updated downloadable workflow JSON failed because the file-generation tool was rate-limited. No v2 file was created by that attempt. On a later user request, retry file generation once available; do not claim a file exists until verified.

## GitHub pull requests as of checkpoint
- PR #31 `Add standalone NEXUS n8n gallery task report workflow`: open, unmerged; head `feat/n8n-task-report-workflow`, head SHA `0b8c10b6e4c49a69219792a87fb0164b62b455e2`.
- PR #30 `Replace legacy NEXUS UI with the original Lovable design`: open, draft, unmerged; head `feat/lovable-neural-fiber-integration-clean`, head SHA `59b88f686008f9d74c3579b27a8aacd4c38f3c21`.
- PR #2 and #3 are also open; PR #1 remains unmerged. Never merge any PR without explicit user permission.
- This checkpoint was committed on the PR #31 branch only as documentation; it does not change runtime behavior.

## Resume order
1. User creates the bot with BotFather; configure credentials safely in n8n.
2. Prepare and import one complete, separate production workflow JSON with robust API health/error handling and Telegram node left unconfigured/disabled until credentials/chat ID are set.
3. Inspect API/dashboard and implement report persistence/read display so the same report appears in the dashboard.
4. Test API failure, empty tasks, normal tasks, Telegram delivery, and dashboard display.
5. Only then ask for explicit approval to activate the scheduled workflow.
