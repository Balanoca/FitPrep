/** Modelo de dominio del plato en el frontend. */
export interface Plato {
  id: number | null;
  negocioId: number | null;
  nombre: string;
  descripcion: string | null;
  precio: number;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  disponible: boolean;
}

/** Datos que envía el formulario al crear/editar (sin id ni negocioId). */
export interface PlatoForm {
  nombre: string;
  descripcion: string | null;
  precio: number;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  disponible: boolean;
}

/** Plato "vacío" para inicializar el formulario de creación. */
export function emptyPlato(): PlatoForm {
  return {
    nombre: '',
    descripcion: '',
    precio: 0,
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
    disponible: true,
  };
}
