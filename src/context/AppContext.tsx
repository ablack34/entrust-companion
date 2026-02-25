import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  AccountRecommendation,
  OutreachDraft,
  ProspectingRun,
  RunConfig,
  TargetAccount,
} from '../types';
import { mockRecentRuns } from '../data/mockData';

// ─── State ──────────────────────────────────────────────────

interface AppState {
  runs: ProspectingRun[];
  activeRunId: string | null;
  currentStep: number; // 0=dashboard, 1=import, 2=configure, 3=recommendations, 4=outreach
}

const initialState: AppState = {
  runs: mockRecentRuns,
  activeRunId: null,
  currentStep: 0,
};

// ─── Actions ────────────────────────────────────────────────

type Action =
  | { type: 'CREATE_RUN'; payload: { id: string; name: string } }
  | { type: 'SET_ACTIVE_RUN'; payload: string }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'IMPORT_ACCOUNTS'; payload: { runId: string; accounts: TargetAccount[] } }
  | { type: 'SET_RUN_CONFIG'; payload: { runId: string; config: RunConfig } }
  | { type: 'SET_RECOMMENDATIONS'; payload: { runId: string; recommendations: AccountRecommendation[] } }
  | { type: 'UPDATE_RECOMMENDATION_STATUS'; payload: { runId: string; rank: number; status: AccountRecommendation['status'] } }
  | { type: 'UPDATE_RECOMMENDATION'; payload: { runId: string; rank: number; updates: Partial<Pick<AccountRecommendation, 'accountName' | 'reasoning'> & { bestContact: Partial<AccountRecommendation['bestContact']> }> } }
  | { type: 'SET_OUTREACH_DRAFTS'; payload: { runId: string; drafts: OutreachDraft[] } }
  | { type: 'SET_RUN_STATUS'; payload: { runId: string; status: ProspectingRun['status'] } };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'CREATE_RUN': {
      const newRun: ProspectingRun = {
        id: action.payload.id,
        name: action.payload.name,
        date: new Date().toISOString().split('T')[0],
        accountCount: 0,
        status: 'importing',
      };
      return { ...state, runs: [newRun, ...state.runs], activeRunId: newRun.id };
    }
    case 'SET_ACTIVE_RUN':
      return { ...state, activeRunId: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'IMPORT_ACCOUNTS':
      return {
        ...state,
        runs: state.runs.map((r) =>
          r.id === action.payload.runId
            ? { ...r, accounts: action.payload.accounts, accountCount: action.payload.accounts.length, status: 'configuring' as const }
            : r
        ),
      };
    case 'SET_RUN_CONFIG':
      return {
        ...state,
        runs: state.runs.map((r) =>
          r.id === action.payload.runId ? { ...r, config: action.payload.config } : r
        ),
      };
    case 'SET_RECOMMENDATIONS':
      return {
        ...state,
        runs: state.runs.map((r) =>
          r.id === action.payload.runId
            ? { ...r, recommendations: action.payload.recommendations, status: 'review' as const }
            : r
        ),
      };
    case 'UPDATE_RECOMMENDATION_STATUS':
      return {
        ...state,
        runs: state.runs.map((r) =>
          r.id === action.payload.runId
            ? {
                ...r,
                recommendations: r.recommendations?.map((rec) =>
                  rec.rank === action.payload.rank ? { ...rec, status: action.payload.status } : rec
                ),
              }
            : r
        ),
      };
    case 'UPDATE_RECOMMENDATION':
      return {
        ...state,
        runs: state.runs.map((r) =>
          r.id === action.payload.runId
            ? {
                ...r,
                recommendations: r.recommendations?.map((rec) =>
                  rec.rank === action.payload.rank
                    ? {
                        ...rec,
                        ...action.payload.updates,
                        bestContact: {
                          ...rec.bestContact,
                          ...(action.payload.updates.bestContact ?? {}),
                        },
                        status: 'edited' as const,
                      }
                    : rec
                ),
              }
            : r
        ),
      };
    case 'SET_OUTREACH_DRAFTS':
      return {
        ...state,
        runs: state.runs.map((r) =>
          r.id === action.payload.runId ? { ...r, outreachDrafts: action.payload.drafts } : r
        ),
      };
    case 'SET_RUN_STATUS':
      return {
        ...state,
        runs: state.runs.map((r) =>
          r.id === action.payload.runId ? { ...r, status: action.payload.status } : r
        ),
      };
    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);

// Helper to get active run
export const useActiveRun = (): ProspectingRun | undefined => {
  const { state } = useApp();
  return state.runs.find((r) => r.id === state.activeRunId);
};
