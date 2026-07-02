/** Datos del negocio (tenant), tal como los expone GET /negocios/mi-negocio. */
export interface Negocio {
  id: number;
  nombreComercial: string;
  slug: string;
  ruc: string;
  telefono: string | null;
  estado: string;
  fechaRegistro: string;
}

/** Datos editables del negocio (PUT). */
export interface ActualizarNegocioRequest {
  nombreComercial: string;
  telefono: string | null;
}
