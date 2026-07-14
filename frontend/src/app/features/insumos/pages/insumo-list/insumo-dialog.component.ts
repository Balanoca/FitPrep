import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { Insumo, InsumoForm } from '../../data/insumo.model';

/** Alta/edición de un insumo en un diálogo. Devuelve el InsumoForm al cerrar. */
@Component({
  selector: 'app-insumo-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './insumo-dialog.component.html',
})
export class InsumoDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<InsumoDialogComponent>);
  readonly data = inject<Insumo | null>(MAT_DIALOG_DATA);

  readonly esEdicion = this.data !== null;
  readonly unidades = ['kg', 'g', 'l', 'ml', 'unidad', 'lata', 'atado', 'paquete'];

  readonly form = this.fb.nonNullable.group({
    nombre: [this.data?.nombre ?? '', [Validators.required, Validators.maxLength(120)]],
    unidad: [this.data?.unidad ?? 'kg', Validators.required],
    precioUnitario: [this.data?.precioUnitario ?? (null as number | null), [Validators.min(0)]],
    activo: [this.data?.activo ?? true],
  });

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close(this.form.getRawValue() as InsumoForm);
  }

  cancelar(): void {
    this.ref.close(null);
  }
}
