import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { KpiCardComponent } from '../../../../shared/ui/kpi-card/kpi-card.component';
import { ProduccionService } from '../../data/produccion.service';
import { ProduccionItem, ProduccionPorDia } from '../../data/produccion.model';
import { DIAS_SEMANA, DIA_LABEL, TIPO_LABEL, DiaSemana, TipoComida } from '../../../planificacion/data/plan.model';

@Component({
  selector: 'app-produccion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
    KpiCardComponent,
  ],
  templateUrl: './produccion.component.html',
})
export class ProduccionComponent implements OnInit {
  private readonly produccionService = inject(ProduccionService);
  private readonly snackbar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly fecha = signal<Date>(this.lunesDeEstaSemana());
  readonly items = signal<ProduccionItem[]>([]);

  readonly totalUnidades = computed(() =>
    this.items().reduce((sum, i) => sum + i.cantidadTotal, 0),
  );
  readonly platosDistintos = computed(() => new Set(this.items().map((i) => i.platoId)).size);

  /** Reporte agrupado y ordenado por día de la semana. */
  readonly porDia = computed<ProduccionPorDia[]>(() => {
    const grupos = new Map<string, ProduccionItem[]>();
    for (const item of this.items()) {
      const key = item.diaSemana;
      if (!grupos.has(key)) grupos.set(key, []);
      grupos.get(key)!.push(item);
    }
    const orden = DIAS_SEMANA as readonly string[];
    return [...grupos.entries()]
      .map(([diaSemana, items]) => ({
        diaSemana,
        items,
        totalUnidades: items.reduce((s, i) => s + i.cantidadTotal, 0),
      }))
      .sort((a, b) => orden.indexOf(a.diaSemana) - orden.indexOf(b.diaSemana));
  });

  ngOnInit(): void {
    this.consultar();
  }

  onFecha(date: Date | null): void {
    if (date) {
      this.fecha.set(date);
      this.consultar();
    }
  }

  consultar(): void {
    this.loading.set(true);
    this.produccionService.obtenerProduccion(this.fecha()).subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se pudo cargar el reporte de producción.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  diaLabel(dia: string): string {
    return DIA_LABEL[dia as DiaSemana] ?? dia;
  }

  tipoLabel(tipo: string): string {
    return TIPO_LABEL[tipo as TipoComida] ?? tipo;
  }

  private lunesDeEstaSemana(): Date {
    const hoy = new Date();
    const dow = (hoy.getDay() + 6) % 7;
    hoy.setDate(hoy.getDate() - dow);
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  }
}
