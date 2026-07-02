/** Contrato HTTP del backend (ReporteProduccionResponse). */
export interface ProduccionItemDto {
  platoId: number;
  platoNombre: string;
  diaSemana: string;
  tipoComida: string;
  cantidadTotal: number;
}
