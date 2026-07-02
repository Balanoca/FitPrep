import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { Role } from '../models/user.model';

/**
 * Restringe una ruta a ciertos roles. Se usa como:
 *   canActivate: [authGuard, roleGuard(['TENANT'])]
 */
export function roleGuard(allowed: Role[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const role = auth.role();

    if (role && allowed.includes(role)) {
      return true;
    }
    // Autenticado pero sin permiso → a su home; sin sesión → login.
    return router.createUrlTree([auth.homeForRole(role)]);
  };
}
