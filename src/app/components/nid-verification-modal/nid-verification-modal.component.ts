import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nid-verification-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nid-verification-modal.component.html',
  styleUrl: './nid-verification-modal.component.scss',
})
export class NidVerificationModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
  dismiss() {
    this.activeModal.dismiss('Cross click');
  }
  verifyNow() {
    const url = 'https://corporate3.bdjobs.com/nidVerification.asp';
    window.location.href = url;
  }
}
