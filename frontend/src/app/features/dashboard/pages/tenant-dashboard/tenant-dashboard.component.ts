import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { KpiCardComponent } from '../../../../shared/ui/kpi-card/kpi-card.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { PlatoService } from '../../../catalogo/data/plato.service';
import { ProduccionService } from '../../../logistica/data/produccion.service';
import { Plato } from '../../../catalogo/data/plato.model';
import { ProduccionItem } from '../../../logistica/data/produccion.model';

interface TopPlato {
  nombre: string;
  unidades: number;
  pct: number;
}

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    KpiCardComponent,
  ],
  templateUrl: './tenant-dashboard.component.html',
})
export class TenantDashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly platoService = inject(PlatoService);
  private readonly produccionService = inject(ProduccionService);

  readonly user = this.auth.user;
  readonly loading = signal(true);
  readonly platos = signal<Plato[]>([]);
  readonly produccion = signal<ProduccionItem[]>([]);

  // --- KPIs reales del catálogo ---
  readonly totalPlatos = computed(() => this.platos().length);
  readonly disponibles = computed(() => this.platos().filter((p) => p.disponible).length);
  readonly precioPromedio = computed(() => {
    const list = this.platos();
    if (list.length === 0) return 0;
    return list.reduce((s, p) => s + p.precio, 0) / list.length;
  });

  // --- KPIs de producción de la semana ---
  readonly unidadesSemana = computed(() =>
    this.produccion().reduce((s, i) => s + i.cantidadTotal, 0),
  );

  /** Top platos por unidades a producir esta semana (dato real). */
  readonly topPlatos = computed<TopPlato[]>(() => {
    const acc = new Map<string, number>();
    for (const item of this.produccion()) {
      acc.set(item.platoNombre, (acc.get(item.platoNombre) ?? 0) + item.cantidadTotal);
    }
    const orden = [...acc.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const max = orden.length ? orden[0][1] : 0;
    return orden.map(([nombre, unidades]) => ({
      nombre,
      unidades,
      pct: max > 0 ? Math.round((unidades / max) * 100) : 0,
    }));
  });

  ngOnInit(): void {
    forkJoin({
      platos: this.platoService.listar(),
      produccion: this.produccionService.obtenerProduccion(this.lunes()),
    }).subscribe({
      next: ({ platos, produccion }) => {
        this.platos.set(platos);
        this.produccion.set(produccion);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private lunes(): Date {
    const hoy = new Date();
    const dow = (hoy.getDay() + 6) % 7;
    hoy.setDate(hoy.getDate() - dow);
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  }
}
