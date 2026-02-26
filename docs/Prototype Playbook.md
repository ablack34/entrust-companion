# Entrust Prospect Prioritization Companion — Prototype Playbook

> **Engagement type:** Rapid prototype (Usually 4–6 week sprint, condensed to 1 week)
> **Stack:** React 19 + Fluent UI React v9 · Papa Parse (client-side CSV) · GitHub Pages hosting · `mailto:` Outlook handoff
> **Audience:** Entrust C-suite + Sales leadership · Microsoft account team
> **Live demo:** [https://ablack34.github.io/entrust-companion](https://ablack34.github.io/entrust-companion)

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

| Capability | Planned | Actual | Notes |
|---|---|---|---|
| **Import accounts (CSV upload)** | ✅ BUILD | ✅ BUILT | Client-side CSV parsing via Papa Parse with drag-drop, file browse, and "Use Demo Data" fallback. No SharePoint upload — data stays in React state. |
| **ICP / Persona configuration UI** | ✅ BUILD (simplified) | ✅ BUILT | 5 preset personas with checkboxes + priority sliders. 3 product lines, 3 regions, 3 segments. Scoring weight sliders for 5 factors. |
| **AI-ranked recommendation list with explanations** | ✅ BUILD | 🟡 MOCK UI | Full recommendation card UI is built with AI reasoning blocks, but results are hardcoded mock data — no real Copilot Studio agent call. |
| **Confidence scores per recommendation** | ✅ BUILD | 🟡 MOCK UI | Score display (0–100) with per-factor breakdown bars rendered in UI; scores are mock data. |
| **Account hierarchy disambiguation flags** | 🟡 MOCK | ✅ BUILT (enhanced) | Rich contact data provenance system: source badges (Salesforce/Goodfit/Inferred/None), discovery confidence (Matched/Partial/Inferred/Not found), email source tracking, detailed discovery notes, and LinkedIn Sales Navigator search links for missing contacts. |
| **Salesforce Graph Connector (read-only index)** | ✅ BUILD | 🔴 NOT BUILT | No connector configured. Mock data simulates Salesforce CRM matches with realistic account/contact records. |
| **SharePoint staging layer (Goodfit list)** | ✅ BUILD | 🔴 NOT BUILT | Dropdown shows mock SharePoint list names for demo; no actual SharePoint integration. |
| **Outreach pack export (CSV + messaging blocks)** | ✅ BUILD | ✅ BUILT (partial) | CSV export generates real downloadable file. Draft messaging cards are pre-authored mock data (not agent-generated). Copy-to-clipboard works. |
| **Outlook handoff (deep link)** | 🟡 MOCK+LINK | ✅ BUILT | `mailto:` links with pre-filled subject/body. Per-draft and "Open All in Outlook" buttons. Disabled when email unavailable with warning. |
| **Contact data provenance** | *(not planned)* | ✅ BUILT | New capability not in original spec: tracks contact source, discovery method, email source, and provides LinkedIn Sales Navigator links for enrichment. |
| **Dashboard analytics** | *(basic planned)* | ✅ BUILT (enhanced) | Richer than spec: hero section, 4 stat cards, top prospects with SVG score rings, activity feed, quick actions grid, two-column layout, CSS animations. |
| **CRM write-back** | 🔴 DEFER | 🔴 DEFERRED | Mentioned in Outreach Pack screen as roadmap item. |
| **Fabric analytics / dashboards** | 🔴 DEFER | 🔴 DEFERRED | Not built. |
| **Teams / M365 Copilot chat front door** | 🔴 DEFER | 🔴 DEFERRED | Not built. |
| **Real Goodfit API integration** | 🔴 DEFER | 🔴 DEFERRED | CSV import is the entry point. |
| **Multi-region / multi-segment rules engine** | 🟡 MOCK | 🟡 MOCK | 3 regions (EMEA, North America, APAC) and 3 segments (Enterprise, Mid-Market, SMB) in dropdowns. |

### What "Mock" means in this prototype

- **Mock data**: 5 synthetic target accounts (Acme Corp, Beta Holdings, Gamma Financial Group, Nordic Secure Systems, Meridian Insurance) with realistic fields. 5 mock recommendation results with varied contact scenarios (full CRM match, partial match with missing email, no CRM record). 3 pre-authored outreach draft messages. Dashboard stats and activity feed are hardcoded.
- **Mock logic**: Recommendations and scores are pre-authored in `src/data/mockData.ts` — no AI scoring occurs. The processing animation on the Configure screen simulates an agent call with progressive status messages before loading mock results. CSV parsing is real (via Papa Parse) but falls back to mock data on error.
- **Mock integration**: Outlook handoff uses `mailto:` deep links with pre-filled content. SharePoint list selector shows dummy options. No Graph API, Copilot Studio, or Salesforce connector calls are made — the prototype is fully client-side.
- **Mock contact enrichment**: When a recommended account has no buyer contact in Salesforce (or has incomplete data like missing email), the app generates a LinkedIn Sales Navigator deep-link search (pre-built from account name, domain, and target persona title) and shows it as a "Find on LinkedIn Sales Navigator" button. The seller follows the link to manually retrieve the contact. The narrative says "Sales Navigator provides the contact; the Companion tells you who to look for and why."

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

**As built** (`src/screens/Dashboard.tsx` — 871 lines):

```
┌──────────────────────────────────────────────────────────────┐
│  [🏠]  Entrust Prospect Prioritization Companion      [👤]  │
├──────────────────────────────────────────────────────────────┤
│ ┌─ Hero (gradient banner) ──────────────────────────────────┐│
│ │  Good afternoon, Sarah ✨                                 ││
│ │  You have 1 run in review and 2 completed runs this month.││
│ │  Your average prospect score is 87.                       ││
│ │  Wednesday, February 25, 2026             [New Prosp Pass]││
│ └───────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────┐│
│  │  40,127      │ │  2,340       │ │  156         │ │18.4% ││
│  │  Accounts    │ │  Prioritized │ │  Outreach    │ │Conv. ││
│  │  Imported    │ │  This Month  │ │  Packs Sent  │ │Rate  ││
│  │  +2.4k/mo   │ │  +18% vs last│ │  +12/wk      │ │+3.1pp││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────┘│
│                                                              │
│  ┌─ Left Column ──────────────────┐ ┌─ Right Column ───────┐│
│  │                                │ │                       ││
│  │  Quick Actions (3-tile grid)   │ │  Top Prospects        ││
│  │  ┌────────┐┌────────┐┌───────┐ │ │  #1 Acme Corp (94)   ││
│  │  │Start   ││View    ││Outrch │ │ │  #2 Meridian Ins (91)││
│  │  │New Run ││Recos   ││Packs  │ │ │  #3 Gamma Fin (89)   ││
│  │  └────────┘└────────┘└───────┘ │ │  [View all →]         ││
│  │                                │ │                       ││
│  │  Recent Runs (card list)       │ │  Recent Activity      ││
│  │  ● EMEA—PKI   2/15  ✅ 1,247  │ │  ✅ EMEA run done     ││
│  │  ● NA—IAM     2/12  ✅ 3,412  │ │  📧 3 packs sent      ││
│  │  ● APAC—Sign  2/10  🔄 823    │ │  ✓ 4 accounts apprvd  ││
│  └────────────────────────────────┘ └───────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Fluent UI components:** `Card`, `Button`, `Avatar`, `Badge`, `CounterBadge`, `Tooltip`, `ToolbarButton`, `Subtitle1`, `Caption1`, `Text`, `mergeClasses`

**Key differences from original wireframe:**
- **4 stat cards** (added Conversion Rate), each with trend badges and hover elevation
- **Two-column layout** replaces simple table: left has quick actions + run cards; right has top prospects + activity feed
- **Top Prospects panel** with custom SVG `ScoreRing` component (circular progress indicator)
- **Activity Feed** with typed icons per activity type (run_complete, outreach_sent, import, review, approved)
- **Quick Actions grid** (3 tiles: Start New Run, View Recommendations, Outreach Packs)
- **Hero section** with gradient background, time-of-day greeting, sparkle icon, and contextual summary
- **CSS animations**: fadeInUp, slideInRight, countUp, pulseGlow (on in-review status dots), scoreRing
- **Sticky header** (`AppHeader.tsx`) with Entrust purple (#6B2FA0), home button, and avatar — shared across all screens

**Interaction:**
- "New Prospecting Pass" → creates a new run in state, navigates to Import
- Click any run card → navigates to Recommendations for that run (if complete/review)
- Quick action tiles → Start New Run, View Recommendations, Outreach Packs
- Top Prospects "View all →" → navigates to latest completed run's recommendations

---

#### Screen 2: Import Accounts

**Purpose:** Upload a Goodfit CSV (or select an existing SharePoint list). Low friction — get the data in and move on.

**As built** (`src/screens/ImportAccounts.tsx` — 319 lines):

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back    Import Accounts                             [👤]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ProgressBar ███████░░░░░░░░░░░░░░ (0.33)                    │
│  1. Import (bold)    2. Configure    3. Review               │
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
│  │   [ EMEA Target Accounts — PKI Q1 2026    ▾ ]         │  │
│  │   [ NA Target Accounts — IAM Q1 2026      ▾ ]         │  │
│  │   [ APAC Target Accounts — Digital Signing ▾ ]         │  │
│  │                                                        │  │
│  │   [ Use Demo Data ]  (loads mock accounts)             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ✅ File parsed successfully  (MessageBar)                   │
│  Detected: 5 accounts                                        │
│                                                              │
│  Preview (first 5 rows):                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Company   │ Domain       │ Industry   │ Employees │ GF │  │
│  │ Acme Corp │ acme.com     │ Financial  │ 5,200     │ 91 │  │
│  │ Beta Hold.│ betahold.co  │ Healthcare │ 12,000    │ 85 │  │
│  │ ...       │              │            │           │    │  │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│                              [ Cancel ]  [ Next → ]          │
└──────────────────────────────────────────────────────────────┘
```

**Fluent UI components:** `ProgressBar` (stepper), `Dropdown`, `Option`, `DataGrid`, `DataGridHeader`, `DataGridRow`, `DataGridHeaderCell`, `DataGridBody`, `DataGridCell`, `Button`, `Card`, `Text`, `MessageBar`

**Interaction:**
- CSV upload triggers real Papa Parse parsing → maps common column names (`Company`, `CompanyName`, `Domain`, `Industry`, `Employees`, `EmployeeCount`, etc.) to `TargetAccount` fields
- File drag-and-drop supported with visual drag-over state
- "Use Demo Data" button loads 5 hardcoded mock accounts (fallback for demos)
- Dropdown shows mock SharePoint list names (no real SharePoint connection)
- On parse error, silently falls back to mock data
- Preview shows `DataGrid` with columns: Company, Domain, Industry, Employees, Goodfit Score
- "Next" dispatches `IMPORT_ACCOUNTS` to state and navigates to Configure
- "Cancel" returns to Dashboard

**Prototype shortcut:** No actual SharePoint upload. Parsed CSV data is held in React state via `useReducer`. SharePoint list dropdown options are hardcoded.

---

#### Screen 3: Configure ICP / Persona Rules

**Purpose:** Let the seller select target persona types and weight the scoring criteria. This addresses the "persona-to-account mapping is manual" pain point by letting the AI do the heavy lifting with human-guided rules.

**As built** (`src/screens/ConfigureRules.tsx` — 401 lines):

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back    Configure Persona Rules                     [👤]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ProgressBar ██████████████░░░░░░░ (0.66)                    │
│  1. Import    2. Configure (bold)   3. Review                │
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
│     factor more when ranking your accounts. For new market   │
│     penetration, increase Persona Fit and Industry Relevance.│
│     For cross-sell, increase CRM Signals.                    │
│                                                              │
│                     [ ← Back ]  [ ▶ Run Prioritization ]     │
└──────────────────────────────────────────────────────────────┘
```

**Processing state (shown after "Run Prioritization"):**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                      (Spinner — huge)                        │
│                                                              │
│              Running Prioritization                          │
│                                                              │
│     "Scoring & ranking by weighted criteria..."              │
│                                                              │
│     ProgressBar (indeterminate)                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Progressive status messages cycle every 1.2s:
1. "Analyzing 1,247 accounts..."
2. "Querying Salesforce data via Microsoft Graph..."
3. "Matching personas across contacts..."
4. "Scoring & ranking by weighted criteria..."
5. "Generating explanations..."
6. "Flagging accounts that need review..."

**Fluent UI components:** `Dropdown`, `Option`, `Checkbox`, `Slider`, `Tooltip`, `Button`, `Spinner`, `ProgressBar`, `Divider`, `Card`, `Text`

**Interaction:**
- Persona checkboxes toggle enabled/disabled; sliders set priority (0–100)
- Weight sliders adjust scoring factor importance (0–100%)
- "Run Prioritization" saves config to state, shows processing overlay, then loads mock recommendations after ~7 seconds
- Tooltips on section headers explain the purpose of personas and weights
- "Back" returns to Import screen

**Prototype shortcut:** 3 product lines (PKI, IAM, Digital Signing), 3 regions (EMEA, NA, APAC), 3 segments (Enterprise, Mid-Market, SMB) with hardcoded options. Processing animation is purely cosmetic — mock recommendations are loaded from `mockData.ts` regardless of configuration.

---

#### Screen 4: AI-Ranked Recommendations

**Purpose:** The hero screen. Show ranked accounts/contacts with AI-generated explanations and confidence scores. This is where leadership sees the value — transparent, explainable prioritization.

**As built** (`src/screens/Recommendations.tsx` — 783 lines):

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back    Recommendations — EMEA PKI Q1               [👤] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ProgressBar ████████████████████ (1.0)                      │
│  1. Import    2. Configure    3. Review (bold)               │
│                                                              │
│  5 accounts analyzed · (3) high-priority · (1) needs review  │
│  · (0) approved                                              │
│                                                              │
│  🔍  Filter: [All ▾] [High Priority ▾] [Needs Review ▾]     │
│              [Approved ▾]                                    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ #1  ACME CORP                          Score: 94/100  │  │
│  │     acme.com                         ProgressBar ████ │  │
│  │                                                        │  │
│  │  👤 Jane Smith, CISO  jane.smith@acme.com              │  │
│  │     [⚠ Sales Navigator lookup recommended]             │  │
│  │                                                        │  │
│  │  🔗 Contact Discovery Provenance:                      │  │
│  │     [🗄 Salesforce CRM] [✓ Domain matched]             │  │
│  │     "Contact matched via Salesforce Account → Contact  │  │
│  │      relationship. Goodfit domain (acme.com) matched   │  │
│  │      Salesforce Account 'Acme Corp' (ID: 001xx00042)." │  │
│  │     [🔍 Find on LinkedIn Sales Navigator]  (if needed) │  │
│  │                                                        │  │
│  │  🤖 AI Reasoning:                                      │  │
│  │  "Acme Corp is a strong persona fit — CISO (Jane       │  │
│  │   Smith) is present in Salesforce with recent activity. │  │
│  │   Company size (5,200 employees) matches your          │  │
│  │   Enterprise segment..."                               │  │
│  │                                                        │  │
│  │  Factors (ProgressBar per factor):                     │  │
│  │  Persona fit ████████████████████ 95%                  │  │
│  │  Size match  ████████████████──── 85%                  │  │
│  │  Industry    ██████████████████── 92%                  │  │
│  │  CRM signals ████████████████──── 88%                  │  │
│  │  Web signals ████████████████████ 90%                  │  │
│  │                                                        │  │
│  │  [ ✓ Approve ]  [ ✏ Edit ]  [ ✗ Dismiss ]            │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ #4  BETA HOLDINGS                      Score: 87/100  │  │
│  │     ⚠ NEEDS REVIEW border (yellow)                    │  │
│  │                                                        │  │
│  │  👤 Mark Lee, IT Director  [⚠ Email not available]     │  │
│  │     [🔍 Sales Navigator lookup recommended]             │  │
│  │                                                        │  │
│  │  🔗 [🗄 Salesforce CRM] [⚠ Partial match]             │  │
│  │     "Contact found in Salesforce but email field is    │  │
│  │      blank. Two matching Salesforce Accounts exist..."  │  │
│  │     [🔍 Find on LinkedIn Sales Navigator]               │  │
│  │                                                        │  │
│  │  ⚠ Needs Review (MessageBar warning):                  │  │
│  │  "Two Salesforce account records found: 'Beta Holdings │  │
│  │   Ltd' and 'Beta Holdings Group'. Both share domain    │  │
│  │   betahold.co.uk..."                                   │  │
│  │                                                        │  │
│  │  [ ✓ Approve ]  [ ✏ Edit ]  [ ✗ Dismiss ]            │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ── Inline Edit Form (when Edit clicked) ─────────────────   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Edit Recommendation                                   │  │
│  │  Contact Name: [__________]  Contact Title: [________] │  │
│  │  Contact Email: [________________________]             │  │
│  │  Notes / Reasoning: [________________________]         │  │
│  │                        [ Cancel ]  [ 💾 Save Changes ] │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Page 1 of 1         [ ← Prev ]  [ Next → ]                 │
│                                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  2 accounts · approved for outreach                          │
│  [ Generate Outreach Pack → ]                                │
└──────────────────────────────────────────────────────────────┘
```

**Fluent UI components:** `Card`, `Badge`, `CounterBadge`, `ProgressBar` (score bar + factor bars), `MessageBar` + `MessageBarBody` + `MessageBarTitle` (needs review warning), `Button`, `Dropdown`, `Option`, `Divider`, `Input`, `Textarea`, `Label`, `Text`

**Key UX decisions (as implemented):**
- **Explainability** — every recommendation has a natural-language "AI Reasoning" block in a styled container with a bot icon
- **Contact Data Provenance** (new, not in original spec) — each recommendation shows:
  - **Source badge**: Salesforce CRM / Goodfit Enrichment / Inferred / No contact found
  - **Discovery badge**: Domain matched / Partial match / Inferred / Not found
  - **Email source badge**: CRM-verified / Pattern-guessed (shown when email source differs from contact source)
  - **Discovery note**: Detailed text explaining how the contact was found and linked
  - **LinkedIn Sales Navigator button**: Pre-built search URL for missing/incomplete contacts
- **Confidence score** is 0–100 with color-coded `ProgressBar` (green ≥85, yellow ≥70, red <70) + per-factor breakdown bars
- **"Needs Review" flag** renders yellow border + `MessageBar` with detailed review reason
- **Missing email warning** shows `Badge` with mail-warning icon
- **Inline edit form** opens below the card with fields for Contact Name, Title, Email, and Notes/Reasoning; saving marks as "Edited"
- **Status flow**: Pending → Approve/Edit/Dismiss. Edited → Approve/Edit Again/Dismiss. Approved/Dismissed → Undo (returns to Pending)
- **Pagination**: 5 cards per page with Prev/Next
- **Filtering**: Dropdown with All / High Priority (85+) / Needs Review / Approved

**Mock data provides 5 recommendation cards with varied scenarios:**
1. Acme Corp (94) — full CRM match, email available, no review needed
2. Meridian Insurance (91) — full match, dormant lead re-engagement
3. Gamma Financial Group (89) — full match, re-engagement angle
4. Beta Holdings (87) — partial match, missing email, needs review (duplicate CRM records), LinkedIn enrichment recommended
5. Nordic Secure Systems (82) — no CRM record, no contact found, LinkedIn enrichment recommended

---

#### Screen 5: Outreach Pack & Handoff

**Purpose:** Bundle approved selections into an actionable outreach pack with draft messaging, then hand off to Outlook.

**As built** (`src/screens/OutreachPack.tsx` — 426 lines):

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back    Outreach Pack — EMEA PKI Q1               [👤]   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  3 accounts · 3 draft messages ready                         │
│                                                              │
│  ── Draft Messaging ──────────────────────────────────────   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  To: Jane Smith, CISO — Acme Corp       [AI-drafted]  │  │
│  │  jane.smith@acme.com                                   │  │
│  │                                                        │  │
│  │  [🗄 Contact from Salesforce] [✓ Email CRM-verified]  │  │
│  │  [Domain matched]                                      │  │
│  │                                                        │  │
│  │  Subject: Acme's Certificate Renewal — A Timely        │  │
│  │           Conversation                                 │  │
│  │                                                        │  │
│  │  Jane,                                                 │  │
│  │                                                        │  │
│  │  With Acme Corp's Symantec certificate contract        │  │
│  │  approaching its Q2 2026 renewal window, this is the   │  │
│  │  moment most enterprise CISOs reassess their PKI       │  │
│  │  strategy...                                           │  │
│  │                                                        │  │
│  │  ℹ Personalization: Referenced expiring Symantec       │  │
│  │    contract (Q2 2026), company size (5,200),           │  │
│  │    Financial Services industry, CISO role.             │  │
│  │                                                        │  │
│  │  ✏ Edit draft    📋 Copy    📧 Open in Outlook        │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  To: Pierre Dubois, VP InfoSec — Meridian Insurance    │  │
│  │  ...                                                   │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  To: Klaus Weber, IT Director — Gamma Financial Group  │  │
│  │  ...                                                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ── Export Options ───────────────────────────────────────   │
│                                                              │
│  [ 📥 Download CSV  ]  Account + contact list               │
│  [ 📥 Download Pack ]  CSV + messaging + AI summaries       │
│  [ 📧 Open All in Outlook ]  (opens drafts for each)       │
│                                                              │
│  💡 Tip: "Open in Outlook" creates a draft with this        │
│     messaging pre-filled. Use Copilot in Outlook to         │
│     further personalize — try asking it to "incorporate     │
│     this prospect's recent company news."                    │
│                                                              │
│  ℹ What's next? After sending outreach, CRM write-back     │
│    and engagement tracking are on the roadmap. For now,     │
│    update Salesforce manually with the exported data.       │
└──────────────────────────────────────────────────────────────┘
```

**Fluent UI components:** `Card`, `Textarea` (editable draft), `Button`, `Tooltip`, `Divider`, `Badge`, `MessageBar`, `Text`

**Key features as built:**
- **Contact data provenance per draft**: Source badge (Salesforce/Goodfit/Inferred) + email verification badge (CRM-verified/Pattern-guessed) + discovery badge (matched/inferred)
- **Missing email handling**: `MessageBar` warning when email unavailable; "Open in Outlook" button disabled with tooltip explanation
- **Inline draft editing**: Toggle edit mode to modify message body in a `Textarea`
- **Copy to clipboard**: Copies subject + body; shows floating "Copied to clipboard" badge
- **CSV export**: Generates real downloadable CSV with Contact, Title, Account, Subject, Body columns
- **Personalization notes**: Each draft shows what data points were used to personalize the message

**Outlook handoff mechanics (as built):**
- "Open in Outlook" uses `mailto:` link with URL-encoded `subject` and `body` parameters
- "Open All in Outlook" iterates through all drafts and opens each
- Button is disabled when contact has no email address
- Tip text references Copilot in Outlook for further refinement

**Mock data provides 3 pre-authored outreach drafts:**
1. Jane Smith (CISO, Acme Corp) — certificate renewal angle
2. Pierre Dubois (VP InfoSec, Meridian Insurance) — digital transformation + RFP angle
3. Klaus Weber (IT Director, Gamma Financial Group) — EU regulation + re-engagement angle

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

> **Implementation status:** The Copilot Studio agent is **not built** in the current prototype. The system prompt, prompt templates, and output formats below remain the design specification for a future integration. The prototype UI renders mock data that matches this output schema, proving the UX works with the expected agent response format.
>
> **TypeScript mapping:** The agent's JSON output format has been implemented as TypeScript types in `src/types/index.ts`. The actual types are richer than the original spec — notably, `BestContact` now includes `emailSource`, `discovery`, `discoveryNote`, `enrichmentAction`, and `linkedinSearchUrl` fields to support the contact data provenance UI.

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
    "email_source": "crm_verified | pattern_guessed | null",
    "linkedin_url": "<string or null>",
    "source": "salesforce | goodfit | inferred",
    "discovery": "domain_matched | partial_match | inferred | not_found",
    "discovery_note": "<string — how the contact was found/linked>",
    "enrichment_action": "none | linkedin_search_recommended",
    "linkedin_search_url": "<string or null — pre-built Sales Navigator search URL>"
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
4. If a matching contact is found but has incomplete data (e.g., missing email,
   stale title), flag it and set enrichment_action to "linkedin_search_recommended".
   Generate a LinkedIn Sales Navigator search URL scoped to the account's company
   and the target persona title.
5. If NO matching contact is found in Salesforce for a high-priority account, infer
   the best persona title to target based on the account's profile and the seller's
   persona priorities. Set source to "inferred", set enrichment_action to
   "linkedin_search_recommended", and generate the Sales Navigator search URL.
   Include a note in the reasoning explaining that the contact was inferred and
   recommending the seller verify via LinkedIn Sales Navigator.
6. Score each account using the weighted factors above. The overall_score is a
   weighted average.
7. Sort accounts by overall_score descending.
8. Return the top {{result_count}} accounts in the JSON format specified in your
   instructions.

Important:
- If no Salesforce match is found, still include the account but set crm_signals
  to 0 and note "No CRM history" in the reasoning.
- If a contact's email is not in Salesforce, set email to null and note the gap.
  Set enrichment_action to "linkedin_search_recommended" and generate a
  Sales Navigator search URL using the pattern:
  https://www.linkedin.com/sales/search/people?query=(companyName:{{account_name}})AND(title:{{persona_title}})
- For accounts where no contact exists in Salesforce at all, always still include
  the account if it scores well on other factors. Infer the best persona title to
  target and provide the Sales Navigator search link. A missing contact does not
  disqualify an otherwise high-fit account.
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
| **Contact enrichment bridging** | Tasks A & B | When CRM contacts are missing or incomplete, the agent generates LinkedIn Sales Navigator search URLs to bridge the gap — preserving the seller's existing manual lookup workflow while eliminating the guesswork about *who* to search for |

---

## 4. Data Architecture

> **Implementation status:** The data architecture below describes the **target design**. In the current prototype, no external data sources are connected. All data flows through client-side React state using mock data from `src/data/mockData.ts`.

### 4.1 Data Flow — As Built (Prototype)

```
                    ┌─────────────┐
                    │  Goodfit     │
                    │  CSV File    │
                    └──────┬──────┘
                           │ drag-drop / file browse
                           │ (or "Use Demo Data" button)
                           ▼
                    ┌──────────────────────────────────┐
                    │    Papa Parse (client-side)       │
                    │    CSV → TargetAccount[]          │
                    │    Falls back to mockParsedAccounts│
                    └──────────────┬───────────────────┘
                                   │ dispatch(IMPORT_ACCOUNTS)
                                   ▼
                    ┌──────────────────────────────────┐
                    │    React Context (AppContext)     │
                    │    useReducer state               │
                    │                                  │
                    │  state.runs[].accounts            │
                    │  state.runs[].config              │
                    │  state.runs[].recommendations     │
                    │    (loaded from mockData.ts)      │
                    │  state.runs[].outreachDrafts      │
                    │    (loaded from mockData.ts)      │
                    └──────────────┬───────────────────┘
                                   │ renders
                                   ▼
                    ┌──────────────────────────────────┐
                    │    React / Fluent UI Web App      │
                    │    (GitHub Pages)                 │
                    │                                  │
                    │  → Dashboard with mock stats      │
                    │  → Renders mock ranked results    │
                    │  → Export CSV (real download)     │
                    │  → mailto: Outlook handoff        │
                    └──────────────────────────────────┘
```

### 4.1b Data Flow — Target Design (Future)

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
  ┌────────────────┐ ┌──────────────────────────────────┐
  │  LinkedIn       │ │    React / Fluent UI Web App      │
  │  Sales          │ │    (standalone experience)        │
  │  Navigator      │ │                                  │
  │                │ │  → Renders ranked results         │
  │  Enrichment    │◄│  → Contact provenance + gaps      │
  │  fallback when │ │  → Export outreach packs          │
  │  email/contact │ │  → Handoff to Outlook             │
  │  missing       │ └──────────────────────────────────┘
  └────────────────┘
```

**LinkedIn Sales Navigator integration:** When the agent (or mock data) identifies contacts with missing emails or no CRM record, the React app generates pre-built LinkedIn Sales Navigator search URLs (`linkedin.com/sales/search/people?query=...`). This gives sellers a one-click path to manually enrich contact data. In the current prototype, this is implemented as a `linkedinSearchUrl` field on `BestContact` in `src/types/index.ts`, rendered as a "Find on LinkedIn Sales Navigator" button on Recommendations and as provenance badges on Outreach Pack cards. In the target design, the agent could automate this lookup via a LinkedIn Sales Navigator API tool action.

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

> **Implementation status:** None of the retrieval paths below are implemented. The prototype uses hardcoded mock data in `src/data/mockData.ts`. This section describes the **target architecture** for when the Copilot Studio agent is integrated.

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

**Current prototype implementation:**
- All 5 recommendation records are hardcoded in `mockData.ts` with realistic field values
- The mock data demonstrates varied contact scenarios: full CRM match, partial match with missing email, no CRM record found
- The processing animation on the Configure screen simulates the agent call with progressive status messages
- The React `AppContext` reducer handles the data flow: `SET_RECOMMENDATIONS` action loads mock data into state, which the Recommendations screen renders

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

> Updated to reflect actual prototype behavior and mock data.

1. **Open Dashboard** (15 sec): "Here's Sarah's home base. She can see her recent prospecting runs — EMEA PKI, NA IAM, APAC Digital Signing — along with summary stats: 40,000 accounts imported, 2,300 prioritized this month, 18% conversion rate. The top prospects panel shows her best leads at a glance with score rings."
2. **Import** (20 sec): "Sarah clicks 'New Prospecting Pass' and uploads a Goodfit CSV. The system parses it client-side — she sees a preview of the accounts immediately. Or she can click 'Use Demo Data' to load our sample set." *(click Use Demo Data for a clean demo)*
3. **Configure** (30 sec): "She selects her target personas — CISO at 95 priority, IT Director at 80. She adjusts scoring weights to emphasize persona fit and industry relevance for this PKI-focused run."
4. **Run** (20 sec): "She hits 'Run Prioritization.' Watch the processing animation — it simulates the AI analyzing accounts, querying Salesforce, matching personas, scoring and ranking." *(show the animated spinner with progressive messages)*
5. **Recommendations** (60 sec): "Here are 5 results. Acme Corp scores 94 — the AI explains *why*: CISO is in the CRM, company size matches, and there's a certificate contract expiring in Q2. Notice the contact provenance: 'Salesforce CRM → Domain matched' with a full discovery trace. Now look at Beta Holdings — scores 87 but has a yellow border and 'Needs Review' flag. The AI found *two* Salesforce records and the contact has no email. It's asking Sarah to confirm which entity is correct and recommending LinkedIn Sales Navigator to find the email. *That's the AI surfacing the problem, not hiding it.*"
6. **Outreach Pack** (40 sec): "Sarah approves accounts and generates the outreach pack. Each draft references specific data — Acme's expiring Symantec contract, Meridian's RFP timeline, Gamma's EU regulatory angle. She can edit, copy, or click 'Open in Outlook' to create a pre-filled email draft. The personalization notes show exactly what data points made each message unique."
7. **Close** (15 sec): "From CSV upload to personalized outreach emails with full reasoning — the UI makes it feel like minutes, not days. That's the value."

---

### Summary: What's Real vs. Mock

| Layer | Status |
|---|---|
| **React UI (all 5 screens)** | ✅ Fully built and functional |
| **CSV parsing** | ✅ Real Papa Parse integration |
| **State management** | ✅ React Context + useReducer |
| **Outlook handoff** | ✅ Real `mailto:` links |
| **CSV export** | ✅ Real downloadable file |
| **Contact data provenance** | ✅ Built (beyond original spec) |
| **LinkedIn Sales Navigator links** | ✅ Pre-built search URLs |
| **AI scoring / recommendations** | 🔴 Mock data — no Copilot Studio agent |
| **Salesforce integration** | 🔴 Mock data — no Graph Connector |
| **SharePoint integration** | 🔴 Mock dropdown — no real SharePoint |
| **Outreach message generation** | 🔴 Pre-authored — no AI generation |
| **Authentication** | 🔴 Not implemented — no MSAL.js |

---

## Appendix: Technology Decisions

| Decision | Planned | Actual | Notes |
|---|---|---|---|
| **Frontend framework** | React 18 + Fluent UI React v9 | React 19 + Fluent UI React v9 (`@fluentui/react-components` ^9.73.0) + `@fluentui/react-icons` ^2.0.319 | Upgraded to React 19; Fluent v9 as planned |
| **State management** | React Context + useReducer | React Context + useReducer | Matches plan. Single `AppContext` with `appReducer` handling 10 action types |
| **Navigation** | *(not explicitly planned)* | State-based (`currentStep: 0–4`) | `react-router-dom` is installed but **unused**. Navigation is entirely via `dispatch({ type: 'SET_STEP' })` |
| **API layer** | Microsoft Graph JS SDK + Copilot Studio Direct Line | None — fully client-side mock data | No backend API calls. All data from `src/data/mockData.ts` |
| **CSV parsing** | Papa Parse (client-side) | Papa Parse ^5.5.3 (client-side) | Works as planned; maps common CSV column names to `TargetAccount` type |
| **Contact enrichment** | LinkedIn Sales Navigator deep links (v1); Sales Navigator API (v2) | LinkedIn Sales Navigator deep links (v1) | Deep links to pre-scoped searches are zero-integration for prototype; API enables automated contact import in production |
| **Hosting** | Azure Static Web Apps | GitHub Pages (`gh-pages` ^6.3.0) |  |
| **Auth** | MSAL.js (Microsoft Entra ID) | Not implemented | No authentication; prototype is public |
| **Outlook integration** | `mailto:` URI (v1); Graph `sendMail` (v2) | `mailto:` URI only | Works as planned for v1 |
| **TypeScript** | *(implied)* | TypeScript ^4.9.5 | Full type safety with rich type definitions in `src/types/index.ts` |
| **Build tooling** | *(implied CRA)* | Create React App (`react-scripts` 5.0.1) | Standard CRA setup |
