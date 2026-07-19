/** Plan del catálogo de suscripción del SaaS. */
export interface PlanSuscripcion {
  id: number;
  nombre: string;
  precioMensual: number;
  maxPlatos: number | null;
  maxClientes: number | null;
}

/** Estado de la suscripción de un negocio. */
export type EstadoSuscripcion = 'PRUEBA' | 'ACTIVA' | 'VENCIDA' | 'CANCELADA';

export interface Suscripcion {
  id: number;
  negocioId: number;
  planId: number;
  planNombre: string;
  planPrecioMensual: number;
  estado: EstadoSuscripcion;
  fechaInicio: string;
  fechaVencimiento: string;
  vigente: boolean;
}

/** Un pago (simulado) de la suscripción. */
export interface PagoSuscripcion {
  id: number;
  monto: number;
  fechaPago: string;
  periodoDesde: string;
  periodoHasta: string;
}
