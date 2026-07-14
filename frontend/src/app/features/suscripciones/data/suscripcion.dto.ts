/** Contratos HTTP tal como los expone el backend. */
export interface PlanSuscripcionDto {
  id: number;
  nombre: string;
  precioMensual: number;
  maxPlatos: number | null;
  maxClientes: number | null;
}

export interface SuscripcionDto {
  id: number;
  negocioId: number;
  planId: number;
  planNombre: string;
  planPrecioMensual: number;
  estado: string;
  fechaInicio: string;
  fechaVencimiento: string;
  vigente: boolean;
}

export interface PagoSuscripcionDto {
  id: number;
  monto: number;
  fechaPago: string;
  periodoDesde: string;
  periodoHasta: string;
}
