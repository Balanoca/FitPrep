import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { InsumoService } from '../../data/insumo.service';
import { Insumo, InsumoForm } from '../../data/insumo.model';
import { InsumoDialogComponent } from './insumo-dialog.component';

/** Catálogo de insumos de la cocina: lista + alta/edición por diálogo. */
@Component({
  selector: 'app-insumo-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
  ],
  templateUrl: './insumo-list.component.html',
})
export class InsumoListComponent implements OnInit {
  private readonly insumoService = inject(InsumoService);
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly insumos = signal<Insumo[]>([]);
  readonly search = signal('');

  readonly insumosFiltrados = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.insumos().filter((i) => !q || i.nombre.toLowerCase().includes(q));
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.loading.set(true);
    this.insumoService.listar().subscribe({
      next: (insumos) => {
        this.insumos.set(insumos);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se pudo cargar el catálogo de insumos.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  abrirNuevo(): void {
    const ref = this.dialog.open(InsumoDialogComponent, { data: null, width: '420px' });
    ref.afterClosed().subscribe((form: InsumoForm | null) => {
      if (!form) return;
      this.insumoService.crear(form).subscribe({
        next: (creado) => {
          this.insumos.update((list) => [...list, creado].sort((a, b) => a.nombre.localeCompare(b.nombre)));
          this.snackbar.open('Insumo creado.', 'Cerrar', { duration: 3000 });
        },
        error: (err) =>
          this.snackbar.open(err?.error ?? 'No se pudo crear el insumo.', 'Cerrar', { duration: 4000 }),
      });
    });
  }

  editar(insumo: Insumo): void {
    const ref = this.dialog.open(InsumoDialogComponent, { data: insumo, width: '420px' });
    ref.afterClosed().subscribe((form: InsumoForm | null) => {
      if (!form || insumo.id === null) return;
      this.insumoService.actualizar(insumo.id, form).subscribe({
        next: (actualizado) => {
          this.insumos.update((list) => list.map((i) => (i.id === actualizado.id ? actualizado : i)));
          this.snackbar.open('Insumo actualizado.', 'Cerrar', { duration: 3000 });
        },
        error: (err) =>
          this.snackbar.open(err?.error ?? 'No se pudo actualizar el insumo.', 'Cerrar', { duration: 4000 }),
      });
    });
  }

  eliminar(insumo: Insumo): void {
    if (insumo.id === null) return;
    const id = insumo.id;
    this.insumoService.eliminar(id).subscribe({
      next: () => {
        this.insumos.update((list) => list.filter((i) => i.id !== id));
        this.snackbar.open(`"${insumo.nombre}" eliminado.`, 'Cerrar', { duration: 3000 });
      },
      error: () => this.snackbar.open('No se pudo eliminar el insumo.', 'Cerrar', { duration: 4000 }),
    });
  }
}
