import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { KpiCardComponent } from '../../../../shared/ui/kpi-card/kpi-card.component';
import { PlanService } from '../../../planificacion/data/plan.service';
import { PlatoService } from '../../../catalogo/data/plato.service';
import { ClienteService } from '../../../clientes/data/cliente.service';
import { PlanSemanal } from '../../../planificacion/data/plan.model';
import { Plato } from '../../../catalogo/data/plato.model';
import { Cliente } from '../../../clientes/data/cliente.model';

interface EstadoBarra {
  estado: string;
  cantidad: number;
  pct: number;
  color: string;
}

const ESTADOS: { key: string; color: string }[] = [
  { key: 'PENDIENTE', color: 'bg-amber-500' },
  { key: 'CONFIRMADO', color: 'bg-blue-500' },
  { key: 'PAGADO', color: 'bg-brand-500' },
  { key: 'CANCELADO', color: 'bg-rose-500' },
];

@Component({
  selector: 'app-reportes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    KpiCardComponent,
  ],
  templateUrl: './reportes.component.html',
})
export class ReportesComponent implements OnInit {
  private readonly planService = inject(PlanService);
  private readonly platoService = inject(PlatoService);
  private readonly clienteService = inject(ClienteService);

  readonly loading = signal(true);
  readonly pedidos = signal<PlanSemanal[]>([]);
  readonly platos = signal<Plato[]>([]);
  readonly clientes = signal<Cliente[]>([]);

  // --- KPIs de negocio (datos reales) ---
  readonly totalPedidos = computed(() => this.pedidos().length);
  readonly ingresos = computed(() =>
    this.pedidos()
      .filter((p) => p.estadoPago === 'PAGADO')
      .reduce((s, p) => s + p.montoTotal, 0),
  );
  readonly ticketPromedio = computed(() => {
    const pagados = this.pedidos().filter((p) => p.estadoPago === 'PAGADO');
    return pagados.length ? this.ingresos() / pagados.length : 0;
  });
  readonly totalClientes = computed(() => this.clientes().length);

  // --- Distribución de pedidos por estado ---
  readonly estados = computed<EstadoBarra[]>(() => {
    const total = this.pedidos().length;
    return ESTADOS.map(({ key, color }) => {
      const cantidad = this.pedidos().filter((p) => p.estadoPago === key).length;
      return { estado: key, cantidad, pct: total ? Math.round((cantidad / total) * 100) : 0, color };
    });
  });

  // --- Top platos por unidades pedidas (todas las comidas de todos los pedidos) ---
  readonly topPlatos = computed(() => {
    const acc = new Map<string, number>();
    for (const p of this.pedidos()) {
      for (const c of p.comidas) {
        acc.set(c.plato.nombre, (acc.get(c.plato.nombre) ?? 0) + c.cantidad);
      }
    }
    const orden = [...acc.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const max = orden.length ? orden[0][1] : 0;
    return orden.map(([nombre, unidades]) => ({
      nombre,
      unidades,
      pct: max ? Math.round((unidades / max) * 100) : 0,
    }));
  });

  readonly platosDisponibles = computed(() => this.platos().filter((p) => p.disponible).length);

  ngOnInit(): void {
    forkJoin({
      pedidos: this.planService.listarTodos(),
      platos: this.platoService.listar(),
      clientes: this.clienteService.listar(),
    }).subscribe({
      next: ({ pedidos, platos, clientes }) => {
        this.pedidos.set(pedidos);
        this.platos.set(platos);
        this.clientes.set(clientes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
