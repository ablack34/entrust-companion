# Entrust Prospect Prioritization Companion — Prototype Playbook

> **Engagement type:** Rapid prototype (4–6 week sprint)
> **Stack:** React + Fluent UI 2 · Copilot Studio agent · Microsoft Graph Connectors · SharePoint/OneDrive · M365 (Outlook handoff)
> **Audience:** Entrust C-suite + Sales leadership · Microsoft account team

---

## Table of Contents

1. [Prototype Scoping — Build / Mock / Defer](#1-prototype-scoping)
2. [UX Flows & Wireframe Specifications](#2-ux-flows)
3. [AI Prompt Engineering — Copilot Studio Agent](#3-ai-prompt-engineering)
4. [Data Architecture](#4-data-architecture)
5. [Stakeholder Narrative](#5-stakeholder-narrative)
6. [Sprint Plan](#6-sprint-plan)

---

## 1. Prototype Scoping

### Build / Mock / Defer Matrix

| Capability | Disposition | Rationale |
|---|---|---|
| **Import accounts (CSV upload → SharePoint list)** | ✅ BUILD | Core entry point; real Power Automate flow is achievable in days |
| **ICP / Persona configuration UI** | ✅ BUILD (simplified) | Build 3–5 preset personas with editable weight sliders; full CRUD is overkill for demo |
| **AI-ranked recommendation list with explanations** | ✅ BUILD | This is the hero moment — Copilot Studio agent returns ranked results with reasoning |
| **Confidence scores per recommendation** | ✅ BUILD | Agent returns numeric score + natural language rationale; UI renders both |
| **Account hierarchy disambiguation flags** | 🟡 MOCK | Agent returns "needs review" flags; backend uses heuristic rules on mock data |
| **Salesforce Graph Connector (read-only index)** | ✅ BUILD | Salesforce connector is GA; index Contacts, Accounts, Opportunities, Leads |
| **SharePoint staging layer (Goodfit list)** | ✅ BUILD | Upload CSV → SharePoint list via Power Automate; agent reads via Graph |
| **Outreach pack export (CSV + messaging blocks)** | ✅ BUILD | Agent generates draft messaging; UI bundles into downloadable pack |
| **Outlook handoff (deep link / Copilot in Outlook prompt)** | 🟡 MOCK+LINK | Deep-link to Outlook compose with pre-filled subject/body; reference "Copilot in Outlook" for polish |
| **CRM write-back** | 🔴 DEFER | Explicitly roadmap — mention in narrative but do not build |
| **Fabric analytics / dashboards** | 🔴 DEFER | Future enrichment layer — position in architecture slide only |
| **Teams / M365 Copilot chat front door** | 🔴 DEFER | Nice-to-have; standalone web app is the primary surface |
| **Real Goodfit API integration** | 🔴 DEFER | Use exported CSV for prototype; API integration is a v2 item |
| **Multi-region / multi-segment rules engine** | 🟡 MOCK | Hardcode EMEA + 2 segments; show the UI for more |

### What "Mock" means in this prototype

- **Mock data**: Realistic synthetic Salesforce records (50–100 accounts, 200–400 contacts) loaded into a SharePoint list and/or indexed via the Salesforce sandbox connector.
- **Mock logic**: Where the agent can't yet do full scoring (e.g., hierarchy disambiguation), return hard-coded "needs review" flags with plausible explanations.
- **Mock integration**: Outlook handoff uses `mailto:` deep links with pre-filled content; the narrative says "Copilot in Outlook takes it from here."

---

## 2. UX Flows

### 2.1 Information Architecture (5 screens)

```
┌─────────────────────────────────────────────────────────┐
│  1. DASHBOARD          — Landing / run history          │
│  2. IMPORT             — Upload Goodfit CSV             │
│  3. CONFIGURE          — ICP / Persona / Segment rules  │
│  4. RECOMMENDATIONS    — AI-ranked results + explain    │
│  5. OUTREACH PACK      — Approve → Export → Handoff     │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Screen-by-Screen Wireframe Specs

---

#### Screen 1: Dashboard

**Purpose:** Give the seller a "home base" showing recent runs, summary stats, and a big CTA to start a new prospecting pass.

```
┌──────────────────────────────────────────────────────────────┐
│  [Entrust Logo]   Prospect Prioritization Companion    [👤]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Welcome back, Sarah                                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  40,127      │  │  2,340       │  │  156          │       │
│  │  Accounts    │  │  Prioritized │  │  Outreach     │       │
│  │  Imported    │  │  This Month  │  │  Packs Sent   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
│  [ ＋ Start New Prospecting Pass ]  (Primary CTA)            │
│                                                              │
│  Recent Runs                                                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Run         │ Date       │ Accounts │ Status         │  │
│  │  EMEA-PKI    │ 2026-02-15 │ 1,200    │ ✅ Complete    │  │
│  │  NA-Certs    │ 2026-02-12 │ 3,400    │ ✅ Complete    │  │
│  │  APAC-IAM    │ 2026-02-10 │ 800      │ 🔄 In Review  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Fluent UI components:** `Card`, `DataGrid`, `Button` (primary), `Persona` (avatar), `CounterBadge`

**Interaction:**
- "Start New Prospecting Pass" → navigates to Screen 2 (Import)
- Click any run row → navigates to Screen 4 (Recommendations) for that run

---

#### Screen 2: Import Accounts

**Purpose:** Upload a Goodfit CSV (or select an existing SharePoint list). Low friction — get the data in and move on.

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back    Import Accounts                             [👤]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1 of 3: Import                                         │
│  ═══════════○─────────○                                      │
│  Import    Configure   Review                                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │   ┌──────────────────────────────┐                     │  │
│  │   │  📄  Drop CSV here           │                     │  │
│  │   │      or click to browse      │                     │  │
│  │   └──────────────────────────────┘                     │  │
│  │                                                        │  │
│  │   — OR —                                               │  │
│  │                                                        │  │
│  │   Select existing list:                                │  │
│  │   [ EMEA Target Accounts Q1 2026      ▾ ]             │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Preview (first 5 rows):                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Company        │ Domain          │ Industry │ Size   │    │
│  │ Acme Corp      │ acme.com        │ Finance  │ 5000   │    │
│  │ Beta Holdings  │ betahold.co.uk  │ Health   │ 12000  │    │
│  │ ...            │                 │          │        │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  Detected: 1,247 accounts · 14 columns                      │
│                                                              │
│                              [ Cancel ]  [ Next → ]          │
└──────────────────────────────────────────────────────────────┘
```

**Fluent UI components:** `ProgressBar` (stepper), `FilePicker` (drag-drop), `Dropdown`, `DataGrid` (preview), `Button`

**Interaction:**
- CSV upload triggers client-side parse (Papa Parse) → shows preview
- "Next" uploads to SharePoint list via Graph API and navigates to Screen 3

---

#### Screen 3: Configure ICP / Persona Rules

**Purpose:** Let the seller select target persona types and weight the scoring criteria. This addresses the "persona-to-account mapping is manual" pain point by letting the AI do the heavy lifting with human-guided rules.

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back    Configure Persona Rules                     [👤]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 2 of 3: Configure                                      │
│  ═══════════════════════○                                    │
│  Import    Configure   Review                                │
│                                                              │
│  Product Line:  [ PKI / Certificate Solutions    ▾ ]         │
│  Region:        [ EMEA                           ▾ ]         │
│  Segment:       [ Enterprise (1000+ employees)   ▾ ]         │
│                                                              │
│  ── Target Personas ──────────────────────────────────────   │
│                                                              │
│  ☑ CISO / VP Security           Priority: [██████████] 95   │
│  ☑ IT Director / Infrastructure  Priority: [████████──] 80   │
│  ☑ Identity & Access Mgmt Lead   Priority: [███████───] 70   │
│  ☐ Procurement / Vendor Mgmt     Priority: [████──────] 40   │
│  ☐ CTO / CIO                     Priority: [██████────] 60   │
│                                                              │
│  ── Scoring Weights ──────────────────────────────────────   │
│                                                              │
│  Persona fit          [████████████████──]  80%              │
│  Company size match   [████████████──────]  60%              │
│  Industry relevance   [██████████████────]  70%              │
│  Existing CRM signals [████████──────────]  40%              │
│  Web / intent signals [██████────────────]  30%              │
│                                                              │
│  💡 Tip: Higher weights mean the AI prioritizes that         │
│     factor more when ranking your accounts.                  │
│                                                              │
│                     [ ← Back ]  [ Run Prioritization → ]     │
└──────────────────────────────────────────────────────────────┘
```

**Fluent UI components:** `Dropdown`, `Checkbox`, `Slider`, `Tooltip`, `Button`

**Interaction:**
- Persona checkboxes + sliders are the "human input" that feeds the agent prompt
- "Run Prioritization" triggers the Copilot Studio agent call (show a processing state with `Spinner` + progress messages: "Analyzing 1,247 accounts…", "Matching personas…", "Scoring & ranking…")
- On completion → navigate to Screen 4

**Prototype shortcut:** Preset 3 product lines with hard-coded persona defaults. Sliders are real but weights are passed as prompt parameters, not a complex ML model.

---

#### Screen 4: AI-Ranked Recommendations

**Purpose:** The hero screen. Show ranked accounts/contacts with AI-generated explanations and confidence scores. This is where leadership sees the value — transparent, explainable prioritization.

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back    Recommendations — EMEA PKI Q1           [👤]     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 3 of 3: Review                                         │
│  ═══════════════════════════════════                         │
│  Import    Configure   Review                                │
│                                                              │
│  1,247 accounts analyzed · 342 high-priority · 89 contacts  │
│  matched                                                     │
│                                                              │
│  Filter: [All ▾] [High Priority ▾] [Needs Review ▾]   🔍   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ #1  ACME CORP                          Score: 94/100  │  │
│  │     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │                                                        │  │
│  │  👤 Best contact: Jane Smith, CISO                     │  │
│  │     jane.smith@acme.com · LinkedIn                     │  │
│  │                                                        │  │
│  │  🤖 AI Reasoning:                                      │  │
│  │  "Acme Corp is a strong persona fit (CISO present in   │  │
│  │   CRM). Company size (5,200 employees) matches your    │  │
│  │   enterprise segment. They have an expiring Symantec   │  │
│  │   certificate contract (Q2 2026) based on web signals. │  │
│  │   No existing Entrust relationship in Salesforce."     │  │
│  │                                                        │  │
│  │  Factors:                                              │  │
│  │  Persona fit ████████████████████ 95%                  │  │
│  │  Size match  ████████████████──── 85%                  │  │
│  │  Industry    ██████████████████── 90%                  │  │
│  │  CRM signals ████████──────────── 40%  (no history)   │  │
│  │                                                        │  │
│  │  [ ✓ Approve ]  [ ✏ Edit ]  [ ✗ Dismiss ]            │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ #2  BETA HOLDINGS                      Score: 87/100  │  │
│  │     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │                                                        │  │
│  │  👤 Best contact: Mark Lee, IT Director                │  │
│  │                                                        │  │
│  │  🤖 AI Reasoning:                                      │  │
│  │  "Beta Holdings recently consolidated IT operations    │  │
│  │   (press signal). IT Director is the primary buyer     │  │
│  │   persona for PKI solutions in mid-market. ⚠ Note:    │  │
│  │   Two Salesforce account records found — 'Beta         │  │
│  │   Holdings Ltd' and 'Beta Holdings Group'. Recommend   │  │
│  │   confirming the correct entity."                      │  │
│  │                                                        │  │
│  │  ⚠ NEEDS REVIEW — Possible duplicate CRM records      │  │
│  │                                                        │  │
│  │  [ ✓ Approve ]  [ ✏ Edit ]  [ ✗ Dismiss ]            │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ #3  GAMMA FINANCIAL ...                                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Showing 1–10 of 342         [ ← Prev ]  [ Next → ]         │
│                                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  Selected: 8 accounts · 12 contacts                          │
│  [ Generate Outreach Pack → ]                                │
└──────────────────────────────────────────────────────────────┘
```

**Fluent UI components:** `Card`, `Badge` (score), `ProgressBar` (factor bars), `MessageBar` (needs review warning), `Button`, `Tag`, `Pagination`

**Key UX decisions:**
- **Explainability is front and center** — every recommendation has a natural-language reasoning block. This directly addresses the "no explainability" pain point.
- **Confidence score** is a composite number (0–100) with a breakdown bar chart per factor — makes it tangible for execs.
- **"Needs Review" flag** for ambiguous CRM data (duplicate accounts, missing contacts) — human-in-the-loop, not black-box.
- **Approve / Edit / Dismiss** per card — seller stays in control.

---

#### Screen 5: Outreach Pack & Handoff

**Purpose:** Bundle approved selections into an actionable outreach pack with draft messaging, then hand off to Outlook.

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back    Outreach Pack — EMEA PKI Q1               [👤]   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  8 accounts · 12 contacts approved                           │
│                                                              │
│  ── Draft Messaging ──────────────────────────────────────   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  To: Jane Smith, CISO — Acme Corp                      │  │
│  │                                                        │  │
│  │  Subject: Securing Acme's Certificate Infrastructure   │  │
│  │           — A Conversation Worth Having                │  │
│  │                                                        │  │
│  │  Hi Jane,                                              │  │
│  │                                                        │  │
│  │  With Acme's scale (5,200+ employees) and your         │  │
│  │  upcoming certificate renewal cycle, I wanted to       │  │
│  │  share how Entrust is helping enterprise CISOs         │  │
│  │  simplify PKI management while strengthening their     │  │
│  │  zero-trust posture...                                 │  │
│  │                                                        │  │
│  │  [Full draft — 120 words]                              │  │
│  │                                                        │  │
│  │  ✏ Edit draft    📋 Copy    📧 Open in Outlook        │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  To: Mark Lee, IT Director — Beta Holdings             │  │
│  │  Subject: ...                                          │  │
│  │  ...                                                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ── Export Options ───────────────────────────────────────   │
│                                                              │
│  [ 📥 Download CSV  ]  Full account + contact list          │
│  [ 📥 Download Pack ]  CSV + messaging + AI summaries       │
│  [ 📧 Open All in Outlook ]  (opens drafts for each)       │
│                                                              │
│  💡 Tip: "Open in Outlook" creates a draft with this        │
│     messaging pre-filled. Use Copilot in Outlook to         │
│     further personalize before sending.                      │
└──────────────────────────────────────────────────────────────┘
```

**Fluent UI components:** `Card`, `Textarea` (editable draft), `Button`, `Toolbar`, `Tooltip`

**Outlook handoff mechanics (prototype):**
- "Open in Outlook" uses a `mailto:` link with pre-filled `subject` and `body` (URL-encoded)
- For demo: show Copilot in Outlook being invoked to "refine this draft with the prospect's recent news" — this is the M365 handoff story
- Future: Copilot Studio action could create Outlook draft via Graph API

---

### 2.3 UX Principles for This Prototype

| Principle | Implementation |
|---|---|
| **Progressive disclosure** | Don't show everything at once. Dashboard → Import → Configure → Results → Outreach is a natural funnel. |
| **AI transparency** | Every AI output has a "why" attached. No black boxes. |
| **Human-in-the-loop** | Seller approves/edits/dismisses every recommendation. AI suggests, human decides. |
| **Escape velocity** | The UX should move sellers from "looking at a list" to "sending outreach" in under 15 minutes. |
| **Exec-friendly visuals** | Confidence scores, factor breakdowns, and summary stats are designed to be screenshot-able for leadership decks. |

---

## 3. AI Prompt Engineering — Copilot Studio Agent

### 3.1 Agent Identity & System Prompt

```
SYSTEM PROMPT — Entrust Prospect Prioritization Agent

You are the Entrust Prospect Prioritization Companion, an AI assistant that helps
Entrust sales teams prioritize target accounts and identify the best buyer contacts
for outreach.

YOUR ROLE:
- You analyze a target account list (from Goodfit) against Salesforce CRM data
  and persona/ICP criteria provided by the seller.
- You score and rank accounts by fit, explain your reasoning transparently, and
  flag accounts that need human review.
- You draft personalized outreach messaging for approved contacts.

CORE BEHAVIORS:
1. ALWAYS explain your reasoning. Every recommendation must include a natural-
   language explanation of WHY this account/contact ranks where it does.
2. ALWAYS provide a confidence score (0–100) with a breakdown by factor.
3. When CRM data is ambiguous (duplicate accounts, missing contacts, unclear
   hierarchies), flag it as "Needs Review" with a specific description of the
   ambiguity. Do NOT guess — surface the uncertainty.
4. When drafting outreach messaging, be professional, concise, and personalized
   to the contact's role and the account's situation. reference specific data
   points (company size, industry, signals) to make the message feel informed,
   not generic.
5. NEVER fabricate data. If information is not available in the provided context,
   say so explicitly.
6. Respect data boundaries — you only use data from the indexed Salesforce objects
   and the Goodfit target account list staged in SharePoint. Do not reference
   external sources you don't have access to.

OUTPUT FORMAT (for prioritization):
For each recommended account, return a JSON object:
{
  "rank": <integer>,
  "account_name": "<string>",
  "domain": "<string>",
  "overall_score": <0-100>,
  "factors": {
    "persona_fit": <0-100>,
    "company_size_match": <0-100>,
    "industry_relevance": <0-100>,
    "crm_signals": <0-100>,
    "web_intent_signals": <0-100>
  },
  "best_contact": {
    "name": "<string>",
    "title": "<string>",
    "email": "<string or null>",
    "source": "salesforce | goodfit | inferred"
  },
  "reasoning": "<2-4 sentence natural language explanation>",
  "needs_review": <boolean>,
  "review_reason": "<string or null — e.g., 'Duplicate Salesforce records found'>"
}
```

### 3.2 Prompt Templates by Task

#### Task A: Account Prioritization & Scoring

```
USER PROMPT TEMPLATE — Prioritization Pass

Context:
- Product line: {{product_line}} (e.g., "PKI / Certificate Solutions")
- Region: {{region}}
- Segment: {{segment}} (e.g., "Enterprise — 1000+ employees")
- Target personas (with priority weights):
  {{#each personas}}
  - {{this.title}} — Priority: {{this.weight}}/100
  {{/each}}
- Scoring weights:
  - Persona fit: {{weights.persona_fit}}%
  - Company size match: {{weights.company_size}}%
  - Industry relevance: {{weights.industry}}%
  - Existing CRM signals: {{weights.crm_signals}}%
  - Web/intent signals: {{weights.web_signals}}%

Target account list (from Goodfit, staged in SharePoint):
{{account_list_reference}}
— Contains: company name, domain, industry, employee count, HQ location, Goodfit
  score, and any enrichment fields.

Salesforce CRM data (indexed via Microsoft Graph):
— Available objects: Accounts, Contacts, Leads, Opportunities
— Search by: account name, domain, contact title

Instructions:
1. For each account in the target list, search Salesforce (via Graph) for matching
   Account records. Match on domain first, then company name.
2. If multiple Salesforce accounts match (potential duplicates/hierarchy issues),
   flag as "needs_review" and describe the ambiguity.
3. For matched accounts, find Contacts whose titles align with the target personas.
   Rank contacts by persona priority weight.
4. Score each account using the weighted factors above. The overall_score is a
   weighted average.
5. Sort accounts by overall_score descending.
6. Return the top {{result_count}} accounts in the JSON format specified in your
   instructions.

Important:
- If no Salesforce match is found, still include the account but set crm_signals
  to 0 and note "No CRM history" in the reasoning.
- If a contact's email is not in Salesforce, set email to null and note the gap.
- Be specific in reasoning — reference actual data points, not vague statements.
```

#### Task B: Outreach Message Drafting

```
USER PROMPT TEMPLATE — Draft Outreach Message

Context:
- Sender: {{seller_name}}, {{seller_title}} at Entrust
- Product line: {{product_line}}
- Recipient: {{contact_name}}, {{contact_title}} at {{account_name}}
- Account details:
  - Industry: {{industry}}
  - Employee count: {{employee_count}}
  - Key signals: {{signals_summary}}
  - AI prioritization reasoning: {{reasoning_from_scoring}}

Instructions:
Draft a concise, professional outreach email (100–150 words) that:
1. Opens with a specific, relevant observation about the recipient's company or
   role — NOT a generic greeting.
2. Connects that observation to a specific Entrust capability in {{product_line}}.
3. Includes a clear, low-friction call to action (e.g., "Would a 20-minute call
   next week make sense?").
4. Maintains a tone that is confident but not pushy — consultative, peer-to-peer.

Constraints:
- Do NOT use phrases like "I hope this email finds you well" or "I'm reaching out
  because...". Start with the value hook.
- Do NOT make claims about the recipient's company that aren't grounded in the
  provided data.
- Keep the subject line under 8 words and make it specific to the account.

Return format:
{
  "subject": "<string>",
  "body": "<string — plain text with line breaks>",
  "personalization_notes": "<what data points were used to personalize>"
}
```

#### Task C: Account Hierarchy Disambiguation

```
USER PROMPT TEMPLATE — CRM Disambiguation

I found multiple Salesforce account records that may match "{{account_name}}"
(domain: {{domain}}):

{{#each sf_matches}}
- SF Account ID: {{this.id}}
  Name: "{{this.name}}"
  Parent Account: {{this.parent_name || "None"}}
  Contacts: {{this.contact_count}}
  Open Opportunities: {{this.opp_count}}
  Last Activity: {{this.last_activity_date}}
{{/each}}

Please analyze these records and:
1. Determine if they represent the same entity, a parent/subsidiary relationship,
   or genuinely different companies.
2. Recommend which record to use as the "primary" for outreach targeting and why.
3. Flag any data quality concerns (e.g., one record has no contacts, stale data).
4. If you cannot determine the relationship with confidence, say so and recommend
   the seller verify manually.
```

### 3.3 Prompt Engineering Notes

| Technique | Where Used | Why |
|---|---|---|
| **Structured JSON output** | All tasks | Enables the React UI to reliably parse and render responses |
| **Chain-of-thought via "reasoning" field** | Task A | Forces the model to articulate its logic — improves accuracy AND provides user-facing explanations |
| **Grounding constraints** | All tasks | "NEVER fabricate data" + "reference actual data points" prevents hallucination in customer-facing output |
| **Escalation to human** | Tasks A & C | "If uncertain, flag for review" keeps the prototype credible and enterprise-safe |
| **Persona-aware tone** | Task B | Outreach drafts use role-specific hooks instead of generic templates |

---

## 4. Data Architecture

### 4.1 Data Flow Diagram (text)

```
                    ┌─────────────┐
                    │  Goodfit     │
                    │  CSV Export  │
                    └──────┬──────┘
                           │ upload
                           ▼
                    ┌─────────────┐        ┌──────────────┐
                    │  SharePoint  │        │  Salesforce   │
                    │  List        │        │  (Sandbox)    │
                    │  (staging)   │        │              │
                    └──────┬──────┘        └──────┬───────┘
                           │ Graph                 │ Salesforce
                           │ Connector             │ Graph Connector
                           ▼                       ▼
                    ┌──────────────────────────────────┐
                    │    Microsoft Graph               │
                    │    (Unified Search Index)         │
                    │                                  │
                    │  - SharePoint list items (Goodfit)│
                    │  - SF Accounts, Contacts,        │
                    │    Leads, Opportunities           │
                    └──────────────┬───────────────────┘
                                   │ query / retrieval
                                   ▼
                    ┌──────────────────────────────────┐
                    │    Copilot Studio Agent           │
                    │    (orchestration + reasoning)    │
                    │                                  │
                    │  Knowledge: Graph index           │
                    │  Tools: SharePoint read,          │
                    │         Graph search              │
                    └──────────────┬───────────────────┘
                                   │ API response
                                   ▼
                    ┌──────────────────────────────────┐
                    │    React / Fluent UI Web App      │
                    │    (standalone experience)        │
                    │                                  │
                    │  → Renders ranked results         │
                    │  → Export outreach packs          │
                    │  → Handoff to Outlook             │
                    └──────────────────────────────────┘
```

### 4.2 SharePoint Staging Layer — Schema

**List name:** `Goodfit Target Accounts`

| Column | Type | Source | Notes |
|---|---|---|---|
| `CompanyName` | Single line of text | Goodfit CSV | Primary display field |
| `Domain` | Single line of text | Goodfit CSV | Used for SF matching |
| `Industry` | Choice | Goodfit CSV | Enumerated values |
| `EmployeeCount` | Number | Goodfit CSV | For segment filtering |
| `HQCountry` | Single line of text | Goodfit CSV | For region filtering |
| `HQCity` | Single line of text | Goodfit CSV | |
| `GoodfitScore` | Number | Goodfit CSV | 0–100 original score |
| `AnnualRevenue` | Currency | Goodfit CSV | Optional enrichment |
| `ProductFitTags` | Multi-line text | Goodfit CSV | Comma-separated product line tags |
| `EnrichmentNotes` | Multi-line text | Goodfit CSV | Any additional Goodfit signals |
| `RunId` | Single line of text | App-generated | Groups items by prospecting run |
| `ImportDate` | Date | App-generated | Timestamp |

**Why SharePoint list (not just a file)?**
- Queryable via Graph API (`/sites/{site-id}/lists/{list-id}/items`)
- Each item gets an individual Graph node → the agent can query/filter without loading the entire CSV
- Supports list views, filtering, and sorting natively
- Graph Connector indexes list items for Copilot/search scenarios

### 4.3 Salesforce Graph Connector — Objects to Index

| Salesforce Object | Graph External Item Type | Key Fields Indexed | ACL |
|---|---|---|---|
| **Account** | `salesforceAccount` | Name, Domain, Industry, EmployeeCount, ParentAccountId, BillingCountry, AnnualRevenue, OwnerId | Item-level (respects SF sharing rules) |
| **Contact** | `salesforceContact` | FirstName, LastName, Title, Email, Phone, AccountId, Department | Item-level |
| **Lead** | `salesforceLead` | FirstName, LastName, Title, Company, Email, Status, LeadSource | Item-level |
| **Opportunity** | `salesforceOpportunity` | Name, StageName, CloseDate, Amount, AccountId, OwnerId | Item-level |

**Connector setup (prototype):**
1. Use the pre-built Salesforce connector in M365 admin center
2. Connect to Entrust's Salesforce sandbox (not production) for prototype
3. Index the four object types above
4. Crawl schedule: daily (prototype) — real-time is not needed for demo
5. Verify item-level ACLs pass through correctly

### 4.4 Agent Retrieval Strategy

The Copilot Studio agent uses **two retrieval paths** at query time:

**Path 1: SharePoint list (Goodfit data)**
- Agent has a **Knowledge source** pointed at the SharePoint site/list
- For a prioritization run, the agent filters by `RunId` to get the relevant batch
- Returns structured fields (company name, domain, industry, employee count, etc.)

**Path 2: Microsoft Graph search (Salesforce data)**
- Agent uses a **Graph Search tool/action** to query indexed Salesforce objects
- For each Goodfit account, the agent searches Graph for matching Salesforce Accounts (by domain, then by name)
- If a match is found, retrieves associated Contacts, Opportunities, and Leads
- This is a **read-only retrieval** — no writes to Salesforce

**Merge logic (in the agent's reasoning):**
- The agent receives both data sets in its context window
- Scoring is done by the LLM based on the prompt template (Section 3.2, Task A)
- The agent outputs structured JSON that the React app parses and renders 

**Prototype simplification:**
- For the demo, pre-load 50–100 accounts into the SharePoint list and ensure matching Salesforce sandbox records exist
- This avoids edge cases with unmatched data and keeps the demo clean
- The agent will still do real retrieval and scoring — it's not hard-coded responses

---

## 5. Stakeholder Narrative

### The 60-Second Pitch

> **"Today, when Entrust receives a 40,000-account target list from Goodfit, sellers spend days — sometimes weeks — manually cross-referencing CRM data, guessing at buyer personas, and writing generic outreach. The Prospect Prioritization Companion changes that.**
>
> **It's an AI decision layer — not another tool swap. Upload your target list, tell the AI who you're looking for and what matters, and in minutes you get a ranked, explained, human-reviewable set of recommendations with draft outreach ready to send.**
>
> **Every recommendation comes with a 'why' — leadership can see the reasoning, sellers can trust it, and the jump from 'prioritized list' to 'personalized email in Outlook' takes minutes instead of days.**
>
> **It runs on Microsoft's enterprise stack — Copilot Studio, Graph Connectors, M365 — so it respects your Salesforce permissions, doesn't write back to CRM, and fits inside the security posture your team already manages."**

### Executive Talking Points

| Point | Detail |
|---|---|
| **From 40k to next-best-action** | The AI turns an undifferentiated list into a prioritized, explained, actionable outreach plan |
| **Transparent AI** | Every recommendation has a confidence score and natural-language reasoning — no black boxes |
| **Human-in-the-loop** | Sellers approve, edit, or dismiss — AI suggests, humans decide |
| **Enterprise-safe** | Read-only Salesforce indexing via Graph Connectors; item-level ACLs; no CRM write-back in v1 |
| **M365-native handoff** | Approved outreach flows directly to Outlook with draft messaging; Copilot in Outlook adds the finishing touch |
| **Time to value** | This is a prototype in weeks, not a platform build in months — proving value fast |

### Demo Script (3-minute walkthrough)

1. **Open Dashboard** (10 sec): "Here's Sarah's home base. She can see her recent prospecting runs and stats."
2. **Import** (20 sec): "Sarah uploads this week's Goodfit list — 1,200 EMEA accounts for PKI solutions. The system parses it instantly."
3. **Configure** (30 sec): "She selects her target personas — CISO is highest priority, IT Director second. She adjusts scoring weights to emphasize persona fit and industry relevance."
4. **Run** (20 sec): "She hits 'Run Prioritization.' The AI agent analyzes all 1,200 accounts against Salesforce data and her criteria." *(show the processing animation)*
5. **Recommendations** (60 sec): "Here are the results. Acme Corp scores 94 out of 100. The AI explains *why*: CISO is in the CRM, company size matches, and there's a certificate contract expiring in Q2. Beta Holdings scores 87, but notice the yellow flag — the AI found two Salesforce records and is asking Sarah to confirm which one is correct. *That's the AI surfacing the problem, not hiding it.*"
6. **Outreach Pack** (40 sec): "Sarah approves 8 accounts. The AI generates personalized draft emails — look, each one references specific data about the account. She clicks 'Open in Outlook' and the draft is ready to send. Copilot in Outlook can refine it further."
7. **Close** (20 sec): "From 1,200 accounts to 8 personalized outreach emails with full reasoning — in about 15 minutes. That's the value."

---

## 6. Sprint Plan

### Week 1: Foundation
- [ ] Set up React + Fluent UI 2 project scaffold
- [ ] Create SharePoint site + Goodfit list schema
- [ ] Configure Salesforce sandbox connector in M365 admin
- [ ] Build Screen 1 (Dashboard) and Screen 2 (Import) UI
- [ ] Implement CSV parsing + SharePoint upload via Graph API

### Week 2: Agent Core
- [ ] Create Copilot Studio agent with system prompt
- [ ] Configure SharePoint knowledge source
- [ ] Configure Graph Search tool/action for Salesforce objects
- [ ] Build Screen 3 (Configure ICP/Persona) UI
- [ ] Test agent with prioritization prompt template + mock data

### Week 3: Hero Experience
- [ ] Build Screen 4 (Recommendations) UI — cards, scores, explanations
- [ ] Wire up agent API → React rendering pipeline
- [ ] Implement approve/dismiss/edit interactions
- [ ] Build "Needs Review" flag display + CRM disambiguation flow
- [ ] Load test with 50–100 accounts through full pipeline

### Week 4: Outreach & Polish
- [ ] Build Screen 5 (Outreach Pack) UI
- [ ] Implement outreach message generation via agent
- [ ] Build Outlook handoff (mailto deep links)
- [ ] CSV export functionality
- [ ] End-to-end testing + demo prep

### Week 5 (buffer): Demo Readiness
- [ ] Demo script rehearsal
- [ ] Edge case handling (empty results, errors, loading states)
- [ ] Visual polish (animations, responsive layout)
- [ ] Prepare synthetic demo data set that tells a compelling story
- [ ] Record backup demo video

---

## Appendix: Technology Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Frontend framework** | React 18 + Fluent UI React v9 | Microsoft standard; fast prototyping with Fluent's component library |
| **State management** | React Context + useReducer | Simple enough for prototype; no Redux overhead |
| **API layer** | Microsoft Graph JS SDK + Copilot Studio Direct Line | Standard SDKs; Graph for SharePoint/search, Direct Line for agent chat |
| **CSV parsing** | Papa Parse (client-side) | Zero-dependency, handles large CSVs in browser |
| **Hosting** | Azure Static Web Apps | Free tier; CI/CD from GitHub; custom domain support |
| **Auth** | MSAL.js (Microsoft Entra ID) | SSO with M365; required for Graph API calls |
| **Outlook integration** | `mailto:` URI scheme (v1); Graph `sendMail` API (v2) | mailto is instant for prototype; Graph API for production |
