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

### 2.4 Automatic reports and alerts

**User-confirmed reporting preferences:**
- NEXUS should support reports about tasks and commitments, a daily summary, a weekly report, business performance, decision-making and opportunities, and personal planning.
- **Delivery cadence:** send reports or alerts only when there is an important matter that merits the user's attention, rather than sending routine daily or weekly reports on a fixed schedule.
- The trigger and importance threshold for a report/alert remain to be defined. NEXUS should avoid noisy notifications and must not fabricate missing business data; it should state when data is unavailable.

### 2.3 Proactive follow-up and notifications

User-confirmed preferences:
- NEXUS should be proactive and active: suggest a daily plan and follow up on tasks regularly, including reminders for overdue tasks.
- **User-confirmed follow-up policy:** prioritize tasks using a combination of importance, urgency, deadline, and the consequences of not completing them. Adapt reminder frequency and spacing to importance and urgency, avoiding repetitive or disruptive notifications. The user should be able to pause or change a task's follow-up.
- Telegram should be used for notifications and reminders; the web app should provide detailed views and controls for managing tasks, reports, and follow-up.
- **User-confirmed daily planning cadence:** send the next day's plan the night before, followed by a short review in the morning.
- Outside the defined quiet hours, notifications may be sent for **urgent and important** matters. Routine notifications should respect the quiet-hours setting.
- **Quiet hours are 01:00–07:00 in the `Asia/Tehran` time zone.** Routine notifications should be suppressed during this interval; urgent and important notifications are permitted. The implementation must use the IANA time zone `Asia/Tehran` rather than a fixed UTC offset so that time-zone rules are applied correctly.

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
- **User-confirmed account-linking decision:** both sign-in methods should lead to one shared NEXUS account, not separate accounts with divergent memory or permissions.
- Linking must verify control of both identities; knowing or entering an email address or Telegram identifier alone is not sufficient to gain access to the existing account.
- Initially, access is for the user alone.
- The design should allow employees or other users with differentiated permissions to be added later without requiring a fundamental redesign.

Security design must still assess account recovery, secure session handling, protection of credentials, safe linking and unlinking of Telegram and email identities, and recovery if one linked method becomes unavailable. Multi-user support is a future extensibility requirement, not a requirement to enable employee accounts in the first release.

## 4. Current business context, data sources, and integrations

- Current first business priority: Galeri Tala Yousefi.
- Current known management tool: Instagram.
- **User-confirmed Instagram setup:** `golddyousefi` is a professional Instagram account (Business or Creator) connected to a Facebook Page. The exact account type and current permissions/API availability should still be verified during implementation planning rather than assumed.
- No other inventory, accounting, customer relationship, or sales system has been confirmed.
- **User-confirmed current state:** the gallery does not currently have a defined system for recording sales, expenses, or inventory.
- **User-confirmed preliminary decision:** compare available approaches and recommend the lowest-cost practical method for recording sales, expenses, and inventory before committing to a specific tool. No method or integration has been selected yet.
- **User decision on business data sources:** first investigate the available options and recommend a simple, low-cost starting method for sales, expenses, and inventory. Do not assume an existing system is available. Compare manual entry and spreadsheet-based approaches before recommending an integration; confirm any existing tool with the user before treating it as a source of truth.
- **Instagram access goal:** the long-term goal is automated publishing within rules explicitly approved in advance by the user. This is a target, not current authorization to publish or a claim that the required API/integration is available. First assess feasible access methods, platform restrictions, security, auditability, and cost. Publishing must remain limited to the approved scope; new, ambiguous, or out-of-scope cases require renewed approval.
- The system must distinguish verified data from missing, estimated, or unavailable data; it must not fabricate Instagram metrics or business records.
- Avoid hard-coupling the core assistant to Instagram or to the gallery domain.

## 5. Autonomy and permission boundaries

### 5.1 Routine reversible work
The assistant may automatically perform ordinary, low-risk, reversible tasks and report the result. Examples include analysis of available data, drafting plans and reports, reminders, and organizing information. Actual automatic execution remains bounded by explicit permissions, available integrations, and auditability.

**User-confirmed autonomy refinement:** prefer broader independence for low-risk, reversible work within explicitly defined rules, with a report of the outcome. Routine reporting and analysis may run automatically. Creating or changing business records (including sales, expenses, and inventory) must follow clearly defined rules and validation checks; if a rule is missing, the data is ambiguous, or a material discrepancy is detected, NEXUS must pause the write/change and ask the user. This refinement does not weaken the separate confirmation requirements for financial actions or commitments, important deletion, security/access-control changes, or other high-consequence actions.

**User-confirmed autonomy preference:** NEXUS should be proactive and relatively autonomous within rules explicitly approved in advance. It should initiate follow-up and execute permitted tasks without asking for repeated approval for each routine step. It must ask when a case is ambiguous, outside the approved rules, materially different from the expected situation, or carries significant consequences. This preference does not grant unlimited access or override the separate requirements for financial actions, important deletion, security changes, or other protected actions.

### 5.2 External communications and publishing
The assistant may send messages or publish content automatically only within rules explicitly approved in advance by the user. Actions outside the approved scope, ambiguous cases, and materially changed circumstances require renewed approval. The system should retain a record of the applicable rule and the action taken. The user's preference for proactive execution means the assistant should carry out in-scope tasks rather than merely recommend them, but only after the relevant rules, integrations, and permissions have been explicitly established.

### 5.3 Financial actions and commitments
Explicit user confirmation is required before every financial action or financial commitment, including purchases, payments, orders, or accepting obligations. Analysis, calculations, recommendations, and draft transactions may be prepared without committing the user.

### 5.4 Deletion and security
Important deletion, access-control changes, and security-sensitive changes require explicit user confirmation before execution. Prefer reversible changes and preserve an audit trail where appropriate.

### 5.5 Truthful execution reporting
NEXUS must distinguish recommendations, drafts, attempted actions, successful actions, and failed or unverified actions. It must never claim that an action succeeded without evidence.

## 6. Memory, privacy, and improvement

### 6.1 Useful information and automatic capture
NEXUS should automatically identify and save useful, non-sensitive information across personal and professional domains, such as preferences, goals, projects, decisions, and recurring workflows. If it is uncertain whether information is sensitive or appropriate to retain, it must ask rather than save it automatically.

**User-confirmed memory categories:** preferences and habits; projects and goals; decisions and their rationale; tasks and commitments; business information; and summaries of important conversations. These categories guide useful memory capture but do not override the consent requirement for sensitive information.

The memory system should distinguish confirmed facts, user preferences, hypotheses, and outdated information, and should retain enough context to avoid presenting guesses as verified facts.

### 6.2 Sensitive information and consent
NEXUS must ask for explicit user permission before saving any sensitive information. It must not silently infer permission from the fact that information was shared in conversation.

### 6.3 User control across channels
The user must be able to inspect, correct, and request deletion of memory at any time through both the web app and Telegram. These interfaces should manage the same shared memory store. The implementation must make clear what can be removed immediately and whether copies or audit records are retained for a legitimate security reason.

### 6.4 Learning and improvement
NEXUS should improve through explicit user feedback, measured outcomes, and reviewable changes to workflows or preferences. It should not silently treat guesses as facts, change high-impact rules without authorization, or learn sensitive details without appropriate controls.

### 6.5 Retention and review preferences
User-confirmed preferences:
- If NEXUS is unsure whether older information should continue to be retained, it should ask the user rather than silently deciding to keep or discard it.
- Conversation and activity history should be retained long-term when useful for following projects and prior decisions, with the user able to request deletion.
- These preferences do not authorize indefinite retention of sensitive information; sensitive information still requires explicit consent, and the implementation must provide clear retention and deletion controls.
- Exact retention periods, memory categories, backups, and technical deletion behavior remain open for design and security review.

## 7. Budget and technology priorities

User-confirmed preferences:
- Initial setup should use the **lowest practical cost**, even if some early workflows require manual steps.
- Do not set a fixed monthly spending ceiling yet. First compare feasible options and estimate the actual total cost, including hosting, AI model usage, speech services, storage, and any essential integrations.
- Prefer free tiers and simple/manual alternatives when they meet requirements, but do not compromise essential security or reliability merely to avoid every cost.
- Technology choices should balance cost, quality, security, and extensibility rather than optimizing only one dimension.

The next budget decision should be based on a transparent comparison of options and realistic monthly usage estimates. Do not treat an unspecified budget as permission for uncontrolled spending; paid commitments still require explicit confirmation. Prefer replaceable providers and make recurring costs visible.

## 8. Delivery approach

- Build incrementally, prioritizing measurable impact against implementation and running cost.
- Keep the shared personal-assistant core separate from business-specific capabilities.
- Do not begin application implementation until product discovery is sufficiently complete and material technical/security/autonomy decisions have accepted ADRs.
- Do not claim integrations or capabilities are operational until implemented and tested.

## 9. Open questions

- Minimum viable management workflow and measurable baselines/targets for the first three months.
- Detailed reminder escalation rules, including thresholds for task importance/urgency, while respecting the confirmed `Asia/Tehran` quiet hours of 01:00–07:00.
- Memory retention periods, backups, and detailed deletion behavior. The user has approved the initial categories: preferences and habits; projects and goals; decisions and rationale; tasks and commitments; business information; and summaries of important conversations.
- Secure authentication details, account recovery, safe linking/unlinking of Telegram and email identities, and recovery if a linked method becomes unavailable.
- Feasibility, permissions, and technical approach for Instagram data access and rule-bounded automatic publishing.
- Recommended simple initial source and workflow for sales, expenses, and inventory data.
- Comparative estimate of setup and monthly costs; a fixed monthly cap is intentionally deferred until options are reviewed.
- Technical choices and corresponding ADRs.

## 10. User-confirmed decisions to date

1. NEXUS is a general-purpose personal assistant; the gallery is the current priority, not its exclusive scope.
2. The first-version outcomes include sales/conversion, real follower growth, reduced repetitive work, and improved management visibility, prioritized by impact and cost.
3. First operational workflow: general-purpose management assistant for tasks, reminders, reports, decision support, and follow-up; exact minimum scope remains open.
4. First three-month success areas: task management/follow-up, time saved/reduced repetitive work, sales/conversion, real relevant follower growth, report-supported decisions, and reliable preference-aware memory. Quantified targets remain open.
5. Proactive follow-up: prioritize tasks by combined importance, urgency, deadline, and consequences of non-completion;
22. Automatic reporting: support task/commitment, daily summary, weekly, business performance, decision/opportunity, and personal-planning reports; notify or deliver a report only when an important matter arises. The importance threshold and triggers remain open. adapt follow-up spacing to importance and urgency; active daily planning and regular task follow-up; urgent and important notifications may be sent outside quiet hours. Quiet hours are 01:00–07:00, `Asia/Tehran`. Reminder frequency and spacing should adapt to importance, deadline, and urgency without repeated nuisance notifications; the user can pause or change follow-up. Send the next day's plan at night and a short review in the morning.
6. Telegram is for notifications, while the web app is for detail and management.
7. Initial access: Telegram and web app; text and voice from version one; mobile and desktop.
8. Voice: both voice messages and live conversations; wake-word activation is a future capability; Persian and colloquial Persian are the initial language priority.
9. Web-app sign-in: both Telegram-based sign-in and email/password, linked to one shared account after verifying ownership of both methods.
10. Access: initially single-user, with architecture that can support employee accounts and differentiated permissions later.
11. Budget: use the lowest practical setup cost, accepting manual steps when appropriate; do not set a fixed monthly cap until options and realistic costs are compared. Keep recurring costs visible and controlled.
12. Memory categories approved by the user: preferences and habits; projects and goals; decisions and rationale; tasks and commitments; business information; and summaries of important conversations. Automatically save useful non-sensitive information; ask when sensitivity is uncertain; require explicit permission for sensitive information; allow inspection, correction, and deletion requests through both Telegram and web app. When uncertain about retention of older information, ask the user. Retain useful conversation/activity history long-term for project and decision follow-up, with user-requested deletion available.
13. Routine low-risk work: broader independent execution of reversible tasks within explicit rules, with a report; reporting and analysis may be automatic, while creating or changing records requires defined rules and validation. Ambiguity or material discrepancies must pause the change and trigger clarification.
14. Autonomy level: proactive execution and follow-up within rules approved in advance; ask for confirmation in ambiguous, out-of-scope, materially changed, or high-consequence cases. Financial actions, security changes, and important actions still require explicit confirmation.
15. Publishing and external communication: future/automatic execution only within rules explicitly approved in advance; feasibility and permissions must be assessed before implementation.
16. Financial actions or commitments: explicit confirmation every time.
17. Important deletion and security changes: confirmation required.
18. Data sources for sales, expenses, and inventory: investigate options and recommend a simple low-cost starting method before selecting or integrating a system.
20. Current gallery recordkeeping: no defined system currently exists for sales, expenses, or inventory; recommend a simple low-cost starting method before selecting integrations.
21. Preliminary method decision: compare feasible options and recommend the lowest-cost practical recordkeeping method for gallery sales, expenses, and inventory; defer tool selection until that comparison is presented.
19. Instagram setup: the user confirms that `golddyousefi` is a professional account connected to a Facebook Page; current permissions and API access remain to be verified.
