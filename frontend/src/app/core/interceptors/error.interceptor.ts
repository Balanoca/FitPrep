import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../auth/auth.service';

/**
 * Manejo global de errores HTTP. Ante 401/403 con sesión activa (token ausente,
 * inválido o expirado) cierra sesión y redirige a login. Este backend responde
 * 403 —no 401— cuando el JWT es inválido, por eso se cubren ambos.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const esAuthError = error.status === 401 || error.status === 403;
      const esLogin = req.url.includes('/auth/login');
      // Solo forzamos re-login si había una sesión: si no, es un 403 legítimo
      // (p. ej. un rol sin permiso) y no hay que expulsar.
      if (esAuthError && !esLogin && auth.hasToken()) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
