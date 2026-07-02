import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { PlatoService } from '../../data/plato.service';
import { Plato } from '../../data/plato.model';

type EstadoFiltro = 'todas' | 'disponibles' | 'no-disponibles';

@Component({
  selector: 'app-plato-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    RouterLink,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
  ],
  templateUrl: './plato-list.component.html',
})
export class PlatoListComponent implements OnInit {
  private readonly platoService = inject(PlatoService);
  private readonly snackbar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly platos = signal<Plato[]>([]);
  readonly search = signal('');
  readonly estado = signal<EstadoFiltro>('todas');

  readonly filtros: { key: EstadoFiltro; label: string }[] = [
    { key: 'todas', label: 'Todas' },
    { key: 'disponibles', label: 'Disponibles' },
    { key: 'no-disponibles', label: 'No disponibles' },
  ];

  readonly platosFiltrados = computed(() => {
    const q = this.search().trim().toLowerCase();
    const est = this.estado();
    return this.platos().filter((p) => {
      const coincideTexto = !q || p.nombre.toLowerCase().includes(q);
      const coincideEstado =
        est === 'todas' ||
        (est === 'disponibles' && p.disponible) ||
        (est === 'no-disponibles' && !p.disponible);
      return coincideTexto && coincideEstado;
    });
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.loading.set(true);
    this.platoService.listar().subscribe({
      next: (platos) => {
        this.platos.set(platos);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se pudo cargar el catálogo.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  eliminar(plato: Plato): void {
    if (plato.id === null) return;
    const id = plato.id;
    this.platoService.eliminar(id).subscribe({
      next: () => {
        this.platos.update((list) => list.filter((p) => p.id !== id));
        this.snackbar.open(`"${plato.nombre}" eliminado.`, 'Cerrar', { duration: 3000 });
      },
      error: () => this.snackbar.open('No se pudo eliminar el plato.', 'Cerrar', { duration: 4000 }),
    });
  }

  setEstado(e: EstadoFiltro): void {
    this.estado.set(e);
  }
}
