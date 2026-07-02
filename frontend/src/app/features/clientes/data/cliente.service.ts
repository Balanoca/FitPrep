import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Cliente } from './cliente.model';

/** Acceso a los clientes (deportistas) del negocio. */
@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/usuarios`;

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.base);
  }
}
