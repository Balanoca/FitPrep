import { Plato, PlatoForm } from './plato.model';
import { PlatoRequestDto, PlatoResponseDto } from './plato.dto';

/** Traduce entre los DTOs HTTP y el modelo del frontend. */
export const PlatoMapper = {
  toModel(dto: PlatoResponseDto): Plato {
    return {
      id: dto.id,
      negocioId: dto.negocioId,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precio: dto.precio,
      calorias: dto.calorias,
      proteinas: dto.proteinas,
      carbohidratos: dto.carbohidratos,
      grasas: dto.grasas,
      disponible: dto.disponible,
    };
  },

  toRequest(form: PlatoForm): PlatoRequestDto {
    return {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion?.trim() || null,
      precio: form.precio,
      calorias: form.calorias,
      proteinas: form.proteinas,
      carbohidratos: form.carbohidratos,
      grasas: form.grasas,
      disponible: form.disponible,
    };
  },
};
