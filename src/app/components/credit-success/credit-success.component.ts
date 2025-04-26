import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-credit-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit-success.component.html',
  styleUrl: './credit-success.component.scss'
})
export class CreditSuccessComponent {
  constructor(public activeModal: NgbActiveModal) {}
  dismiss() {
    this.activeModal.dismiss('Cross click');
  }
}
