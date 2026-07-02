import { Role } from '../models/user.model';

export interface NavItem {
  to: string;
  label: string;
  icon: string; // nombre de Material icon
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface RoleMeta {
  label: string;
  sub: string;
  icon: string;
  groups: NavGroup[];
}

/**
 * Navegación por rol, traducida del prototipo NutriFlow (Sidebar.tsx).
 * Los íconos son de Angular Material (Material Symbols).
 */
export const NAVIGATION: Record<Role, RoleMeta> = {
  ATHLETE: {
    label: 'Deportista',
    sub: 'Mi nutrición',
    icon: 'fitness_center',
    groups: [
      {
        title: 'Mi nutrición',
        items: [
          { to: '/athlete', label: 'Dashboard', icon: 'dashboard' },
          { to: '/athlete/goals', label: 'Objetivos', icon: 'track_changes' },
          { to: '/athlete/plan', label: 'Plan semanal', icon: 'calendar_month' },
          { to: '/athlete/progress', label: 'Progreso macros', icon: 'monitoring' },
        ],
      },
      {
        title: 'Comidas',
        items: [
          { to: '/athlete/add-meal', label: 'Agregar comida', icon: 'add_circle' },
          { to: '/tenants', label: 'Explorar negocios', icon: 'storefront' },
        ],
      },
      {
        title: 'Pedidos',
        items: [
          { to: '/athlete/cart', label: 'Carrito semanal', icon: 'shopping_cart' },
          { to: '/athlete/checkout', label: 'Checkout', icon: 'credit_card' },
          { to: '/athlete/orders', label: 'Historial', icon: 'history' },
        ],
      },
      {
        title: 'Cuenta',
        items: [
          { to: '/athlete/profile', label: 'Perfil', icon: 'person' },
          { to: '/athlete/settings', label: 'Configuración', icon: 'settings' },
        ],
      },
    ],
  },
  TENANT: {
    label: 'Restaurante',
    sub: 'Negocio · Tenant',
    icon: 'restaurant',
    groups: [
      {
        title: 'Operación',
        items: [
          { to: '/tenant', label: 'Dashboard', icon: 'dashboard' },
          { to: '/tenant/orders', label: 'Pedidos semanales', icon: 'list_alt' },
          { to: '/tenant/production', label: 'Producción diaria', icon: 'factory' },
          { to: '/tenant/kitchen', label: 'Planeamiento cocina', icon: 'skillet' },
          { to: '/tenant/delivery', label: 'Entregas', icon: 'local_shipping' },
        ],
      },
      {
        title: 'Catálogo',
        items: [
          { to: '/tenant/meals', label: 'Comidas', icon: 'lunch_dining' },
          { to: '/tenant/meals/new', label: 'Nueva comida', icon: 'add_box' },
          { to: '/tenant/ingredients', label: 'Ingredientes', icon: 'nutrition' },
        ],
      },
      {
        title: 'Negocio',
        items: [
          { to: '/tenant/clients', label: 'Clientes', icon: 'group' },
          { to: '/tenant/reports', label: 'Reportes', icon: 'assessment' },
          { to: '/tenant/settings', label: 'Configuración', icon: 'settings' },
        ],
      },
    ],
  },
  ADMIN: {
    label: 'FitPrep SaaS',
    sub: 'Administración',
    icon: 'admin_panel_settings',
    groups: [
      {
        title: 'Plataforma',
        items: [
          { to: '/admin', label: 'Dashboard general', icon: 'shield' },
          { to: '/admin/businesses', label: 'Negocios registrados', icon: 'apartment' },
          { to: '/admin/users', label: 'Usuarios', icon: 'manage_accounts' },
          { to: '/admin/subscriptions', label: 'Suscripciones', icon: 'receipt_long' },
          { to: '/admin/reports', label: 'Reportes', icon: 'pie_chart' },
          { to: '/admin/settings', label: 'Configuración', icon: 'tune' },
        ],
      },
    ],
  },
};
