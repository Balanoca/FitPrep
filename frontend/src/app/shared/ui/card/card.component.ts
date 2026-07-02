import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Tarjeta base (equivale a <Card> del prototipo). Proyecta contenido. */
@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-2xl border border-border bg-card shadow-sm" [class]="padding">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  @Input() padding = 'p-6';
}
