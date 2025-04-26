import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-circular-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="circular-progress" [style.width]="size" [style.height]="size">
      <svg class="circular-progress-svg" viewBox="0 0 100 100">
        <circle
          class="circular-progress-background"
          cx="50"
          cy="50"
          r="45"
          [style.stroke]="backgroundColor"
          [style.stroke-width]="strokeWidth"
          fill="none"
        />
        <circle
          class="circular-progress-path"
          cx="50"
          cy="50"
          r="45"
          [style.stroke]="pathColor"
          [style.stroke-width]="strokeWidth"
          [style.stroke-dasharray]="circumference"
          [style.stroke-dashoffset]="offset"
          fill="none"
        />
      </svg>
      <div class="circular-progress-text" [style.color]="textColor">
        {{ value }}%
      </div>
    </div>
  `,
  styles: [`
    .circular-progress {
      position: relative;
      display: inline-block;
    }
    .circular-progress-svg {
      transform: rotate(-90deg);
    }
    .circular-progress-background {
      stroke: #d6d6d6;
    }
    .circular-progress-path {
      transition: stroke-dashoffset 0.3s ease;
    }
    .circular-progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      font-weight: bold;
    }
  `]
})
export class CircularProgressComponent {
  @Input() value: number = 0;
  @Input() size: string = '100%';
  @Input() strokeWidth: number = 10;
  @Input() pathColor: string = '#0e73a9';
  @Input() backgroundColor: string = '#d6d6d6';
  @Input() textColor: string = '#0e73a9';

  get circumference(): number {
    return 2 * Math.PI * 45;
  }

  get offset(): number {
    return this.circumference - (this.value / 100) * this.circumference;
  }
} 