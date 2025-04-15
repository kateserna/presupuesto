import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth', pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard] // Protege la ruta de dashboard implementando el guard
    },
    {
        path: 'auth',
        loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
    },
    {
        path: '**', //captura todas las rutas no definidas en Routes
        redirectTo: 'auth', pathMatch: 'full'
    }
];
