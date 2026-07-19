import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { PlatoService } from '../../data/plato.service';
import { PlatoForm } from '../../data/plato.model';
import { InsumoService } from '../../../insumos/data/insumo.service';
import { Insumo } from '../../../insumos/data/insumo.model';

/** Una línea de receta editable en el formulario. */
interface LineaRecetaEditable {
  insumoId: number | null;
  cantidad: number | null;
}

@Component({
  selector: 'app-plato-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
  ],
  templateUrl: './plato-form.component.html',
})
export class PlatoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly platoService = inject(PlatoService);
  private readonly insumoService = inject(InsumoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackbar = inject(MatSnackBar);

  readonly editId = signal<number | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);

  /** Insumos disponibles de la cocina y líneas de la receta del plato. */
  readonly insumos = signal<Insumo[]>([]);
  readonly lineasReceta = signal<LineaRecetaEditable[]>([]);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0)]],
    calorias: [0, [Validators.required, Validators.min(0)]],
    proteinas: [0, [Validators.required, Validators.min(0)]],
    carbohidratos: [0, [Validators.required, Validators.min(0)]],
    grasas: [0, [Validators.required, Validators.min(0)]],
    disponible: [true],
  });

  get esEdicion(): boolean {
    return this.editId() !== null;
  }

  ngOnInit(): void {
    // Los insumos se cargan siempre: el selector de receta los necesita.
    this.insumoService.listar().subscribe({
      next: (insumos) => this.insumos.set(insumos),
      error: () => {},
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.editId.set(id);
      this.cargar(id);
    }
  }

  private cargar(id: number): void {
    this.loading.set(true);
    // Plato + su receta en paralelo.
    forkJoin({
      plato: this.platoService.obtener(id),
      receta: this.insumoService.obtenerReceta(id),
    }).subscribe({
      next: ({ plato, receta }) => {
        this.form.patchValue({
          nombre: plato.nombre,
          descripcion: plato.descripcion ?? '',
          precio: plato.precio,
          calorias: plato.calorias,
          proteinas: plato.proteinas,
          carbohidratos: plato.carbohidratos,
          grasas: plato.grasas,
          disponible: plato.disponible,
        });
        this.lineasReceta.set(
          receta.map((r) => ({ insumoId: r.insumoId, cantidad: r.cantidad })),
        );
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se encontró el plato.', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/tenant/meals']);
      },
    });
  }

  // --- Edición de la receta ---

  agregarLinea(): void {
    this.lineasReceta.update((l) => [...l, { insumoId: null, cantidad: null }]);
  }

  quitarLinea(index: number): void {
    this.lineasReceta.update((l) => l.filter((_, i) => i !== index));
  }

  setLineaInsumo(index: number, insumoId: number): void {
    this.lineasReceta.update((l) =>
      l.map((linea, i) => (i === index ? { ...linea, insumoId } : linea)),
    );
  }

  setLineaCantidad(index: number, cantidad: number): void {
    this.lineasReceta.update((l) =>
      l.map((linea, i) => (i === index ? { ...linea, cantidad } : linea)),
    );
  }

  unidadDe(insumoId: number | null): string {
    return this.insumos().find((i) => i.id === insumoId)?.unidad ?? '';
  }

  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const payload = this.form.getRawValue() as PlatoForm;

    const id = this.editId();
    const req$ = id === null
      ? this.platoService.crear(payload)
      : this.platoService.actualizar(id, payload);

    req$.subscribe({
      next: (plato) => {
        const platoId = id ?? plato.id;
        // Guarda la receta (líneas válidas) contra el plato ya persistido.
        const lineas = this.lineasReceta()
          .filter((l) => l.insumoId != null && l.cantidad != null && l.cantidad > 0)
          .map((l) => ({ insumoId: l.insumoId as number, cantidad: l.cantidad as number }));

        if (platoId == null) {
          this.finalizarGuardado(id);
          return;
        }
        this.insumoService.guardarReceta(platoId, lineas).subscribe({
          next: () => this.finalizarGuardado(id),
          error: () => {
            this.saving.set(false);
            this.snackbar.open(
              'El plato se guardó, pero la receta no. Revísala.',
              'Cerrar',
              { duration: 5000 },
            );
            this.router.navigate(['/tenant/meals']);
          },
        });
      },
      error: (err) => {
        this.saving.set(false);
        this.snackbar.open(
          err?.error?.message ?? 'No se pudo guardar el plato.',
          'Cerrar',
          { duration: 4000 },
        );
      },
    });
  }

  private finalizarGuardado(id: number | null): void {
    this.saving.set(false);
    this.snackbar.open(
      id === null ? 'Plato creado.' : 'Plato actualizado.',
      'Cerrar',
      { duration: 3000 },
    );
    this.router.navigate(['/tenant/meals']);
  }
}
