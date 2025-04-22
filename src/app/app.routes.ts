import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/layout/layout.component').then(m => m.LayoutComponent),
        children: [
            {
                path: 'home',
                loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
            },
            {
                path: 'completed',
                loadComponent: () => import('./features/completed/completed.component').then(m => m.CompletedComponent),
            },
            {
                path: 'list/:id',
                loadComponent: () => import('./features/list/list.component').then(m => m.ListComponent),
            },
            {
                path: '**',
                redirectTo: 'home',
            }
        ]
    }
];
