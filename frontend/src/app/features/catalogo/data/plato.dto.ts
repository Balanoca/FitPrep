/** Contrato HTTP tal como lo expone el backend (PlatoResponse / PlatoRequest). */
export interface PlatoResponseDto {
  id: number;
  negocioId: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  disponible: boolean;
}

export interface PlatoRequestDto {
  nombre: string;
  descripcion: string | null;
  precio: number;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  disponible: boolean;
}
