











import { CommonModule } from '@angular/common';
import { Component, isDevMode, OnInit } from '@angular/core';
import { ControlBarComponent } from '../../components/control-bar/control-bar.component';
import { JobPostContainerComponent } from '../../components/job-post-container/job-post-container.component';
// import { LoginService } from "../../services/login.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BannerModalComponent } from '../../components/banner-modal/banner-modal/banner-modal.component';
import { CompanySelectPopupComponent } from '../../components/company-select-popup/company-select-popup.component';
import { NidVerificationModalComponent } from '../../components/nid-verification-modal/nid-verification-modal.component';
import { ServiceInfo } from '../../models/shared/ServiceInfo';
import { LoginService } from '../../services/login.service';
import { MultipleJobPostPopupComponent } from "../../components/multiple-job-post-popup/multiple-job-post-popup.component";
@Component({
  selector: 'app-job-dashboard',
  standalone: true,
  templateUrl: './job-dashboard.component.html',
  styleUrl: './job-dashboard.component.scss',
  imports: [
    CommonModule,
    ControlBarComponent,
    JobPostContainerComponent,
    CompanySelectPopupComponent,
    MultipleJobPostPopupComponent
  ],

})
export class JobDashboardComponent implements OnInit {
  // public companyCreatedAtString = "";
  // public companyCreatedAt : Date | undefined;
  // public companyId = "";

  // constructor(private loginService: LoginService){
  // }
  verificationStatus: boolean = false;
  nidVerify: boolean = false;
  isNidButtonVisible: boolean = false;
  paymentProcess: boolean | undefined;
  activeTab: string = 'dashboard';
  outsideBangladesh?: boolean;
  companySizePopUp: string = '';
  queryString: string = '';
  recruiterRedirectURL = 'https://recruiter.bdjobs.com/jobposting/';

  urlParams = new URLSearchParams(window.location.search);

  selectedJobType: any = this.urlParams.get('selectedJobType')
    ? this.urlParams.get('selectedJobType')
    : '';

  serviceData?: ServiceInfo;

  victoryDateStart = new Date('2024-08-21T00:00:00');
  victoryDateEnd = new Date('2024-08-30T23:59:59');
  nowTime: Date = new Date()

  isCm: boolean = false;

  constructor(
    private loginService: LoginService,
    // private gatewayDataSharingService: GatewayDataSharingService,
    private modalService: NgbModal,
    private router: Router,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {



    this.companySizePopUp =
      window.localStorage.getItem('companySizePopUp') ?? '';


    this.loginService.getSupportingInfo().subscribe({
      next: (supportingInfo) => {
        if (supportingInfo) {
          this.verificationStatus = supportingInfo.VerificationStatus ?? false;
          this.nidVerify = supportingInfo.NidVerify;
          if (this.verificationStatus === false && this.nidVerify === false) {
            this.isNidButtonVisible = true;
          }
          this.paymentProcess = supportingInfo.PaymentProcess;
          if (
            supportingInfo.CompanyCountry.toLocaleLowerCase() !== 'bangladesh'
          ) {
            this.outsideBangladesh = true;
          } else {
            this.outsideBangladesh = false;
          }
          this.isCm = supportingInfo.JobPostingAccess;
        }
        this.setServiceData();
        let isBannerShow = window.localStorage.getItem('bannerShow') ?? '0';
        if (this.nowTime > this.victoryDateStart && this.nowTime < this.victoryDateEnd && !this.outsideBangladesh && !this.isCm && isBannerShow === '0') {
          this.bannerModalOpen();
        }
      },
    });

    if (this.selectedJobType.toString() !== "") {
      this.redirectToServiceTypeUrl(this.selectedJobType.toString());
    }


    // this.companyCreatedAtString =
    //   window.localStorage.getItem(
    //     this.loginService.LOCAL_STORAGE_KEYS.Company_Created_At
    //   ) ?? "";
    // this.companyId =
    //   window.localStorage.getItem(
    //     this.loginService.LOCAL_STORAGE_KEYS.COMPANY_ID
    //   ) ?? "";
    // this.companyCreatedAt = new Date(this.companyCreatedAtString);

    this.loginService.serviceInfoData$.subscribe((data) => {
      this.serviceData = data;
    });

    this.isPasswordChanged();
  }

  setServiceData(): void {
    let comId: string = window.localStorage.getItem('CompanyId') ?? '';
    let uId: string = window.localStorage.getItem('UserId') ?? '';

    this.loginService.getServiceData(comId, uId)
      .subscribe((response: any) => {
        this.loginService.setServiceData(response.data);
      });
  }

  redirectToServiceTypeUrl(servicetype: string) {
    console.log('this is the service type -- ' + servicetype)

    switch (servicetype) {
      case 'from=servicePage':
        window.location.replace(
          'https://corporate3.bdjobs.com/services.asp?from=recruiter'
        );
        break;
      case servicetype = 'bc':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=bc&psta=new`
        );
        break;
      case servicetype = 'so':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=so&psta=new`
        );
        break;
      case servicetype = 'sp':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=sp&psta=new`
        );
        break;
      case servicetype = 'hj':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=hj&psta=new`
        );
        break;
      case servicetype = 'hjp':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=hjp&psta=new`
        );
        break;
      case servicetype = 'pnpl':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=pnpl&psta=new`
        );
        break;
      case servicetype = 'ln':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=ln&psta=new`
        );
        break;
      case servicetype = 'fjp':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=fjp&psta=new`
        );
        break;
      case servicetype = 'ud':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=ud&psta=new`
        );
        break;
      case servicetype = 'intern':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=intern&psta=new`
        );
        break;
      case servicetype = 'freeBlueCol':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=freeBlueCol&psta=new`
        );
        break;
      default:
        this.router.navigate(['dashboard']);
        break;
    }
  }
  onChange(): void {
    console.log('companySizePopUp=>', this.companySizePopUp);

    this.companySizePopUp =
      window.localStorage.getItem('companySizePopUp') ?? '';
  }
  onChanges(): void {
    console.log('companySizePopUp=>', this.companySizePopUp);

    this.companySizePopUp =
      window.localStorage.getItem('companySizePopUp') ?? '';
  }
  /**
   *
   */


  getJobPostingUrl(): string {
    // const redirectDate = new Date("2024-01-11T17:00:00");

    // const shouldRedirect =
    //   this.companyCreatedAt &&
    //   (this.companyCreatedAt > redirectDate ||
    //     ["15131", "33762", "41914"].includes(this.companyId.toString()));

    // return shouldRedirect
    //   ? "https://recruiter.bdjobs.com/jobposting/"
    //   : "https://corporate3.bdjobs.com/Job_Posting_Board_Services.asp";

    return 'https://corporate3.bdjobs.com/Job_Posting_Board_Services.asp?from=recruiter';
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

  isPasswordChanged(): void {

    if (isDevMode()) {
      return;
    }


    const userAcc = window.localStorage.getItem('UserId');
    const UserPassword = '';
    const comid = window.localStorage.getItem('CompanyId');
    const loggedintime = this.cookieService.get('LoggedInDateTime');


    this.loginService
      .checkIsPasswordChanged({
        userAcc: userAcc,
        UserPassword: UserPassword,
        comid: comid,
        loggedintime: loggedintime,
      })
      .subscribe((response) => {
        //console.log('This is the response', response.Valid);
        let valid: boolean = response.Valid;
        if (!valid) {
          this.onClickSignOut();
        } else {
          //this.loginService.increaseAuthTokenExpiration();
        }
      });
  }

  onClickSignOut() {
    let comId: string = window.localStorage.getItem('CompanyId') ?? '';
    let uId: string = window.localStorage.getItem('UserId') ?? '';

    this.loginService.deleteServiceDataFromRadis(comId, uId).subscribe();

    this.loginService.clearAppData().subscribe({
      next: () => {
        // window.location.replace('https://gateway.bdjobs.com');
        this.router.navigate(['/']);
      },
      error: () => {
        // window.location.replace('https://gateway.bdjobs.com');
        this.router.navigate(['/']);
      },
    });
  }

  bannerModalOpen() {
    this.openFunctionalModal(BannerModalComponent);
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


}
