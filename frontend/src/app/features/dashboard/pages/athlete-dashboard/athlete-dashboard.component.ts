import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { KpiCardComponent } from '../../../../shared/ui/kpi-card/kpi-card.component';
import { DonutComponent } from '../../../../shared/ui/donut/donut.component';
import { ProgressBarComponent } from '../../../../shared/ui/progress-bar/progress-bar.component';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-athlete-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    PageHeaderComponent,
    CardComponent,
    KpiCardComponent,
    DonutComponent,
    ProgressBarComponent,
  ],
  templateUrl: './athlete-dashboard.component.html',
})
export class AthleteDashboardComponent {
  private readonly auth = inject(AuthService);

  readonly user = this.auth.user;

  readonly tieneObjetivos = computed(() => (this.user()?.requerimientoKcal ?? null) != null);

  /** Macros objetivo del usuario (dato real del perfil). */
  readonly objetivos = computed(() => {
    const u = this.user();
    return [
      { label: 'Proteína', valor: u?.reqProteinasG ?? null },
      { label: 'Carbohidratos', valor: u?.reqCarbohidratosG ?? null },
      { label: 'Grasas', valor: u?.reqGrasasG ?? null },
    ];
  });

  /** Distribución de macros como % del total en gramos (para las barras). */
  readonly distribucion = computed(() => {
    const objs = this.objetivos().filter((o) => o.valor != null) as { label: string; valor: number }[];
    const total = objs.reduce((s, o) => s + o.valor, 0);
    return this.objetivos().map((o) => ({
      label: o.label,
      valor: o.valor,
      pct: o.valor != null && total > 0 ? Math.round((o.valor / total) * 100) : 0,
    }));
  });
}
