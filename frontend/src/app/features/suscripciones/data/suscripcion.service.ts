import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  PagoSuscripcion,
  PlanSuscripcion,
  Suscripcion,
} from './suscripcion.model';
import {
  PagoSuscripcionDto,
  PlanSuscripcionDto,
  SuscripcionDto,
} from './suscripcion.dto';

/** Acceso a los datos de la suscripción del negocio y del panel admin. */
@Injectable({ providedIn: 'root' })
export class SuscripcionService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/suscripciones`;

  listarPlanes(): Observable<PlanSuscripcion[]> {
    return this.http.get<PlanSuscripcionDto[]>(`${this.base}/planes`);
  }

  miSuscripcion(): Observable<Suscripcion> {
    return this.http.get<SuscripcionDto>(`${this.base}/mi-suscripcion`) as Observable<Suscripcion>;
  }

  misPagos(): Observable<PagoSuscripcion[]> {
    return this.http.get<PagoSuscripcionDto[]>(`${this.base}/mi-suscripcion/pagos`);
  }

  suscribir(planId: number): Observable<Suscripcion> {
    return this.http.post<SuscripcionDto>(`${this.base}/suscribir`, { planId }) as Observable<Suscripcion>;
  }

  pagar(): Observable<Suscripcion> {
    return this.http.post<SuscripcionDto>(`${this.base}/pagar`, {}) as Observable<Suscripcion>;
  }

  /** Panel del ADMIN: todas las suscripciones. */
  listarTodas(): Observable<Suscripcion[]> {
    return this.http.get<SuscripcionDto[]>(`${this.base}/admin/todas`) as Observable<Suscripcion[]>;
  }
}
