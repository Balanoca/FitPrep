import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

/** Anillo de progreso con etiqueta central (equivale a <Donut> del prototipo). */
@Component({
  selector: 'app-donut',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative grid place-items-center" [style.width.px]="size" [style.height.px]="size">
      <div class="rounded-full" [style.width.px]="size" [style.height.px]="size" [style.background]="ring()"></div>
      <div
        class="absolute rounded-full bg-card grid place-items-center"
        [style.width.px]="innerSize()"
        [style.height.px]="innerSize()"
      >
        <div class="text-center">
          <div class="text-xl font-semibold tabular-nums">{{ label }}</div>
          @if (sub) {
            <div class="text-[10px] text-muted-foreground uppercase tracking-widest">{{ sub }}</div>
          }
        </div>
      </div>
    </div>
  `,
})
export class DonutComponent {
  @Input({ required: true }) set value(v: number) { this._value.set(v); }
  @Input() size = 140;
  @Input({ required: true }) label!: string;
  @Input() sub?: string;

  private readonly _value = signal(0);

  readonly ring = computed(
    () => `conic-gradient(var(--brand-500) ${this._value() * 3.6}deg, var(--muted) 0)`,
  );
  readonly innerSize = computed(() => this.size * 0.72);
}
