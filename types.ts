
export interface Additive {
  name: string;
  code?: string;
  purpose: string;
  fdaStatus: string;
  healthRisks: string[];
  sources: {
    fda: string;
    academic: string;
  };
  safetyRating: 'SAFE' | 'CAUTION' | 'AVOID';
}

export interface AnalysisResponse {
  productName?: string;
  additives: Additive[];
  summary: string;
}

export enum AppState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
