import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterDeportistaRequest,
  RegisterNegocioRequest,
  Role,
} from '../models/user.model';
import { TokenStorageService } from './token-storage.service';

/**
 * Estado de sesión con Signals. Fuente única de verdad para "quién soy",
 * "estoy autenticado" y "qué rol tengo". Consumido por guards, layout y features.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly base = `${environment.apiUrl}/auth`;

  private readonly _user = signal<AuthUser | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly role = computed<Role | null>(() => this._user()?.rol ?? null);

  /** Rehidrata la sesión al arrancar si hay token guardado. */
  restoreSession(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.base}/me`).pipe(
      tap((user) => this._user.set(user)),
    );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, credentials).pipe(
      tap((res) => {
        if (res.token) {
          this.tokenStorage.set(res.token);
        }
        const { token, ...user } = res;
        this._user.set(user);
      }),
    );
  }

  /**
   * Registra un deportista y lo autentica automáticamente. El endpoint de
   * registro no devuelve token, así que se encadena un login.
   */
  registrarDeportista(request: RegisterDeportistaRequest): Observable<AuthResponse> {
    return this.http.post<AuthUser>(`${this.base}/register/deportista`, request).pipe(
      switchMap(() => this.login({ email: request.email, password: request.password })),
    );
  }

  /** Registra un negocio (tenant). No crea sesión: el usuario luego inicia sesión. */
  registrarNegocio(request: RegisterNegocioRequest): Observable<unknown> {
    return this.http.post(`${this.base}/register/negocio`, request);
  }

  logout(): void {
    this.tokenStorage.clear();
    this._user.set(null);
  }

  hasToken(): boolean {
    return this.tokenStorage.get() !== null;
  }

  /** Ruta de inicio según el rol. */
  homeForRole(role: Role | null): string {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'TENANT':
        return '/tenant';
      case 'ATHLETE':
        return '/athlete';
      default:
        return '/login';
    }
  }
}
