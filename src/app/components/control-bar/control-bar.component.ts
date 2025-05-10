import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, HostListener, ElementRef, ViewChild, TemplateRef, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
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
    EmptyCreditComponent,
    CreditPendingComponent,
    CreditRejectedComponent,
    CircularProgressComponent
  ],
})
export class ControlBarComponent implements OnInit {
  @ViewChild('modalRef') modalRef!: TemplateRef<any>;
  @ViewChild('pendingModal') pendingModal!: TemplateRef<any>;
  @ViewChild('rejectedModal') rejectedModal!: TemplateRef<any>;

  // Signals for state management
  outsideBangladesh = signal<boolean | undefined>(undefined);
  activeDropdown = signal<string | null>(null);
  isFirstOpen = signal(true);
  isSecondOpen = signal(false);
  isThirdOpen = signal(false);
  isFourthOpen = signal(false);
  showModal = signal(false);
  showPendingModal = signal(false);
  showRejectedModal = signal(false);
  currentModal = signal<TemplateRef<any> | null>(null);

  // Circular progress visibility flags
  isSmsCircularProgressVisible = true;
  isJobPostingCircularProgressVisible = true;
  isCvBankCircularProgressVisible = true;

  // Computed values
  isSidebar = signal(false);
  isAdminUser = signal(false);
  companyName = signal('');
  companyId = signal('');
  companyLogoURL = signal('');

  // Progress percentages
  cvBankPercentage = signal(0);
  smsPackagePercentage = signal(0);
  jobPostingAccessPercentage = signal(0);

  // Service access flags
  hasJobPostingAccess = signal(false);
  hasCVBankAccess = signal(false);
  hasSmsPackage = signal(false);

  // Service data
  remainingCV = signal(0);
  viewedCV = signal(0);
  maxCV = signal(0);
  smsPurchased = signal(0);
  smsSend = signal(0);
  smsRemaining = signal(0);
  remainingBasicJobs = signal(0);
  maxBasicJobs = signal(0);
  remainingStandoutJobs = signal(0);
  maxStandoutJobs = signal(0);
  remainingStandoutPremiumJobs = signal(0);
  maxStandoutPremiumJobs = signal(0);

  // Verification status
  verificationStatus = signal<boolean | undefined>(undefined);
  nidVerify = signal<boolean | undefined>(undefined);
  paymentProcess = signal<boolean | undefined>(undefined);
  isNotCreditExpired = signal(false);

  // Input properties
  @Input() activeTab?: string;

  serviceData = signal<ServiceInfo | undefined>(undefined);
  supportingInfo = signal<SupportingInfo | undefined>(undefined);
  creditSystem = signal<CreditSystemResponse | undefined>(undefined);

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.activeDropdown.set(null);
    }
  }

  constructor(
    private cookieService: CookieService,
    private creditSystemService: CreditSystemService,
    public gatewayDataSharingService: GatewayDataSharingService,
    private loginService: LoginService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.loginService.serviceInfoData$.subscribe((data) => {
      this.serviceData.set(data);
      this.cvDataShow();
      this.setCreditSystem();
      this.jobPostingAssessShow();
      this.showSmsPackage();
    });

    this.companyId.set(window.localStorage.getItem('companyId') ?? '');
    this.loginService.getSupportingInfo().subscribe((userData) => {
      if (userData) {
        const defaultLogo = 'https://recruiter.bdjobs.com/assets/images/default-company.png';
        this.companyLogoURL.set(
          userData.CompanyActiveLogoURL === '' ? defaultLogo : userData.CompanyActiveLogoURL
        );
      }
    });

    this.isAdminUser.set(
      (window.localStorage.getItem(this.loginService.LOCAL_STORAGE_KEYS.IS_ADMIN_USER) === 'true') || false
    );
    this.companyName.set(
      window.localStorage.getItem(this.loginService.LOCAL_STORAGE_KEYS.COMPANY_NAME) ?? 'Company Name'
    );

    this.loginService.getSupportingInfo().subscribe((supportingInfo) => {
      if (supportingInfo) {
        this.verificationStatus.set(supportingInfo.VerificationStatus);
        this.nidVerify.set(supportingInfo.NidVerify);
        this.paymentProcess.set(supportingInfo.PaymentProcess);

        this.outsideBangladesh.set(
          supportingInfo.CompanyCountry.toLowerCase() !== 'bangladesh'
        );
      }
    });
  }

  toggleDropdown(dropdownName: string) {
    this.activeDropdown.set(
      this.activeDropdown() === dropdownName ? null : dropdownName
    );
  }

  openRejectedModal() {
    this.currentModal.set(this.rejectedModal);
    this.showRejectedModal.set(true);
  }

  setCreditSystem() {
    this.creditSystem.set(this.serviceData()?.creditSystem);
    const validityDate = this.creditSystem()?.validityDate ?? '';
    this.isNotCreditExpired.set(
      this.gatewayDataSharingService.getParseDate(validityDate) >=
      this.gatewayDataSharingService.getCurrentDateTime()
    );
  }

  jobPostingAssessShow() {
    this.hasJobPostingAccess.set(this.serviceData()?.jobPostingAccess ?? false);

    if (this.hasJobPostingAccess()) {
      this.remainingBasicJobs.set(
        this.serviceData()?.jobPostingService?.basicListLimit ?? 0
      );
      this.maxBasicJobs.set(
        this.serviceData()?.jobPostingService?.maxJob ?? 0
      );
      this.remainingStandoutJobs.set(
        this.serviceData()?.jobPostingService?.standoutLimit ?? 0
      );
      this.maxStandoutJobs.set(
        this.serviceData()?.jobPostingService?.maxStandout ?? 0
      );
      this.remainingStandoutPremiumJobs.set(
        this.serviceData()?.jobPostingService?.standoutPremiumLimit ?? 0
      );
      this.maxStandoutPremiumJobs.set(
        this.serviceData()?.jobPostingService?.maxStandoutPremium ?? 0
      );

      const remainingJobsSum =
        this.remainingBasicJobs() +
        this.remainingStandoutJobs() +
        this.remainingStandoutPremiumJobs();
      const maxJobsSum =
        this.maxBasicJobs() + this.maxStandoutJobs() + this.maxStandoutPremiumJobs();

      if (maxJobsSum > 0) {
        this.jobPostingAccessPercentage.set(
          Math.round((remainingJobsSum / maxJobsSum) * 100)
        );
      }
    }
  }

  showSmsPackage() {
    this.hasSmsPackage.set(this.serviceData()?.smsPackage ?? false);
    this.smsPurchased.set(this.serviceData()?.smsPurchased ?? 0);
    this.smsSend.set(this.serviceData()?.smsSend ?? 0);
    this.smsRemaining.set(this.serviceData()?.smsRemaining ?? 0);

    if (this.smsPurchased() > 0) {
      this.smsPackagePercentage.set(
        Math.round((this.smsRemaining() / this.smsPurchased()) * 100)
      );
      if (this.smsPackagePercentage() < 0) {
        this.smsPackagePercentage.set(0);
      }
    }
  }

  cvDataShow() {
    this.hasCVBankAccess.set(this.serviceData()?.cvSearchAccess ?? false);

    if (this.hasCVBankAccess()) {
      this.remainingCV.set(this.serviceData()?.cvSearchService?.available ?? 0);
      this.maxCV.set(this.serviceData()?.cvSearchService.limit ?? 0);
      this.viewedCV.set(
        parseInt(
          window.localStorage.getItem(
            this.loginService.LOCAL_STORAGE_KEYS.CV_BANK_VIEWED
          ) ?? '0'
        )
      );
      this.viewedCV.set(this.serviceData()?.cvSearchService.viewed ?? 0);

      if (this.maxCV() > 0) {
        this.cvBankPercentage.set(
          Math.round((this.remainingCV() / this.maxCV()) * 100)
        );
      }
    }
  }

  onClickSignOut() {
    const comId: string = window.localStorage.getItem('CompanyId') ?? '';
    const uId: string = window.localStorage.getItem('UserId') ?? '';

    this.loginService.deleteServiceDataFromRadis(comId, uId).subscribe();

    this.loginService.clearAppData().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
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
  }

  submitCreditReferral(token: string): Observable<any> {
    return this.creditSystemService
      .callCreditSystemCheckReferral(this.companyId(), this.companyName(), token)
      .pipe(
        tap((response) => {
          const comId: string = window.localStorage.getItem('CompanyId') ?? '';
          const uId: string = window.localStorage.getItem('UserId') ?? '';
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

  open() {
    this.currentModal.set(this.modalRef);
    this.showModal.set(true);
  }

  openModal(content: TemplateRef<any>) {
    this.currentModal.set(content);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.showPendingModal.set(false);
    this.showRejectedModal.set(false);
    this.currentModal.set(null);
  }

  openPendingModal() {
    this.currentModal.set(this.pendingModal);
    this.showPendingModal.set(true);
  }

  openFunctionalModal(component: any) {
    this.currentModal.set(this.modalRef);
    this.showModal.set(true);
  }

  navigateToDashboard() {
    this.router.navigate(['dashboard']);
  }

  navigateToCreditSystem() {
    this.router.navigate(['credit-system']);
  }

  setServiceData(): void {
    const comId: string = window.localStorage.getItem('CompanyId') ?? '';
    const uId: string = window.localStorage.getItem('UserId') ?? '';

    this.loginService.getServiceData(comId, uId).subscribe((response: any) => {
      this.loginService.setServiceData(response.data);
    });
  }

  sidebarShow(): void {
    this.isSidebar.set(true);
  }

  sidebarClose(): void {
    this.isSidebar.set(false);
  }

  onFirstAccordionChange(isOpen: boolean) {
    this.isFirstOpen.set(isOpen);
  }

  onSecondAccordionChange(isOpen: boolean) {
    this.isSecondOpen.set(isOpen);
  }

  onThirdAccordionChange(isOpen: boolean) {
    this.isThirdOpen.set(isOpen);
  }

  onFourthAccordionChange(isOpen: boolean) {
    this.isFourthOpen.set(isOpen);
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
