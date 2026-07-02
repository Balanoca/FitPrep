import { Injectable } from '@angular/core';

const TOKEN_KEY = 'fitprep.token';

/**
 * Persistencia del JWT. Aislada para poder cambiar de localStorage a
 * cookies/otro mecanismo sin tocar el resto de la app.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
