import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { KpiCardComponent } from '../../../../shared/ui/kpi-card/kpi-card.component';
import { SuscripcionService } from '../../data/suscripcion.service';
import { Suscripcion } from '../../data/suscripcion.model';

/** Panel del ADMIN de la plataforma: todas las suscripciones de los negocios. */
@Component({
  selector: 'app-admin-suscripciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    DecimalPipe,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
    KpiCardComponent,
  ],
  templateUrl: './admin-suscripciones.component.html',
})
export class AdminSuscripcionesComponent implements OnInit {
  private readonly service = inject(SuscripcionService);
  private readonly snackbar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly suscripciones = signal<Suscripcion[]>([]);

  readonly activas = computed(() => this.suscripciones().filter((s) => s.vigente).length);
  readonly mrr = computed(() =>
    this.suscripciones()
      .filter((s) => s.vigente)
      .reduce((sum, s) => sum + s.planPrecioMensual, 0),
  );

  ngOnInit(): void {
    this.service.listarTodas().subscribe({
      next: (list) => {
        this.suscripciones.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se pudieron cargar las suscripciones.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  tono(estado: string): 'brand' | 'amber' | 'rose' | 'neutral' {
    switch (estado) {
      case 'ACTIVA': return 'brand';
      case 'PRUEBA': return 'amber';
      case 'VENCIDA': return 'rose';
      default: return 'neutral';
    }
  }
}
