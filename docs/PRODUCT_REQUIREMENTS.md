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

### 2.2 First three-month success criteria

The user selected six outcomes to evaluate during the first three months:
- Better task management and follow-up on overdue tasks.
- Time saved and fewer repetitive manual tasks.
- Increased sales and improved conversion of followers into customers.
- Growth in real, relevant Instagram followers.
- Better decisions supported by reports and analysis.
- Reliable memory and better recognition of the user's preferences.

These are user-selected outcome areas, not yet quantified targets or claims of guaranteed results. During discovery, define practical baselines and measures where data is available (for example, overdue-task follow-through, estimated time saved, sales/conversion measures, relevant follower growth, usefulness of reports, and memory corrections). Record unavailable data as unavailable rather than inventing a baseline. The user has not specified additional criteria.

### 2.3 Proactive follow-up and notifications

User-confirmed preferences:
- NEXUS should be proactive and active: suggest a daily plan and follow up on tasks regularly, including reminders for overdue tasks.
- Telegram should be used for notifications and reminders; the web app should provide detailed views and controls for managing tasks, reports, and follow-up.
- Outside the defined quiet hours, notifications may be sent for **urgent and important** matters. Routine notifications should respect the quiet-hours setting.
- The user selected custom quiet hours but has not yet specified the actual start and end times. Do not assume a schedule; ask the user to define it before enabling notifications.

Proactive behavior must remain bounded by the existing permission rules. Suggestions and reminders may be proactive, but external messages, financial commitments, security changes, and other protected actions still require the previously specified authorization. Notification escalation details remain open for discovery.

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

## 4. Current business context, data sources, and integrations

- Current first business priority: Galeri Tala Yousefi.
- Current known management tool: Instagram.
- No other inventory, accounting, customer relationship, or sales system has been confirmed.
- **User decision on business data sources:** first investigate the available options and recommend a simple, low-cost starting method for sales, expenses, and inventory. Do not assume an existing system is available. Compare manual entry and spreadsheet-based approaches before recommending an integration; confirm any existing tool with the user before treating it as a source of truth.
- **Instagram access goal:** the long-term goal is automated publishing within rules explicitly approved in advance by the user. This is a target, not current authorization to publish or a claim that the required API/integration is available. First assess feasible access methods, platform restrictions, security, auditability, and cost. Publishing must remain limited to the approved scope; new, ambiguous, or out-of-scope cases require renewed approval.
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

- Minimum viable management workflow and measurable baselines/targets for the first three months.
- Exact custom quiet hours and any notification escalation rules.
- Memory categories, retention periods, and detailed deletion behavior.
- Secure authentication details, account recovery, and account-linking behavior.
- Feasibility, permissions, and technical approach for Instagram data access and rule-bounded automatic publishing.
- Recommended simple initial source and workflow for sales, expenses, and inventory data.
- Exact currency-denominated setup and monthly budget ceilings.
- Technical choices and corresponding ADRs.

## 10. User-confirmed decisions to date

1. NEXUS is a general-purpose personal assistant; the gallery is the current priority, not its exclusive scope.
2. The first-version outcomes include sales/conversion, real follower growth, reduced repetitive work, and improved management visibility, prioritized by impact and cost.
3. First operational workflow: general-purpose management assistant for tasks, reminders, reports, decision support, and follow-up; exact minimum scope remains open.
4. First three-month success areas: task management/follow-up, time saved/reduced repetitive work, sales/conversion, real relevant follower growth, report-supported decisions, and reliable preference-aware memory. Quantified targets remain open.
5. Proactive follow-up: active daily planning and regular task follow-up; urgent and important notifications may be sent outside quiet hours. The user wants custom quiet hours, but has not supplied the times yet.
6. Telegram is for notifications, while the web app is for detail and management.
7. Initial access: Telegram and web app; text and voice from version one; mobile and desktop.
8. Voice: both voice messages and live conversations; wake-word activation is a future capability; Persian and colloquial Persian are the initial language priority.
9. Web-app sign-in: both Telegram-based sign-in and email/password.
10. Access: initially single-user, with architecture that can support employee accounts and differentiated permissions later.
11. Budget: setup as free as practical, only unavoidable initial costs; low and controlled recurring costs for essentials; balance cost, quality, security, and extensibility.
12. Memory: automatically save useful non-sensitive information; ask when sensitivity is uncertain; require explicit permission for sensitive information; always allow the user to inspect, correct, and request deletion through both Telegram and web app.
13. Routine low-risk work: automatic execution with a report.
14. Publishing and external communication: future/automatic execution only within rules explicitly approved in advance; feasibility and permissions must be assessed before implementation.
15. Financial actions or commitments: explicit confirmation every time.
16. Important deletion and security changes: confirmation required.
17. Data sources for sales, expenses, and inventory: investigate options and recommend a simple low-cost starting method before selecting or integrating a system.
