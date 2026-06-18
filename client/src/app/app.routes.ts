import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'analysis',
        loadComponent: () => import('./features/analysis/analysis.component').then(m => m.AnalysisComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
