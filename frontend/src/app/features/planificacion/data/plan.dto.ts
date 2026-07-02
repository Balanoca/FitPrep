/** Contratos HTTP del backend (PlanSemanalRequest/Response + ComidaProgramadaDTO). */
export interface ComidaProgramadaDto {
  platoId: number;
  diaSemana: string;
  tipoComida: string;
  cantidad: number;
}

export interface PlanSemanalRequestDto {
  usuarioId: number;
  fechaInicioSemana: string; // yyyy-MM-dd
  montoTotal: number;
  comidas: ComidaProgramadaDto[];
}

export interface PlanSemanalResponseDto {
  id: number;
  negocioId: number;
  usuarioId: number;
  fechaInicioSemana: string;
  estadoPago: string;
  montoTotal: number;
  comidas: ComidaProgramadaDto[];
}
