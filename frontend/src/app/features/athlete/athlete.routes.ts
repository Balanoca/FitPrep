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
  { path: 'goals', component: PlaceholderPageComponent, data: { title: 'Objetivos', eyebrow: 'Atleta' } },
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
  { path: 'orders', component: PlaceholderPageComponent, data: { title: 'Historial de pedidos', eyebrow: 'Atleta' } },
  { path: 'profile', component: PlaceholderPageComponent, data: { title: 'Perfil', eyebrow: 'Atleta' } },
  { path: 'settings', component: PlaceholderPageComponent, data: { title: 'Configuración', eyebrow: 'Atleta' } },
];
