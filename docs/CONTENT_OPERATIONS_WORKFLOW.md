# Content Operations Workflow — Discovery Specification

**Status:** Proposed workflow specification; not implemented.
**Scope:** Research, evaluate, draft, review, and later measure Instagram content ideas for Galeri Tala Yousefi.

## 1. Goals and exclusions
Goals:
- Find relevant public examples from gold, jewelry, and adjacent accounts.
- Preserve sources and observation dates so findings can be checked later.
- Convert observations into original, brand-appropriate content ideas.
- Prioritize useful real follower growth and business outcomes without treating views as success by themselves.
- Keep factual product claims tied to a verified private product reference.
- Learn from actual results without inventing attribution.

Out of scope:
- Accessing private accounts or bypassing platform restrictions.
- Automatic publishing before permissions, safeguards, and authorization are verified.
- Inventing product prices, discounts, weights, purity, stock, or business metrics.
- Treating public competitor performance as proof that a particular hook caused the result.

## 2. Workflow states
Each idea has a stable ID and one explicit state:
1. observed — source/content found; no interpretation accepted yet.
2. analyzed — observable details and limitations captured.
3. proposed — original idea and rationale drafted.
4. selected — user or authorized policy selects it for production.
5. draft — copy/script/visual direction prepared.
6. approved — required human approval recorded for the exact version.
7. scheduled — a supported scheduler has accepted a publication job.
8. published_verified — publication evidence has been checked.
9. failed_or_unverified — action failed or success cannot be verified.

State changes must include timestamp, actor (user/system/tool), reason, and relevant artifact/version. A draft must never be labelled approved, scheduled, or published by inference.

## 3. Source observation record
Minimum fields:
- Stable source record ID
- Source URL and account/content identifier, if visible
- Date/time observed (timezone included)
- Content type (Reel, carousel, image, story, other)
- Visible topic, hook, opening visual, CTA, and format notes
- Public metrics actually visible, with value, metric name, and capture time
- Missing/private/unavailable fields explicitly marked as unavailable
- Evidence note or capture reference, subject to platform terms and privacy
- Analyst interpretation, clearly separated from observation
- Confidence: high / medium / low, with a short reason

Do not store private personal details about commenters or copy large amounts of copyrighted content. Record only what is needed to understand the format and public response.

## 4. Idea record
Minimum fields:
- Stable ID (never reuse an ID; sequential IDs may use the project code prefix)
- Working title and target audience/need
- Original premise, hook, structure, CTA, and production notes
- Linked source observation IDs (zero or more)
- Why it may work; what is observation vs hypothesis
- Brand-fit notes and risk flags
- Required product facts and their verified source/last-checked time
- Effort/cost estimate (qualitative until measured)
- Ranking rationale and confidence
- State, version, owner, and next action

The first ranking rubric is a provisional balanced recommendation: relevant-follower growth, plausible sales/conversion, meaningful engagement (saves/shares/substantive comments), brand fit, production effort/cost, and evidence quality. Do not fabricate success probabilities. Revisit weights only with observed outcomes.

## 5. Approval and publication controls
Require explicit approval for any public post, story, Reel, or externally visible message unless a precise pre-approved rule covers that exact category and all conditions are met; prices, discounts, weight, purity, product availability, financial or sensitive claims; and ambiguous, materially changed, out-of-scope, or low-confidence content.

Before publishing is ever enabled:
- Verify official API route, account eligibility, app configuration, scopes, token lifecycle, and supported media workflow.
- Store credentials only in a secret manager or protected runtime configuration; never in GitHub, prompts, logs, or this document.
- Enforce policy server-side, not only through model instructions.
- Use idempotency/reconciliation for uncertain outcomes and avoid duplicate publication.
- Record the exact approved version and verify the resulting post URL/ID and status.
- Provide a kill switch and a documented manual fallback.

A successful API request is not sufficient evidence of a visible post; publication must be checked through an authorized response or account view.

## 6. Outcome measurement
Capture available metrics at consistent windows (for example, 24 hours and 7 days) only when the authorized data source supports them. Store the metric source and capture time. Separate views/plays from reach and unique accounts; follows gained/lost from total follower count; engagement counts from engagement rate; and observed changes from causal claims.

Compare ideas cautiously. Account size, distribution, paid boosts, timing, and content format can confound results. Treat conclusions as hypotheses unless stronger evidence exists.

## 7. Audit events
Log minimally: idea created/edited and version changed; state transition and actor; source observation added; product fact verified or invalidated; approval granted/withdrawn including exact version; publish/schedule attempt and verified result; API/provider failure and retry; user correction/deletion request.

Do not log secrets or unnecessary message contents. Retention, export, deletion, and backup behavior must be designed before production use.

## 8. Acceptance criteria for a future implementation
- Every idea has a stable ID and valid lifecycle state.
- Every external observation retains its source URL and observation time, or a clear reason these are unavailable.
- Observations, interpretations, hypotheses, and metrics are distinguishable.
- Unknown product facts block factual public claims.
- Unapproved public actions are rejected server-side.
- Retries do not create duplicate publications.
- Failed/uncertain publication attempts are reported as unverified, not successful.
- User can inspect and correct idea records and approval state.
- Tests cover permission failures, stale approval, changed content after approval, missing product facts, API timeout, duplicate retry, and deletion/correction.