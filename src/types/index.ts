// ─── Core Data Models ───────────────────────────────────────

export interface TargetAccount {
  id: string;
  companyName: string;
  domain: string;
  industry: string;
  employeeCount: number;
  hqCountry: string;
  hqCity: string;
  goodfitScore: number;
  annualRevenue?: number;
  productFitTags: string[];
  enrichmentNotes?: string;
}

export interface Persona {
  id: string;
  title: string;
  enabled: boolean;
  priority: number; // 0–100
}

export interface ScoringWeights {
  personaFit: number;
  companySizeMatch: number;
  industryRelevance: number;
  crmSignals: number;
  webIntentSignals: number;
}

export interface RunConfig {
  productLine: string;
  region: string;
  segment: string;
  personas: Persona[];
  weights: ScoringWeights;
}

// ─── Agent Response Models ──────────────────────────────────

export interface ScoringFactors {
  personaFit: number;
  companySizeMatch: number;
  industryRelevance: number;
  crmSignals: number;
  webIntentSignals: number;
}

export type ContactSource = 'salesforce' | 'goodfit' | 'inferred' | 'none';
export type ContactDiscovery = 'matched' | 'partial' | 'inferred' | 'not-found';

export interface BestContact {
  name: string;
  title: string;
  email: string | null;
  emailSource: ContactSource;
  source: ContactSource;
  /** How the contact was associated to this account */
  discovery: ContactDiscovery;
  /** Human-readable explanation of how we found this contact */
  discoveryNote: string;
}

export interface AccountRecommendation {
  rank: number;
  accountName: string;
  domain: string;
  overallScore: number;
  factors: ScoringFactors;
  bestContact: BestContact;
  reasoning: string;
  needsReview: boolean;
  reviewReason: string | null;
  status: 'pending' | 'approved' | 'dismissed' | 'edited';
}

export interface OutreachDraft {
  contactName: string;
  contactTitle: string;
  contactEmail: string | null;
  contactEmailSource: ContactSource;
  contactSource: ContactSource;
  contactDiscovery: ContactDiscovery;
  accountName: string;
  subject: string;
  body: string;
  personalizationNotes: string;
}

// ─── Run State ──────────────────────────────────────────────

export interface ProspectingRun {
  id: string;
  name: string;
  date: string;
  accountCount: number;
  status: 'importing' | 'configuring' | 'processing' | 'review' | 'complete';
  config?: RunConfig;
  accounts?: TargetAccount[];
  recommendations?: AccountRecommendation[];
  outreachDrafts?: OutreachDraft[];
}
