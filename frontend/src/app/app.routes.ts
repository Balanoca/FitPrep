import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ShellComponent } from './core/layout/shell/shell.component';

export const routes: Routes = [
  // --- Público ---
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Iniciar sesión — FitPrep',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    title: 'Crear cuenta — FitPrep',
  },

  // --- Áreas protegidas (dentro del Shell) ---
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'athlete',
        canActivate: [roleGuard(['ATHLETE'])],
        loadChildren: () =>
          import('./features/athlete/athlete.routes').then((m) => m.ATHLETE_ROUTES),
      },
      {
        path: 'tenant',
        canActivate: [roleGuard(['TENANT', 'ADMIN'])],
        loadChildren: () =>
          import('./features/tenant/tenant.routes').then((m) => m.TENANT_ROUTES),
      },
      {
        path: 'admin',
        canActivate: [roleGuard(['ADMIN'])],
        loadChildren: () =>
          import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },
    ],
  },

  // --- Redirecciones ---
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
