# Product Requirements — Discovery Draft

**Status:** Discovery in progress  
**Scope:** NEXUS personal assistant, with Galeri Tala Yousefi as the current execution priority  
**Authority:** The project constitution in `PROJECT_MANIFEST.md` remains normative. This document records user-stated product needs; unresolved details remain open questions.

## 1. Product vision

NEXUS is the user's general-purpose personal assistant, not a product limited to managing Galeri Tala Yousefi. It should support personal and professional work across multiple domains, while the gallery is the first operational priority because it is the current business focus.

NEXUS should support memory, planning, analysis, learning from user feedback and outcomes, and continuous improvement. These are product capabilities, not claims of human consciousness or unlimited autonomous learning.

## 2. Initial outcomes and prioritization

The first version should address all of the following, prioritizing by expected impact, implementation and operating cost, risk, and ability to measure outcomes:
- Improve business results, including sales and conversion of followers into customers.
- Grow the Instagram presence with real, relevant followers.
- Reduce repetitive manual work.
- Improve managerial visibility and decision-making.

Prioritization must not turn the gallery into the only supported domain or prevent the user from using general assistant capabilities.

## 3. Access channels and interaction

User-selected requirements:
- Telegram and a dedicated web app.
- Text and voice interaction from the first version.
- Use on both mobile devices and computers.
- Telegram and web app should connect to one shared core for tasks, permissions, and memory rather than becoming inconsistent independent systems.

Technical feasibility, voice implementation, provider selection, and cost remain to be assessed during discovery and ADR review.

## 4. Current business context and integrations

- Current first business priority: Galeri Tala Yousefi.
- Current known management tool: Instagram.
- No other inventory, accounting, customer relationship, or sales system has been confirmed.
- The system must distinguish verified data from missing, estimated, or unavailable data; it must not fabricate Instagram metrics or business records.
- Avoid hard-coupling the core assistant to Instagram or to the gallery domain.

## 5. Autonomy and permission boundaries

### 5.1 Routine reversible work
The assistant may automatically perform ordinary, low-risk, reversible tasks and report the result. Examples include analysis of available data, drafting plans and reports, reminders, and organizing information. Actual automatic execution remains bounded by explicit permissions, available integrations, and auditability.

### 5.2 External communications and publishing
The assistant may send messages or publish content automatically only within rules explicitly approved in advance by the user. Actions outside the approved scope, ambiguous cases, and materially changed circumstances require renewed approval. The system should retain a record of the applicable rule and the action taken.

### 5.3 Financial actions and commitments
Explicit user confirmation is required before every financial action or financial commitment, including purchases, payments, orders, or accepting obligations. Analysis, calculations, recommendations, and draft transactions may be prepared without committing the user.

### 5.4 Deletion and security
Important deletion, access-control changes, and security-sensitive changes require explicit user confirmation before execution. Prefer reversible changes and preserve an audit trail where appropriate.

### 5.5 Truthful execution reporting
NEXUS must distinguish recommendations, drafts, attempted actions, successful actions, and failed or unverified actions. It must never claim that an action succeeded without evidence.

## 6. Learning and improvement

NEXUS should be designed to improve through explicit user feedback, measured outcomes, and reviewable changes to workflows or preferences. It should not silently treat guesses as facts, change high-impact rules without authorization, or learn sensitive details without appropriate controls. The memory model, user review/correction, retention, and deletion mechanisms are still open discovery questions.

## 7. Delivery approach

- Build incrementally, prioritizing measurable impact against implementation and running cost.
- Keep the shared personal-assistant core separate from business-specific capabilities.
- Do not begin application implementation until product discovery is sufficiently complete and material technical/security/autonomy decisions have accepted ADRs.
- Do not claim integrations or capabilities are operational until implemented and tested.

## 8. Open questions

- Memory categories, persistence, review/correction, retention, and deletion.
- Voice input/output expectations and acceptable latency/cost.
- Initial user authentication and secure access from Telegram and web.
- Exact first measurable business workflow and success metrics.
- Integration feasibility and approved automation rules for Instagram.
- Budget ceiling and acceptable recurring infrastructure/model costs.
- Technical choices and corresponding ADRs.

## 9. User-confirmed decisions to date

1. NEXUS is a general-purpose personal assistant; the gallery is the current priority, not its exclusive scope.
2. The first-version outcomes include sales/conversion, real follower growth, reduced repetitive work, and improved management visibility, prioritized by impact and cost.
3. Initial access: Telegram and web app; text and voice from version one; mobile and desktop.
4. Routine low-risk work: automatic execution with a report.
5. Publishing and external communication: automatic only within rules explicitly approved in advance.
6. Financial actions or commitments: explicit confirmation every time.
7. Important deletion and security changes: confirmation required.
