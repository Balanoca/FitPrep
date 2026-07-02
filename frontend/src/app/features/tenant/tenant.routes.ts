import { Routes } from '@angular/router';

import { PlaceholderPageComponent } from '../shared-pages/placeholder-page.component';

export const TENANT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../dashboard/pages/tenant-dashboard/tenant-dashboard.component').then(
        (m) => m.TenantDashboardComponent,
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('../planificacion/pages/pedidos-tenant/pedidos-tenant.component').then(
        (m) => m.PedidosTenantComponent,
      ),
  },
  {
    path: 'production',
    loadComponent: () =>
      import('../logistica/pages/produccion/produccion.component').then((m) => m.ProduccionComponent),
  },
  { path: 'kitchen', component: PlaceholderPageComponent, data: { title: 'Planeamiento de cocina', eyebrow: 'Operación' } },
  { path: 'delivery', component: PlaceholderPageComponent, data: { title: 'Entregas', eyebrow: 'Operación' } },
  {
    path: 'meals',
    loadComponent: () =>
      import('../catalogo/pages/plato-list/plato-list.component').then((m) => m.PlatoListComponent),
  },
  {
    path: 'meals/new',
    loadComponent: () =>
      import('../catalogo/pages/plato-form/plato-form.component').then((m) => m.PlatoFormComponent),
  },
  {
    path: 'meals/:id/edit',
    loadComponent: () =>
      import('../catalogo/pages/plato-form/plato-form.component').then((m) => m.PlatoFormComponent),
  },
  { path: 'ingredients', component: PlaceholderPageComponent, data: { title: 'Ingredientes', eyebrow: 'Catálogo' } },
  {
    path: 'clients',
    loadComponent: () =>
      import('../clientes/pages/clientes-list/clientes-list.component').then(
        (m) => m.ClientesListComponent,
      ),
  },
  { path: 'reports', component: PlaceholderPageComponent, data: { title: 'Reportes', eyebrow: 'Negocio' } },
  { path: 'settings', component: PlaceholderPageComponent, data: { title: 'Configuración', eyebrow: 'Negocio' } },
];
