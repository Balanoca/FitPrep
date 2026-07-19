import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { SuscripcionService } from '../../data/suscripcion.service';
import { PagoSuscripcion, PlanSuscripcion, Suscripcion } from '../../data/suscripcion.model';

/** Pantalla de la suscripción del negocio: estado, planes, pago e historial. */
@Component({
  selector: 'app-suscripcion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    DecimalPipe,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
  ],
  templateUrl: './suscripcion.component.html',
})
export class SuscripcionComponent implements OnInit {
  private readonly service = inject(SuscripcionService);
  private readonly snackbar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly procesando = signal(false);
  readonly suscripcion = signal<Suscripcion | null>(null);
  readonly planes = signal<PlanSuscripcion[]>([]);
  readonly pagos = signal<PagoSuscripcion[]>([]);

  readonly tonoEstado = computed<'brand' | 'amber' | 'rose' | 'neutral'>(() => {
    switch (this.suscripcion()?.estado) {
      case 'ACTIVA': return 'brand';
      case 'PRUEBA': return 'amber';
      case 'VENCIDA': return 'rose';
      default: return 'neutral';
    }
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.loading.set(true);
    this.service.miSuscripcion().subscribe({
      next: (s) => {
        this.suscripcion.set(s);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se pudo cargar la suscripción.', 'Cerrar', { duration: 4000 });
      },
    });
    this.service.listarPlanes().subscribe({ next: (p) => this.planes.set(p) });
    this.cargarPagos();
  }

  private cargarPagos(): void {
    this.service.misPagos().subscribe({ next: (p) => this.pagos.set(p), error: () => {} });
  }

  esPlanActual(plan: PlanSuscripcion): boolean {
    return this.suscripcion()?.planId === plan.id;
  }

  elegirPlan(plan: PlanSuscripcion): void {
    if (this.procesando() || this.esPlanActual(plan)) return;
    this.procesando.set(true);
    this.service.suscribir(plan.id).subscribe({
      next: (s) => {
        this.suscripcion.set(s);
        this.procesando.set(false);
        this.snackbar.open(`Plan cambiado a ${plan.nombre}.`, 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.procesando.set(false);
        this.snackbar.open(err?.error?.message ?? 'No se pudo cambiar el plan.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  pagar(): void {
    if (this.procesando()) return;
    this.procesando.set(true);
    this.service.pagar().subscribe({
      next: (s) => {
        this.suscripcion.set(s);
        this.procesando.set(false);
        this.cargarPagos();
        this.snackbar.open('Pago registrado. Suscripción renovada un mes.', 'Cerrar', { duration: 4000 });
      },
      error: (err) => {
        this.procesando.set(false);
        this.snackbar.open(err?.error?.message ?? 'No se pudo procesar el pago.', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
