import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { KpiCardComponent } from '../../../../shared/ui/kpi-card/kpi-card.component';
import { NegocioService } from '../../../negocio/data/negocio.service';
import { NegocioResumen } from '../../../negocio/data/negocio.model';
import { ClienteService } from '../../../clientes/data/cliente.service';
import { UsuarioAdmin } from '../../../clientes/data/cliente.model';
import { SuscripcionService } from '../../../suscripciones/data/suscripcion.service';
import { Suscripcion } from '../../../suscripciones/data/suscripcion.model';

interface Barra {
  label: string;
  cantidad: number;
  pct: number;
  color: string;
}

/**
 * Reportes de la plataforma (ADMIN). Métricas globales derivadas de los datos
 * que ya exponen los endpoints admin de negocios, usuarios y suscripciones.
 */
@Component({
  selector: 'app-admin-reports',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    KpiCardComponent,
  ],
  templateUrl: './admin-reports.component.html',
})
export class AdminReportsComponent implements OnInit {
  private readonly negocioService = inject(NegocioService);
  private readonly clienteService = inject(ClienteService);
  private readonly suscripcionService = inject(SuscripcionService);

  readonly loading = signal(true);
  readonly negocios = signal<NegocioResumen[]>([]);
  readonly usuarios = signal<UsuarioAdmin[]>([]);
  readonly suscripciones = signal<Suscripcion[]>([]);

  // --- KPIs de plataforma ---
  readonly totalNegocios = computed(() => this.negocios().length);
  readonly totalUsuarios = computed(() => this.usuarios().length);
  readonly totalDeportistas = computed(
    () => this.usuarios().filter((u) => u.rol === 'ATHLETE').length,
  );
  readonly mrr = computed(() =>
    this.suscripciones().filter((s) => s.vigente).reduce((sum, s) => sum + s.planPrecioMensual, 0),
  );
  /** Ingreso anual proyectado (MRR × 12). */
  readonly arr = computed(() => this.mrr() * 12);
  readonly ticketPromedio = computed(() => {
    const vig = this.suscripciones().filter((s) => s.vigente);
    return vig.length ? this.mrr() / vig.length : 0;
  });

  // --- Distribución de suscripciones por plan ---
  readonly porPlan = computed<Barra[]>(() => {
    const colores = ['bg-brand-500', 'bg-blue-500', 'bg-amber-500', 'bg-rose-500'];
    const acc = new Map<string, number>();
    for (const s of this.suscripciones()) {
      acc.set(s.planNombre, (acc.get(s.planNombre) ?? 0) + 1);
    }
    const total = this.suscripciones().length;
    return [...acc.entries()].map(([label, cantidad], i) => ({
      label,
      cantidad,
      pct: total ? Math.round((cantidad / total) * 100) : 0,
      color: colores[i % colores.length],
    }));
  });

  // --- Distribución de suscripciones por estado ---
  readonly porEstado = computed<Barra[]>(() => {
    const def: { key: string; color: string }[] = [
      { key: 'ACTIVA', color: 'bg-brand-500' },
      { key: 'PRUEBA', color: 'bg-amber-500' },
      { key: 'VENCIDA', color: 'bg-rose-500' },
      { key: 'CANCELADA', color: 'bg-muted-foreground' },
    ];
    const total = this.suscripciones().length;
    return def
      .map(({ key, color }) => {
        const cantidad = this.suscripciones().filter((s) => s.estado === key).length;
        return { label: key, cantidad, pct: total ? Math.round((cantidad / total) * 100) : 0, color };
      })
      .filter((b) => b.cantidad > 0);
  });

  ngOnInit(): void {
    forkJoin({
      negocios: this.negocioService.listarTodosAdmin(),
      usuarios: this.clienteService.listarTodosAdmin(),
      suscripciones: this.suscripcionService.listarTodas(),
    }).subscribe({
      next: ({ negocios, usuarios, suscripciones }) => {
        this.negocios.set(negocios);
        this.usuarios.set(usuarios);
        this.suscripciones.set(suscripciones);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
