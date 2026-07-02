import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ProduccionItem } from './produccion.model';
import { ProduccionItemDto } from './produccion.dto';

/** Acceso al reporte consolidado de producción de cocina. */
@Injectable({ providedIn: 'root' })
export class ProduccionService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/logistica`;

  /** @param fechaSemana fecha (lunes) de la semana a consultar. */
  obtenerProduccion(fechaSemana: Date): Observable<ProduccionItem[]> {
    const params = new HttpParams().set('fechaSemana', this.toIsoDate(fechaSemana));
    return this.http
      .get<ProduccionItemDto[]>(`${this.base}/produccion`, { params })
      .pipe(map((dtos) => dtos.map((d) => ({ ...d }))));
  }

  private toIsoDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
