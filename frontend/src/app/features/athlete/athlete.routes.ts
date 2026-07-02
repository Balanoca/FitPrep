import { Routes } from '@angular/router';

import { PlaceholderPageComponent } from '../shared-pages/placeholder-page.component';

export const ATHLETE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../dashboard/pages/athlete-dashboard/athlete-dashboard.component').then(
        (m) => m.AthleteDashboardComponent,
      ),
  },
  {
    path: 'goals',
    loadComponent: () =>
      import('../perfil/pages/objetivos/objetivos.component').then((m) => m.ObjetivosComponent),
  },
  {
    path: 'plan',
    loadComponent: () =>
      import('../planificacion/pages/plan-semanal/plan-semanal.component').then(
        (m) => m.PlanSemanalComponent,
      ),
  },
  { path: 'progress', component: PlaceholderPageComponent, data: { title: 'Progreso macros', eyebrow: 'Atleta' } },
  { path: 'add-meal', component: PlaceholderPageComponent, data: { title: 'Agregar comida', eyebrow: 'Atleta' } },
  { path: 'cart', component: PlaceholderPageComponent, data: { title: 'Carrito semanal', eyebrow: 'Atleta' } },
  { path: 'checkout', component: PlaceholderPageComponent, data: { title: 'Checkout', eyebrow: 'Atleta' } },
  {
    path: 'orders',
    loadComponent: () =>
      import('../planificacion/pages/mis-planes/mis-planes.component').then((m) => m.MisPlanesComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../perfil/pages/perfil/perfil.component').then((m) => m.PerfilComponent),
  },
  { path: 'settings', component: PlaceholderPageComponent, data: { title: 'Configuración', eyebrow: 'Atleta' } },
];
