# Discovery Options 02 — Cost and Deployment Baseline

**Status:** Preliminary desk research; not an accepted architecture decision or purchase authorization.  
**Date:** 2026-10-20  
**Scope:** Cost-aware first release for NEXUS, with Galeri Tala Yousefi Instagram operations as the first use case.

## 1. Executive recommendation

Start with a small, replaceable modular-monolith deployment and a text-first workflow. Do not purchase a GPU server, adopt microservices, or make real-time voice a launch dependency. First validate the workflow using local development and synthetic data; then deploy only after access, backup, monitoring, and recovery checks are specified.

Keep these as separate cost buckets:
1. Server and domain/networking.
2. Model/API usage (variable; driven by actual tokens, images, and audio).
3. Database and backups (can initially share the VPS, but backups should not exist only on that same server).
4. Optional speech-to-text/text-to-speech or realtime voice.
5. Optional third-party automation/analytics tools.
6. Developer time and payment/access friction, which may be more consequential than list price for a user operating from Iran.

This is a cost model, not a quote. Provider access, payment acceptance, local connectivity, tax, and availability have not been tested.

## 2. Hosting reference points

Hetzner's official June 2026 pricing notice lists EU cloud plans after the adjustment. Examples include CX23 at **$6.49/month** and CX33 at **$9.99/month**, excluding VAT and IPv4; the final bill can differ by location, IP, backups, tax, and selected configuration. See [official Hetzner pricing update](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/) and [cloud changes](https://docs.hetzner.cloud/whats-new).

**Planning range, not a final server selection:**
- Prototype/local development: $0 incremental hosting, excluding the user's existing computer and internet.
- Small single-user production pilot: use approximately **$7–15/month** as a preliminary server-only planning band, then add any domain, external backup, storage, VAT, and provider-specific charges.
- More memory/CPU or higher availability: budget separately after measuring the pilot; do not scale preemptively.

The server should run the API, background jobs, database, and admin web interface initially, if measured resource use permits. Keep a replaceable model-provider adapter. Do not self-host a large language model on the initial VPS: ordinary CPU VPS resources are not a sensible substitute for dedicated inference hardware.

## 3. Model and voice cost

OpenAI's current public API pricing page lists GPT-Live-1 voice sessions at **$0.05 per minute**, with backend model/tool use charged separately. The realtime model family has token-based rates too; for example, the page lists GPT-Realtime-2.1 audio input at $32 per million audio tokens and audio output at $64 per million, with text tokens billed separately. These are not directly interchangeable pricing units. See [official API pricing](https://developers.openai.com/api/docs/pricing).


For a more economical first voice feature, the official pricing page lists file transcription with GPT-Transcribe at **$0.0045 per minute** (about $0.27 for 60 minutes of source audio before any separate text-model processing). This makes voice-note transcription a better initial experiment than always-on realtime voice, provided the service is accessible and the audio/data handling is acceptable. See [official transcription pricing](https://developers.openai.com/api/docs/models/gpt-transcribe) and [speech-to-text guide](https://developers.openai.com/api/docs/guides/speech-to-text).

Implications:
- Do not assume a ChatGPT subscription includes API credits; API billing is a separate cost path.
- Do not promise a monthly AI bill before defining message volume, average context size, image analysis, audio minutes, and model choice.
- Keep the default experience text-first and use a lower-cost model for routine classification/summarization where quality is adequate.
- Add voice in stages: uploaded voice note/transcription first; generated spoken replies next; realtime speech-to-speech only if measured value justifies its additional complexity and variable cost.
- Establish per-user and per-task budgets, usage logging, rate limits, and a visible stop switch before enabling paid API calls.
- No API provider has been selected and no API key, billing account, or service access has been tested.

## 4. Telegram and Instagram

Telegram's official Bot API is available without an API usage fee for normal bot messaging, subject to rate limits; hosting and model calls remain separate costs. See [Telegram Bots FAQ](https://core.telegram.org/bots/faq) and [Telegram APIs](https://core.telegram.org/).

Meta's Instagram API documentation describes professional-account workflows for publishing, insights, and account management, with permissions and account-type requirements. The Facebook Login route requires a linked Facebook Page; publishing is subject to supported content types and permissions. This is not proof that NEXUS has access. See [Meta's Instagram API documentation](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api/).

For NEXUS:
- Begin with public-source research and manually reviewed drafts.
- Treat API insights and publishing as blocked until account permissions, app configuration, token lifecycle, and relevant policy requirements are verified.
- Do not automate browser login, scrape private data, or store long-lived tokens in the repository.
- Do not publish automatically just because an API endpoint exists; publishing still requires an approved policy and explicit account-level authorization.

## 5. First-release operating profile

| Area | Initial default | Cost/security note |
|---|---|---|
| Application | Modular monolith | Lowest operational complexity; split only when evidence requires it |
| Database | PostgreSQL or equivalent, chosen after architecture review | Private data; backup/restore must be tested |
| Interface | Telegram bot plus small responsive web interface | Telegram Bot API has no ordinary messaging fee; server/model costs remain |
| Models | Provider adapter; text-first | Usage-based; enforce budgets and log usage |
| Voice | Defer realtime voice; prototype transcription path separately | Audio usage can become a variable recurring cost |
| Product facts | Private spreadsheet/file initially, after format comparison | No real gallery data in public GitHub |
| Instagram | Research + draft workflow first | API access and permissions remain unverified |
| Backups | Encrypted backup outside the VPS | Additional storage cost; restore test is mandatory |
| Monitoring | Basic health check, error logs, spend/usage alerts | Keep logs free of tokens and unnecessary personal data |

## 6. Cost estimation method before any paid activation

Use a simple monthly formula rather than guessing:
- Hosting = selected server + storage/backups + domain/networking + applicable tax.
- Text model = input tokens × input rate + output tokens × output rate, by model.
- Voice = actual audio minutes/tokens × the selected service's published rate, plus any model/tool charges.
- Optional services = explicitly listed subscription/API costs.
- Add a usage cap and alert before production use.

Before choosing a provider, run a small synthetic-data benchmark and record: task count, input/output usage, average latency, error rate, and estimated monthly total at low/expected/high usage. No real customer data is needed for this benchmark.

## 7. Risks and unresolved checks

- Iran access/payment compatibility and service terms are not verified; a low list price is not useful if lawful, reliable access or payment is unavailable.
- Exact VPS configuration is not selected. Published prices may exclude VAT, IPv4, backup storage, and other add-ons.
- No deployment, API call, voice session, Instagram permission check, or payment test was performed for this note.
- The user's current VPS/domain situation should be inventoried before recommending a new purchase; avoid duplicate spending.
- Retention, deletion, backup encryption, recovery, and operational alerts need to be defined before storing real gallery records.
- Provider selection, payment, server purchase, public exposure, and production publishing are material decisions and must not proceed without the relevant accepted ADR and user authorization.

## 8. Next discovery steps

1. Inventory any already-paid server/domain and determine whether it can safely be reused; do not expose credentials.
2. Define low/expected/high monthly usage scenarios using synthetic task counts.
3. Compare one or two feasible model routes on quality, cost, access, privacy, and exportability.
4. Draft the hosting/security/backup ADR and model-provider ADR with options and rollback plans.
5. Define first-release acceptance criteria before writing application code.
