import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-credit-pending',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit-pending.component.html',
  styleUrl: './credit-pending.component.scss',
})
export class CreditPendingComponent {
  constructor(public activeModal: NgbActiveModal) {}
  dismiss() {
    this.activeModal.dismiss('Cross click');
  }
}
