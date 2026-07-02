import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../auth/auth.service';
import { NAVIGATION } from '../navigation';

/** Barra lateral por rol. Traducción del Sidebar.tsx del prototipo. */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly auth = inject(AuthService);

  readonly user = this.auth.user;
  readonly meta = computed(() => {
    const role = this.auth.role();
    return role ? NAVIGATION[role] : null;
  });

  readonly initials = computed(() => {
    const u = this.user();
    if (!u) return '';
    return `${u.nombres?.[0] ?? ''}${u.apellidos?.[0] ?? ''}`.toUpperCase();
  });

  logout(): void {
    this.auth.logout();
  }
}
