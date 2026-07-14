import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { NegocioService } from '../../../negocio/data/negocio.service';
import { NegocioResumen } from '../../../negocio/data/negocio.model';

/** Panel del ADMIN: listado de todos los negocios registrados con sus conteos. */
@Component({
  selector: 'app-admin-businesses',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
  ],
  templateUrl: './businesses.component.html',
})
export class BusinessesComponent implements OnInit {
  private readonly negocioService = inject(NegocioService);
  private readonly snackbar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly negocios = signal<NegocioResumen[]>([]);
  readonly search = signal('');

  readonly filtrados = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.negocios().filter((n) => !q || n.nombreComercial.toLowerCase().includes(q));
  });

  ngOnInit(): void {
    this.negocioService.listarTodosAdmin().subscribe({
      next: (list) => {
        this.negocios.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se pudieron cargar los negocios.', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
