import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ActualizarNegocioRequest, Negocio } from './negocio.model';

/** Acceso a los datos del propio negocio (tenant). */
@Injectable({ providedIn: 'root' })
export class NegocioService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/negocios`;

  obtenerMiNegocio(): Observable<Negocio> {
    return this.http.get<Negocio>(`${this.base}/mi-negocio`);
  }

  actualizarMiNegocio(request: ActualizarNegocioRequest): Observable<Negocio> {
    return this.http.put<Negocio>(`${this.base}/mi-negocio`, request);
  }
}
