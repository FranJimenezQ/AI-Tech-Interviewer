export type SeniorityLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
export type AnalysisStatus = 'Pending' | 'In Progress' | 'Completed' | 'Failed';
export type SeniorityAlignment = 'Aligned' | 'Overqualified' | 'Underqualified' | 'Not Applicable';
export type FormatStatus = 'Clean' | 'Needs Review' | 'Incomplete' | 'Not Applicable';

export interface AnalysisRequest {
    cvText: string;
    level: SeniorityLevel;
    jobDescription: string;
}

export interface KeywordMatch {
    total: number;
    matched: number;
    percentage: number;
}

export interface SuggestedChange {
    id: number;
    title: string;
    description: string;
}

export interface AnalysisResult {
    fitScore: number;
    matchSummary: string;
    keywords: KeywordMatch;
    seniorityAlignment: SeniorityAlignment;
    formatStatus: FormatStatus;
    suggestedChanges: SuggestedChange[];
}

export interface AnalysisState {
    isLoading: boolean;
    result: AnalysisResult | null;
    error: string | null;
}