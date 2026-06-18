import {Injectable, signal, computed} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { AnalysisRequest, AnalysisResult, AnalysisState, SeniorityLevel } from '../models/analysis.models';

@Injectable({
    providedIn: 'root'
})
export class AnalysisService {

    private readonly apiUrl = 'api/analyze'; // Replace with your actual API endpoint

    private readonly analysisState = signal<AnalysisState>({
        isLoading: false,
        result: null,
        error: null
    });

    readonly isLoading = computed(() => this.analysisState().isLoading);
    readonly analysisResult = computed(() => this.analysisState().result);
    readonly error = computed(() => this.analysisState().error);
    readonly hasResult = computed(() => !!this.analysisState().result);
    
    constructor(private http: HttpClient) {}

    analyze(cvText: string, level: SeniorityLevel, jobDescription: string): void {
        if (!cvText || !jobDescription) {
            this.setError('Please provide both CV text and job description.');
            return;
        }

        const request: AnalysisRequest = {
            cvText,
            level,
            jobDescription
        };
        this.setLoading(true);

        this.http.post<AnalysisResult>(this.apiUrl, request).subscribe({
            next: (result) => {
                this.analysisState.set({
                    isLoading: false,
                    result,
                    error: null
                });
            },
            error: (err) => {
                this.setError(err.error?.message || 'An error occurred while analyzing the CV. Please try again later.' );

            }
        });
    }

    reset(): void {
        this.analysisState.set({
            isLoading: false,
            result: null,
            error: null
        });
    }

    private setLoading(isLoading: boolean): void {
        this.analysisState.update(state => ({
            ...state,
            isLoading
        }));
    }

    private setError(error: string): void {
        this.analysisState.update(state => ({
            ...state,
            error,
            isLoading: false
        }));
    }

}