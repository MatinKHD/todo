import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/layout/layout.component').then(m => m.LayoutComponent),
        children: [
            {
                path: 'home',
                loadChildren: () => import('./features/home/home.component').then(m => m.HomeComponent),
            },
            {
                path: 'completed',
                loadChildren: () => import('./features/completed/completed.component').then(m => m.CompletedComponent),
            },
            {
                path: 'list/:id',
                loadChildren: () => import('./features/list/list.component').then(m => m.ListComponent),
            }
        ]
    }
];
