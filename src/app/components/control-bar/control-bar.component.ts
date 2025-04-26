import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbAccordionModule,
  NgbDropdownModule,
  NgbModal,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import { GatewayDataSharingService } from '../../services/gateway-data-sharing.service';
import { LoginService } from '../../services/login.service';

import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, tap } from 'rxjs';
import { CreditSystemResponse, ServiceInfo } from '../../models/shared/ServiceInfo';
import { SupportingInfo } from '../../models/shared/SupportingInfo';
import { CreditSystemService } from '../../services/CreditSystem/credit-system.service';
import { CreditPendingComponent } from '../credit-pending/credit-pending.component';
import { EmptyCreditComponent } from '../credit-redeem/credit-redeem.component';
import { CreditRejectedComponent } from '../credit-rejected/credit-rejected.component';
import { CreditSuccessComponent } from '../credit-success/credit-success.component';
import { NidVerificationModalComponent } from '../nid-verification-modal/nid-verification-modal.component';
import { CircularProgressComponent } from '../circular-progress/circular-progress.component';

// import { ProgressLoadingComponent } from '../progress-loading/progress-loading.component';

@Component({
  selector: 'app-control-bar',
  standalone: true,
  templateUrl: './control-bar.component.html',
  styleUrl: './control-bar.component.scss',
  imports: [
    CommonModule,
    NgbDropdownModule,
    EmptyCreditComponent,
    CreditPendingComponent,
    CreditRejectedComponent,
    NgbAccordionModule,
    CircularProgressComponent
  ],
})
export class ControlBarComponent implements OnInit {
  outsideBangladesh?: boolean;
  openRejectedModal() {
    this.openFunctionalModal(CreditRejectedComponent);
  }
  modalRef: NgbModalRef | null = null;
  cvBankPercentage = 0;
  smsPackagePercentage = 0;
  jobPostingAccessPercentage = 0;
  companyName = '';
  companyId: string = '';
  isJobPostingCircularProgressVisible = true;
  isCvBankCircularProgressVisible = true;
  isSmsCircularProgressVisible = true;
  hasJobPostingAccess = false;
  hasCVBankAccess = false;
  remainingCV? = 0;
  viewedCV = 0;
  maxCV = 0;
  hasSmsPackage = false;
  smsPurchased = 0;
  smsSend = 0;
  smsRemaining = 0;
  remainingBasicJobs = 0;
  maxBasicJobs = 0;
  remainingStandoutJobs = 0;
  maxStandoutJobs = 0;
  remainingStandoutPremiumJobs = 0;
  maxStandoutPremiumJobs = 0;
  companyLogoURL = '';
  isAdminUser = false;
  isSidebar = false;
  supportingInfo: SupportingInfo | undefined;
  creditSystem: CreditSystemResponse | undefined;

  serviceData?: ServiceInfo;

  verificationStatus: boolean | undefined;
  nidVerify: boolean | undefined;
  paymentProcess: boolean | undefined;
  // activeTab: string | undefined;
  isNotCreditExpired: boolean = false;
  @Input() activeTab?: string;
  constructor(
    private cookieService: CookieService,
    private creditSystemService: CreditSystemService,
    private modalService: NgbModal,
    public gatewayDataSharingService: GatewayDataSharingService,
    private loginService: LoginService,
    private router: Router
  ) { }

  setCreditSystem() {
    this.creditSystem = this.serviceData?.creditSystem;
    const validityDate = this.creditSystem?.validityDate ?? '';
    if (
      this.gatewayDataSharingService.getParseDate(validityDate) >=
      this.gatewayDataSharingService.getCurrentDateTime()
    ) {
      this.isNotCreditExpired = true;
    }
  }
  ngOnChanges() { }
  ngOnInit(): void {
    // this.controlBarService.activeTab$.subscribe((value: any) => {
    //   console.log(value);
    //   this.changeTab(value);
    // });
    this.loginService.serviceInfoData$.subscribe((data) => {
      this.serviceData = data;

      this.cvDataShow();
      this.setCreditSystem();
      this.jobPostingAssessShow();
      this.showSmsPackage()
    });

    this.companyId = window.localStorage.getItem('companyId') ?? '';
    this.loginService.getSupportingInfo().subscribe((userData) => {
      if (userData) {
        let defaultLogo = 'https://recruiter.bdjobs.com/assets/images/default-company.png';
        this.companyLogoURL =
          userData.CompanyActiveLogoURL === ''
            ? defaultLogo
            : userData.CompanyActiveLogoURL;
      }
    });
    this.isAdminUser = (window.localStorage.getItem(this.loginService.LOCAL_STORAGE_KEYS.IS_ADMIN_USER) === 'true') ?? false;
    this.companyName = window.localStorage.getItem(this.loginService.LOCAL_STORAGE_KEYS.COMPANY_NAME) ?? 'Company Name';

    this.cvBankPercentage = 0;
    this.smsPackagePercentage = 0;
    this.jobPostingAccessPercentage = 0;

    this.loginService.getSupportingInfo().subscribe((supportingInfo) => {
      if (supportingInfo) {
        this.verificationStatus = supportingInfo.VerificationStatus;
        this.nidVerify = supportingInfo.NidVerify;
        this.paymentProcess = supportingInfo.PaymentProcess;

        if (supportingInfo.CompanyCountry.toLowerCase() !== 'bangladesh') {
          this.outsideBangladesh = true;
        } else {
          this.outsideBangladesh = false;
        }
      }
    });
  }

  jobPostingAssessShow() {
    this.hasJobPostingAccess = this.serviceData?.jobPostingAccess ?? false;

    if (this.hasJobPostingAccess) {
      this.remainingBasicJobs =
        this.serviceData?.jobPostingService?.basicListLimit ?? 0;

      this.maxBasicJobs = this.serviceData?.jobPostingService?.maxJob ?? 0;

      this.remainingStandoutJobs =
        this.serviceData?.jobPostingService?.standoutLimit ?? 0;

      this.maxStandoutJobs =
        this.serviceData?.jobPostingService?.maxStandout ?? 0;

      this.remainingStandoutPremiumJobs =
        this.serviceData?.jobPostingService?.standoutPremiumLimit ?? 0;

      this.maxStandoutPremiumJobs =
        this.serviceData?.jobPostingService?.maxStandoutPremium ?? 0;

      const remainingJobsSum =
        this.remainingBasicJobs +
        this.remainingStandoutJobs +
        this.remainingStandoutPremiumJobs;
      const maxJobsSum =
        this.maxBasicJobs + this.maxStandoutJobs + this.maxStandoutPremiumJobs;

      if (maxJobsSum > 0) {
        this.jobPostingAccessPercentage = Math.round(
          (remainingJobsSum / maxJobsSum) * 100
        );
      }
    }
  }

  showSmsPackage() {
    this.hasSmsPackage = this.serviceData?.smsPackage ?? false;

    this.smsPurchased = this.serviceData?.smsPurchased ?? 0;
    this.smsSend = this.serviceData?.smsSend ?? 0;
    this.smsRemaining = this.serviceData?.smsRemaining ?? 0;

    if (this.smsPurchased > 0) {
      this.smsPackagePercentage = Math.round(
        (this.smsRemaining / this.smsPurchased) * 100
      );
      if (this.smsPackagePercentage < 0) {
        this.smsPackagePercentage = 0;
      }
    }
  }

  cvDataShow() {
    this.hasCVBankAccess = this.serviceData?.cvSearchAccess ?? false;

    if (this.hasCVBankAccess) {
      this.remainingCV = this.serviceData?.cvSearchService?.available ?? 0;

      this.maxCV = this.serviceData?.cvSearchService.limit ?? 0;

      this.viewedCV = parseInt(
        window.localStorage.getItem(
          this.loginService.LOCAL_STORAGE_KEYS.CV_BANK_VIEWED
        ) ?? '0'
      );

      this.viewedCV = this.serviceData?.cvSearchService.viewed ?? 0;

      if (this.maxCV > 0) {
        this.cvBankPercentage = Math.round(
          (this.remainingCV / this.maxCV) * 100
        );
      }
    }
  }

  onClickSignOut() {
    let comId: string = window.localStorage.getItem('CompanyId') ?? '';
    let uId: string = window.localStorage.getItem('UserId') ?? '';

    this.loginService.deleteServiceDataFromRadis(comId, uId).subscribe();

    this.loginService.clearAppData().subscribe({
      next: () => {
        // window.location.replace('https://gateway.bdjobs.com');
        //window.location.replace('https://recruiter.bdjobs.com');
        this.router.navigate(['/']);
      },
      error: () => {
        // window.location.replace('https://gateway.bdjobs.com');
        //window.location.replace('https://recruiter.bdjobs.com');
        this.router.navigate(['/']);
      },
    });
  }

  onSmsDropdownOpenChange(event: boolean) {
    this.isSmsCircularProgressVisible = !event;
  }
  onJobPostDropdownOpenChange(event: boolean) {
    this.isJobPostingCircularProgressVisible = !event;
  }

  onCvBankDropdownOpenChange(event: boolean) {
    this.isCvBankCircularProgressVisible = !event;
    // this.isCvBankCircularProgressVisible = !event;
  }

  submitCreditReferral(token: string): Observable<any> {
    // Remove this.closeModal(); as it likely belongs to a different component
    // var companyId = window.localStorage.getItem('CompanyId') ?? '';
    // console.log('companyId=>', companyId);

    // var companyName = window.localStorage.getItem('CompanyName') ?? '';

    return this.creditSystemService
      .callCreditSystemCheckReferral(this.companyId, this.companyName, token)
      .pipe(
        tap((response) => {
          let comId: string = window.localStorage.getItem('CompanyId') ?? '';
          let uId: string = window.localStorage.getItem('UserId') ?? '';
          this.loginService.deleteServiceDataFromRadis(comId, uId).subscribe();
          setTimeout(() => {
            this.setServiceData();
          }, 2000);

          const message = response.Message.toLowerCase();
          if (message === 'approved') {
            this.closeModal();
            this.openFunctionalModal(CreditSuccessComponent);
            this.openFunctionalModal(CreditSuccessComponent);
            this.setCreditSystem();
          } else if (message === 'pending') {
            this.closeModal();
            this.openFunctionalModal(CreditPendingComponent);
          } else if (message === 'rejected') {
            this.closeModal();
            this.openFunctionalModal(CreditRejectedComponent);
          } else if (message === 'invalidToken') {
            throw new Error(
              'Invalid referral code. Please enter a valid referral code.'
            );
          }
        }),
        catchError((error) => {
          throw new Error(error);
        })
      );
  }

  //modal
  openModal(content: any) {
    // console.log('opened!');
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  closeModal() {
    this.modalRef?.close();
  }
  navigateToDashboard() {
    this.router.navigate(['dashboard']);
  }
  navigateToCreditSystem() {
    this.router.navigate(['credit-system']);
  }
  open() {
    const modalRef = this.modalService.open(NidVerificationModalComponent, {
      centered: true,
    });
    modalRef.result.then(
      (result) => {
        console.log(result);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
  // openFunctionalModal(component: any) {
  //   const modalRef = this.modalService.open(component, {
  //     centered: true,
  //     size: 'lg',
  //   });
  //   modalRef.result.then(
  //     (result) => {
  //       console.log(result);
  //     },
  //     (reason) => {
  //       console.log(reason);
  //     }
  //   );
  // }
  openPendingModal() {
    this.openFunctionalModal(CreditPendingComponent);
  }
  openFunctionalModal(component: any) {
    const modalRef = this.modalService.open(component, {
      centered: true,
      size: 'lg',
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
    });
    modalRef.result.then(
      (result) => {
        console.log(result);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  // openProgressModal() {
  //   const modalRef = this.modalService.open(ProgressLoadingComponent, {
  //     centered: true,
  //   });
  //   modalRef.result.then(
  //     (result) => {
  //       console.log(result);
  //     },
  //     (reason) => {
  //       console.log(reason);
  //     }
  //   );
  // }
  setServiceData(): void {
    let comId: string = window.localStorage.getItem('CompanyId') ?? '';
    let uId: string = window.localStorage.getItem('UserId') ?? '';

    this.loginService.getServiceData(comId, uId).subscribe((response: any) => {
      this.loginService.setServiceData(response.data);
    });
  }

  sidebarShow(): void{
    this.isSidebar = true;
  }
  sidebarClose(): void{
    this.isSidebar = false;
  }

  truncateText(compName: string): string {
    const maxLength = 20;
    const ellipsis = '...';

    if (compName.length > maxLength) {
      return compName.substring(0, maxLength - ellipsis.length) + ellipsis;
    }
    return compName;
  }
}
