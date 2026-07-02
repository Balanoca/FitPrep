import { Routes } from '@angular/router';

import { PlaceholderPageComponent } from '../shared-pages/placeholder-page.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: PlaceholderPageComponent, data: { title: 'Dashboard general', eyebrow: 'Plataforma' } },
  { path: 'businesses', component: PlaceholderPageComponent, data: { title: 'Negocios registrados', eyebrow: 'Plataforma' } },
  { path: 'users', component: PlaceholderPageComponent, data: { title: 'Usuarios', eyebrow: 'Plataforma' } },
  { path: 'subscriptions', component: PlaceholderPageComponent, data: { title: 'Suscripciones', eyebrow: 'Plataforma' } },
  { path: 'reports', component: PlaceholderPageComponent, data: { title: 'Reportes', eyebrow: 'Plataforma' } },
  { path: 'settings', component: PlaceholderPageComponent, data: { title: 'Configuración', eyebrow: 'Plataforma' } },
];
