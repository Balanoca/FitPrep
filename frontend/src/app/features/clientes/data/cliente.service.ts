import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Cliente, UsuarioAdmin } from './cliente.model';

/** Acceso a los clientes (deportistas) del negocio y al panel admin de usuarios. */
@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/usuarios`;

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.base);
  }

  /** Panel del ADMIN: todos los usuarios de la plataforma. */
  listarTodosAdmin(): Observable<UsuarioAdmin[]> {
    return this.http.get<UsuarioAdmin[]>(`${this.base}/admin/todos`);
  }
}
