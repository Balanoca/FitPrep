import { Routes } from '@angular/router';

import { PlaceholderPageComponent } from '../shared-pages/placeholder-page.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'businesses',
    loadComponent: () =>
      import('./pages/businesses/businesses.component').then((m) => m.BusinessesComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'subscriptions',
    loadComponent: () =>
      import('../suscripciones/pages/admin-suscripciones/admin-suscripciones.component').then(
        (m) => m.AdminSuscripcionesComponent,
      ),
  },
  { path: 'reports', component: PlaceholderPageComponent, data: { title: 'Reportes', eyebrow: 'Plataforma' } },
  { path: 'settings', component: PlaceholderPageComponent, data: { title: 'Configuración', eyebrow: 'Plataforma' } },
];
