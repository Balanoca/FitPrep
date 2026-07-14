import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { KpiCardComponent } from '../../../../shared/ui/kpi-card/kpi-card.component';
import { NegocioService } from '../../../negocio/data/negocio.service';
import { NegocioResumen } from '../../../negocio/data/negocio.model';
import { SuscripcionService } from '../../../suscripciones/data/suscripcion.service';
import { Suscripcion } from '../../../suscripciones/data/suscripcion.model';

/** Dashboard general de la plataforma para el ADMIN: KPIs globales. */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    KpiCardComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private readonly negocioService = inject(NegocioService);
  private readonly suscripcionService = inject(SuscripcionService);

  readonly loading = signal(true);
  readonly negocios = signal<NegocioResumen[]>([]);
  readonly suscripciones = signal<Suscripcion[]>([]);

  readonly totalNegocios = computed(() => this.negocios().length);
  readonly totalDeportistas = computed(() =>
    this.negocios().reduce((s, n) => s + n.totalDeportistas, 0),
  );
  readonly totalPlatos = computed(() => this.negocios().reduce((s, n) => s + n.totalPlatos, 0));
  readonly suscripcionesVigentes = computed(() => this.suscripciones().filter((s) => s.vigente).length);
  readonly mrr = computed(() =>
    this.suscripciones().filter((s) => s.vigente).reduce((sum, s) => sum + s.planPrecioMensual, 0),
  );

  ngOnInit(): void {
    forkJoin({
      negocios: this.negocioService.listarTodosAdmin(),
      suscripciones: this.suscripcionService.listarTodas(),
    }).subscribe({
      next: ({ negocios, suscripciones }) => {
        this.negocios.set(negocios);
        this.suscripciones.set(suscripciones);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
