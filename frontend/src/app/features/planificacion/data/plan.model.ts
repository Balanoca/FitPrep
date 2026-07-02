import { Plato } from '../../catalogo/data/plato.model';

/** Días de la semana usados como clave (coinciden con lo que envía el front). */
export const DIAS_SEMANA = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'] as const;
export type DiaSemana = (typeof DIAS_SEMANA)[number];

export const TIPOS_COMIDA = ['DESAYUNO', 'ALMUERZO', 'CENA', 'SNACK'] as const;
export type TipoComida = (typeof TIPOS_COMIDA)[number];

/** Una comida programada dentro del plan, ya resuelta con su plato completo. */
export interface ComidaProgramada {
  plato: Plato;
  diaSemana: DiaSemana;
  tipoComida: TipoComida;
  cantidad: number;
}

/** Plan semanal en construcción/lectura en el front. */
export interface PlanSemanal {
  id: number | null;
  usuarioId: number | null;
  fechaInicioSemana: string; // ISO yyyy-MM-dd
  estadoPago: string;
  montoTotal: number;
  comidas: ComidaProgramada[];
}

/** Etiquetas legibles para la UI. */
export const DIA_LABEL: Record<DiaSemana, string> = {
  LUNES: 'Lun',
  MARTES: 'Mar',
  MIERCOLES: 'Mié',
  JUEVES: 'Jue',
  VIERNES: 'Vie',
  SABADO: 'Sáb',
  DOMINGO: 'Dom',
};

export const TIPO_LABEL: Record<TipoComida, string> = {
  DESAYUNO: 'Desayuno',
  ALMUERZO: 'Almuerzo',
  CENA: 'Cena',
  SNACK: 'Snack',
};
