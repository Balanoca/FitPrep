import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    // Rehidrata la sesión si hay un JWT guardado (p. ej. tras recargar).
    if (this.auth.hasToken() && !this.auth.isAuthenticated()) {
      this.auth.restoreSession().subscribe({
        error: () => this.auth.logout(),
      });
    }
  }
}
