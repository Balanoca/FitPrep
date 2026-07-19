import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { ClienteService } from '../../data/cliente.service';
import { Cliente } from '../../data/cliente.model';
import { objetivoLabel } from '../../../perfil/data/objetivo-fitness';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
  ],
  templateUrl: './clientes-list.component.html',
})
export class ClientesListComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly snackbar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly clientes = signal<Cliente[]>([]);
  readonly search = signal('');

  readonly filtrados = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.clientes();
    return this.clientes().filter(
      (c) =>
        `${c.nombres} ${c.apellidos}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  });

  ngOnInit(): void {
    this.clienteService.listar().subscribe({
      next: (clientes) => {
        this.clientes.set(clientes);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackbar.open('No se pudieron cargar los clientes.', 'Cerrar', { duration: 4000 });
      },
    });
  }

  iniciales(c: Cliente): string {
    return `${c.nombres?.[0] ?? ''}${c.apellidos?.[0] ?? ''}`.toUpperCase();
  }

  readonly objetivoLabel = objetivoLabel;
}
