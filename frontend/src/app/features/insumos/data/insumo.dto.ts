/** Contratos HTTP tal como los expone el backend. */
export interface InsumoResponseDto {
  id: number;
  negocioId: number;
  nombre: string;
  unidad: string;
  precioUnitario: number | null;
  activo: boolean;
}

export interface InsumoRequestDto {
  nombre: string;
  unidad: string;
  precioUnitario: number | null;
  activo: boolean;
}

export interface RecetaItemResponseDto {
  id: number;
  insumoId: number;
  insumoNombre: string;
  insumoUnidad: string;
  cantidad: number;
}

export interface RecetaRequestDto {
  lineas: { insumoId: number; cantidad: number }[];
}
