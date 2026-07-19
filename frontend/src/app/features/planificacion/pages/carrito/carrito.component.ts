import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { PlanService } from '../../data/plan.service';
import { CarritoService } from '../../data/carrito.service';
import { porcentaje } from '../../data/macros';
import { ComidaProgramada, DiaSemana, DIAS_SEMANA, DIA_LABEL, TIPO_LABEL } from '../../data/plan.model';

/**
 * Carrito semanal: resumen del plan en construcción antes de confirmarlo. Lee el
 * estado compartido de CarritoService (el mismo que edita el Plan semanal).
 */
@Component({
  selector: 'app-carrito',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
  ],
  templateUrl: './carrito.component.html',
})
export class CarritoComponent {
  private readonly auth = inject(AuthService);
  private readonly planService = inject(PlanService);
  private readonly carrito = inject(CarritoService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly user = this.auth.user;
  readonly saving = signal(false);

  readonly comidas = this.carrito.comidas;
  readonly vacio = this.carrito.vacio;
  readonly macros = this.carrito.macros;
  readonly totalItems = this.carrito.totalItems;

  readonly diaLabel = DIA_LABEL;
  readonly tipoLabel = TIPO_LABEL;

  readonly limiteKcal = computed(() => this.user()?.requerimientoKcal ?? null);
  readonly excede = computed(() => {
    const l = this.limiteKcal();
    return l != null && this.macros().calorias > l;
  });
  readonly pctCalorias = computed(() => porcentaje(this.macros().calorias, this.limiteKcal()));

  /** Comidas agrupadas por día (solo días con contenido), en orden de la semana. */
  readonly grupos = computed(() => {
    const map = new Map<DiaSemana, ComidaProgramada[]>();
    for (const c of this.comidas()) {
      if (!map.has(c.diaSemana)) map.set(c.diaSemana, []);
      map.get(c.diaSemana)!.push(c);
    }
    return DIAS_SEMANA.filter((d) => map.has(d)).map((d) => ({ dia: d, items: map.get(d)! }));
  });

  quitar(comida: ComidaProgramada): void {
    this.carrito.quitar(comida);
  }

  vaciar(): void {
    this.carrito.vaciar();
  }

  confirmar(): void {
    const usuarioId = this.user()?.id;
    if (!usuarioId) {
      this.snackbar.open('Sesión no válida.', 'Cerrar', { duration: 4000 });
      return;
    }
    if (this.vacio()) return;
    this.saving.set(true);

    const plan = {
      id: null,
      usuarioId,
      fechaInicioSemana: this.lunesDeEstaSemana(),
      estadoPago: 'PENDIENTE',
      montoTotal: this.macros().precio,
      comidas: this.comidas(),
    };

    this.planService.guardar(plan, usuarioId).subscribe({
      next: () => {
        this.saving.set(false);
        this.carrito.vaciar();
        this.snackbar.open('Plan confirmado. Revísalo en Mis pedidos.', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/athlete/orders']);
      },
      error: (err) => {
        this.saving.set(false);
        this.snackbar.open(err?.error?.message ?? 'No se pudo confirmar el plan.', 'Cerrar', {
          duration: 6000,
        });
      },
    });
  }

  private lunesDeEstaSemana(): string {
    const hoy = new Date();
    const dow = (hoy.getDay() + 6) % 7;
    hoy.setDate(hoy.getDate() - dow);
    return hoy.toISOString().slice(0, 10);
  }
}
