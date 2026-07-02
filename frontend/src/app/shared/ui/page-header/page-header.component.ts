import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Cabecera de página (equivale a <PageHeader> del prototipo).
 * Las acciones se proyectan vía <ng-content select="[actions]">.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div class="min-w-0">
        @if (eyebrow) {
          <div class="text-[11px] font-semibold uppercase tracking-widest text-brand-600 mb-1.5">
            {{ eyebrow }}
          </div>
        }
        <h1 class="text-2xl md:text-3xl font-semibold tracking-tight">{{ title }}</h1>
        @if (description) {
          <p class="text-sm text-muted-foreground mt-1.5 max-w-2xl">{{ description }}</p>
        }
      </div>
      <div class="flex flex-wrap gap-2">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() eyebrow?: string;
  @Input({ required: true }) title!: string;
  @Input() description?: string;
}
