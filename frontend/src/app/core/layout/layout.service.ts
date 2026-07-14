import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'fitprep.sidebar.collapsed';

/**
 * Estado del layout compartido entre el shell y el sidebar. Por ahora solo el
 * colapso de la barra lateral, persistido para que se recuerde entre sesiones.
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly _collapsed = signal<boolean>(this.restaurar());

  readonly collapsed = this._collapsed.asReadonly();

  toggleSidebar(): void {
    this._collapsed.update((v) => this.persistir(!v));
  }

  private persistir(value: boolean): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // localStorage no disponible: se ignora, el estado sigue en memoria.
    }
    return value;
  }

  private restaurar(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }
}
