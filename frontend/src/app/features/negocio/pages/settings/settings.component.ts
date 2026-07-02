import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { NegocioService } from '../../data/negocio.service';
import { Negocio } from '../../data/negocio.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly negocioService = inject(NegocioService);
  private readonly snackbar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly negocio = signal<Negocio | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombreComercial: ['', Validators.required],
    telefono: [''],
  });

  ngOnInit(): void {
    this.negocioService.obtenerMiNegocio().subscribe({
      next: (negocio) => {
        this.negocio.set(negocio);
        this.form.patchValue({
          nombreComercial: negocio.nombreComercial,
          telefono: negocio.telefono ?? '',
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se pudieron cargar los datos del negocio.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const { nombreComercial, telefono } = this.form.getRawValue();

    this.negocioService.actualizarMiNegocio({ nombreComercial, telefono: telefono || null }).subscribe({
      next: (negocio) => {
        this.negocio.set(negocio);
        this.saving.set(false);
        this.snackbar.open('Datos del negocio actualizados.', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.saving.set(false);
        this.snackbar.open(err?.error?.message ?? 'No se pudo guardar.', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
