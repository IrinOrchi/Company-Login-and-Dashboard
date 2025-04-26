import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-credit-rejected',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit-rejected.component.html',
  styleUrl: './credit-rejected.component.scss',
})
export class CreditRejectedComponent {
  constructor(public activeModal: NgbActiveModal) {}
  dismiss() {
    this.activeModal.dismiss('Cross click');
  }
}
