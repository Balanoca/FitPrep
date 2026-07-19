import { Insumo, InsumoForm, ItemReceta } from './insumo.model';
import {
  InsumoRequestDto,
  InsumoResponseDto,
  RecetaItemResponseDto,
} from './insumo.dto';

/** Traduce entre los DTOs HTTP y los modelos del frontend. */
export const InsumoMapper = {
  toModel(dto: InsumoResponseDto): Insumo {
    return {
      id: dto.id,
      negocioId: dto.negocioId,
      nombre: dto.nombre,
      unidad: dto.unidad,
      precioUnitario: dto.precioUnitario,
      activo: dto.activo,
    };
  },

  toRequest(form: InsumoForm): InsumoRequestDto {
    return {
      nombre: form.nombre.trim(),
      unidad: form.unidad.trim(),
      precioUnitario: form.precioUnitario,
      activo: form.activo,
    };
  },

  recetaToModel(dto: RecetaItemResponseDto): ItemReceta {
    return {
      id: dto.id,
      insumoId: dto.insumoId,
      insumoNombre: dto.insumoNombre,
      insumoUnidad: dto.insumoUnidad,
      cantidad: dto.cantidad,
    };
  },
};
