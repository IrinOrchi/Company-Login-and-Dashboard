import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-progress-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './progress-loading.component.html',
  styleUrl: './progress-loading.component.scss',
})
export class ProgressLoadingComponent {
}
