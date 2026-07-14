/** Modelo de dominio del insumo (ingrediente) en el frontend. */
export interface Insumo {
  id: number | null;
  negocioId: number | null;
  nombre: string;
  unidad: string;
  precioUnitario: number | null;
  activo: boolean;
}

/** Datos que envía el formulario al crear/editar (sin id ni negocioId). */
export interface InsumoForm {
  nombre: string;
  unidad: string;
  precioUnitario: number | null;
  activo: boolean;
}

export function emptyInsumo(): InsumoForm {
  return {
    nombre: '',
    unidad: 'kg',
    precioUnitario: null,
    activo: true,
  };
}

/** Una línea de la receta de un plato (insumo + cantidad por unidad de plato). */
export interface ItemReceta {
  id: number | null;
  insumoId: number;
  insumoNombre: string;
  insumoUnidad: string;
  cantidad: number;
}
