import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-nid-verification-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nid-verification-modal.component.html',
  styleUrl: './nid-verification-modal.component.scss',
})
export class NidVerificationModalComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  private readonly MODAL_ID = 'nid-verification-modal';
  
  constructor(private modalService: ModalService) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    this.modalService.openModal(this.MODAL_ID);
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
    this.modalService.closeModal();
  }
  
  dismiss() {
    this.close.emit();
  }

  verifyNow() {
    const url = 'https://corporate3.bdjobs.com/nidVerification.asp';
    window.location.href = url;
  }
}
