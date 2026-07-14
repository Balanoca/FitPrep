import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { KpiCardComponent } from '../../../../shared/ui/kpi-card/kpi-card.component';
import { ClienteService } from '../../../clientes/data/cliente.service';
import { UsuarioAdmin } from '../../../clientes/data/cliente.model';

/** Panel del ADMIN: todos los usuarios de la plataforma (deportistas y negocios). */
@Component({
  selector: 'app-admin-users',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
    KpiCardComponent,
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly snackbar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly usuarios = signal<UsuarioAdmin[]>([]);
  readonly search = signal('');

  readonly atletas = computed(() => this.usuarios().filter((u) => u.rol === 'ATHLETE').length);
  readonly negocios = computed(
    () => this.usuarios().filter((u) => u.rol === 'TENANT' || u.rol === 'ADMIN').length,
  );

  readonly filtrados = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.usuarios().filter(
      (u) => !q || `${u.nombres} ${u.apellidos} ${u.email}`.toLowerCase().includes(q),
    );
  });

  ngOnInit(): void {
    this.clienteService.listarTodosAdmin().subscribe({
      next: (list) => {
        this.usuarios.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se pudieron cargar los usuarios.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  tono(rol: string): 'brand' | 'blue' | 'amber' {
    switch (rol) {
      case 'ADMIN': return 'amber';
      case 'TENANT': return 'blue';
      default: return 'brand';
    }
  }

  rolLabel(rol: string): string {
    return { ADMIN: 'Admin', TENANT: 'Negocio', ATHLETE: 'Deportista' }[rol] ?? rol;
  }
}
