import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { DonutComponent } from '../../../../shared/ui/donut/donut.component';
import { ProgressBarComponent } from '../../../../shared/ui/progress-bar/progress-bar.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { PlanService } from '../../data/plan.service';
import { PlanSemanal } from '../../data/plan.model';

/** Una macro comparada: consumido (del plan) vs. objetivo semanal (perfil × 7). */
interface MacroProgreso {
  label: string;
  consumido: number;
  objetivo: number | null;
  unidad: string;
  pct: number;
  tone: 'brand' | 'blue' | 'amber';
}

/**
 * Progreso de macros del atleta: compara lo que suma el plan de la semana
 * seleccionada contra su requerimiento (objetivo diario × 7 días).
 */
@Component({
  selector: 'app-progreso',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    DonutComponent,
    ProgressBarComponent,
  ],
  templateUrl: './progreso.component.html',
})
export class ProgresoComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly planService = inject(PlanService);
  private readonly snackbar = inject(MatSnackBar);

  private static readonly DIAS = 7;

  readonly user = this.auth.user;
  readonly loading = signal(true);
  readonly planes = signal<PlanSemanal[]>([]);
  readonly planSelId = signal<number | null>(null);

  readonly tieneObjetivos = computed(() => (this.auth.user()?.requerimientoKcal ?? null) != null);

  readonly planSel = computed(() =>
    this.planes().find((p) => p.id === this.planSelId()) ?? null,
  );

  /** Suma de calorías y macros de todas las comidas del plan seleccionado. */
  readonly consumo = computed(() => {
    const plan = this.planSel();
    const acc = { kcal: 0, prot: 0, carb: 0, gras: 0 };
    if (!plan) return acc;
    for (const c of plan.comidas) {
      const q = c.cantidad ?? 1;
      acc.kcal += (c.plato.calorias ?? 0) * q;
      acc.prot += (c.plato.proteinas ?? 0) * q;
      acc.carb += (c.plato.carbohidratos ?? 0) * q;
      acc.gras += (c.plato.grasas ?? 0) * q;
    }
    return acc;
  });

  /** % de calorías consumidas sobre el objetivo semanal (para el donut). */
  readonly pctCalorias = computed(() => {
    const obj = this.objetivoSemanal(this.auth.user()?.requerimientoKcal);
    const c = this.consumo().kcal;
    return obj ? Math.min(999, Math.round((c / obj) * 100)) : 0;
  });

  readonly excedeCalorias = computed(() => this.pctCalorias() > 100);

  readonly macros = computed<MacroProgreso[]>(() => {
    const u = this.auth.user();
    const c = this.consumo();
    return [
      this.macro('Proteína', c.prot, u?.reqProteinasG, 'g', 'brand'),
      this.macro('Carbohidratos', c.carb, u?.reqCarbohidratosG, 'g', 'blue'),
      this.macro('Grasas', c.gras, u?.reqGrasasG, 'g', 'amber'),
    ];
  });

  ngOnInit(): void {
    this.planService.listarMisPlanes().subscribe({
      next: (planes) => {
        this.planes.set(planes);
        this.planSelId.set(planes[0]?.id ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se pudieron cargar tus planes.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  seleccionar(id: number): void {
    this.planSelId.set(id);
  }

  private objetivoSemanal(diario: number | null | undefined): number | null {
    return diario != null ? diario * ProgresoComponent.DIAS : null;
  }

  private macro(
    label: string,
    consumido: number,
    objetivoDiario: number | null | undefined,
    unidad: string,
    tone: 'brand' | 'blue' | 'amber',
  ): MacroProgreso {
    const objetivo = this.objetivoSemanal(objetivoDiario);
    const pct = objetivo ? Math.min(100, Math.round((consumido / objetivo) * 100)) : 0;
    return { label, consumido, objetivo, unidad, pct, tone };
  }
}
