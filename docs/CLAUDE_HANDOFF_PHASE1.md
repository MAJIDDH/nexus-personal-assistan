# Claude Handoff — Finish NEXUS Phase 1 Discovery

**Status:** Ready to use as a task brief; not proof Claude has read or executed it.
**Repository:** https://github.com/MAJIDDH/nexus-personal-assistan
**Branch:** main
**Date prepared:** 2026-10-20

## Goal
Finish a focused review of Phase 1 discovery artifacts and return NEXUS to the user with a clear, evidence-based implementation-readiness assessment. Do not begin application implementation in this task.

## Read first
1. PROJECT_MANIFEST.md
2. docs/DEVELOPMENT_WORKFLOW.md
3. docs/AI_COLLABORATION.md
4. docs/PRODUCT_REQUIREMENTS.md
5. docs/PHASE_01_DISCOVERY.md
6. docs/DISCOVERY_OPTIONS_01.md
7. docs/DISCOVERY_OPTIONS_02_COSTS.md
8. docs/CONTENT_OPERATIONS_WORKFLOW.md
9. docs/ARCHITECTURE.md
10. docs/SECURITY.md
11. docs/RISK_REGISTER.md
12. docs/adr/README.md

## Tasks
1. Inspect the latest repository tree and relevant files. Do not rely on pasted or stale file contents.
2. Check internal links, duplicated or contradictory requirements, decision-register numbering, phase status, and whether recommendations are clearly distinguished from user-confirmed decisions.
3. Review the content-operations workflow against the project constitution and security baseline. Identify missing approval boundaries, evidence fields, deletion/retention risks, and testable acceptance criteria.
4. Review the cost note critically. Verify current public price claims against official sources where possible; label access/payment availability as unverified if not tested. Do not treat a public price as an estimate of the user's final bill.
5. Propose—not accept—ADRs for the minimum material choices still needed before implementation. At minimum consider hosting/deployment and backups; persistence/memory and deletion; model-provider adapter and budget controls; authentication/account recovery; and agent/tool authorization. Each proposed ADR must include options, trade-offs, security/privacy, costs, rollback, and what user approval is required.
6. Recommend the smallest viable first release and a staged order of implementation with observable acceptance criteria and test cases.
7. Do not commit code, buy or provision a server, connect accounts, use real customer/gallery data, add credentials, publish content, or accept material decisions. Documentation-only corrections may be made if clearly low-risk and reversible.
8. Do not mark Phase 1 complete if material user decisions remain open. Instead produce a concise readiness report with blockers and the smallest list of decisions that genuinely require the user.

## Constraints
- No secrets, tokens, environment files, customer records, or private business data in the public repository.
- No paid commitment or financial action.
- No production deployment or external account actions.
- Do not claim a test ran unless the command and result are available.
- Avoid concurrent edits to files currently being changed by another collaborator.
- If repository permissions do not allow inspection or writing, report the exact limitation and stop; do not invent results.

## Required handoff report
- Current branch and commit inspected
- Files inspected/changed
- Internal-link and consistency checks actually run, with results
- Official sources checked and date
- Material ADRs proposed and the user decisions each requires
- Smallest viable first-release recommendation
- Acceptance criteria and tests
- Open risks, unverified assumptions, and blockers
- Exact next action for the user/ChatGPT