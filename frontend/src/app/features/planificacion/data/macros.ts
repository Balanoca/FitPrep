import { ComidaProgramada } from './plan.model';

export interface MacroTotales {
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  precio: number;
}

/** Suma los macros de todas las comidas (plato × cantidad). Función pura. */
export function calcularMacros(comidas: ComidaProgramada[]): MacroTotales {
  return comidas.reduce<MacroTotales>(
    (acc, c) => {
      const q = c.cantidad;
      acc.calorias += (c.plato.calorias ?? 0) * q;
      acc.proteinas += (c.plato.proteinas ?? 0) * q;
      acc.carbohidratos += (c.plato.carbohidratos ?? 0) * q;
      acc.grasas += (c.plato.grasas ?? 0) * q;
      acc.precio += (c.plato.precio ?? 0) * q;
      return acc;
    },
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, precio: 0 },
  );
}

/** Porcentaje de avance respecto a un objetivo (acotado a 0-100 para la barra). */
export function porcentaje(actual: number, objetivo: number | null | undefined): number {
  if (!objetivo || objetivo <= 0) return 0;
  return Math.min(100, Math.round((actual / objetivo) * 100));
}
