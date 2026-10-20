# Phase 1 — Discovery and Recommended Defaults

**Status:** Local API scaffold in progress — ADRs 0001–0006 accepted within local synthetic-data scope  
**Purpose:** Continue discovery without burdening the user with repeated preference questions. Use existing confirmed requirements and reversible, low-risk defaults. Ask the user only when a decision is consequential, costly, security-sensitive, difficult to reverse, or genuinely blocks progress.

## 1. Working principles

- Treat `PROJECT_MANIFEST.md` and accepted governance ADRs as normative.
- Keep NEXUS general-purpose; Galeri Tala Yousefi is the first operational priority.
- Prefer the lowest practical total cost, simple workflows, replaceable providers, and manual fallbacks where sensible.
- Application implementation may start only after discovery is sufficient and all material ADRs, including the concrete stack, are accepted.
- Never claim a capability, integration, publication, measurement, or test is operational without evidence.
- Never assume private or unauthorized access. Public sources and authorized tools/APIs only, after access, cost, security, policy, and auditability checks.
- Separate confirmed facts, observations, interpretations, hypotheses, and unavailable information.

## 2. Recommended defaults (not user-confirmed unless explicitly marked)

### 2.1 Content-idea ranking

Until real outcome data supports adjustment, rank ideas with a balanced rubric:
1. Relevance to likely real customers and potential relevant-follower growth.
2. Plausible sales/conversion contribution.
3. Meaningful engagement potential (saves, shares, substantive comments), not just views.
4. Fit with the gallery's brand and audience.
5. Production effort, cost, and repeatability.
6. Quality and strength of evidence behind the idea.

Explain ranking reasons and confidence. Do not invent numeric success probabilities or treat competitor performance as proof of causation.

### 2.2 Idea lifecycle and publishing

Use explicit states: `observed`, `analyzed`, `proposed`, `selected`, `draft`, `approved`, `scheduled`, `published_verified`, and `failed_or_unverified`. Preserve source URLs and observation dates where available. A draft is not approval; scheduling is not publication; publication is not verified until there is evidence. Low-risk ideas may be drafted autonomously within approved rules. Do not publish until publishing authorization, official API access, account permissions, and safeguards have been assessed and enabled. Prices, discounts, sensitive claims, ambiguous content, and out-of-scope content require explicit approval as already specified in the requirements.

### 2.3 Evidence and measurement

For each competitor example, capture only observable facts: source URL, account/content identifier when available, observation date, visible format/topic/hook/CTA, and visible public metrics with their collection time. Mark unavailable/private/estimated values explicitly. Avoid claiming reach, retention, conversion, or audience demographics unless an authorized source actually provides them. Record the difference between snapshots and historical analytics.

### 2.4 Initial product-data reference

Do not select Excel, Google Sheets, or CSV before comparing cost, availability in Iran, security, editability, backup, and integration effort. In the interim, use a versioned, human-reviewable structured file as a prototype only if one is needed; do not make it the authoritative source until the comparison is complete. Missing or stale product facts block factual claims and publication, not unrelated ideation.

### 2.5 Gallery recordkeeping

Compare a simple spreadsheet/manual workflow against available low-cost alternatives for sales, expenses, and inventory. Recommend a minimal starting schema and validation rules before integration. Do not invent opening balances, sales, expenses, or stock. Business-record writes require defined rules and validation; ambiguous or materially inconsistent entries must pause for the user.

### 2.6 Reporting and baselines

Use currently accessible authorized data to establish baselines where possible. Track unavailable measures as unavailable rather than blocking useful work. Prioritize reports and notifications only when a matter warrants attention, in accordance with the user's quiet hours and task-follow-up preferences. Do not invent a fixed importance threshold without evidence; begin conservatively and make thresholds adjustable.

### 2.7 Account and provider choices

Before choosing paid services or binding the core to a provider, compare realistic setup and recurring costs, access in the user's environment, privacy/security, reliability, exportability, and lock-in. No paid subscription, purchase, financial commitment, or security-sensitive change without explicit confirmation.

## 3. Discovery work sequence

1. Audit current repository governance and identify inconsistencies, without exposing or copying secrets.
2. Consolidate product requirements and decisions so the decision list is uniquely numbered and distinguishes user-confirmed decisions from recommendations.
3. Create an evidence and content-idea workflow specification, including lifecycle states, source records, confidence, review, and audit events.
4. Compare public Instagram research options and authorized Instagram publishing/data access; document restrictions and cost. Do not treat access as enabled until verified.
5. Compare Excel, Google Sheets, and CSV for product-reference data, including Iran availability and integration/security.
6. Compare minimal manual/spreadsheet approaches for gallery sales, expenses, and inventory.
7. Produce a realistic cost comparison for hosting, models, voice, storage, integrations, and operations.
8. Propose material architecture/security/autonomy ADRs before implementation.
9. Define an incremental first release with acceptance criteria and tests; only then begin application implementation.

## 4. Initial research artifact

The first desk-research note is available in [Discovery Options 01](DISCOVERY_OPTIONS_01.md). It compares the two documented Instagram API routes, initial product-reference options, and a minimal gallery recordkeeping approach. It is explicitly preliminary: no account permissions were tested, no live integration was enabled, and no product-data format was selected.

The second note, [Discovery Options 02 — Costs](DISCOVERY_OPTIONS_02_COSTS.md), provides a preliminary hosting/model/voice/Telegram cost baseline and staged deployment recommendation. It is not a purchase authorization; provider access, billing, and account permissions remain untested.

The proposed [Content Operations Workflow](CONTENT_OPERATIONS_WORKFLOW.md) defines source evidence, idea states, approval boundaries, publication verification, and outcome measurement. It is a specification, not an implemented feature.

The local API scaffold has been started on a feature branch, but its build and tests remain unverified. ADR 0006 proposes the PostgreSQL access layer (`pg` plus versioned SQL migrations); this decision remains unaccepted and persistence implementation must not begin until the user explicitly accepts it or chooses another option.

## 5. Completion reporting

For each work item, report what was inspected or changed, evidence and links, limitations, and what remains. Do not present recommendations as confirmed decisions or drafts as published content.

## 4. ADR decisions and next work

The following bounded decisions have been accepted by the user on 2026-10-20 for a local prototype only:
- [ADR 0001 — Local-first modular monolith](adr/0001-local-first-modular-monolith.md)
- [ADR 0002 — Private data and memory boundaries](adr/0002-private-data-and-memory.md)
- [ADR 0003 — Replaceable model provider and spend controls](adr/0003-model-provider-and-spend-controls.md)
- [ADR 0004 — Agent tool permissions and approval gates](adr/0004-agent-tool-permissions-and-approvals.md)
- [ADR 0005 — Concrete local prototype stack](adr/0005-local-prototype-stack.md)

Next: verify the scaffold and PostgreSQL layer in an actual Node environment and record test/build results. ADR 0006 is accepted; database integration is implemented as a minimal pool boundary and SQL migration runner, but runtime behavior remains unverified. Keep paid API activation, server provisioning, persistent real business data, and external publishing disabled until their specific controls and authorizations are in place.

### Proposed local prototype acceptance criteria

- The repository contains a runnable application scaffold with documented prerequisites and commands.
- Configuration validation fails safely when required values are absent; no real credentials are committed.
- Health endpoint returns an explicit status without exposing secrets or private data.
- Core policy denies unlisted tools and high-impact actions without an exact valid approval.
- Tests run locally for configuration, health, policy allow/deny, and error handling; results are recorded honestly.
- The prototype uses synthetic fixtures and a deterministic mock model provider; no paid API calls or production data are used.
- Setup and test instructions are verified on the actual development environment before marking the prototype runnable.
