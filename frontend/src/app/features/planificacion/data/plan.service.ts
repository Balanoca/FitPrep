import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PlatoService } from '../../catalogo/data/plato.service';
import { Plato } from '../../catalogo/data/plato.model';
import { PlanSemanal } from './plan.model';
import { PlanSemanalResponseDto } from './plan.dto';
import { PlanMapper } from './plan.mapper';

/** Acceso a la API de planes semanales. */
@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly http = inject(HttpClient);
  private readonly platoService = inject(PlatoService);
  private readonly base = `${environment.apiUrl}/planes`;

  guardar(plan: PlanSemanal, usuarioId: number): Observable<PlanSemanal> {
    const request = PlanMapper.toRequest(plan, usuarioId);
    // El POST devuelve el plan; se cruza con el catálogo para reconstruirlo.
    return forkJoin({
      created: this.http.post<PlanSemanalResponseDto>(this.base, request),
      platos: this.platoService.listar(),
    }).pipe(map(({ created, platos }) => PlanMapper.toModel(created, indexar(platos))));
  }

  obtener(id: number): Observable<PlanSemanal> {
    return forkJoin({
      dto: this.http.get<PlanSemanalResponseDto>(`${this.base}/${id}`),
      platos: this.platoService.listar(),
    }).pipe(map(({ dto, platos }) => PlanMapper.toModel(dto, indexar(platos))));
  }

  /** Planes del usuario autenticado (el backend lo resuelve por el JWT). */
  listarMisPlanes(): Observable<PlanSemanal[]> {
    return forkJoin({
      dtos: this.http.get<PlanSemanalResponseDto[]>(`${this.base}/mis-planes`),
      platos: this.platoService.listar(),
    }).pipe(
      map(({ dtos, platos }) => {
        const idx = indexar(platos);
        return dtos.map((dto) => PlanMapper.toModel(dto, idx));
      }),
    );
  }

  /** Todos los pedidos del negocio (solo TENANT/ADMIN). */
  listarTodos(): Observable<PlanSemanal[]> {
    return forkJoin({
      dtos: this.http.get<PlanSemanalResponseDto[]>(this.base),
      platos: this.platoService.listar(),
    }).pipe(
      map(({ dtos, platos }) => {
        const idx = indexar(platos);
        return dtos.map((dto) => PlanMapper.toModel(dto, idx));
      }),
    );
  }

  /**
   * Cambia el estado de pago de un plan (CONFIRMADO, PAGADO, CANCELADO) y
   * devuelve el nuevo estado. No reconstruye los platos (no hace falta el
   * catálogo): evita una llamada extra que podría fallar y romper el "confirmar".
   */
  cambiarEstado(planId: number, estadoPago: string): Observable<string> {
    return this.http
      .patch<PlanSemanalResponseDto>(`${this.base}/${planId}/estado`, { estadoPago })
      .pipe(map((dto) => dto.estadoPago));
  }
}

function indexar(platos: Plato[]): Map<number, Plato> {
  return new Map(platos.filter((p) => p.id !== null).map((p) => [p.id!, p]));
}
