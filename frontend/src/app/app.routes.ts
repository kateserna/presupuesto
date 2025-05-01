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
        path: 'add-info',
        loadComponent: () => import('./components/add-info/add-info.component').then(m => m.AddInfoComponent),
        canActivate: [authGuard]
    },
    {
        path: 'activos',
        loadComponent: () => import('./components/activos/activos.component').then(m => m.ActivosComponent),
        canActivate: [authGuard]
    },
    {
        path: 'pasivos',
        loadComponent: () => import('./components/pasivos/pasivos.component').then(m => m.PasivosComponent),
        canActivate: [authGuard]
    },
    {
        path: 'ingresos',
        loadComponent: () => import('./components/ingresos/ingresos.component').then(m => m.IngresosComponent),
        canActivate: [authGuard]
    },
    {
        path: 'egresos',
        loadComponent: () => import('./components/egresos/egresos.component').then(m => m.EgresosComponent),
        canActivate: [authGuard]
    },
    {
        path: 'resumen',
        loadComponent: () => import('./components/resumen/resumen.component').then(m => m.ResumenComponent),
        canActivate: [authGuard]
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
