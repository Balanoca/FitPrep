import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { CardComponent } from '../../shared/ui/card/card.component';

/**
 * Página temporal para rutas aún no implementadas. Lee el título de la data
 * de la ruta. Se irá reemplazando feature por feature.
 */
@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, CardComponent],
  template: `
    <div class="p-8">
      <app-page-header
        [eyebrow]="eyebrow()"
        [title]="title()"
        description="Esta pantalla está en construcción. La UX seguirá el prototipo NutriFlow."
      />
      <app-card>
        <div class="grid place-items-center py-16 text-center text-muted-foreground">
          <div class="text-sm">Contenido pendiente de implementar</div>
        </div>
      </app-card>
    </div>
  `,
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly title = toSignal(
    this.route.data.pipe(map((d) => (d['title'] as string) ?? 'FitPrep')),
    { initialValue: 'FitPrep' },
  );
  readonly eyebrow = toSignal(
    this.route.data.pipe(map((d) => (d['eyebrow'] as string) ?? '')),
    { initialValue: '' },
  );
}
