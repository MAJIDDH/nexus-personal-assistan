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

### 2.1 First operational workflow

The user selected a **general-purpose management assistant** as the first operational workflow. The initial experience should help organize tasks and reminders, prepare reports, support decisions, and coordinate follow-up across personal and professional domains. Gallery-specific workflows, including Instagram growth and content production, can be added as capabilities rather than defining the entire product.

The exact minimum viable workflow, measurable success criteria, and first integrations remain to be defined during discovery. Do not treat this selection as authorization to build an unbounded feature set; delivery should still be incremental and cost-aware.

### 2.2 Proactive follow-up and notifications

User-confirmed preferences:
- NEXUS should be proactive: remind the user about overdue tasks and suggest appropriate follow-up, rather than only responding to direct requests.
- Telegram should be used for notifications and reminders; the web app should provide detailed views and controls for managing tasks, reports, and follow-up.

Proactive behavior must remain bounded by the existing permission rules. Suggestions and reminders may be proactive, but external messages, financial commitments, security changes, and other protected actions still require the previously specified authorization. Notification frequency, quiet hours, and escalation rules remain open for discovery.

## 3. Access channels and interaction

User-selected requirements:
- Telegram and a dedicated web app.
- Text and voice interaction from the first version.
- Use on both mobile devices and computers.
- Telegram and web app should connect to one shared core for tasks, permissions, and memory rather than becoming inconsistent independent systems.

### 3.1 Voice requirements

User-confirmed voice preferences:
- Voice messages and live, bidirectional voice conversations are both desired.
- A wake word is a future capability, not a required first-version activation method. The architecture should avoid unnecessarily blocking its later addition.
- Persian and colloquial Persian speech are the initial language priority.

Implementation approach, speech recognition and synthesis providers, latency, reliability, privacy controls, and operating cost remain to be assessed during discovery and ADR review. These preferences do not imply that live voice or wake-word activation is already implemented.

### 3.2 Authentication and access

User-confirmed requirements:
- The web app should support both Telegram-based sign-in and email/password sign-in.
- Initially, access is for the user alone.
- The design should allow employees or other users with differentiated permissions to be added later without requiring a fundamental redesign.

Security design must still assess account recovery, secure session handling, protection of credentials, and how Telegram identities are linked to web-app accounts. Multi-user support is a future extensibility requirement, not a requirement to enable employee accounts in the first release.

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

## 6. Memory, privacy, and improvement

### 6.1 Useful information and automatic capture
NEXUS should automatically identify and save useful, non-sensitive information across personal and professional domains, such as preferences, goals, projects, decisions, and recurring workflows. If it is uncertain whether information is sensitive or appropriate to retain, it must ask rather than save it automatically.

The memory system should distinguish confirmed facts, user preferences, hypotheses, and outdated information, and should retain enough context to avoid presenting guesses as verified facts.

### 6.2 Sensitive information and consent
NEXUS must ask for explicit user permission before saving any sensitive information. It must not silently infer permission from the fact that information was shared in conversation.

### 6.3 User control across channels
The user must be able to inspect, correct, and request deletion of memory at any time through both the web app and Telegram. These interfaces should manage the same shared memory store. The implementation must make clear what can be removed immediately and whether copies or audit records are retained for a legitimate security reason.

### 6.4 Learning and improvement
NEXUS should improve through explicit user feedback, measured outcomes, and reviewable changes to workflows or preferences. It should not silently treat guesses as facts, change high-impact rules without authorization, or learn sensitive details without appropriate controls. Detailed retention periods, memory categories, and technical deletion behavior remain open decisions.

## 7. Budget and technology priorities

User-confirmed preferences:
- Initial setup should be free wherever practical, paying only unavoidable costs.
- Recurring costs for hosting, AI models, and essential services should be low and controlled.
- Technology choices should balance cost, quality, security, and extensibility rather than optimizing only one dimension.

Architecture and provider decisions should make recurring costs visible, avoid unnecessary paid dependencies, and permit replaceable providers where practical. The exact currency-denominated budget ceiling and acceptable service-level trade-offs remain open; no specific price cap has yet been set.

## 8. Delivery approach

- Build incrementally, prioritizing measurable impact against implementation and running cost.
- Keep the shared personal-assistant core separate from business-specific capabilities.
- Do not begin application implementation until product discovery is sufficiently complete and material technical/security/autonomy decisions have accepted ADRs.
- Do not claim integrations or capabilities are operational until implemented and tested.

## 9. Open questions

- Minimum viable management workflow and its success criteria.
- Notification frequency, quiet hours, and escalation rules.
- Memory categories, retention periods, and detailed deletion behavior.
- Secure authentication details, account recovery, and account-linking behavior.
- Integration feasibility and approved automation rules for Instagram.
- Exact currency-denominated setup and monthly budget ceilings.
- Technical choices and corresponding ADRs.

## 10. User-confirmed decisions to date

1. NEXUS is a general-purpose personal assistant; the gallery is the current priority, not its exclusive scope.
2. The first-version outcomes include sales/conversion, real follower growth, reduced repetitive work, and improved management visibility, prioritized by impact and cost.
3. First operational workflow: general-purpose management assistant for tasks, reminders, reports, decision support, and follow-up; exact minimum scope remains open.
4. NEXUS should proactively remind about overdue tasks and suggest follow-up; Telegram is for notifications, while the web app is for detail and management.
5. Initial access: Telegram and web app; text and voice from version one; mobile and desktop.
6. Voice: both voice messages and live conversations; wake-word activation is a future capability; Persian and colloquial Persian are the initial language priority.
7. Web-app sign-in: both Telegram-based sign-in and email/password.
8. Access: initially single-user, with architecture that can support employee accounts and differentiated permissions later.
9. Budget: setup as free as practical, only unavoidable initial costs; low and controlled recurring costs for essentials; balance cost, quality, security, and extensibility.
10. Memory: automatically save useful non-sensitive information; ask when sensitivity is uncertain; require explicit permission for sensitive information; always allow the user to inspect, correct, and request deletion through both Telegram and web app.
11. Routine low-risk work: automatic execution with a report.
12. Publishing and external communication: automatic only within rules explicitly approved in advance.
13. Financial actions or commitments: explicit confirmation every time.
14. Important deletion and security changes: confirmation required.
