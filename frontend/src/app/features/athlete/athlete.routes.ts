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
  {
    path: 'progress',
    loadComponent: () =>
      import('../planificacion/pages/progreso/progreso.component').then((m) => m.ProgresoComponent),
  },
  // "Agregar comida" se hace dentro del Plan semanal; el menú redirige allí.
  { path: 'add-meal', redirectTo: 'plan', pathMatch: 'full' },
  {
    path: 'cart',
    loadComponent: () =>
      import('../planificacion/pages/carrito/carrito.component').then((m) => m.CarritoComponent),
  },
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
  {
    path: 'settings',
    loadComponent: () =>
      import('../perfil/pages/cocina/cocina.component').then((m) => m.CocinaComponent),
  },
];
