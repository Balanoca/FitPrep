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
