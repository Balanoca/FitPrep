/** Contrato HTTP del backend (ReporteProduccionResponse). */
export interface ProduccionItemDto {
  platoId: number;
  platoNombre: string;
  diaSemana: string;
  tipoComida: string;
  cantidadTotal: number;
}

/** Contrato HTTP del backend (ListaCompraItemResponse). */
export interface ListaCompraItemDto {
  insumoId: number;
  insumoNombre: string;
  unidad: string;
  cantidadTotal: number;
  precioUnitario: number | null;
  costoEstimado: number | null;
}
