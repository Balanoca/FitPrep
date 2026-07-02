import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type Tone = 'neutral' | 'brand' | 'amber' | 'blue' | 'rose';

/** Etiqueta de estado (equivale a <Badge> del prototipo). */
@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      [class]="toneClass"
    >
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  @Input() tone: Tone = 'neutral';

  get toneClass(): string {
    return {
      neutral: 'bg-muted text-muted-foreground',
      brand: 'bg-brand-50 text-brand-700',
      amber: 'bg-amber-50 text-amber-700',
      blue: 'bg-blue-50 text-blue-700',
      rose: 'bg-rose-50 text-rose-700',
    }[this.tone];
  }
}
