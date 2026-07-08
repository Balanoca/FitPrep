import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Plato, PlatoForm } from './plato.model';
import { PlatoResponseDto } from './plato.dto';
import { PlatoMapper } from './plato.mapper';

/**
 * Adaptador de datos de catálogo. Encapsula el acceso HTTP y el mapeo
 * DTO↔modelo; el resto de la feature solo conoce el modelo Plato.
 */
@Injectable({ providedIn: 'root' })
export class PlatoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/platos`;

  listar(): Observable<Plato[]> {
    return this.http
      .get<PlatoResponseDto[]>(this.base)
      .pipe(map((dtos) => dtos.map(PlatoMapper.toModel)));
  }

  /** Catálogo público (disponibles) de una cocina concreta. Sin autenticación. */
  listarPublicos(negocioId: number): Observable<Plato[]> {
    return this.http
      .get<PlatoResponseDto[]>(`${this.base}/publico`, { params: { negocioId } })
      .pipe(map((dtos) => dtos.map(PlatoMapper.toModel)));
  }

  obtener(id: number): Observable<Plato> {
    return this.http
      .get<PlatoResponseDto>(`${this.base}/${id}`)
      .pipe(map(PlatoMapper.toModel));
  }

  crear(form: PlatoForm): Observable<Plato> {
    return this.http
      .post<PlatoResponseDto>(this.base, PlatoMapper.toRequest(form))
      .pipe(map(PlatoMapper.toModel));
  }

  actualizar(id: number, form: PlatoForm): Observable<Plato> {
    return this.http
      .put<PlatoResponseDto>(`${this.base}/${id}`, PlatoMapper.toRequest(form))
      .pipe(map(PlatoMapper.toModel));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
