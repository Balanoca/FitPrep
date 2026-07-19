import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/auth/auth.service';
import { CocinaPublica } from '../../../core/models/user.model';
import { NegocioService } from '../../negocio/data/negocio.service';
import { PlatoService } from '../../catalogo/data/plato.service';
import { Plato } from '../../catalogo/data/plato.model';

type Modo = 'atleta' | 'negocio';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly negocioService = inject(NegocioService);
  private readonly platoService = inject(PlatoService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(MatSnackBar);

  readonly modo = signal<Modo>('atleta');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /** Cocinas disponibles para elegir + preview de su catálogo. */
  readonly cocinas = signal<CocinaPublica[]>([]);
  readonly platosPreview = signal<Plato[]>([]);
  readonly cargandoPreview = signal(false);

  readonly objetivos = [
    { value: 'PERDIDA_GRASA', label: 'Pérdida de grasa' },
    { value: 'GANANCIA_MUSCULAR', label: 'Ganancia muscular' },
    { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
  ];

  readonly atletaForm = this.fb.nonNullable.group({
    negocioId: [null as number | null, Validators.required],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    objetivoFitness: ['PERDIDA_GRASA'],
    requerimientoKcal: [null as number | null],
  });

  constructor() {
    this.negocioService.listarPublicas().subscribe({
      next: (cocinas) => this.cocinas.set(cocinas),
      error: () => this.error.set('No se pudieron cargar las cocinas disponibles.'),
    });
  }

  /** Al elegir cocina, carga un preview de sus platos disponibles. */
  onCocinaChange(negocioId: number): void {
    this.platosPreview.set([]);
    if (!negocioId) {
      return;
    }
    this.cargandoPreview.set(true);
    this.platoService.listarPublicos(negocioId).subscribe({
      next: (platos) => {
        this.platosPreview.set(platos);
        this.cargandoPreview.set(false);
      },
      error: () => this.cargandoPreview.set(false),
    });
  }

  readonly negocioForm = this.fb.nonNullable.group({
    nombreComercial: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    telefono: [''],
  });

  setModo(modo: Modo): void {
    this.modo.set(modo);
    this.error.set(null);
  }

  registrarAtleta(): void {
    if (this.atletaForm.invalid || this.loading()) {
      this.atletaForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    const { negocioId, ...resto } = this.atletaForm.getRawValue();
    this.auth.registrarDeportista({ ...resto, negocioId: negocioId! }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.router.navigateByUrl(this.auth.homeForRole(res.rol));
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo crear la cuenta.');
      },
    });
  }

  registrarNegocio(): void {
    if (this.negocioForm.invalid || this.loading()) {
      this.negocioForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    this.auth.registrarNegocio(this.negocioForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackbar.open('Negocio registrado. Ahora inicia sesión con tu cuenta.', 'Cerrar', {
          duration: 5000,
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo registrar el negocio.');
      },
    });
  }
}
