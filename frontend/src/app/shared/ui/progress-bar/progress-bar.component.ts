import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type Tone = 'brand' | 'blue' | 'amber';

/** Barra de progreso fina (equivale a <ProgressBar> del prototipo). */
@Component({
  selector: 'app-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div class="h-full rounded-full" [class]="toneClass" [style.width.%]="value"></div>
    </div>
  `,
})
export class ProgressBarComponent {
  @Input({ required: true }) value!: number;
  @Input() tone: Tone = 'brand';

  get toneClass(): string {
    return { brand: 'bg-brand-500', blue: 'bg-blue-500', amber: 'bg-amber-500' }[this.tone];
  }
}
