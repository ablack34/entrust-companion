# The Prospect Prioritization Companion
### How Entrust turned 40,000 raw accounts into actionable pipeline — in minutes, not weeks

---

## Act 1: The List

Every quarter, Sarah Chen opens her inbox and finds the same thing waiting for her: a spreadsheet. Specifically, a 1,247-row CSV from Goodfit — Entrust's third-party data provider — containing every company in EMEA that matches some combination of firmographic and technographic criteria for PKI and certificate lifecycle management solutions.

Forty thousand accounts a year, delivered in flat files. This is how a global cybersecurity company's sales motion begins.

Sarah is an enterprise sales rep covering EMEA for Entrust's PKI solutions. She's good at her job. She's closed seven-figure deals with financial institutions undergoing post-quantum readiness assessments, and she's guided healthcare organizations through complex certificate rollouts mandated by EU digital identity regulation. But closing deals isn't the hard part anymore. *Finding the right deals to chase* — that's the hard part.

When that Goodfit list lands, Sarah's real work begins. She opens Salesforce in one browser tab, the CSV in another, and starts the manual cross-reference that will consume most of her week. Does Acme Corp already have an Entrust relationship? Is there an open opportunity? Who's the CISO? Is there even a CISO in the contact database, or just a "Head of IT" from a trade show badge scan three years ago?

The persona-to-account mapping is entirely manual. Sarah knows she's looking for CISOs, IT Directors, and Identity & Access Management leads — these are the buyers who sign off on PKI investments. But figuring out which of the 1,247 companies actually have those personas in Salesforce, and whether the contact data is current, means clicking into records one by one. There's no systematic way to answer: *Of these 1,247 accounts, which ones already have a known buyer contact in our CRM?*

There's no scoring either — not really. Sarah relies on gut feel, tribal knowledge, and whatever research she can squeeze between pipeline reviews. She knows Financial Services is a strong vertical for PKI. She suspects insurance companies undergoing digital transformation are good targets. But "suspects" doesn't build pipeline, and gut feel doesn't scale across 1,247 accounts.

Then there's the CRM itself. Sarah's Salesforce instance is a monument to years of accumulated data entropy. Beta Holdings appears twice — once as "Beta Holdings Ltd" with three contacts and a closed-lost opportunity from 2023, and again as "Beta Holdings Group" with eight contacts and no opportunity history. Which one is the real account? Are the contacts duplicated? Sarah doesn't know, and she doesn't have time to find out, so Beta Holdings goes into the "maybe later" pile.

The outreach that eventually results from this process is, inevitably, generic. Sarah doesn't have time to research every account's situation — whether they have an expiring Symantec certificate contract, whether their industry is facing new regulatory pressure, whether they explored Entrust solutions last year and the conversation went cold. So the emails she sends read like templates, because that's what they are.

> *"The worst part isn't the manual work — it's knowing that somewhere in that list, there are accounts with an expiring contract and a CISO who's actively looking for alternatives. And I'm going to miss them because I ran out of time on row 312."*

By the time Sarah has worked through the list, identified her top prospects, cleaned up enough CRM data to feel confident, and drafted personalized outreach for a couple of dozen accounts — two weeks have passed. The buying window for some of those accounts has already narrowed. The competitive landscape has shifted. And another Goodfit list is on its way.

This isn't a failure of effort or skill. This is a systems problem. Sarah has all the data she needs — it's just scattered across Salesforce, Goodfit exports, and her own institutional memory, with no intelligence layer connecting them.

---

## Act 2: The Companion

The Prospect Prioritization Companion was designed around a single question: *What if Sarah could go from a raw Goodfit list to ranked, explained, ready-to-send outreach in under fifteen minutes?*

Not a dashboard. Not an analytics layer that tells her what happened last quarter. A working tool that does the job she's currently doing by hand — cross-referencing CRM data, scoring accounts against her ideal customer profile, explaining why each account matters, flagging CRM problems, and drafting outreach that references real signals — but does it in the time it takes to drink a coffee.

Here's what that looks like in practice.

**Sarah opens the Companion on a Tuesday morning.** The dashboard greets her with the numbers that frame her world: 40,127 accounts imported across all runs, 2,340 prioritized this month, 156 outreach packs sent. Three recent prospecting runs are visible — her completed EMEA PKI pass from last week, a North America identity management run, and an APAC digital signing run still in review. She clicks "Start New Prospecting Pass."

**She uploads the fresh Goodfit CSV — 1,247 EMEA accounts for PKI.** The file is parsed instantly. A preview grid shows the first rows with field detection already complete: Company, Domain, Industry, Employee Count, Goodfit Score. Acme Corp appears at the top — Financial Services, 5,200 employees, London, Goodfit Score 91, with an enrichment note that stops her mid-scroll: *"Expiring Symantec certificate contract Q2 2026."* In her old workflow, she might not have noticed that note until day three. Here, it's visible in seconds.

**She configures the scoring rules.** This is the step that codifies what used to live in Sarah's head. She selects the product line (PKI / Certificate Solutions), region (EMEA), and segment (Enterprise, 1,000+ employees). Then she configures her target personas — CISO at priority 95, IT Director at 80, Identity & Access Management Lead at 70. She leaves Procurement and CTO/CIO disabled; those are secondary personas she doesn't want to dilute the scoring. Finally, she sets the scoring weights: persona fit at 80%, industry relevance at 70%, company size at 60%, CRM signals at 40%, web and intent signals at 30%. These aren't arbitrary — they reflect how Sarah actually makes decisions, now made explicit and repeatable.

**She clicks "Run Prioritization" and watches the Companion work.** A progress animation shows each stage: *Analyzing 1,247 accounts... Querying Salesforce data via Microsoft Graph... Matching personas across contacts... Scoring & ranking by weighted criteria... Generating explanations... Flagging accounts that need review.*

Behind that animation, the architecture is doing something Sarah could never do manually. A Copilot Studio agent is orchestrating the AI reasoning. Microsoft Graph Connectors are querying a read-only index of Salesforce CRM data — Accounts, Contacts, Leads, Opportunities — respecting item-level access controls. The Goodfit data, staged in a SharePoint list, is being cross-referenced via Graph API. Every account is being scored against Sarah's weighted criteria, with natural-language reasoning generated for each result.

**The Recommendations screen loads. This is the hero moment.**

Account #1: **Acme Corp — Score 94/100.** The AI reasoning is specific and grounded: *"CISO (Jane Smith) is present in Salesforce with recent activity. Company size (5,200 employees) matches your Enterprise segment. Financial Services is a high-relevance industry for PKI solutions. Web signals indicate an expiring Symantec certificate contract in Q2 2026, creating a near-term buying window. No existing Entrust relationship in CRM."* The factor breakdown shows persona fit at 95%, industry relevance at 92%, web signals at 90%. Below the reasoning, a data provenance badge confirms: contact sourced from Salesforce CRM, domain matched, email CRM-verified.

Account #2: **Meridian Insurance — Score 91/100.** Pierre Dubois, VP of Information Security, is the recommended contact. The reasoning highlights what Sarah would have taken an hour to piece together: a digital transformation initiative, an expected RFP for identity platform in H2 2026, and a dormant Salesforce lead from 2024. The AI doesn't just score the account — it tells her *why* this account deserves her attention right now.

Account #3: **Gamma Financial Group — Score 89/100.** Klaus Weber, IT Director, is the contact. The reasoning references EU digital identity regulation driving PKI investment across German financial institutions — and flags that Salesforce shows a previous demo request from 2025 that went cold. This is a re-engagement opportunity with a timely regulatory angle, and the AI has connected those dots automatically.

**Then Sarah hits Account #4, and the Companion earns its keep in a different way.**

Beta Holdings — Score 87/100. But this card looks different. It's bordered in amber, and a "Needs Review" warning is prominently displayed: *"Two Salesforce account records found: 'Beta Holdings Ltd' (Account ID: 001xx00001) and 'Beta Holdings Group' (Account ID: 001xx00002). Both share the domain betahold.co.uk. The 'Ltd' record has 3 contacts and 1 closed-lost opportunity; the 'Group' record has 8 contacts and no opportunities. Recommend confirming which entity is the target for outreach."*

This is the CRM duplicate that Sarah would have encountered on day three of her manual process, lost twenty minutes to, and probably set aside. The Companion surfaced it proactively, explained the ambiguity, and asked for her judgment. The IT Director contact, Mark Lee, is shown with a data provenance badge reading "Partial match" and a note that his email field is blank in Salesforce. Human-in-the-loop, not black-box.

Sarah approves Acme Corp, Meridian Insurance, and Gamma Financial Group. She flags Beta Holdings for review. She dismisses Nordic Secure Systems (score 76, weaker persona fit, inferred contact). Three clicks per account — Approve, Edit, or Dismiss.

**She clicks "Generate Outreach Pack" and the final step unfolds.** For each approved account, the Companion has drafted a personalized email. These aren't templates with a company name swapped in. The draft for Jane Smith at Acme Corp opens with: *"With Acme Corp's Symantec certificate contract approaching its Q2 2026 renewal window, this is the moment most enterprise CISOs reassess their PKI strategy — particularly around automation, crypto-agility, and compliance posture."* Each draft includes a personalization note explaining which data points informed the messaging: the expiring contract, the company size, the industry, the role.

Sarah edits one word in the Meridian email, copies the Acme draft with one click, and hits "Open in Outlook" to hand the email off for sending. The entire process — from CSV upload to personalized outreach ready for delivery — has taken eleven minutes.

> *"The part that got me wasn't the speed — it was the AI telling me why. I've never had a tool that shows its work like that."*

---

## Act 3: The Return

The Prospect Prioritization Companion is a rapid prototype built in four to six weeks on Microsoft's enterprise stack — Copilot Studio, Graph Connectors, Azure Static Web Apps, M365 integration. It is not a twelve-month platform build. It is not a replacement for Salesforce, or Goodfit, or any tool in Entrust's existing motion. It is an AI decision layer that sits on top of those investments and makes all of them more useful.

The business value is concrete and measurable.

**Seller productivity transforms from days to minutes.** The manual process of cross-referencing a Goodfit list against Salesforce, identifying target personas, scoring accounts, and drafting outreach consumed one to two weeks of calendar time for a single EMEA pass. The Companion compresses that to under fifteen minutes of active work. For a sales organization running multiple regional passes per quarter across multiple product lines, the compounding effect on seller capacity is significant.

**Pipeline quality improves because decisions are data-driven.** The Companion doesn't replace Sarah's judgment — it augments it with a weighted scoring model that evaluates persona fit, company size, industry relevance, CRM signals, and web intent data simultaneously. Every recommendation comes with an explanation that can be reviewed, challenged, and refined. Gut feel becomes a calibration input, not the entire method.

**Outreach effectiveness increases because messaging is signal-informed.** A personalized email that references an expiring certificate contract, an upcoming regulatory deadline, or a previous demo request is categorically different from a template. It demonstrates that the seller understands the prospect's situation. The Companion generates these drafts automatically, pulling from the same data that informed the ranking — turning intelligence into communication without an additional research step.

**CRM data quality improves as a side effect.** By cross-referencing Goodfit domains against Salesforce records and flagging duplicates, missing emails, and ambiguous account hierarchies, the Companion surfaces data problems that would otherwise remain hidden until a seller stumbles into them mid-deal. The Beta Holdings example — two records, shared domain, unclear parent-child relationship — is a pattern that exists across thousands of CRM records in most enterprise Salesforce instances. Every flag is an opportunity to clean the data proactively.

**Leadership gains visibility into AI-assisted decision-making.** Every recommendation includes an explainable, auditable reasoning chain. A sales leader reviewing pipeline can see not just which accounts were prioritized, but why — and whether the reasoning aligns with strategic priorities. These explanations can be reviewed in the tool, discussed in pipeline reviews, and captured for executive decks. There is no opaque model producing scores without context.

**The architecture is enterprise-safe by design.** CRM access is read-only through Microsoft Graph Connectors, respecting item-level access controls. There is no write-back to Salesforce in the prototype phase. Authentication is handled through Entra ID. The application accesses only the data the seller is already authorized to see.

The roadmap extends this foundation naturally. CRM write-back — allowing approved recommendations to create or update Salesforce records — is a planned next phase. Integration with Microsoft Fabric would enable longitudinal analytics: which scoring patterns predict closed-won outcomes, which persona weights are most predictive by region, how outreach response rates correlate with recommendation confidence. A Teams and M365 Copilot front door would let sellers access prioritization from within their daily workflow, not a separate application. And direct Goodfit API integration would eliminate the CSV staging step entirely, enabling continuous prospect monitoring rather than periodic batch imports.

But the most important aspect of the roadmap is scope. The prototype was built for Sarah — an EMEA enterprise rep selling PKI solutions. The same architecture, the same scoring framework, the same AI reasoning pipeline, applies to every product line Entrust sells: Identity Verification, Digital Signing, Certificate Lifecycle Management. It applies to every region: North America, APAC, EMEA. It applies to every segment: Enterprise, Mid-Market, Public Sector.

What was built in four to six weeks for one seller's workflow is a pattern that scales across the entire Entrust sales organization. The scoring weights change. The target personas change. The product-specific signals change. But the fundamental problem — turning an undifferentiated prospect list into a prioritized, explained, actionable outreach plan — is universal.

> *This is not a tool that promises value. It is a working prototype that demonstrates it — with real data architecture, real AI reasoning, and real outreach output that a seller would actually send.*

The Prospect Prioritization Companion represents a shift in how Entrust's sales organization converts market intelligence into pipeline. Not by working harder on the same manual process, but by applying an AI decision layer that makes every existing investment — Salesforce, Goodfit, Microsoft 365 — compound in value. When forty thousand accounts land next quarter, the question won't be which ones Sarah can get to. It will be which ones the Companion has already ranked, explained, and prepared for her — before she finishes her coffee.
