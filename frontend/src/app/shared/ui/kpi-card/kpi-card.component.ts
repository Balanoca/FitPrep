import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Métrica destacada (equivale a <KpiCard> del prototipo). */
@Component({
  selector: 'app-kpi-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-2xl border border-border bg-card shadow-sm p-5">
      <div class="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
        {{ label }}
      </div>
      <div class="text-2xl font-semibold tracking-tight">{{ value }}</div>
      @if (delta || hint) {
        <div class="mt-3 flex items-center gap-1.5 text-xs">
          @if (delta) { <span class="text-brand-600 font-medium">{{ delta }}</span> }
          @if (hint) { <span class="text-muted-foreground">{{ hint }}</span> }
        </div>
      }
    </div>
  `,
})
export class KpiCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string;
  @Input() delta?: string;
  @Input() hint?: string;
}
