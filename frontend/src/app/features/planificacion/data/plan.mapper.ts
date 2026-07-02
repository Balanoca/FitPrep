import { Plato } from '../../catalogo/data/plato.model';
import { ComidaProgramada, DiaSemana, PlanSemanal, TipoComida } from './plan.model';
import { ComidaProgramadaDto, PlanSemanalRequestDto, PlanSemanalResponseDto } from './plan.dto';

export const PlanMapper = {
  /** Arma el request para POST /planes a partir del plan del front. */
  toRequest(plan: PlanSemanal, usuarioId: number): PlanSemanalRequestDto {
    return {
      usuarioId,
      fechaInicioSemana: plan.fechaInicioSemana,
      montoTotal: plan.montoTotal,
      comidas: plan.comidas.map(
        (c): ComidaProgramadaDto => ({
          platoId: c.plato.id!,
          diaSemana: c.diaSemana,
          tipoComida: c.tipoComida,
          cantidad: c.cantidad,
        }),
      ),
    };
  },

  /**
   * Reconstruye el plan desde el response. El backend solo devuelve platoId en
   * cada comida, así que se cruza con el catálogo (mapa id → Plato).
   */
  toModel(dto: PlanSemanalResponseDto, platosById: Map<number, Plato>): PlanSemanal {
    return {
      id: dto.id,
      usuarioId: dto.usuarioId,
      fechaInicioSemana: dto.fechaInicioSemana,
      estadoPago: dto.estadoPago,
      montoTotal: dto.montoTotal,
      comidas: dto.comidas
        .map((c): ComidaProgramada | null => {
          const plato = platosById.get(c.platoId);
          if (!plato) return null;
          return {
            plato,
            diaSemana: c.diaSemana as DiaSemana,
            tipoComida: c.tipoComida as TipoComida,
            cantidad: c.cantidad,
          };
        })
        .filter((c): c is ComidaProgramada => c !== null),
    };
  },
};
