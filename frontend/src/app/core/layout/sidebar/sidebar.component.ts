import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../auth/auth.service';
import { LayoutService } from '../layout.service';
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
  private readonly router = inject(Router);
  private readonly layout = inject(LayoutService);

  readonly user = this.auth.user;
  readonly collapsed = this.layout.collapsed;
  readonly meta = computed(() => {
    const role = this.auth.role();
    return role ? NAVIGATION[role] : null;
  });

  toggle(): void {
    this.layout.toggleSidebar();
  }

  readonly initials = computed(() => {
    const u = this.user();
    if (!u) return '';
    return `${u.nombres?.[0] ?? ''}${u.apellidos?.[0] ?? ''}`.toUpperCase();
  });

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
