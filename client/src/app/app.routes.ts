import { Routes } from '@angular/router';
import { AnalysisService } from './core/services/analysis.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'analysis',
        loadComponent: () => import('./features/analysis/analysis.component').then(m => m.AnalysisComponent),
        canActivate: [() => {
            const analysisService = inject(AnalysisService);
            const router = inject(Router);
            if(!analysisService.hasResult() && !analysisService.isLoading()) {
                router.navigate(['/']);
                return false;
            }
            return true;
        }]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
