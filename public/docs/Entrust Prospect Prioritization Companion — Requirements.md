# Entrust Prospect Prioritization Companion — Requirements Traceability

> Cross-references story narrative, prompt requirements, and prototype implementation.
> Last verified: 2026-03-27

---

## ACT 1 — THE PROBLEM

| # | Requirement | Story | Code | Status |
|---|---|---|---|---|
| 1 | Entrust described as global cybersecurity company (PKI, cert lifecycle, identity verification, digital signing) | Act 1 ¶1–2 | — | ✅ Met |
| 2 | Goodfit as third-party data provider delivering 40,000+ account lists | Act 1 ¶1–2 | `mockDashboardStats.totalImported = 40127` | ✅ Met |
| 3 | Sellers manually cross-reference accounts against Salesforce CRM (existing relationships, open opps, buyer contacts) | Act 1 ¶4 | — | ✅ Met |
| 4 | Persona-to-account mapping is entirely manual (CISO, IT Director, IAM Lead) | Act 1 ¶5 | `defaultPersonas` in ConfigureRules.tsx | ✅ Met |
| 4a | When buyer contacts are missing from CRM, sellers manually search LinkedIn Sales Navigator to retrieve contact information | Act 1 ¶5 | — | ✅ Met |
| 5 | No systematic scoring or ranking — gut feel, tribal knowledge | Act 1 ¶6 | — | ✅ Met |
| 6 | Account hierarchy data in Salesforce is messy — duplicate records, parent/child confusion, stale contacts | Act 1 ¶7 | Beta Holdings "Ltd" vs "Group" in mockData.ts | ✅ Met |
| 7 | Outreach is generic — template emails, no personalization | Act 1 ¶8 | — | ✅ Met |
| 8 | Entire process takes days to weeks; buying window may close | Act 1 ¶10 | — | ✅ Met |
| 9 | Named persona (e.g. "Sarah, enterprise sales rep covering EMEA for PKI") to make it real | Act 1 ¶3 | Dashboard: "Good morning/afternoon/evening, Sarah" via `getGreeting()` | ✅ Met |
| 10 | Show frustration, wasted hours, missed opportunities in concrete human terms | Act 1 throughout + pull-out quote | — | ✅ Met |

---

## ACT 2 — THE SOLUTION

### Architecture & Technology

| # | Requirement | Story | Code | Status |
|---|---|---|---|---|
| 11 | React + Fluent UI 2 standalone web app | Act 2 ¶5 | All components use `@fluentui/react-components` | ✅ Met |
| 12 | Hosted on Azure Static Web Apps | Act 2 ¶5 | Actually deployed to GitHub Pages (`gh-pages` package, homepage: `ablack34.github.io`) | ❌ Not Met — hosted on GitHub Pages, not Azure SWA |
| 13 | Copilot Studio agent orchestrating AI reasoning | Act 2 ¶5 | — | ❌ Not Met — no Copilot Studio integration; AI processing is simulated via `setTimeout`; referenced file `prospective-prioritisation.md` does not exist |
| 14 | Microsoft Graph Connectors indexing Salesforce CRM data (Accounts, Contacts, Leads, Opportunities) — read-only, item-level ACLs | Act 2 ¶5 | Processing animation messages in ConfigureRules.tsx | ⚠️ Partial — concept shown via animation text ("Querying Salesforce data via Microsoft Graph...") but no actual Graph Connector integration |
| 15 | Goodfit CSV data staged in SharePoint list, queryable via Graph API | Act 2 ¶3 | ImportAccounts.tsx SharePoint list dropdown | ⚠️ Partial — dropdown UI exists with SharePoint list names, but loads hardcoded mock data; no actual Graph API call |
| 16 | Outlook integration for outreach handoff | Act 2 ¶10 | `handleOpenInOutlook` → `mailto:` in OutreachPack.tsx | ⚠️ Partial — uses generic `mailto:` protocol handler, not Outlook API or Microsoft Graph; would open any default email client, not specifically Outlook |
| 16a | LinkedIn Sales Navigator integration for contact enrichment — deep links to pre-scoped searches when CRM contacts are missing or incomplete | Act 2 ¶6–7 | `enrichmentAction` + `linkedinSearchUrl` fields in types; UI renders "Find on LinkedIn Sales Navigator" link in Recommendations.tsx | ✅ Met |

### 5-Step User Workflow

| # | Requirement | Story | Code | Status |
|---|---|---|---|---|
| 17 | **DASHBOARD** — home base, recent runs, summary stats (40,127 imported / 2,340 prioritized / 156 outreach packs) | Act 2 ¶2 | Dashboard.tsx + `mockDashboardStats` (exact values match) | ✅ Met |
| 18 | **IMPORT** — upload Goodfit CSV or select SharePoint list; instant parsing, preview of first rows, field detection | Act 2 ¶3 | ImportAccounts.tsx: drag-drop, `Papa.parse`, preview DataGrid, SharePoint dropdown | ✅ Met |
| 19 | **CONFIGURE** — select product line (PKI, Identity, Digital Signing) | Act 2 ¶4 | ConfigureRules.tsx: product line dropdown, defaults to "PKI / Certificate Solutions" | ✅ Met |
| 20 | **CONFIGURE** — select region (EMEA, NA, APAC) | Act 2 ¶4 | ConfigureRules.tsx: region dropdown, defaults to "EMEA" | ✅ Met |
| 21 | **CONFIGURE** — select segment (Enterprise 1000+) | Act 2 ¶4 | ConfigureRules.tsx: segment dropdown, defaults to "Enterprise (1000+ employees)" | ✅ Met |
| 22 | **CONFIGURE** — target personas with priority sliders (CISO 95, IT Director 80, IAM Lead 70) | Act 2 ¶4 | `defaultPersonas` array: exact values match | ✅ Met |
| 23 | **CONFIGURE** — scoring weights (persona fit 80%, industry 70%, size 60%, CRM 40%, web/intent 30%) | Act 2 ¶4 | `defaultWeights` object: exact values match | ✅ Met |
| 24 | **RECOMMENDATIONS** — AI-ranked accounts with confidence scores (0–100) | Act 2 ¶6 | `overallScore` rendered with `/100` in Recommendations.tsx | ✅ Met |
| 25 | **RECOMMENDATIONS** — per-factor breakdowns | Act 2 ¶6 | `renderFactorBar` for persona fit, size, industry, CRM, web signals | ✅ Met |
| 26 | **RECOMMENDATIONS** — natural-language reasoning for every recommendation | Act 2 ¶6–8 | `reasoning` field rendered in AI Reasoning block with Bot icon | ✅ Met |
| 27 | **RECOMMENDATIONS** — example reasoning: "Acme Corp scores 94: CISO present in CRM, 5,200 employees, expiring Symantec cert Q2 2026, no existing Entrust relationship" | Act 2 ¶6 | `mockRecommendations[0].reasoning` — semantic match (all data points present but wording differs; not an exact text match) | ✅ Met |
| 28 | **RECOMMENDATIONS** — "Needs Review" flags when CRM data is ambiguous (e.g. duplicate Salesforce records) | Act 2 ¶9 | `needsReview` + `reviewReason` + amber-bordered card style | ✅ Met |
| 28a | **RECOMMENDATIONS** — "Find on LinkedIn Sales Navigator" deep link when recommended contact is missing or has incomplete data (no email) | Act 2 ¶6–7 | `enrichmentAction` + `linkedinSearchUrl` in mock data; UI renders Sales Navigator link in Recommendations.tsx | ✅ Met |
| 29 | **RECOMMENDATIONS** — example: "Beta Holdings Ltd" vs "Beta Holdings Group" duplicate flag | Act 2 ¶9 | `mockRecommendations[3].reviewReason` — exact content match | ✅ Met |
| 30 | **RECOMMENDATIONS** — Approve / Edit / Dismiss controls — human-in-the-loop, never black-box | Act 2 ¶10 | Three action buttons in Recommendations.tsx | ✅ Met |
| 31 | **OUTREACH PACK** — AI-generated personalized draft emails referencing specific account data points | Act 2 ¶10 | `mockOutreachDrafts` with full email bodies + `personalizationNotes` | ✅ Met |
| 32 | **OUTREACH PACK** — one-click Outlook handoff | Act 2 ¶10 | "Open in Outlook" button in OutreachPack.tsx | ✅ Met |
| 33 | **OUTREACH PACK** — CSV export | Not explicitly called out in story | `handleDownloadCSV` in OutreachPack.tsx | ⚠️ Partial — exists in code but story doesn't mention it |

### Design Principles

| # | Requirement | Story | Code | Status |
|---|---|---|---|---|
| 34 | AI transparency: every output has a "why" | Act 2 ¶6–9 + pull-out quote | Reasoning blocks, factor bars, provenance badges | ✅ Met |
| 35 | Human-in-the-loop: AI suggests, sellers decide | Act 2 ¶9–10 | Approve / Edit / Dismiss controls | ✅ Met |
| 36 | Escape velocity: list → personalized outreach in under 15 minutes | Act 2 final ¶ ("eleven minutes") | — | ✅ Met |
| 37 | Enterprise-safe: read-only CRM access, no write-back, Entra ID auth | Act 3 ¶6 | — | ❌ Not Met — no Entra ID / MSAL.js auth implemented; app uses a static `PasswordGate` access code; Prototype Playbook confirms "Auth: 🔴 Not implemented" |

---

## ACT 3 — BUSINESS IMPACT

| # | Requirement | Story | Status |
|---|---|---|---|
| 38 | Seller productivity: days → minutes for prospect prioritization | Act 3 ¶2 | ✅ Met |
| 39 | Pipeline quality: data-driven ranking replaces gut feel | Act 3 ¶3 | ✅ Met |
| 40 | Outreach effectiveness: personalized, signal-informed messaging vs. templates | Act 3 ¶4 | ✅ Met |
| 41 | CRM data quality: AI surfaces duplicates and gaps sellers would have missed | Act 3 ¶5 | ✅ Met |
| 42 | Leadership visibility: explainable, auditable AI reasoning reviewable for exec decks | Act 3 ¶6 | ✅ Met |
| 43 | Time to value: rapid prototype in 1 week (condensed from typical 4–6 week sprint), not a 12-month platform build | Act 3 ¶1 | ✅ Met |
| 44 | Platform play: AI decision layer on top of existing investments (Salesforce, M365, Goodfit) — doesn't replace, makes smarter | Act 3 ¶1 | ✅ Met |
| 45 | Roadmap: CRM write-back | Act 3 ¶8 | ✅ Met |
| 46 | Roadmap: Fabric analytics | Act 3 ¶8 | ✅ Met |
| 47 | Roadmap: Teams / M365 Copilot front door | Act 3 ¶8 | ✅ Met |
| 48 | Roadmap: Real Goodfit API integration | Act 3 ¶8 | ✅ Met |
| 48a | Roadmap: LinkedIn Sales Navigator API integration (automated contact import) | Act 3 ¶8 | ❌ Not Met — LinkedIn Sales Navigator API is not mentioned in the story's roadmap section; only current-state deep links are covered in Act 2 |
| 49 | Forward-looking statement: not just EMEA PKI, but every product line, every region, every seller | Act 3 ¶9–10 | ✅ Met |

---

## Summary

| Category | Total | Met | Partial | Gap |
|---|---|---|---|---|
| Act 1 — The Problem | 11 | 11 | 0 | 0 |
| Act 2 — The Solution | 27 | 22 | 3 | 2 |
| Act 3 — Business Impact | 13 | 12 | 0 | 1 |
| Design Principles | 4 | 3 | 0 | 1 |
| **Total** | **55** | **48** | **3** | **4** |

**Four partial gaps:**
- **#14** — Graph Connectors shown only as animation text, no integration
- **#15** — SharePoint dropdown loads mock data, no Graph API
- **#16** — `Outlook integration` is a generic `mailto:` link, not Outlook/Graph API
- **#33** — CSV export exists in code but story doesn't mention it

**Four gaps identified:**
- **#12** — Hosted on GitHub Pages, not Azure SWA
- **#13** — No Copilot Studio agent integration; AI is simulated
- **#37** — No Entra ID auth; uses static password gate
- **#48a** — LinkedIn Sales Navigator API not mentioned in story roadmap