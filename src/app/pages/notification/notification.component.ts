import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlBarComponent } from '../../components/control-bar/control-bar.component';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, ControlBarComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

}
