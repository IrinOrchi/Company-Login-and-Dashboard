import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { ControlBarComponent } from '../../components/control-bar/control-bar.component';
import { AccordionComponent } from '../../components/accordion/accordion.component';
import { GatewayDataSharingService } from '../../services/gateway-data-sharing.service';
import { SupportingInfo } from '../../models/shared/SupportingInfo';
import {
  CreditDetailsData,
  CreditSystemService,
  TokenData,
} from '../../services/CreditSystem/credit-system.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-credit',
  standalone: true,
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.scss',
  imports: [
    CommonModule,
    NgbProgressbarModule,
    ControlBarComponent,
    AccordionComponent,
    FormsModule,
  ],
})
export class CreditComponent {
  creditSystemService = inject(CreditSystemService);
  private loginService = inject(LoginService);
  private gatewayDataSharingService = inject(GatewayDataSharingService);

  modalRef: NgbModalRef | null = null;

  // Signals for reactive state management
  totalCredit = signal<number>(0);
  usedCredit = signal<number>(0);
  leftCredit = signal<number>(0);
  usedCreditProgress = signal<number>(0);
  leftCreditProgress = signal<number>(0);
  isNotCreditExpired = signal<boolean>(true);
  validity = signal<string>('');
  fromDate = signal<string>('');
  toDate = signal<string>('');
  selectedFilter = signal<string>('p');
  creditSystem = signal<CreditDetailsData | null>(null);
  tokenData = signal<TokenData[]>([]);

  // Computed signal for credit data validation
  hasCreditData = computed(() => {
    const data = this.creditSystem();
    return data !== null && data !== undefined && (data.TokenData?.length || 0) > 0;
  });

  constructor(private modalService: NgbModal) {
    this.initializeData();
  }

  private initializeData() {
    this.getCreditDetails('p', '', '');
  }

  getCreditDetails(filter: string, fromDate: string, toDate: string) {
    const companyId = window.localStorage.getItem('CompanyId') ?? '';
    this.creditSystemService
      .getCreditDetails(companyId, filter, fromDate, toDate)
      .subscribe({
        next: (response: CreditDetailsData) => {
          this.creditSystem.set(response);
          
          // Update credit values
          this.totalCredit.set(response.tCreditTotal || 0);
          this.leftCredit.set(response.tCreditRemaining || 0);
          this.usedCredit.set(response.tCreditUsed || 0);
          
          // Update validity
          this.validity.set(this.creditSystemService.formatDate(response.tCreditValidity));
          
          // Update token data
          this.tokenData.set([...response.TokenData]);

          // Calculate progress percentages
          if (this.totalCredit() > 0) {
            this.leftCreditProgress.set(
              Math.round((this.leftCredit() / this.totalCredit()) * 100)
            );
            this.usedCreditProgress.set(
              Math.round((this.usedCredit() / this.totalCredit()) * 100)
            );
          }

          // Check credit validity
          const tCreditValidity = response.tCreditValidity;
          this.isNotCreditExpired.set(
            this.gatewayDataSharingService.getParseDate(tCreditValidity) >=
            this.gatewayDataSharingService.getCurrentDateTime()
          );
        },
        error: (err: Error) => {
          console.log('Error Getting response: ', err);
          // Reset values on error
          this.resetCreditValues();
        },
      });
  }

  private resetCreditValues() {
    this.totalCredit.set(0);
    this.leftCredit.set(0);
    this.usedCredit.set(0);
    this.usedCreditProgress.set(0);
    this.leftCreditProgress.set(0);
    this.isNotCreditExpired.set(false);
    this.validity.set('');
    this.tokenData.set([]);
  }

  search() {
    this.getCreditDetails(this.selectedFilter(), this.fromDate(), this.toDate());
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  closeModal() {
    this.modalRef?.close();
  }

  // Public method to format date
  formatDate(date: string): string {
    return this.creditSystemService.formatDate(date);
  }
}
