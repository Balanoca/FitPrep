import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { DonutComponent } from '../../../../shared/ui/donut/donut.component';
import { ProgressBarComponent } from '../../../../shared/ui/progress-bar/progress-bar.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { PlanService } from '../../data/plan.service';
import { calcularMacros, porcentaje } from '../../data/macros';
import {
  ComidaProgramada,
  DiaSemana,
  DIAS_SEMANA,
  DIA_LABEL,
  TIPO_LABEL,
} from '../../data/plan.model';
import { AddComidaDialogComponent } from './add-comida-dialog.component';

@Component({
  selector: 'app-plan-semanal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
    DonutComponent,
    ProgressBarComponent,
  ],
  templateUrl: './plan-semanal.component.html',
})
export class PlanSemanalComponent {
  private readonly auth = inject(AuthService);
  private readonly planService = inject(PlanService);
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly user = this.auth.user;
  readonly saving = signal(false);
  readonly comidas = signal<ComidaProgramada[]>([]);

  readonly dias = DIAS_SEMANA;
  readonly diaLabel = DIA_LABEL;
  readonly tipoLabel = TIPO_LABEL;

  readonly macros = computed(() => calcularMacros(this.comidas()));

  /** Comidas agrupadas por día para el grid. */
  readonly comidasPorDia = computed(() => {
    const map = new Map<DiaSemana, ComidaProgramada[]>();
    for (const dia of DIAS_SEMANA) map.set(dia, []);
    for (const c of this.comidas()) map.get(c.diaSemana)!.push(c);
    return map;
  });

  readonly limiteKcal = computed(() => this.user()?.requerimientoKcal ?? null);

  /** % de calorías respecto al límite; el Donut muestra el consumo semanal. */
  readonly pctCalorias = computed(() => porcentaje(this.macros().calorias, this.limiteKcal()));

  readonly excede = computed(() => {
    const limite = this.limiteKcal();
    return limite != null && this.macros().calorias > limite;
  });

  readonly barras = computed(() => {
    const m = this.macros();
    const u = this.user();
    return [
      { label: 'Proteína', actual: m.proteinas, objetivo: u?.reqProteinasG ?? null },
      { label: 'Carbohidratos', actual: m.carbohidratos, objetivo: u?.reqCarbohidratosG ?? null },
      { label: 'Grasas', actual: m.grasas, objetivo: u?.reqGrasasG ?? null },
    ].map((b) => ({ ...b, pct: porcentaje(b.actual, b.objetivo) }));
  });

  comidasDe(dia: DiaSemana): ComidaProgramada[] {
    return this.comidasPorDia().get(dia) ?? [];
  }

  abrirAgregar(dia: DiaSemana): void {
    const ref = this.dialog.open(AddComidaDialogComponent, { data: { diaSemana: dia } });
    ref.afterClosed().subscribe((comida?: ComidaProgramada) => {
      if (comida) {
        this.comidas.update((list) => [...list, comida]);
      }
    });
  }

  quitar(comida: ComidaProgramada): void {
    this.comidas.update((list) => list.filter((c) => c !== comida));
  }

  guardar(): void {
    const usuarioId = this.user()?.id;
    if (!usuarioId) {
      this.snackbar.open('Sesión no válida.', 'Cerrar', { duration: 4000 });
      return;
    }
    if (this.comidas().length === 0) {
      this.snackbar.open('Agrega al menos una comida al plan.', 'Cerrar', { duration: 3000 });
      return;
    }
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
        this.snackbar.open('Plan semanal guardado.', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/athlete/orders']);
      },
      error: (err) => {
        this.saving.set(false);
        // El backend lanza ExcesoCaloriasException (400) con el detalle.
        this.snackbar.open(
          err?.error?.message ?? 'No se pudo guardar el plan.',
          'Cerrar',
          { duration: 6000 },
        );
      },
    });
  }

  private lunesDeEstaSemana(): string {
    const hoy = new Date();
    const dow = (hoy.getDay() + 6) % 7; // 0 = lunes
    hoy.setDate(hoy.getDate() - dow);
    return hoy.toISOString().slice(0, 10);
  }
}
