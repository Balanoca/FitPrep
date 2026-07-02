import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { SidebarComponent } from '../sidebar/sidebar.component';

/**
 * Layout principal autenticado (equivale a <MockupShell> del prototipo):
 * sidebar + topbar + área de contenido con <router-outlet>.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, MatIconModule, SidebarComponent],
  template: `
    <div class="min-h-screen flex bg-background text-foreground">
      <app-sidebar />
      <div class="flex-1 min-w-0 flex flex-col">
        <header
          class="sticky top-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur flex items-center justify-between px-6 gap-4"
        >
          <div class="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
            <span class="font-medium text-foreground">FitPrep</span>
          </div>
          <div class="flex items-center gap-3">
            <button class="size-8 grid place-items-center rounded-md hover:bg-muted relative">
              <mat-icon class="!size-5 !text-[20px]">notifications</mat-icon>
              <span class="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-brand-500"></span>
            </button>
          </div>
        </header>
        <main class="flex-1 min-w-0">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class ShellComponent {}
