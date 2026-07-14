import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Insumo, InsumoForm, ItemReceta } from './insumo.model';
import { InsumoResponseDto, RecetaItemResponseDto } from './insumo.dto';
import { InsumoMapper } from './insumo.mapper';

/** Acceso a datos del catálogo de insumos y de las recetas de los platos. */
@Injectable({ providedIn: 'root' })
export class InsumoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/insumos`;
  private readonly platosBase = `${environment.apiUrl}/platos`;

  listar(): Observable<Insumo[]> {
    return this.http
      .get<InsumoResponseDto[]>(this.base)
      .pipe(map((dtos) => dtos.map(InsumoMapper.toModel)));
  }

  crear(form: InsumoForm): Observable<Insumo> {
    return this.http
      .post<InsumoResponseDto>(this.base, InsumoMapper.toRequest(form))
      .pipe(map(InsumoMapper.toModel));
  }

  actualizar(id: number, form: InsumoForm): Observable<Insumo> {
    return this.http
      .put<InsumoResponseDto>(`${this.base}/${id}`, InsumoMapper.toRequest(form))
      .pipe(map(InsumoMapper.toModel));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // --- Recetas (por plato) ---

  obtenerReceta(platoId: number): Observable<ItemReceta[]> {
    return this.http
      .get<RecetaItemResponseDto[]>(`${this.platosBase}/${platoId}/receta`)
      .pipe(map((dtos) => dtos.map(InsumoMapper.recetaToModel)));
  }

  guardarReceta(
    platoId: number,
    lineas: { insumoId: number; cantidad: number }[],
  ): Observable<ItemReceta[]> {
    return this.http
      .put<RecetaItemResponseDto[]>(`${this.platosBase}/${platoId}/receta`, { lineas })
      .pipe(map((dtos) => dtos.map(InsumoMapper.recetaToModel)));
  }
}
