import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private activeModal = new BehaviorSubject<string | null>(null);
  activeModal$ = this.activeModal.asObservable();

  openModal(modalId: string) {
    this.activeModal.next(modalId);
  }

  closeModal() {
    this.activeModal.next(null);
  }

  isModalOpen(modalId: string): boolean {
    return this.activeModal.value === modalId;
  }
} 