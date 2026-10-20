# NEXUS Changelog

This changelog records meaningful project milestones and verified deliveries. It does not replace the project constitution, ADRs, or phase records.

## Unreleased — Discovery and AI collaboration

- Added the NEXUS project constitution and authority hierarchy.
- Added a persistent AI collaboration workflow for ChatGPT/Claude roles, safe handoffs, verification, and repository security.
- Linked product requirements, Phase 1 discovery, and AI collaboration instructions from the README.
- Updated the README to reflect that Phase 1 discovery is in progress rather than presenting Phase 0 as the current phase.
- Normalized the product decision register to remove duplicate and out-of-order numbering, and explicitly separated a provisional ranking recommendation from user-confirmed decisions.
- Added an initial research note comparing documented Instagram API routes, product-reference formats, and minimal sales/expense/inventory recordkeeping. The note explicitly records what has not been tested or enabled.
- Added a preliminary cost and deployment baseline for hosting, model/voice usage, Telegram, and Instagram API access; no provider or paid service was selected.
- Added a proposed content-operations workflow covering source evidence, idea lifecycle, approvals, publication verification, and outcome measurement.
- Added a bounded Claude handoff brief to review Phase 1 readiness without starting implementation or making paid/external changes.
- Added the development workflow for scope, implementation, verification, and reporting.
- Added Phase 0 scope, open decisions, and exit criteria.
- Added the ADR workflow and initial risk register.
- Linked governance documents from the README.
- Added Proposed ADR-0001 to record the adapted governance workflow.
- Checked local Markdown links across the governance documents; no missing local targets were found.
- Reviewed the current tracked repository tree for public-repository safety; no real environment files or application source are present in the current NEXUS tree.
- Recorded Phase 0 review evidence while keeping user acceptance explicitly pending.

### Verification and limitations

- Confirmed that the new documents exist in the GitHub repository.
- No application code, dependencies, runtime, or infrastructure were added.
- Phase 0 governance artifacts remain available for review; Phase 1 discovery is now the active work phase. No application implementation or direct ChatGPT–Claude integration is claimed.

- Recorded user acceptance of ADRs 0001–0004 for a local synthetic-data prototype only; no server purchase, paid API use, real business data, external integration, or production deployment is authorized.
- Concrete application framework/database/container stack remains a separate material decision and must be accepted before framework-specific implementation.


## 2026-10-20 — Local prototype scaffold (feature branch)

- Recorded user acceptance of ADR 0005 for Node.js LTS, TypeScript, NestJS, PostgreSQL, and local Docker Compose, limited to synthetic-data development.
- Added an initial NestJS API scaffold with environment validation, a minimal health route, a deterministic mock model provider, and a default-deny tool policy.
- Added unit and e2e test definitions, a local-only PostgreSQL Compose service, and setup/safety documentation.
- Work is on `feat/local-prototype-foundation`; it has not been merged into `main`.
- Tests/build have not been executed in this environment; implementation is not yet verified as runnable.
