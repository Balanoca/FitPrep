import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { PlatoService } from '../../../catalogo/data/plato.service';
import { Plato } from '../../../catalogo/data/plato.model';
import {
  ComidaProgramada,
  DiaSemana,
  DIAS_SEMANA,
  DIA_LABEL,
  TIPOS_COMIDA,
  TIPO_LABEL,
  TipoComida,
} from '../../data/plan.model';

interface DialogData {
  diaSemana: DiaSemana;
}

@Component({
  selector: 'app-add-comida-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-comida-dialog.component.html',
})
export class AddComidaDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly platoService = inject(PlatoService);
  private readonly dialogRef = inject(MatDialogRef<AddComidaDialogComponent, ComidaProgramada>);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly platos = signal<Plato[]>([]);
  readonly loading = signal(true);

  readonly dias = DIAS_SEMANA.map((d) => ({ value: d, label: DIA_LABEL[d] }));
  readonly tipos = TIPOS_COMIDA.map((t) => ({ value: t, label: TIPO_LABEL[t] }));

  readonly form = this.fb.nonNullable.group({
    platoId: [null as number | null, Validators.required],
    diaSemana: [this.data.diaSemana as DiaSemana, Validators.required],
    tipoComida: ['ALMUERZO' as TipoComida, Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.platoService.listar().subscribe({
      next: (platos) => {
        this.platos.set(platos.filter((p) => p.disponible));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  agregar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const plato = this.platos().find((p) => p.id === raw.platoId);
    if (!plato) return;

    const comida: ComidaProgramada = {
      plato,
      diaSemana: raw.diaSemana,
      tipoComida: raw.tipoComida,
      cantidad: raw.cantidad,
    };
    this.dialogRef.close(comida);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
