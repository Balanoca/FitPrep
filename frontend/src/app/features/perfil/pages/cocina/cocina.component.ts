import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { CocinaPublica } from '../../../../core/models/user.model';
import { NegocioService } from '../../../negocio/data/negocio.service';

/**
 * Configuración del atleta: cambiar de dark kitchen (Opción B, cocina fija
 * reasignable). Los planes ya creados no se migran a la nueva cocina.
 */
@Component({
  selector: 'app-cocina',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
  ],
  templateUrl: './cocina.component.html',
})
export class CocinaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly negocioService = inject(NegocioService);
  private readonly snackbar = inject(MatSnackBar);

  readonly saving = signal(false);
  readonly cocinas = signal<CocinaPublica[]>([]);

  /** Nombre de la cocina actual del usuario, resuelto contra la lista pública. */
  readonly cocinaActual = computed(() => {
    const id = this.auth.user()?.negocioId;
    return this.cocinas().find((c) => c.id === id)?.nombreComercial ?? null;
  });

  readonly form = this.fb.nonNullable.group({
    negocioId: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    this.negocioService.listarPublicas().subscribe({
      next: (cocinas) => {
        this.cocinas.set(cocinas);
        this.form.patchValue({ negocioId: this.auth.user()?.negocioId ?? null });
      },
      error: () =>
        this.snackbar.open('No se pudieron cargar las cocinas.', 'Cerrar', { duration: 4000 }),
    });
  }

  guardar(): void {
    const negocioId = this.form.controls.negocioId.value;
    if (this.form.invalid || negocioId == null || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    if (negocioId === this.auth.user()?.negocioId) {
      this.snackbar.open('Ya perteneces a esa cocina.', 'Cerrar', { duration: 3000 });
      return;
    }
    this.saving.set(true);

    this.auth.cambiarCocina(negocioId).subscribe({
      next: () => {
        this.saving.set(false);
        this.snackbar.open('Cocina actualizada. Tus próximos planes irán a la nueva cocina.', 'Cerrar', {
          duration: 4000,
        });
      },
      error: (err) => {
        this.saving.set(false);
        this.snackbar.open(err?.error?.message ?? 'No se pudo cambiar de cocina.', 'Cerrar', {
          duration: 4000,
        });
      },
    });
  }
}
