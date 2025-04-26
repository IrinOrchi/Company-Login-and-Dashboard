import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { FormsModule } from '@angular/forms';
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
  modalRef: NgbModalRef | null = null;

  leftCreditProgress: number = 0;
  usedCreditProgress: number = 0;

  //search
  fromDate: string = '';
  toDate: string = '';
  selectedFilter: string = 'All';
  isNotCreditExpired: boolean = false;
  constructor(
    private modalService: NgbModal,
    public creditSystemService: CreditSystemService,
    public loginService: LoginService,
    public gatewayDataSharingService: GatewayDataSharingService
  ) {}
  creditSystem: CreditDetailsData | undefined;
  // supportingInfo: SupportingInfo | undefined;
  tokenData: TokenData[] | undefined;

  totalCredit: number = 0;
  usedCredit: number = 0;
  leftCredit: number = 0;
  validity: string = '';

  ngOnInit(): void {
    // this.gatewayDataSharingService.supportingInfo$.subscribe(
    //   (supportingInfo) => {
    //     this.supportingInfo = supportingInfo;
    //   }
    // );

    // this.loginService.getCompanyId().subscribe({
    //   next: (data) => {
    //     if (data) companyId = data;
    //   },
    // });
    this.getCreditDetails('p', '', '');
  }
  openModal(content: any) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  search() {
    // this.gatewayDataSharingService.supportingInfo$.subscribe(
    //   (supportingInfo) => {
    //     this.supportingInfo = supportingInfo;
    //   }
    // );
    this.getCreditDetails(this.selectedFilter, this.fromDate, this.toDate);
  }
  getCreditDetails(filter: string, fromDate: string, toDate: string) {
    let companyId = '';
    this.loginService.getCompanyId().subscribe({
      next: (cid) => {
        if (cid) companyId = cid;
      },
    });
    this.creditSystemService
      .getCreditDetails(companyId ?? '', filter, fromDate, toDate)
      .subscribe({
        next: (response) => {
          this.creditSystem = response;
          // this.creditSystem = this.creditSystemService.getDummyData();
          // console.log(this.creditSystem, 'c');
          this.totalCredit = this.creditSystem.tCreditTotal;
          this.leftCredit = this.creditSystem.tCreditRemaining;
          this.usedCredit = this.creditSystem.tCreditUsed;
          this.validity = this.creditSystemService.formatDate(
            this.creditSystem.tCreditValidity
          );

          this.tokenData = [...this.creditSystem.TokenData];
          // debugger;
          if (this.leftCredit > 0 && this.totalCredit > this.leftCredit) {
            this.leftCreditProgress =
              this.creditSystemService.calculateProgress(
                this.totalCredit,
                this.leftCredit
              );
          }
          if (this.leftCredit > 0 && this.totalCredit > this.usedCredit) {
            // parseInt(this.leftCredit) / parseInt(this.totalCredit);
            this.usedCreditProgress =
              this.creditSystemService.calculateProgress(
                this.totalCredit,
                this.usedCredit
              );
          }
          const tCreditValidity = this.creditSystem.tCreditValidity;
          // console.log(
          //   this.gatewayDataSharingService.getParseDate(tCreditValidity),
          //   'tCreditValidity'
          // );
          // console.log(
          //   this.gatewayDataSharingService.getCurrentDateTime(),
          //   'currentDate'
          // );

          if (
            this.gatewayDataSharingService.getParseDate(tCreditValidity) >=
            this.gatewayDataSharingService.getCurrentDateTime()
          ) {
            this.isNotCreditExpired = true;
          }
        },
        error: (err) => {
          console.log('Error Getting response: ', err);
        },
      });
    // this.creditSystem = this.creditSystemService.getDummyData();
    // this.totalCredit = this.creditSystem.tCreditTotal;
    // this.leftCredit = this.creditSystem.tCreditRemaining;
    // this.usedCredit = this.creditSystem.tCreditUsed;
    // this.validity = this.creditSystemService.formatDate(
    //   this.creditSystem.tCreditValidity
    // );

    // this.tokenData = [...this.creditSystem.TokenData];

    // this.leftCreditProgress = this.creditSystemService.calculateProgress(
    //   this.leftCredit,
    //   this.totalCredit
    // );
    // this.usedCreditProgress = this.creditSystemService.calculateProgress(
    //   this.usedCredit,
    //   this.totalCredit
    // );
  }
  closeModal() {
    this.modalRef?.close();
  }
}
