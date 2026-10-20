# Phase 1 Research Note 01 — Instagram Access and Product Data Options

**Status:** Initial desk research; not an account-access test, legal opinion, or implementation decision.  
**Date checked:** 2026-10-20  
**Decision authority:** User requirements and `PROJECT_MANIFEST.md` remain controlling.

## 1. Executive summary

1. Meta documents two relevant routes for professional Instagram accounts: Instagram API with Facebook Login and Instagram API with Instagram Login. The latter's published documentation says it does not require a linked Facebook Page; the Facebook Login route does require the professional account to be linked to a Page. Since the gallery account is reported as professional and linked to a Page, the Facebook Login route is a candidate, but current app configuration, granted permissions, account eligibility, review requirements, and token access are not yet verified. [Meta Instagram API collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api?entity=request-23987686-3a63181c-e5c6-4890-96dd-e4d425bef5e0) [Meta Instagram Login documentation](https://www.postman.com/meta/workspace/instagram/documentation/23987686-9386f468-7714-490f-9bfc-9442db5c8f00)
2. Official publishing is technically documented for professional accounts, but this is not proof that NEXUS can publish now. It still needs an app, authentication, appropriate permissions, any required review/authorization, secure token handling, supported media hosting, error handling, and a verified end-to-end test. [Meta API documentation](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api?entity=request-23987686-3a63181c-e5c6-4890-96dd-e4d425bef5e0)
3. Google Sheets API standard usage is documented as no-additional-cost, with per-minute quotas. That does not establish whether Google services are reliably available from the user's operating environment, whether the chosen Google account is suitable, or whether API setup is simpler than local files. [Google Sheets API limits and pricing](https://developers.google.com/workspace/sheets/api/limits?authuser=302792331)
4. For the earliest prototype, a local, versioned CSV or Excel workbook is likely simpler and less integration-heavy than a live Sheets integration. This is a provisional recommendation, not a final file-format decision. Keep one canonical product list, clear ownership of updates, backups, and a “last verified” date for volatile facts.
5. Do not automate public publishing until permissions, approval rules, security, and the actual account workflow are verified. Research and draft creation can proceed separately.

## 2. Instagram API options

### Option A — Instagram API with Facebook Login
**Fit:** Plausible candidate because the user reports that `golddyousefi` is a professional account linked to a Facebook Page.

**Documented prerequisites/considerations:** Meta's documentation describes a Facebook app, user access token, professional account, linked Page, and relevant permissions. Content publishing and insights are among the documented capabilities, with limitations depending on endpoint and account setup. The exact permissions required must be checked against the specific intended operations and current Meta documentation.

**Unknown until tested:** Whether the correct Page/account is visible to the authenticated user; exact Business/Creator type; granted permissions; app mode/review status; any Page Publishing Authorization requirements; token lifecycle; whether publishing and insight endpoints work for this account.

### Option B — Instagram API with Instagram Login
**Fit:** Alternative route worth comparing, particularly if a Facebook Page dependency is undesirable. Meta's documentation states that this route does not require a Facebook Page linked to the professional Instagram account.

**Unknown until tested:** Supported operations and scopes needed for the selected workflow; app setup/review requirements; whether existing connected tools or permissions can be reused; operational and maintenance complexity.

### Recommended next action
Prepare a read-only access checklist first. With the user's authorization, verify account type, app ownership/configuration, linked Page, permissions and scopes, token handling, and read-only profile/media access. Do not publish a test post until the user explicitly approves the test content and all safeguards are ready. Never place access tokens in repository files, prompts, issues, or logs.

## 3. Product reference format options

| Option | Advantages | Risks / trade-offs | Current recommendation |
|---|---|---|---|
| CSV stored locally/in repository | Plain text; easy to parse; low integration complexity; can be versioned and reviewed | No built-in data validation or friendly editing; multiple files/branches can diverge; never store private/customer data in a public repo | Good technical prototype only with synthetic/sample data; not a public source for live prices or sensitive business records |
| Excel workbook stored privately | Familiar spreadsheet editing; supports multiple sheets and validation; can work offline | Binary diffs are difficult to review; needs secure storage and backups; simultaneous edits can conflict; integration needs file access | Strong candidate for a private human-edited product catalog if the user already uses Excel |
| Google Sheets | Convenient collaborative editing; API available; granular sharing can help workflow | Account/service availability and reliability in Iran must be tested; OAuth/service-account setup and permissions add complexity; data is held by an external provider | Consider only if availability and access are reliable and collaboration outweighs setup cost |

### Provisional design regardless of format
- One canonical record per product/SKU with stable ID, product name, category, verified specifications, price, currency/unit, status, source/evidence, last verified timestamp, and who/what updated it.
- Separate “unknown/not provided” from zero, and separate retail price from cost, inventory quantity, and discount.
- Changes to prices, discounts, or sensitive claims must not publish automatically; retain explicit approval for publication.
- Track product information separately from customer details and sales records. Do not commit real gallery data to this public repository.
- Backups, access controls, version history, and exportability must be assessed before selecting the authoritative store.

### Recommendation
For the first discovery/prototype stage, use synthetic examples in a version-controlled CSV schema to design and test parsing/validation only. Keep real product data in a private location chosen after confirming the user's current tools and secure storage. Do not decide Excel vs Google Sheets until actual access and workflow are checked.

## 4. Sales, expenses, and inventory recordkeeping

The requirements state that the gallery currently has no defined recordkeeping system. No starting balances, sales, expenses, or inventory quantities are known, so none should be invented.

**Lowest-complexity candidate:** a private workbook with separate tables for products, stock movements, sales, expenses, and a reconciliation summary. Define mandatory fields and validation before using real records. For a minimal initial workflow, enter records manually and review them daily; automate only after the data model and routine are proven.

**Minimum control rules:**
- Never silently overwrite or delete a recorded transaction; use a correction/reversal entry with timestamp and reason.
- Distinguish sale date from record-entry date, and distinguish gross sale, discount, cost, payment method, and outstanding balance.
- Stock changes should be represented as movements (opening balance, purchase/receipt, sale, return, adjustment) so the current quantity can be reconciled.
- A discrepancy, duplicate, missing required field, or unclear amount must pause automatic updates for review.
- Financial actions/commitments remain subject to explicit confirmation; recordkeeping does not authorize payments or purchases.

This is a proposed data-control approach, not a selected tool or an instruction to start entering real records.

## 5. Evidence and limitations

- The Meta API references above are first-party documentation published through Meta's official Postman workspace. They establish documented API routes/capabilities, not access to the user's account.
- The Google Sheets quotas page states standard API usage is currently available at no additional cost and describes rate limits. It does not establish reliable service availability in Iran or total cost of the complete NEXUS integration.
- No credentials were accessed; no account API call, permission check, publishing attempt, Google sign-in test, or real-data migration was performed.
- This note does not claim the APIs are connected, publishing is enabled, or a product-data format has been selected.

## 6. Next research tasks

1. Inspect existing repository security and architecture requirements and confirm they align with this note.
2. Create a non-secret Instagram access checklist and define read-only verification evidence.
3. Compare the practical cost and setup steps for the two official Instagram API routes, including app review, hosting, tokens, and maintenance.
4. Define a synthetic product CSV schema and validation rules without using real customer or business data.
5. Define workbook/table schemas for sales, expenses, stock movements, reconciliation, and audit/correction handling.
6. Estimate the total recurring cost of hosting, model usage, voice, storage, and integrations before proposing implementation.
