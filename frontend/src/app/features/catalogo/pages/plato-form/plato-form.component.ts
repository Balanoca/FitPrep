import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { PlatoService } from '../../data/plato.service';
import { PlatoForm } from '../../data/plato.model';

@Component({
  selector: 'app-plato-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackbar = inject(MatSnackBar);

  readonly editId = signal<number | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);

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
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.editId.set(id);
      this.cargar(id);
    }
  }

  private cargar(id: number): void {
    this.loading.set(true);
    this.platoService.obtener(id).subscribe({
      next: (plato) => {
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
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se encontró el plato.', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/tenant/meals']);
      },
    });
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
      next: () => {
        this.saving.set(false);
        this.snackbar.open(
          id === null ? 'Plato creado.' : 'Plato actualizado.',
          'Cerrar',
          { duration: 3000 },
        );
        this.router.navigate(['/tenant/meals']);
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
}
