# Prospect Prioritization Companion — Story Diagram & Storytelling Guide

> Use this document alongside the narrative story. Each diagram maps to an Act, with speaker annotations to guide the storytelling flow.

---

## Overview: The Three-Act Arc

```mermaid
flowchart LR
    subgraph ACT1["🔴 ACT 1 — The Problem"]
        direction TB
        A1["`**The List**
        Sarah receives 1,247 accounts
        in a flat CSV every quarter`"]
    end

    subgraph ACT2["🟢 ACT 2 — The Solution"]
        direction TB
        A2["`**The Companion**
        Upload → Configure → Score →
        Outreach in 11 minutes`"]
    end

    subgraph ACT3["🔵 ACT 3 — The Return"]
        direction TB
        A3["`**The Value**
        Days → Minutes
        Pattern scales across
        all product lines & regions`"]
    end

    ACT1 --> ACT2 --> ACT3

    style ACT1 fill:#fce4ec,stroke:#c62828,color:#000
    style ACT2 fill:#e8f5e9,stroke:#2e7d32,color:#000
    style ACT3 fill:#e3f2fd,stroke:#1565c0,color:#000
```

> **Speaker note:** Open with the arc. "This is a story in three parts — a problem everyone in sales recognises, a prototype we built in hours, and the compounding value it unlocks."

---

## Act 1: The Problem — Sarah's Current Workflow

### Pain Journey

```mermaid
journey
    title Sarah's Quarterly Prospecting — Before the Companion
    section The List Arrives
      Open Goodfit CSV in inbox: 3: Sarah
      See 1,247 raw accounts: 2: Sarah
    section Manual Cross-Reference
      Open Salesforce + CSV side-by-side: 2: Sarah
      Click into records one by one: 1: Sarah
      Search for CISOs and IT Directors: 2: Sarah
      Check if contacts are current: 1: Sarah
    section The Scoring Gap
      No systematic scoring method: 1: Sarah
      Rely on gut feel and tribal knowledge: 2: Sarah
      Suspect insurance is a good vertical: 2: Sarah
    section CRM Data Entropy
      Find Beta Holdings appears twice: 1: Sarah
      Waste 20 min on duplicate records: 1: Sarah
      Put ambiguous accounts in maybe pile: 2: Sarah
    section Generic Outreach
      No time to research every account: 1: Sarah
      Send template emails: 2: Sarah
      Miss high-intent accounts at row 312: 1: Sarah
    section Result
      Two weeks consumed: 1: Sarah
      Buying windows narrowed: 1: Sarah
      Another list already arriving: 1: Sarah
```

> **Speaker note:** "This is Sarah Chen — enterprise rep, EMEA, PKI solutions. She's closed seven-figure deals. But the hardest part of her job isn't closing. It's finding which deals to chase."

### The Manual Process (Detail)

```mermaid
flowchart TD
    CSV["`📄 **Goodfit CSV Arrives**
    1,247 EMEA accounts
    Flat file, no intelligence`"]

    CSV --> TAB1["`🖥️ Open Salesforce
    in Browser Tab 1`"]
    CSV --> TAB2["`📊 Open CSV
    in Browser Tab 2`"]

    TAB1 --> XREF["`🔄 **Manual Cross-Reference**
    Click into records one by one
    _Does Acme already have a relationship?_
    _Is there an open opportunity?_
    _Who's the CISO?_`"]
    TAB2 --> XREF

    XREF --> PERSONA["`👤 **Persona Mapping**
    Entirely manual
    No way to answer: which of 1,247
    have a known buyer in CRM?`"]

    PERSONA --> SCORING["`📉 **No Real Scoring**
    Gut feel + tribal knowledge
    Financial Services 'seems strong'
    'Suspects' don't build pipeline`"]

    SCORING --> DUPES["`⚠️ **CRM Data Entropy**
    Beta Holdings Ltd vs Beta Holdings Group
    3 contacts vs 8 contacts
    Which is real? No time to find out`"]

    DUPES --> OUTREACH["`📧 **Generic Outreach**
    Template emails
    No mention of expiring contracts,
    regulation, or prior conversations`"]

    OUTREACH --> RESULT["`⏱️ **Result: 2 Weeks Lost**
    Buying windows narrowed
    Competitors moved faster
    Next list already arriving`"]

    style CSV fill:#fff3e0,stroke:#e65100
    style XREF fill:#fce4ec,stroke:#c62828
    style PERSONA fill:#fce4ec,stroke:#c62828
    style SCORING fill:#fce4ec,stroke:#c62828
    style DUPES fill:#fff8e1,stroke:#f57f17
    style OUTREACH fill:#fce4ec,stroke:#c62828
    style RESULT fill:#ffebee,stroke:#b71c1c
```

> **Speaker note:** Pause on the quote — *"The worst part isn't the manual work — it's knowing that somewhere in that list, there are accounts with an expiring contract and a CISO who's actively looking for alternatives. And I'm going to miss them because I ran out of time on row 312."*

---

## Act 2: The Solution — The Companion Workflow

### Solution Journey

```mermaid
journey
    title Sarah's Tuesday Morning — With the Companion
    section Dashboard
      Open the Companion: 5: Sarah
      See 40K accounts imported: 5: Sarah
      Click Start New Prospecting Pass: 5: Sarah
    section Upload
      Upload Goodfit CSV: 5: Sarah
      Preview grid with field detection: 5: Sarah
      Spot expiring Symantec contract instantly: 5: Sarah
    section Configure Rules
      Select PKI product line and EMEA: 5: Sarah
      Set persona priorities CISO=95 ITDir=80: 5: Sarah
      Set scoring weights: 5: Sarah
    section AI Prioritization
      Click Run Prioritization: 5: Sarah
      Watch AI analyze all 1,247 accounts: 5: Sarah
    section Review Recommendations
      Acme Corp Score 94 — Approve: 5: Sarah
      Meridian Insurance Score 91 — Approve: 5: Sarah
      Beta Holdings Score 87 — Flag for review: 4: Sarah
    section Outreach
      Generate personalized outreach packs: 5: Sarah
      Edit one word and copy to Outlook: 5: Sarah
      Done in 11 minutes: 5: Sarah
```

> **Speaker note:** "Same person. Same data. Same Tuesday morning. Completely different outcome."

### The Companion Workflow (Step-by-Step)

```mermaid
flowchart TD
    START["`🏠 **Dashboard**
    40,127 accounts imported
    2,340 prioritized this month
    156 outreach packs sent`"]

    START --> UPLOAD["`📤 **Upload Goodfit CSV**
    1,247 EMEA accounts
    Instant field detection
    ✨ Enrichment visible immediately:
    _Acme Corp — Expiring Symantec
    contract Q2 2026_`"]

    UPLOAD --> CONFIG["`⚙️ **Configure Scoring Rules**`"]

    subgraph RULES["What Sarah Configures"]
        direction LR
        R1["`**Product Line**
        PKI / Certificate
        Solutions`"]
        R2["`**Personas**
        CISO → 95
        IT Director → 80
        IAM Lead → 70`"]
        R3["`**Weights**
        Persona Fit — 80%
        Industry — 70%
        Company Size — 60%
        CRM Signals — 40%
        Web/Intent — 30%`"]
    end

    CONFIG --> RULES
    RULES --> RUN["`▶️ **Run Prioritization**`"]

    subgraph ENGINE["What Happens Behind the Scenes"]
        direction TB
        E1["`🤖 Copilot Studio
        orchestrates AI reasoning`"]
        E2["`🔗 Graph Connectors
        query Salesforce index
        (read-only, item-level ACLs)`"]
        E3["`📊 Graph API
        cross-references Goodfit data
        from SharePoint`"]
        E4["`🧠 AI scores every account
        against weighted criteria
        + generates explanations`"]
        E1 --> E2 --> E3 --> E4
    end

    RUN --> ENGINE
    ENGINE --> RECS["`⭐ **Recommendations Screen**
    _— The Hero Moment —_`"]

    subgraph ACCOUNTS["Ranked Accounts with AI Reasoning"]
        direction TB
        ACC1["`✅ **Acme Corp — 94/100**
        CISO Jane Smith in Salesforce
        Financial Services, 5,200 emp
        Expiring Symantec contract Q2 2026
        No existing Entrust relationship`"]

        ACC2["`✅ **Meridian Insurance — 91/100**
        VP InfoSec Pierre Dubois
        Digital transformation initiative
        Expected RFP H2 2026
        Dormant lead from 2024`"]

        ACC3["`✅ **Gamma Financial — 89/100**
        IT Director Klaus Weber
        EU digital identity regulation
        Previous demo request 2025 went cold
        Re-engagement opportunity`"]

        ACC4["`⚠️ **Beta Holdings — 87/100**
        NEEDS REVIEW — CRM Duplicate
        'Beta Holdings Ltd' vs 'Group'
        Shared domain, different records
        Contact email missing`"]
    end

    RECS --> ACCOUNTS

    ACCOUNTS --> ACTION{"`**Sarah's Decision**
    3 clicks per account`"}

    ACTION -->|Approve| APPROVED["✅ Approved for Outreach"]
    ACTION -->|Flag| FLAGGED["🔍 Flagged for Review"]
    ACTION -->|Dismiss| DISMISSED["❌ Dismissed"]

    APPROVED --> OUTREACH_PACK["`📨 **Generate Outreach Pack**
    Personalized emails per account
    NOT templates — signal-informed`"]

    subgraph EMAIL["Example: Acme Corp Draft"]
        direction TB
        DRAFT["`_'With Acme Corp's Symantec certificate
        contract approaching its Q2 2026 renewal
        window, this is the moment most enterprise
        CISOs reassess their PKI strategy —
        particularly around automation,
        crypto-agility, and compliance posture.'_`"]
        PROV["`📋 **Personalization Note**
        Sources: expiring contract, company size,
        industry vertical, CISO role match`"]
    end

    OUTREACH_PACK --> EMAIL
    EMAIL --> OUTLOOK["`📧 **Open in Outlook**
    Copy with one click
    Ready to send`"]

    OUTLOOK --> DONE["`⏱️ **Total Time: 11 Minutes**`"]

    style START fill:#e3f2fd,stroke:#1565c0
    style UPLOAD fill:#e8f5e9,stroke:#2e7d32
    style CONFIG fill:#fff3e0,stroke:#e65100
    style RUN fill:#f3e5f5,stroke:#6a1b9a
    style RECS fill:#fff8e1,stroke:#f57f17
    style ACC4 fill:#fff3e0,stroke:#e65100
    style DONE fill:#e8f5e9,stroke:#2e7d32
    style OUTREACH_PACK fill:#e8f5e9,stroke:#2e7d32
    style OUTLOOK fill:#e3f2fd,stroke:#1565c0
```

> **Speaker note:** Walk through each step slowly. The hero moment is the Recommendations screen — pause and let the audience read one account card. Then highlight Beta Holdings: "This is where the Companion earns its keep in a different way — it surfaces a CRM problem Sarah would have hit on day three, and asks for her judgment. Human-in-the-loop, not black box."

> **Key quote:** *"The part that got me wasn't the speed — it was the AI telling me why. I've never had a tool that shows its work like that."*

---

## Act 3: The Value — Before vs. After

### Before & After Comparison

```mermaid
flowchart LR
    subgraph BEFORE["🔴 BEFORE — Manual Process"]
        direction TB
        B1["`⏱️ **1–2 Weeks**
        per regional pass`"]
        B2["`📉 **Gut Feel Scoring**
        no systematic method`"]
        B3["`📧 **Template Emails**
        generic, low conversion`"]
        B4["`⚠️ **CRM Problems Hidden**
        found mid-deal`"]
        B5["`🔒 **Opaque Decisions**
        no audit trail`"]
        B1 ~~~ B2 ~~~ B3 ~~~ B4 ~~~ B5
    end

    subgraph AFTER["🟢 AFTER — With Companion"]
        direction TB
        A1["`⏱️ **Under 15 Minutes**
        per regional pass`"]
        A2["`📊 **Data-Driven Scoring**
        weighted, explainable`"]
        A3["`📨 **Signal-Informed Emails**
        references real data points`"]
        A4["`🔍 **CRM Issues Surfaced**
        flagged proactively`"]
        A5["`📋 **Auditable Reasoning**
        every recommendation explained`"]
        A1 ~~~ A2 ~~~ A3 ~~~ A4 ~~~ A5
    end

    BEFORE ---> AFTER

    style BEFORE fill:#ffebee,stroke:#c62828,color:#000
    style AFTER fill:#e8f5e9,stroke:#2e7d32,color:#000
```

> **Speaker note:** "This isn't incremental improvement. Days become minutes. Gut feel becomes a calibration input. Templates become conversations. And CRM problems that used to ambush reps mid-deal are surfaced before outreach even begins."

### Scaling the Pattern

```mermaid
flowchart TD
    PROTO["`🏗️ **Prototype**
    Sarah — EMEA — PKI`"]

    PROTO --> SCALE["`📐 **Same Architecture Scales To**`"]

    subgraph PRODUCTS["Product Lines"]
        direction LR
        P1["PKI / Certificates"]
        P2["Identity Verification"]
        P3["Digital Signing"]
        P4["Certificate Lifecycle Mgmt"]
    end

    subgraph REGIONS["Regions"]
        direction LR
        R1["EMEA"]
        R2["North America"]
        R3["APAC"]
    end

    subgraph SEGMENTS["Segments"]
        direction LR
        S1["Enterprise"]
        S2["Mid-Market"]
        S3["Public Sector"]
    end

    SCALE --> PRODUCTS
    SCALE --> REGIONS
    SCALE --> SEGMENTS

    PRODUCTS --> CHANGE["`🔄 **What Changes per Use Case**
    Scoring weights
    Target personas
    Product-specific signals`"]

    REGIONS --> CHANGE
    SEGMENTS --> CHANGE

    CHANGE --> CONSTANT["`✅ **What Stays the Same**
    Architecture
    AI reasoning pipeline
    Graph Connectors integration
    Scoring framework`"]

    style PROTO fill:#e3f2fd,stroke:#1565c0
    style SCALE fill:#fff3e0,stroke:#e65100
    style CHANGE fill:#fff8e1,stroke:#f57f17
    style CONSTANT fill:#e8f5e9,stroke:#2e7d32
```

> **Speaker note:** "What was built for one seller is a pattern that scales across every product line, region, and segment Entrust sells. The weights change. The personas change. The fundamental problem — turning an undifferentiated list into an actionable, explained outreach plan — is universal."

---

## Quick Reference: Storytelling Beat Sheet

| Beat | Diagram | Key Message | Emotional Note |
|------|---------|-------------|----------------|
| **Open** | Three-Act Arc | "Problem → Solution → Value" | Set expectations |
| **The Pain** | Pain Journey + Manual Process | Sarah is skilled, the system is broken | Empathy |
| **The Quote** | *(pause, no diagram)* | "I ran out of time on row 312" | Frustration |
| **The Turn** | Solution Journey | Same person, same data, different outcome | Relief |
| **The Walkthrough** | Companion Workflow | Step-by-step through the tool | Building excitement |
| **The Hero Moment** | Account Cards in Workflow | AI shows its reasoning | "The part that got me" |
| **The CRM Save** | Beta Holdings (amber card) | Human-in-the-loop, not black box | Trust |
| **The Transformation** | Before vs. After | Days → Minutes, gut → data | Impact |
| **The Scale** | Scaling the Pattern | One prototype → entire org | Strategic vision |
| **The Close** | Roadmap | What's built, what's next | Forward momentum |
