import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { KpiCardComponent } from '../../../../shared/ui/kpi-card/kpi-card.component';
import { PlanService } from '../../data/plan.service';
import { PlanSemanal } from '../../data/plan.model';

type BadgeTone = 'neutral' | 'brand' | 'amber' | 'blue' | 'rose';
type EstadoFiltro = 'TODOS' | 'PENDIENTE' | 'CONFIRMADO' | 'PAGADO' | 'CANCELADO';

@Component({
  selector: 'app-pedidos-tenant',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DatePipe,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
    KpiCardComponent,
  ],
  templateUrl: './pedidos-tenant.component.html',
})
export class PedidosTenantComponent implements OnInit {
  private readonly planService = inject(PlanService);
  private readonly snackbar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly pedidos = signal<PlanSemanal[]>([]);
  readonly actualizando = signal<number | null>(null);
  readonly estado = signal<EstadoFiltro>('TODOS');

  readonly filtros: EstadoFiltro[] = ['TODOS', 'PENDIENTE', 'CONFIRMADO', 'PAGADO', 'CANCELADO'];

  readonly filtrados = computed(() => {
    const e = this.estado();
    return e === 'TODOS' ? this.pedidos() : this.pedidos().filter((p) => p.estadoPago === e);
  });

  readonly totalIngresos = computed(() =>
    this.pedidos()
      .filter((p) => p.estadoPago === 'PAGADO')
      .reduce((s, p) => s + p.montoTotal, 0),
  );
  readonly pendientes = computed(() => this.pedidos().filter((p) => p.estadoPago === 'PENDIENTE').length);
  readonly confirmados = computed(() => this.pedidos().filter((p) => p.estadoPago === 'CONFIRMADO').length);

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.loading.set(true);
    this.planService.listarTodos().subscribe({
      next: (pedidos) => {
        this.pedidos.set(pedidos);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se pudieron cargar los pedidos.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  totalComidas(plan: PlanSemanal): number {
    return plan.comidas.reduce((s, c) => s + c.cantidad, 0);
  }

  esTerminal(estado: string): boolean {
    return estado === 'PAGADO' || estado === 'CANCELADO';
  }

  tono(estado: string): BadgeTone {
    switch (estado) {
      case 'CONFIRMADO':
        return 'blue';
      case 'PAGADO':
        return 'brand';
      case 'CANCELADO':
        return 'rose';
      default:
        return 'amber';
    }
  }

  cambiar(plan: PlanSemanal, nuevoEstado: string): void {
    if (plan.id === null) return;
    const id = plan.id;
    this.actualizando.set(id);
    this.planService.cambiarEstado(id, nuevoEstado).subscribe({
      next: (estadoActualizado) => {
        this.pedidos.update((list) =>
          list.map((p) => (p.id === id ? { ...p, estadoPago: estadoActualizado } : p)),
        );
        this.actualizando.set(null);
        this.snackbar.open(`Pedido #${id}: ${estadoActualizado.toLowerCase()}.`, 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.actualizando.set(null);
        this.snackbar.open(err?.error?.message ?? 'No se pudo actualizar el pedido.', 'Cerrar', {
          duration: 5000,
        });
      },
    });
  }
}
