import {
  AccountRecommendation,
  OutreachDraft,
  ProspectingRun,
  TargetAccount,
} from '../types';

// ─── Mock Data: Recent Runs ─────────────────────────────────

export const mockRecentRuns: ProspectingRun[] = [
  {
    id: 'run-001',
    name: 'EMEA — PKI / Certificate Solutions',
    date: '2026-02-15',
    accountCount: 1247,
    status: 'complete',
  },
  {
    id: 'run-002',
    name: 'NA — Identity & Access Management',
    date: '2026-02-12',
    accountCount: 3412,
    status: 'complete',
  },
  {
    id: 'run-003',
    name: 'APAC — Digital Signing',
    date: '2026-02-10',
    accountCount: 823,
    status: 'review',
  },
];

// ─── Mock Data: Parsed CSV Accounts ─────────────────────────

export const mockParsedAccounts: TargetAccount[] = [
  {
    id: 'acc-001',
    companyName: 'Acme Corp',
    domain: 'acme.com',
    industry: 'Financial Services',
    employeeCount: 5200,
    hqCountry: 'United Kingdom',
    hqCity: 'London',
    goodfitScore: 91,
    annualRevenue: 2400000000,
    productFitTags: ['PKI', 'Certificate Lifecycle'],
    enrichmentNotes: 'Expiring Symantec certificate contract Q2 2026',
  },
  {
    id: 'acc-002',
    companyName: 'Beta Holdings',
    domain: 'betahold.co.uk',
    industry: 'Healthcare',
    employeeCount: 12000,
    hqCountry: 'United Kingdom',
    hqCity: 'Manchester',
    goodfitScore: 85,
    annualRevenue: 890000000,
    productFitTags: ['PKI', 'Identity Verification'],
    enrichmentNotes: 'Recently consolidated IT operations; new CTO appointed',
  },
  {
    id: 'acc-003',
    companyName: 'Gamma Financial Group',
    domain: 'gammafinancial.de',
    industry: 'Financial Services',
    employeeCount: 8500,
    hqCountry: 'Germany',
    hqCity: 'Frankfurt',
    goodfitScore: 88,
    annualRevenue: 5600000000,
    productFitTags: ['PKI', 'Digital Signing', 'Certificate Lifecycle'],
    enrichmentNotes: 'EU digital identity regulation driving PKI investment',
  },
  {
    id: 'acc-004',
    companyName: 'Nordic Secure Systems',
    domain: 'nordicsecure.se',
    industry: 'Technology',
    employeeCount: 3200,
    hqCountry: 'Sweden',
    hqCity: 'Stockholm',
    goodfitScore: 79,
    annualRevenue: 420000000,
    productFitTags: ['Certificate Lifecycle'],
    enrichmentNotes: '',
  },
  {
    id: 'acc-005',
    companyName: 'Meridian Insurance',
    domain: 'meridianins.fr',
    industry: 'Insurance',
    employeeCount: 15000,
    hqCountry: 'France',
    hqCity: 'Paris',
    goodfitScore: 82,
    annualRevenue: 9800000000,
    productFitTags: ['PKI', 'Identity Verification', 'Digital Signing'],
    enrichmentNotes: 'Undergoing digital transformation; RFP for identity platform expected H2 2026',
  },
];

// ─── Mock Data: AI Recommendations ──────────────────────────

export const mockRecommendations: AccountRecommendation[] = [
  {
    rank: 1,
    accountName: 'Acme Corp',
    domain: 'acme.com',
    overallScore: 94,
    factors: {
      personaFit: 95,
      companySizeMatch: 85,
      industryRelevance: 92,
      crmSignals: 88,
      webIntentSignals: 90,
    },
    bestContact: {
      name: 'Jane Smith',
      title: 'CISO',
      email: 'jane.smith@acme.com',
      emailSource: 'salesforce',
      source: 'salesforce',
      discovery: 'matched',
      discoveryNote: 'Contact matched via Salesforce Account → Contact relationship. Goodfit domain (acme.com) matched Salesforce Account "Acme Corp" (ID: 001xx00042). Jane Smith is a linked Contact with email on file.',
    },
    reasoning:
      'Acme Corp is a strong persona fit — CISO (Jane Smith) is present in Salesforce with recent activity. Company size (5,200 employees) matches your Enterprise segment. Financial Services is a high-relevance industry for PKI solutions. Web signals indicate an expiring Symantec certificate contract in Q2 2026, creating a near-term buying window. No existing Entrust relationship in CRM.',
    needsReview: false,
    reviewReason: null,
    status: 'pending',
  },
  {
    rank: 2,
    accountName: 'Meridian Insurance',
    domain: 'meridianins.fr',
    overallScore: 91,
    factors: {
      personaFit: 88,
      companySizeMatch: 92,
      industryRelevance: 95,
      crmSignals: 75,
      webIntentSignals: 93,
    },
    bestContact: {
      name: 'Pierre Dubois',
      title: 'VP of Information Security',
      email: 'p.dubois@meridianins.fr',
      emailSource: 'salesforce',
      source: 'salesforce',
      discovery: 'matched',
      discoveryNote: 'Contact matched via Salesforce Account → Contact relationship. Domain meridianins.fr matched Salesforce Account "Meridian Insurance SA" (ID: 001xx00187). Pierre Dubois is linked as a Contact with a dormant Lead from 2024.',
    },
    reasoning:
      'Meridian Insurance is a large enterprise (15,000 employees) in the Insurance sector — highly regulated and a strong fit for PKI and identity solutions. VP of Information Security is a key buyer persona. Web signals indicate an upcoming RFP for identity platform in H2 2026 and an active digital transformation initiative. Existing Salesforce record shows a dormant lead from 2024.',
    needsReview: false,
    reviewReason: null,
    status: 'pending',
  },
  {
    rank: 3,
    accountName: 'Gamma Financial Group',
    domain: 'gammafinancial.de',
    overallScore: 89,
    factors: {
      personaFit: 82,
      companySizeMatch: 88,
      industryRelevance: 95,
      crmSignals: 70,
      webIntentSignals: 88,
    },
    bestContact: {
      name: 'Klaus Weber',
      title: 'IT Director — Infrastructure',
      email: 'k.weber@gammafinancial.de',
      emailSource: 'salesforce',
      source: 'salesforce',
      discovery: 'matched',
      discoveryNote: 'Contact matched via Salesforce Account → Contact relationship. Domain gammafinancial.de matched Salesforce Account "Gamma Financial Group GmbH" (ID: 001xx00093). Klaus Weber is linked with a previous demo request (2025).',
    },
    reasoning:
      'Gamma Financial Group is well-matched on industry (Financial Services, Frankfurt-based) and size (8,500 employees). IT Director is the secondary buyer persona for PKI. EU digital identity regulation is driving PKI investment across German financial institutions. Salesforce shows a previous demo request (2025) that went cold — opportunity to re-engage with a timely regulatory angle.',
    needsReview: false,
    reviewReason: null,
    status: 'pending',
  },
  {
    rank: 4,
    accountName: 'Beta Holdings',
    domain: 'betahold.co.uk',
    overallScore: 87,
    factors: {
      personaFit: 78,
      companySizeMatch: 90,
      industryRelevance: 80,
      crmSignals: 65,
      webIntentSignals: 85,
    },
    bestContact: {
      name: 'Mark Lee',
      title: 'IT Director',
      email: null,
      emailSource: 'none',
      source: 'salesforce',
      discovery: 'partial',
      discoveryNote: 'Contact found in Salesforce but email field is blank. Two matching Salesforce Accounts exist for domain betahold.co.uk — "Beta Holdings Ltd" (3 contacts) and "Beta Holdings Group" (8 contacts). Mark Lee appears under "Beta Holdings Group" with no email on file. Manual enrichment needed.',
    },
    reasoning:
      'Beta Holdings recently consolidated IT operations and appointed a new CTO — organizational change often triggers security infrastructure reviews. IT Director (Mark Lee) is the primary buyer persona for PKI in the Healthcare segment. Company size (12,000) is a strong fit. However, email is not available in Salesforce for this contact.',
    needsReview: true,
    reviewReason:
      'Two Salesforce account records found: "Beta Holdings Ltd" (Account ID: 001xx00001) and "Beta Holdings Group" (Account ID: 001xx00002). Both share the domain betahold.co.uk. The "Ltd" record has 3 contacts and 1 closed-lost opportunity; the "Group" record has 8 contacts and no opportunities. Recommend confirming which entity is the target for outreach.',
    status: 'pending',
  },
  {
    rank: 5,
    accountName: 'Nordic Secure Systems',
    domain: 'nordicsecure.se',
    overallScore: 76,
    factors: {
      personaFit: 60,
      companySizeMatch: 78,
      industryRelevance: 72,
      crmSignals: 45,
      webIntentSignals: 68,
    },
    bestContact: {
      name: 'Elsa Lindqvist',
      title: 'Head of IT Operations',
      email: 'elsa.lindqvist@nordicsecure.se',
      emailSource: 'inferred',
      source: 'inferred',
      discovery: 'inferred',
      discoveryNote: 'No Salesforce Account found for domain nordicsecure.se. Contact inferred from Goodfit enrichment data (LinkedIn profile match). Email address is a standard corporate pattern — not CRM-validated. Recommend verifying before outreach.',
    },
    reasoning:
      'Nordic Secure Systems is a mid-size technology company (3,200 employees) with Certificate Lifecycle as a product fit tag. Head of IT Operations is a secondary persona match. No direct CISO or VP Security contact found in Salesforce — this contact was inferred from LinkedIn data in the Goodfit enrichment. Limited CRM history (no prior Entrust interactions). Lower confidence overall due to weaker persona fit and CRM signals.',
    needsReview: false,
    reviewReason: null,
    status: 'pending',
  },
];

// ─── Mock Data: Outreach Drafts ─────────────────────────────

export const mockOutreachDrafts: OutreachDraft[] = [
  {
    contactName: 'Jane Smith',
    contactTitle: 'CISO',
    contactEmail: 'jane.smith@acme.com',
    contactEmailSource: 'salesforce',
    contactSource: 'salesforce',
    contactDiscovery: 'matched',
    accountName: 'Acme Corp',
    subject: "Acme's Certificate Renewal — A Timely Conversation",
    body: `Jane,

With Acme Corp's Symantec certificate contract approaching its Q2 2026 renewal window, this is the moment most enterprise CISOs reassess their PKI strategy — particularly around automation, crypto-agility, and compliance posture.

Entrust is helping organizations like yours consolidate certificate lifecycle management across hybrid environments while preparing for post-quantum readiness. Given Acme's scale (5,200+ employees across financial services), I'd expect your team is weighing similar priorities.

Would a 20-minute call next week make sense to compare notes on what we're seeing in the market?

Best,
{{seller_name}}
Entrust — Enterprise Sales`,
    personalizationNotes:
      'Referenced: expiring Symantec contract (Q2 2026), company size (5,200), Financial Services industry, CISO role. Points to timely renewal window as hook.',
  },
  {
    contactName: 'Pierre Dubois',
    contactTitle: 'VP of Information Security',
    contactEmail: 'p.dubois@meridianins.fr',
    contactEmailSource: 'salesforce',
    contactSource: 'salesforce',
    contactDiscovery: 'matched',
    accountName: 'Meridian Insurance',
    subject: 'Digital Identity in Insurance — Where Meridian Fits',
    body: `Pierre,

Meridian's digital transformation initiative caught my attention — particularly as your team evaluates identity platform options ahead of H2 2026. In the insurance sector, we're seeing security leaders prioritize PKI and digital signing to meet both regulatory requirements and customer trust expectations.

Entrust works with several large European insurers on exactly this: unified identity and certificate management that scales across 15,000+ employee environments without adding operational complexity.

I'd welcome 20 minutes to share what's working for your peers and hear where Meridian's priorities are heading.

Regards,
{{seller_name}}
Entrust — Enterprise Sales`,
    personalizationNotes:
      'Referenced: digital transformation initiative, H2 2026 RFP timeline, Insurance industry, 15,000 employees, European regulatory context. VP of Information Security role alignment.',
  },
  {
    contactName: 'Klaus Weber',
    contactTitle: 'IT Director — Infrastructure',
    contactEmail: 'k.weber@gammafinancial.de',
    contactEmailSource: 'salesforce',
    contactSource: 'salesforce',
    contactDiscovery: 'matched',
    accountName: 'Gamma Financial Group',
    subject: 'PKI & EU Digital Identity — Gamma Financial',
    body: `Klaus,

With the EU digital identity regulation reshaping requirements for financial institutions, Frankfurt-based organizations like Gamma Financial Group are at the leading edge of PKI modernization.

I noticed your team explored certificate solutions with Entrust in 2025 — since then, we've significantly expanded our automation and crypto-agility capabilities, specifically for enterprise infrastructure teams managing complex hybrid environments. Given Gamma's scale (8,500+ employees), I suspect the regulatory timeline has made this more urgent.

Could we reconnect for a brief call to discuss what's changed on both sides?

Best,
{{seller_name}}
Entrust — Enterprise Sales`,
    personalizationNotes:
      'Referenced: EU digital identity regulation, previous demo request (2025), Frankfurt HQ, 8,500 employees, Financial Services industry. Re-engagement angle with updated capabilities.',
  },
];

// ─── Summary Stats ──────────────────────────────────────────

export const mockDashboardStats = {
  totalImported: 40127,
  prioritizedThisMonth: 2340,
  outreachPacksSent: 156,
};
