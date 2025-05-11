import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-circular-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.scss']
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