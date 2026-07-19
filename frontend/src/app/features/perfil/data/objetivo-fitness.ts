/**
 * Objetivos de fitness. Fuente única para el valor que guarda el backend y su
 * etiqueta legible, usada en formularios (select) y al mostrar el objetivo.
 */
export const OBJETIVOS_FITNESS = [
  { value: 'PERDIDA_GRASA', label: 'Perder grasa' },
  { value: 'GANANCIA_MUSCULAR', label: 'Ganar músculo' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
] as const;

const LABELS: Record<string, string> = Object.fromEntries(
  OBJETIVOS_FITNESS.map((o) => [o.value, o.label]),
);

/** Etiqueta legible de un objetivo (o '—' si no hay / no se reconoce). */
export function objetivoLabel(objetivo: string | null | undefined): string {
  if (!objetivo) return '—';
  return LABELS[objetivo] ?? objetivo;
}
