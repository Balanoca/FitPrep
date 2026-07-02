import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { PlanService } from '../../data/plan.service';
import { PlanSemanal } from '../../data/plan.model';

type BadgeTone = 'neutral' | 'brand' | 'amber' | 'blue' | 'rose';

@Component({
  selector: 'app-mis-planes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
  ],
  templateUrl: './mis-planes.component.html',
})
export class MisPlanesComponent implements OnInit {
  private readonly planService = inject(PlanService);
  private readonly snackbar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly planes = signal<PlanSemanal[]>([]);
  readonly actualizando = signal<number | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.loading.set(true);
    this.planService.listarMisPlanes().subscribe({
      next: (planes) => {
        this.planes.set(planes);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se pudieron cargar tus pedidos.', 'Cerrar', { duration: 4000 });
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
        return 'amber'; // PENDIENTE
    }
  }

  cambiar(plan: PlanSemanal, estado: string): void {
    if (plan.id === null) return;
    const id = plan.id;
    this.actualizando.set(id);
    this.planService.cambiarEstado(id, estado).subscribe({
      next: (actualizado) => {
        this.planes.update((list) => list.map((p) => (p.id === id ? actualizado : p)));
        this.actualizando.set(null);
        this.snackbar.open(`Pedido #${id}: ${estado.toLowerCase()}.`, 'Cerrar', { duration: 3000 });
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
