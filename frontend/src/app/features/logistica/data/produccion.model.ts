/** Ítem consolidado del reporte de producción de cocina. */
export interface ProduccionItem {
  platoId: number;
  platoNombre: string;
  diaSemana: string;
  tipoComida: string;
  cantidadTotal: number;
}

/** Ítems agrupados por día para la vista. */
export interface ProduccionPorDia {
  diaSemana: string;
  items: ProduccionItem[];
  totalUnidades: number;
}

/** Línea de la lista de compra de insumos consolidada de la semana. */
export interface ListaCompraItem {
  insumoId: number;
  insumoNombre: string;
  unidad: string;
  cantidadTotal: number;
  precioUnitario: number | null;
  costoEstimado: number | null;
}
