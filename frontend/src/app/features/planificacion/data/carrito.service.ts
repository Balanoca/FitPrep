import { Injectable, computed, signal } from '@angular/core';

import { ComidaProgramada } from './plan.model';
import { calcularMacros } from './macros';

const STORAGE_KEY = 'fitprep.carrito';

/**
 * Estado del plan semanal en construcción ("carrito"), compartido entre la
 * pantalla de Plan semanal y la de Carrito. Fuente única de verdad, con signals
 * y persistencia en localStorage para no perder el avance al recargar/navegar.
 */
@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly _comidas = signal<ComidaProgramada[]>(this.restaurar());

  readonly comidas = this._comidas.asReadonly();
  readonly totalItems = computed(() =>
    this._comidas().reduce((s, c) => s + c.cantidad, 0),
  );
  readonly macros = computed(() => calcularMacros(this._comidas()));
  readonly vacio = computed(() => this._comidas().length === 0);

  agregar(comida: ComidaProgramada): void {
    this._comidas.update((list) => this.persistir([...list, comida]));
  }

  quitar(comida: ComidaProgramada): void {
    this._comidas.update((list) => this.persistir(list.filter((c) => c !== comida)));
  }

  vaciar(): void {
    this._comidas.set(this.persistir([]));
  }

  private persistir(list: ComidaProgramada[]): ComidaProgramada[] {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // localStorage no disponible (modo privado, etc.): se ignora, sigue en memoria.
    }
    return list;
  }

  private restaurar(): ComidaProgramada[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ComidaProgramada[]) : [];
    } catch {
      return [];
    }
  }
}
