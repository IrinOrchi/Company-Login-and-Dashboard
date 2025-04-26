import { Component, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CvDetails,
  ExperiencesInformation,
} from '../../models/Cv-Details/response/cv-details';
import { SharedDataService } from '../../services/cv-details/shared-data.service';
import { DataServiceService } from '../../services/cv-details/data-service.service';
import { TopNavBarComponent } from './shared/top-nav-bar/top-nav-bar.component';
import { ActivatedRoute, Params, RouterOutlet } from '@angular/router';
import { CheckValidityRequest } from '../../models/Cv-Details/request/CheckValidityRequest';
import { JobInformationUpdateRequest } from '../../models/Cv-Details/request/JobInformationUpdateRequest';
import { CheckValidityResponse } from '../../models/Cv-Details/response/CheckValidityResponse';
import { GlobalDataSharingService } from '../../services/shared/global-data-sharing.service';
import { CvDetailsAccessCheck, CvViewUrlParams } from '../../models/Cv-Details/CvViewUrlParams';
import { ExperienceInformationWithTotal } from '../../models/Cv-Details/ExperienceInformationWithTotal';
import { LoginService } from '../../services/login.service';
import { SupportingInfo } from '../../models/shared/SupportingInfo';
import { error } from 'highcharts';
import { GatewayDataSharingService } from '../../services/gateway-data-sharing.service';
import { CvActionsComponent } from "./shared/cv-actions/cv-actions.component";
import { SkeletonLoaderComponent } from "../../components/skeleton-loader/skeleton-loader.component";
import { ServiceInfo } from '../../models/shared/ServiceInfo';

@Component({
  selector: 'app-cv-details',
  standalone: true,
  imports: [CommonModule, TopNavBarComponent, RouterOutlet, CvActionsComponent, SkeletonLoaderComponent],
  templateUrl: './cv-details.component.html',
  styleUrl: './cv-details.component.scss',
})
export class CvDetailsComponent {

  serviceData?: ServiceInfo;
  showLoader: boolean = true; 

  cvDetails?: CvDetails;
  jobTitle: string = '';
  jobId: string = '';
  Idn: string = '';
  expsal: string = '';
  api: string = '';
  rw: string = '';
  pgtype: string = '';
  viewType: string = '';
  viewTypeStatus: string = '';
  shortcv_view?: string = '';
  revamp: string = '';
  applicantId: string = '';
  applyId: string = '';
  purchasedCv: string = '';
  blueCollar: string = '';
  lcToolShow: boolean = true;
  calculatedTotalExperience?: string = '';
  urlParams?: CvViewUrlParams;
  token: string = '';
  pushNotificationBody: any;
  companyName: string = '';
  companyId: string = '';
  showLeftPanel: boolean = false;
  constructor(
    public dataServiceService: DataServiceService,
    public sharedDataService: SharedDataService,
    private route: ActivatedRoute,
    private globalDataSharingService: GlobalDataSharingService,
    private loginService: LoginService
  ) {}
  supportingInfo: any;

  ngOnInit(): void {
    this.companyId = localStorage.getItem('CompanyId') ?? 'IRUwZRU=';
    this.companyName = localStorage.getItem('CompanyName') ?? '';
    this.route.queryParams.subscribe((params: Params) => {
      this.jobId = params['jid'] ?? '';
      this.applyId = params['api'];
      this.applicantId = params['applicantId'];
      this.jobTitle = params['jobtitle'];
      this.Idn = params['Idn'];
      this.expsal = params['expsal'];
      this.api = params['api'];
      this.rw = params['rw'];
      this.pgtype = params['pgtype'];
      this.viewType = params['viewType'];
      this.viewTypeStatus = params['viewTypeStatus'];
      this.shortcv_view = params['shortcv_view'];
      this.revamp = params['revamp'];
      this.purchasedCv = params['purchasedCV'];
      this.blueCollar = params['blueCollarCV'];
      this.lcToolShow = true;
      this.sharedDataService.setJobTitleToSharedService(this.jobTitle ?? '');
      this.setCvViewUrlParams();

      this.globalDataSharingService.setShouldShowFooter(false);
      this.globalDataSharingService.setShouldShowHeader(false);

      this.setServiceData();

      this.loginService.serviceInfoData$.subscribe((data) => {
        this.serviceData = data;

        if(data){
          if (this.jobId && this.applyId) {
            this.checkValidity(this.jobId, this.applyId);
          } else if (this.applicantId) {
            this.getCVInformation(this.applicantId);
          }else{
            this.checkCvAccess(data.cvSearchService?.id ?? 0, data.cvSearchAccess ?? false);
          }
        }
      });
    });

    this.sharedDataService.urlParams$.subscribe({
      next: (data) => {
        // console.log('urlParamData'+data?.jobId)
      },
    });

    if(this.jobId != ''){
      this.getPnplCheckValue();
    }
    else if(isDevMode()){
      this.getApplicantId();   ;
    }

    
  }

  setServiceData(): void {
    let comId: string = window.localStorage.getItem('CompanyId') ?? '';
    let uId: string = window.localStorage.getItem('UserId') ?? '';

    this.loginService.getServiceData(comId, uId)
      .subscribe((response: any) => {
        this.loginService.setServiceData(response.data);
      });
  }

  downloadCustomizedCv(type: string) {
    this.companyName =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.COMPANY_NAME
      ) ?? '';
    if (this.companyName) {
      // console.log(type, this.companyName, 'downloadCv');
      this.sharedDataService
        .downloadAttachedCV(this.token, this.companyName, type)
        .subscribe((response) => {
          //console.log(response, 'response');
        });
    }
  }

  seeVideoCv() {
    var apiLink = `https://corporate3.bdjobs.com/VideoResume_Watch-RV_mongo_api.asp?Idn=${this.Idn}&jid=${this.jobId}&jobtitle=${this.jobTitle}&expsal=${this.expsal}&api=${this.api}&rw=${this.rw}&pgtype=${this.pgtype}&viewType=${this.viewType}&viewTypeStatus=${this.viewTypeStatus}&purchasedCV=${this.purchasedCv}&blueCollarCV=${this.blueCollar}&LcToolShow=${this.lcToolShow}&appID=${this.applyId}&revamp=${this.revamp}`;
    window.open(apiLink, '_blank');
  }

  setCvViewUrlParams(): void {
    this.urlParams = {
      jobId: this.jobId,
      applyId: this.api,
      applicantId: this.applicantId,
      jobTitle: this.jobTitle,
      Idn: this.Idn,
      expsal: this.expsal,
      api: this.api,
      rw: this.rw,
      pgtype: this.pgtype,
      viewType: this.viewType,
      viewTypeStatus: this.viewTypeStatus,
      shortcv_view: this.shortcv_view,
      revamp: this.revamp,
      purchedCV: this.purchasedCv,
      blueCollar: this.blueCollar,
      LcToolShow: this.lcToolShow,
    };

    this.sharedDataService.setUrlParamsToSharedService(this.urlParams);
  }

  ngOnDestroy(): void {
    this.globalDataSharingService.setShouldShowFooter(true);
    this.globalDataSharingService.setShouldShowHeader(true);
  }

  checkValidity(jobId: string, applyId: string): void {
    const requestData: CheckValidityRequest = {
      Data: {
        JobId: jobId,
        ApplyId: applyId,
        JobType: '',
      },
    };

    this.dataServiceService.checkValidity(requestData).subscribe({
      next: (value: CheckValidityResponse) => {
        this.showLoader = false;
        //console.log(value, 'checkValidity');
        this.sharedDataService.setApplicantJobStatus(value.data);

        if (value.message.toLocaleLowerCase() === 'Valid'.toLocaleLowerCase()) {
          this.getCVInformation(value.data.ApplicantId.toString());
        } else {
          //alert(value.message + ' For this Job/Application');
        }
      },
      error: (error) => console.log(error, 'Error While Checking Validity.'),
    });
    //this.showLoader = false;
  }

  getApplicantId(): void {
    const requestData: CheckValidityRequest = {
      Data: {
        idn: this.Idn,
        companyId: this.companyId,
      },
    };

    this.dataServiceService.checkValidity(requestData).subscribe({
      next: (value: CheckValidityResponse) => {
        //console.log(value, 'checkValidity');
        this.sharedDataService.setApplicantJobStatus(value.data);

        if (value.message.toLocaleLowerCase() === 'Valid'.toLocaleLowerCase()) {
          this.getCVInformation(value.data.ApplicantId.toString());
        } else {
          console.log(value.message + ' For this Job/Application');
        }
      },
      error: (error) => console.log(error, 'Error While Checking Validity.'),
    });
  }

  getCVInformation(applicantId: string): void {
    //debugger;

    this.loginService.getSupportingInfo().subscribe({
      next: (userData) => {
        this.showLoader = false;
        //console.log(userData, 'userData');
        this.showLoader = false;
        if (userData && userData.Name) {
          //console.log(userData, 'userData inner');
          var serviceId = 0;
          if (userData.CvSearchService && userData.CvSearchService.Id) {
            serviceId = userData.CvSearchService.Id;
          }
          // console.log(
          //   userData.data.Sessions.company_id,
          //   ' ',
          //   this.applicantId,
          //   ' ',
          //   this.jobId,
          //   ' ',
          //   userData.data.Sessions.NAME,
          //   ' ',
          //   serviceId,
          //   'user ninner'
          // );
          // console.log(userData, 'settingUserData');
          this.sharedDataService.setUserDataSharedService(userData);

          this.pushNotificationBody = {
            companyId: this.companyId,
            responseId: this.applicantId ?? 0,
            jobId: this.jobId ?? 0,
            companyName: this.companyName,
            serviceId: serviceId,
            viewedFrom: 'cv',
          };
          this.sharedDataService
            .pushNotification(this.pushNotificationBody)
            .subscribe(
              (response) => {
                this.token = response.token;
                // console.log(this.token, 'token');
              },
              (error) => {
                // Handle errors from pushNotification service
                console.error('Error sending notification:', error);
              }
            );
        } else {
          console.error('Missing data in userData:', userData);
        }
      },
    });
    this.dataServiceService.getCVinformation(applicantId).subscribe({
      next: (value) => {
        // console.log(value[0], 'CV Details Value');
        if (value[0]) {
          this.cvDetails = value[0];
          this.sharedDataService.setCvDetailsToSharedService(this.cvDetails);
          let experiencesInformation = this.sortExperiencesByStartDate(
            this.cvDetails.ExperiencesInformations
          );
          this.sharedDataService.setExperienceInformationToSharedService(
            experiencesInformation
          );
          this.sortAcademicQualifications();

          // Calculate total experience for each experience and sum up
          const experiencesInformationWithTotal = this.addTotalExperience(
            experiencesInformation
          );
          // Sum up all IndividualTotalExperience values
          const totalExperienceYears = experiencesInformationWithTotal?.reduce(
            (acc, exp) =>
              acc + parseFloat(exp.IndividualTotalExperience || '0'),
            0
          );
          // Assign the sum to calculatedTotalExperience
          this.calculatedTotalExperience = totalExperienceYears
            .toFixed(1)
            .toString();

          this.calculatedTotalExperience = (this.getTotalExperience(experiencesInformation)/12).toFixed(1).toString();

          this.sharedDataService.setTotalExperienceToSharedService(
            this.calculatedTotalExperience
          );
          this.sharedDataService.setExperienceInformationWTotalToSharedService(
            experiencesInformationWithTotal
          );

          this.updateJobInformation();
        } else {
          alert('Data not Found.');
          //window.location.href = `https://corporate3.bdjobs.com/view_resume-RV_mongo_api.asp?Idn=${this.Idn}&jid=${this.jobId}&jobtitle=${this.jobTitle}&expsal=${this.expsal}&api=${this.api}&rw=${this.rw}&pgtype=${this.pgtype}&viewType=${this.viewType}&viewTypeStatus=${this.viewTypeStatus}&shortcv_view=${this.shortcv_view}&revamp=${this.revamp}`;
        }
      },
      error: (error) => console.log(error),
    });
  }

  sortAcademicQualifications() {
    if (this.cvDetails && this.cvDetails.AcademicQualifications) {
      // Sort AcademicQualifications by DegreeLevel._id in descending order
      this.cvDetails.AcademicQualifications.sort((a, b) => {
        const degreeLevelAId = a.DegreeLevel ? a.DegreeLevel._id : null;
        const degreeLevelBId = b.DegreeLevel ? b.DegreeLevel._id : null;
        // Handle the case where DegreeLevel is null
        if (degreeLevelAId === null && degreeLevelBId === null) {
          return 0;
        } else if (degreeLevelAId === null) {
          return 1; // Move a to a lower index (higher priority)
        } else if (degreeLevelBId === null) {
          return -1; // Move b to a lower index (higher priority)
        } else {
          // Sort in descending order
          return degreeLevelBId - degreeLevelAId;
        }
      });
    }
  }

  sortExperiencesByStartDate(
    experiences: ExperiencesInformation[]
  ): ExperiencesInformation[] {
    return experiences?.sort((a, b) => {
      // Check if one experience is continuous and the other is not
      if (a.EmploymentPeriod.IsContinue !== b.EmploymentPeriod.IsContinue) {
        // Place the continuous experience first
        return a.EmploymentPeriod.IsContinue ? -1 : 1;
      } else {
        // Both experiences are either continuous or not, sort by start date
        const dateA = new Date(a.EmploymentPeriod.StartDate);
        const dateB = new Date(b.EmploymentPeriod.StartDate);
        // Sort in descending order
        return dateB.getTime() - dateA.getTime();
      }
    });
  }

  updateJobInformation(): void {
    const applyIdNumber: number = Number(this.applyId);
    const jobIdNumber: number = Number(this.jobId);

    if (applyIdNumber && jobIdNumber) {
      const requestData: JobInformationUpdateRequest = {
        data: {
          applyId: applyIdNumber,
          jobId: jobIdNumber,
          viewed: 1,
        },
      };

      this.dataServiceService.updateJobInformation(requestData).subscribe({
        next: (value) => {
          // console.log(value, 'Update Job Information Successful Response.');
        },
        error: (error) =>
          console.log(error, 'Error While Updating Job Information.'),
      });
    }
  }

  calculateExperience(
    experiencesInformation: ExperiencesInformation[]
  ): string {
    let totalExperienceMonths = 0;
    for (const experience of experiencesInformation) {
      const startDate = new Date(experience.EmploymentPeriod.StartDate);
      let endDate = new Date(experience.EmploymentPeriod.EndDate);
      if (experience.EmploymentPeriod.IsContinue) {
        endDate = new Date(); // Consider today's date as end date
      }
      if (startDate <= endDate) {
        let differenceMs = endDate.getTime() - startDate.getTime();
        let years = differenceMs / (1000 * 60 * 60 * 24 * 365.25);
        let roundedYears = Number(years.toFixed(1));

        // const startYear = startDate.getFullYear();
        // const startMonth = startDate.getMonth();
        // const endYear = endDate.getFullYear();
        // const endMonth = endDate.getMonth();
        // let months = (endYear - startYear) * 12 + (endMonth - startMonth);

        // if (endDate.getDate() < startDate.getDate()) {
        //   roundedYears--;
        // }
        totalExperienceMonths += roundedYears;
      }
    }
    const years = totalExperienceMonths;
    //const roundedYears = Math.ceil(years * 10) / 10;
    return years.toFixed(1).toString();
  }

  getTotalExperience(experiencesInformations?: ExperiencesInformation[]): number{
    if (!experiencesInformations || experiencesInformations.length === 0) {
      return 0;
    }
  
    let totalExperienceMonths = 0;
    const currentDate = new Date();
    let nextStartDate = new Date(0); // Equivalent to DateTime.MinValue in C#
  
    experiencesInformations
      .filter(e => e.EmploymentPeriod.StartDate)
      .sort((a, b) => new Date(a.EmploymentPeriod.StartDate!).getTime() - new Date(b.EmploymentPeriod.StartDate!).getTime())
      .forEach(experience => {
        const startDate = new Date(new Date(experience.EmploymentPeriod.StartDate!).getTime() + 6 * 60 * 60 * 1000); // Add 6 hours
        const endDate = experience.EmploymentPeriod.IsContinue
          ? currentDate
          : experience.EmploymentPeriod.EndDate 
            ? new Date(new Date(experience.EmploymentPeriod.EndDate!).getTime() + 6 * 60 * 60 * 1000)
            : currentDate;
  
        if (startDate >= nextStartDate && endDate >= nextStartDate) {
          totalExperienceMonths += this.getMonthsOfExperience(startDate, endDate);
          nextStartDate = endDate;
        } else if (startDate < nextStartDate && endDate > nextStartDate) {
          const adjustedNextStartDate = new Date(nextStartDate);
          adjustedNextStartDate.setDate(adjustedNextStartDate.getDate() + 1);
          totalExperienceMonths += this.getMonthsOfExperience(adjustedNextStartDate, endDate);
          nextStartDate = endDate;
        }
      });
  
    console.log('++++++++++++',totalExperienceMonths);
    return totalExperienceMonths;
      
  }
  
  getMonthsOfExperience(start: Date, end: Date): number {
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
  
    let months = (endYear - startYear) * 12 + (endMonth - startMonth);
  
    if (end.getDate() < start.getDate()) {
      months--;
    }
  
    return months + 1; // Add 1 to count the start month as a full month
  }
  

  addTotalExperience(
    experiencesInformation: ExperiencesInformation[]
  ): ExperienceInformationWithTotal[] {
    return experiencesInformation?.map((experience) => {
      const individualTotalExperience = this.calculateExperience([experience]);
      return {
        ...experience,
        IndividualTotalExperience: individualTotalExperience,
      };
    });
  }

  getPnplCheckValue(): void {
    
    this.dataServiceService
      .checkIsPnplLocked({
        companyId: this.companyId,
        jobId: this.jobId,
        idn: this.Idn,
      })
      .subscribe((response: any) => {
        this.sharedDataService.setIsPnplToSharedService(response.data.cvblur);
      });
  }

  checkCvAccess(serviceId: number, cvSearchAccess: boolean): void{

    let comId: string = window.localStorage.getItem('CompanyId') ?? '';
    let uId: string = window.localStorage.getItem('UserId') ?? '';
    let comName: string = window.localStorage.getItem('CompanyName') ?? '';
    let verificationStatus: string = window.localStorage.getItem('VerificationStatus') ?? '';

    const requestBody : CvDetailsAccessCheck = {
      companyId: comId,
      idn: this.Idn,
      companyName: comName,
      isPurchased: this.purchasedCv === '1' ? true : false,
      verificationStatus: verificationStatus === 'true' ? true : false,
      userId: uId,
      serviceId: serviceId,
      cvSearchAccess: cvSearchAccess
    }

    this.dataServiceService.checkHaveCvAccess(requestBody).subscribe({
      next: (value) => {
        this.showLoader = false;
        this.sharedDataService.setIsPnplToSharedService(value.isBlurContent);
        this.getApplicantId();   
        this.getActionDataForCvBank();
      },
      error: (error) => console.log(error, 'Error While Checking Cv Access.'),
    })


    // this.dataServiceService.checkCvAccess(this.companyId, this.Idn, this.companyName).subscribe({
    //   next: (value) => {
    //     this.showLoader = false;
    //     this.sharedDataService.setIsPnplToSharedService(value.isBlurContent);
    //     this.getApplicantId();   
    //     this.getActionDataForCvBank();
    //   },
    //   error: (error) => console.log(error, 'Error While Checking Cv Access.'),
    // });

    if (isDevMode()) {
      this.getActionDataForCvBank();
    }
  }

  getActionDataForCvBank(){
    this.dataServiceService.getCvActionData(this.companyId, this.Idn, 1).subscribe({
      next: (value) => {
        this.sharedDataService.setCVActionData(value);
        this.showLeftPanel = true;
      },
      error: (error) => console.log(error, 'Error While Getting Cv Action Data.'),
    });
  }
}
