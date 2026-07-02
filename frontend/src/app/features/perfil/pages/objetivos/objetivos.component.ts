import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-objetivos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
  ],
  templateUrl: './objetivos.component.html',
})
export class ObjetivosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(MatSnackBar);

  readonly saving = signal(false);

  readonly objetivosFitness = [
    { value: 'PERDIDA_GRASA', label: 'Pérdida de grasa' },
    { value: 'GANANCIA_MUSCULAR', label: 'Ganancia muscular' },
    { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
  ];

  readonly form = this.fb.nonNullable.group({
    objetivoFitness: ['MANTENIMIENTO' as string | null],
    requerimientoKcal: [null as number | null, [Validators.min(0)]],
    reqProteinasG: [null as number | null, [Validators.min(0)]],
    reqCarbohidratosG: [null as number | null, [Validators.min(0)]],
    reqGrasasG: [null as number | null, [Validators.min(0)]],
  });

  ngOnInit(): void {
    const u = this.auth.user();
    if (u) {
      this.form.patchValue({
        objetivoFitness: u.objetivoFitness ?? 'MANTENIMIENTO',
        requerimientoKcal: u.requerimientoKcal ?? null,
        reqProteinasG: u.reqProteinasG ?? null,
        reqCarbohidratosG: u.reqCarbohidratosG ?? null,
        reqGrasasG: u.reqGrasasG ?? null,
      });
    }
  }

  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);

    this.auth.actualizarObjetivos(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.snackbar.open('Objetivos actualizados.', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/athlete/profile']);
      },
      error: (err) => {
        this.saving.set(false);
        this.snackbar.open(err?.error?.message ?? 'No se pudieron guardar los objetivos.', 'Cerrar', {
          duration: 4000,
        });
      },
    });
  }
}
