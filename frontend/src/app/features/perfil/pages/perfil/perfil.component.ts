import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule, MatButtonModule, PageHeaderComponent, CardComponent],
  templateUrl: './perfil.component.html',
})
export class PerfilComponent {
  private readonly auth = inject(AuthService);

  readonly user = this.auth.user;

  readonly initials = computed(() => {
    const u = this.user();
    if (!u) return '';
    return `${u.nombres?.[0] ?? ''}${u.apellidos?.[0] ?? ''}`.toUpperCase();
  });

  readonly rolLabel = computed(() => {
    switch (this.user()?.rol) {
      case 'ATHLETE':
        return 'Deportista';
      case 'TENANT':
        return 'Negocio';
      case 'ADMIN':
        return 'Administrador';
      default:
        return '';
    }
  });

  readonly esAtleta = computed(() => this.user()?.rol === 'ATHLETE');
}
