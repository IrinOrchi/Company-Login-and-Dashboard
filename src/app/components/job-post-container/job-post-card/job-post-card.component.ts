import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/funnel';
import { JobInformation } from '../../../models/JobInformation';
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModal,
  NgbModalModule,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { StepperComponent } from '../../stepper/stepper.component';
import { JobInformationService } from '../../../services/job-information.service';
import { LoginService } from '../../../services/login.service';
import { JobUserAccessMongoRequestModel } from '../../../models/JobUserAccessMongoRequestModel';
HC_exporting(Highcharts);
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { TitleStrategy } from '@angular/router';
import { CustomDateFormatterService } from '../../../services/custom-date-formatter.service';
import { SalaryChartDataWithMax } from '../../../models/SalaryChartDataWithMax';

@Component({
  selector: 'app-job-post-card',
  standalone: true,
  imports: [
    CommonModule,
    HighchartsChartModule,
    FormsModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    StepperComponent,
    NgbModalModule,
    ReactiveFormsModule,
    NgbTooltip,
    ConfirmationDialogComponent,
  ],
  providers: [
    ConfirmationDialogService,
    { provide: NgbDateParserFormatter, useClass: CustomDateFormatterService },
  ],
  templateUrl: './job-post-card.component.html',
  styleUrl: './job-post-card.component.scss',
})
export class JobPostCardComponent implements OnChanges {

  domainUrl: string = window.location.hostname;

  @Input() jobInformation?: JobInformation;
  @Input() isAdminUser?: boolean;
  @Input() jobTypeToView: string = 'all';
  @Input() isPayOnlineButtonShow: boolean = false;
  @Output() archiveJobCardEvent = new EventEmitter<number | undefined>();
  @Output() applyProcessChangedEvent = new EventEmitter<number | undefined>();

  public readonly JOB_POST_STATUS = {
    PENDING: 0,
    LIVE: 1,
    PAUSED: 2,
    EXPIRED: 3,
    CLOSED: 4,
    ONHOLD: 5,
  };

  Highcharts: typeof Highcharts = Highcharts;

  public chartOptions: Highcharts.Options = {};
  public chartOption2: Highcharts.Options = {};
  public majorityApplicantGivenSalaryStartText: string = '';
  public majorityApplicantGivenSalaryEndText: string = '';
  public majorityApplicantGivenSalaryStartEndText: string = '';

  public deadlineDatePickerModel: NgbDateStruct = { year: 0, month: 0, day: 0 };
  public deadlineDate: Date = new Date();
  public minDateOfDeadline: NgbDateStruct;
  public maxDateOfDeadline: NgbDateStruct;

  public jobPostStatus: number = 0;

  public encryptedCompanyId: string = '';
  public encryptedUserId: string = '';
  public companyCountry: string = '';
  public isEntrepreneurCompany: string = '';
  public hasJobPostingAccess: string = '';
  public paymentProcess: string = '';
  public verificationStatus: string = '';

  public currentTotalApplicantCount = 0;
  public newApplicantCount = 0;
  public newApplicantCountTrim = '';
  public unreadMessageCount = 0;
  public unreadMessageCountTrim = '';
  public isMessageButtonClicked = false;
  // public unreadMessages : any;
  public unreadMessageResponse: any;
  public allMessages: any;
  public shouldShowMessageList = true;
  unreadMessagesToShow = 5;
  public tempJobPostStatus: number = 0;
  public companyCreatedAtString = '';
  public companyVerificationStatus = '';
  public companyVerificationStatusBoolean = false;
  public companyCreatedAt: Date | undefined;
  public lastJobDataFetchingTime: string = '';
  public TotalUnreadMessagesCount = 0;
  public GatewayActivityCount: any;
  public totalApplicantsMongoCount = 0;
  public ApplicantProcessDataViewedCount = 0;
  public ApplicantProcessDataNotViewedCount = 0;
  public ApplicantProcessDataShortlistedCount = 0;
  public totalApplicantsCountMongo = 0;
  public isPublished: boolean | undefined;
  public lastAcceptedDeadline: NgbDateStruct = { year: 0, month: 0, day: 0 };

  public percentage = '';
  public percentageStyle = '';
  public percentageOfSalaryApplicants = 'Loading...';
  public percentageOfSalaryApplicantsNumber = 0;
  public percentageOfApplicantsSalaryExpectation = '';
  public salaryChartDataWithMax?: SalaryChartDataWithMax[];
  public userAccessFormArray = new FormArray([] as FormGroup[]);

  private readonly DOMAIN = window.location.href.includes('gateway')
    ? 'gateway'
    : 'recruiter';

  public Unread_Message_Redirection_Base_Url =
    'https://corporate3.bdjobs.com/Corporate_message_test.asp?from=recruiter';

  // freeJob: string[] = [
  //   'Selected Blue Collar Job Positions',
  //   'Internship Announcement',
  //   'Free Listing',
  // ];
  // isShowPayOnlineButton: boolean = false;
  // ngOnInit(): void {
  //   const serviceType = this.jobInformation?.serviceType ?? '';
  //   if (this.freeJob.includes(serviceType)) {
  //     this.isShowPayOnlineButton = false;
  //   } else {
  //     this.isShowPayOnlineButton = true;
  //   }
  // }
  constructor(
    private modalService: NgbModal,
    private jobInformationService: JobInformationService,
    private loginService: LoginService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    const now = new Date();

    this.minDateOfDeadline = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };

    // Just a default value. This will be re-calculated later based on job posting date.
    this.maxDateOfDeadline = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), // Last day of current month
    };
  }

  ngOnChanges(): void {
    this.isPublished = this.jobInformation?.isPublished;
    this.currentTotalApplicantCount =
      this.jobInformation?.totalApplications ?? 0;

    this.deadlineDate = new Date(this.jobInformation?.deadlineDate ?? '');

    this.companyCreatedAtString =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.Company_Created_At
      ) ?? '';

    this.companyVerificationStatus =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.VERIFICATION_STATUS
      ) ?? '';

    this.companyCreatedAt = new Date(this.companyCreatedAtString);
    // this.companyId =
    //   window.localStorage.getItem(
    //     this.loginService.LOCAL_STORAGE_KEYS.COMPANY_ID
    //   ) ?? "";

    this.encryptedCompanyId =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.COMPANY_ID
      ) ?? '';

    this.encryptedUserId =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.USER_ID
      ) ?? '';

    this.companyCountry =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.COMPANY_COUNTRY
      ) ?? '';

    this.isEntrepreneurCompany =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.IS_ENTREPRENEUR_COMPANY
      ) ?? '';

    this.hasJobPostingAccess =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.HAS_JOB_POSTING_ACCESS
      ) ?? '';

    this.paymentProcess =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.PAYMENT_PROCESS
      ) ?? '';

    this.verificationStatus =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.VERIFICATION_STATUS
      ) ?? '';

    this.deadlineDatePickerModel = {
      year: this.deadlineDate.getFullYear(),
      month: this.deadlineDate.getMonth() + 1,
      day: this.deadlineDate.getDate(),
    };

    this.lastAcceptedDeadline = this.deadlineDatePickerModel;

    this.jobPostStatus = this.jobInformation?.isPublished
      ? this.jobInformation?.isExpired
        ? this.JOB_POST_STATUS.EXPIRED
        : this.jobInformation?.isPaused
        ? this.JOB_POST_STATUS.PAUSED
        : (!this.jobInformation?.isJobVerified && !this.jobInformation?.isExpired)
        ? this.JOB_POST_STATUS.ONHOLD
        : this.JOB_POST_STATUS.LIVE
      : this.JOB_POST_STATUS.PENDING;

    this.tempJobPostStatus = this.jobInformation?.isPublished
      ? this.jobInformation?.isExpired
        ? this.JOB_POST_STATUS.EXPIRED
        : this.jobInformation?.isPaused
        ? this.JOB_POST_STATUS.PAUSED
        : this.JOB_POST_STATUS.LIVE
      : this.JOB_POST_STATUS.PENDING;

    // if(this.jobInformation?.totalApplications){
    //   this.percentage = this.jobInformation?.majorityGivenSalaryApplicantCount
    //   ? `${Math.round(
    //       this.jobInformation?.majorityGivenSalaryApplicantCount *
    //         (100 / (this.jobInformation?.totalApplications || 1))
    //     )}`
    //   : '';

    //   // this.percentageStyle = this.jobInformation
    //   // ?.majorityGivenSalaryApplicantCount
    //   // ? `${Math.max(
    //   //     20,
    //   //     Math.round(
    //   //       this.jobInformation?.majorityGivenSalaryApplicantCount *
    //   //         (100 / (this.jobInformation?.totalApplications ?? 100))
    //   //     )
    //   //   )}`
    //   // : '';
    // }

    if (this.jobInformation?.employeerGivenSalaryRange) {
      const salaryParts =
        this.jobInformation?.employeerGivenSalaryRange.split(',');
      const firstSalaryPart = salaryParts[0].trim();
      const secondSalaryPart = salaryParts[1].trim();

      this.majorityApplicantGivenSalaryStartText =
        formatSalaryText(firstSalaryPart);
      this.majorityApplicantGivenSalaryEndText =
        formatSalaryText(secondSalaryPart);

      this.majorityApplicantGivenSalaryStartEndText =
        this.majorityApplicantGivenSalaryStartText +
        '-' +
        this.majorityApplicantGivenSalaryEndText;
    }

    function formatSalaryText(salaryPart: string): string {
      const parsedSalary = parseInt(salaryPart);
      const formattedSalary = parsedSalary < 1 ? 0 : parsedSalary / 1000;

      // Check if there are fractional digits, and use toFixed(2) only if needed
      const formattedText =
        formattedSalary % 1 === 0
          ? formattedSalary
          : formattedSalary.toFixed(2);
      return formattedText + 'K';
    }

    const experienceStack = [
      [10, 900],
      [5, 10],
      [3, 5],
      [2, 3],
      [0, 2],
    ];

    const matchingScoreStack = [
      [90, 100],
      [70, 90],
      [50, 70],
      [0, 49],
    ];

    const jobId = this.jobInformation?.jobId ?? '';
    const newLink1 = this.jobInformation?.isForwardToNewLink;  
    console.log("sfdgdfs",newLink1);
    this.chartOptions = {
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },

      chart: {
        type: 'pyramid',
        style: {
          fontFamily: 'Inter Variable',
          fontSize: '14px',
        },
        spacingLeft: -7,
        spacingRight: 70,

        width: 220,
        height: 160,
      },

      legend: {
        enabled: false,
      },
      colors: ['#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB', '#E3F2FD'],
      series: [
        {
          type: 'pyramid',
          name: `Profile Matching`,
          dataLabels: {
            enabled: true,
            inside: false,
            distance: 10,
            
            formatter: function () {
              const currentDomain = window.location.hostname;     
              const match: any = matchingScoreStack.pop();
              if (this.y > 0) {
                if(newLink1===1)
                {
                    return `<a href="https://recruiter.bdjobs.com/recruitment-center/applicants?jobno=${jobId}&minMatch=${
                    match[0]
                  }&maxMatch=${match[1]}">${(this as any).key} </a>`;
                }
                if(currentDomain.includes('recruiter')){
                  return `<a href="https://corporate3.bdjobs.com/Applicant-Hiring-Activity-Process.asp?from=recruiter&jobno=${jobId}&minMatch=${
                    match[0]
                  }&maxMatch=${match[1]}">${(this as any).key} </a>`;
                }
                else {
                  return `<a href="https://gateway.bdjobs.com/recruitmentCenter/applicants?jobno=${jobId}&minMatch=${
                    match[0]
                  }&maxMatch=${match[1]}">${(this as any).key} </a>`;
                }
              } else {
                return null;
              }
            },
            connectorPadding: 0,
            connectorShape: 'straight',
            connectorWidth: 0.8,
            softConnector: true,
            crop: false,
          } as any,
          data: [
            ['<50%', this.jobInformation?.profileMatchingScoreBelow50 ?? 0],
            ['50 - 70%', this.jobInformation?.profileMatchingScore50To69 ?? 0],
            ['70 - 90%', this.jobInformation?.profileMatchingScore70To89 ?? 0],
            ['>90%', this.jobInformation?.profileMatchingScoreAtLeast90 ?? 0],
          ],
        } as Highcharts.SeriesOptionsType,
      ],
    };
    const newLink = this.jobInformation?.isForwardToNewLink;
    this.chartOption2 = {
      chart: {
        type: 'pie',
        width: 260,
        height: 175,
        style: {
          fontFamily: 'Inter Variable',
          fontSize: '14px',
        },
        spacing: [0, 70, 0, 70],
      },

      title: {
        text: '',
      },
      legend: {
        enabled: false,
      },
      colors: ['#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB', '#E3F2FD'],
      series: [
        {
          dataLabels: {
            connectorPadding: 0,
            connectorShape: 'straight',
            connectorWidth: 0.8,
            crop: false,
            distance: 10,
            formatter: function () {
              const exp: any = experienceStack.pop();
              const currentDomain = window.location.hostname;
              //console.log(currentDomain);
              if ((this as any).y > 0) {
                if (exp[0] === 10) {
                  if(newLink===1)
                    {
                      return `<a href="https://recruiter.bdjobs.com/recruitment-center/applicants?jobno=${jobId}&minExp=${
                        exp[0]
                      }&maxExp=">${(this as any).key}</a>`;
                    }
                  if(currentDomain.includes('recruiter'))
                  {
                    return `<a href="https://corporate3.bdjobs.com/Applicant-Hiring-Activity-Process.asp?from=recruiter&jobno=${jobId}&minExp=${
                      exp[0]
                    }&maxExp=">${(this as any).key}</a>`;
                  }
                  else
                  {
                    return `<a href="https://gateway.bdjobs.com/recruitmentCenter/applicants?jobno=${jobId}&minExp=${
                      exp[0]
                    }&maxExp=">${(this as any).key}</a>`;
                  }
                } else {
                  if(newLink===1)
                    {
                      return `<a href="https://recruiter.bdjobs.com/recruitment-center/applicants?jobno=${jobId}&minExp=${
                        exp[0]
                      }&maxExp=${exp[1]}">${(this as any).key}</a>`;
                    }
                  if(currentDomain.includes('recruiter'))
                  {
                    return `<a href="https://corporate3.bdjobs.com/Applicant-Hiring-Activity-Process.asp?from=recruiter&jobno=${jobId}&minExp=${
                      exp[0]
                    }&maxExp=${exp[1]}">${(this as any).key}</a>`;
                  }
                  else
                  {
                    return `<a href="https://gateway.bdjobs.com/recruitmentCenter/applicants?jobno=${jobId}&minExp=${
                      exp[0]
                    }&maxExp=${exp[1]}">${(this as any).key}</a>`;
                  }
                }
              } else {
                return null;
              }
            },
          },
          name: 'Experience',
          data: [
            ['0 - 2yrs', this.jobInformation?.experience0To2Years ?? 0],
            ['2 - 3yrs', this.jobInformation?.experience2To3Years ?? 0],
            ['3 - 5yrs', this.jobInformation?.experience3To5Years ?? 0],
            ['5 - 10yrs', this.jobInformation?.experience5To10Years ?? 0],
            ['> 10yrs', this.jobInformation?.experienceMoreThan10Years ?? 0],
          ],
          innerSize: '50%',
        } as any,
      ],
    };

    this.fetchNotifications();
    // setInterval(this.fetchNotifications, 600000);

    this.fetchUnreadMessageCount();
    setInterval(this.fetchUnreadMessageCount, 10000);

    this.fetchUnreadMessageCountDateTimeWise();
    setInterval(this.fetchUnreadMessageCountDateTimeWise, 10000);

    this.fetchGatewayActivityCount();

    if (
      this.jobInformation &&
      this.jobInformation.salaryChartData &&
      this.jobInformation.salaryChartData.length > 0
    ) {
      //get max applicant count
      const maxApplicantsCount = this.jobInformation?.salaryChartData.reduce(
        (max, current) =>
          current.applicantsCount > max ? current.applicantsCount : max,
        0
      );
      //sort by startRange
      const sortedChartData = this.jobInformation.salaryChartData.sort(
        (a, b) => a.startRange - b.startRange
      );
      //get sorted final table data
      this.salaryChartDataWithMax = sortedChartData.map((item) => ({
        ...item,
        hasMaxApplicants: item.applicantsCount === maxApplicantsCount,
      }));
    }
  }

  fetchGatewayActivityCount() {
    this.jobInformationService
      .getCountsForDashboardFromMongo(this.jobInformation?.jobId)
      .subscribe((data: any) => {
        if (data && data.searchResult) {
          this.totalApplicantsMongoCount = data.searchResult.TotalApplicant;
          this.ApplicantProcessDataNotViewedCount =
            data.searchResult.ApplicantProcessData[0].NotViewed;
          this.ApplicantProcessDataViewedCount =
            data.searchResult.ApplicantProcessData[0].Viewed;
          this.ApplicantProcessDataShortlistedCount =
            data.searchResult.ApplicantProcessData[0].ShortListed;
          this.percentageOfSalaryApplicantsNumber = Math.round(
            ((this.jobInformation
              ?.applicantCountsWithinEmployeerGivenSalaryRange ?? 0) /
              this.totalApplicantsMongoCount) *
              100
          );
          var calculatedPercentageStyle =
            Math.max(20, this.percentageOfSalaryApplicantsNumber) > 100
              ? 100
              : Math.max(20, this.percentageOfSalaryApplicantsNumber);
          this.percentageStyle = `${calculatedPercentageStyle}`;
          this.percentageOfSalaryApplicantsNumber =
            this.percentageOfSalaryApplicantsNumber > 100
              ? 100
              : this.percentageOfSalaryApplicantsNumber;
          this.percentageOfSalaryApplicants =
            this.percentageOfSalaryApplicantsNumber + '%';
        }
      });
  }

  fetchNotifications() {
    if (this.jobInformation) {
      this.jobInformationService
        .getNewApplicantCount(this.jobInformation.jobId)
        .subscribe((data: any) => {
          if (data && data.data) {
            this.currentTotalApplicantCount = data.data;
            this.newApplicantCount = data.data;
            if (data.data >= 10) {
              this.newApplicantCountTrim = '9+';
            } else {
              this.newApplicantCountTrim = data.data.toString();
            }
          }
        });
    }
  }
  onClickAllApplications() {
    const dateNow = new Date();
    if (this.jobInformation && this.jobInformation.jobId) {
      this.jobInformationService
        .refreshNotificationFetchingTime(
          this.jobInformation.jobId,
          this.jobInformation?.totalApplications,
          dateNow
        )
        .subscribe((data: any) => {
          //success status code data.statusCode == 0
          // const redirectUrl = `https://corporate3.bdjobs.com/Applicant-Hiring-Activity-Process.asp?jobno=${this.jobInformation?.jobId}&pgtype=&tc=${this.jobInformation?.totalApplications}&from=recruiter`;
          // window.location.href = redirectUrl;
        });
    }
  }

  onClickNewApplications() {
    const dateNow = new Date();
    if (this.jobInformation && this.jobInformation.jobId) {
      this.jobInformationService
        .refreshNotificationFetchingTime(
          this.jobInformation.jobId,
          this.jobInformation?.totalApplications,
          dateNow
        )
        .subscribe((data: any) => {
          //success status code data.statusCode == 0
          const redirectUrl = this.generateNewApplicantsRedirectionURL();
          window.location.href = redirectUrl;
        });
    }
  }

  onClickJobTitle() {
    const dateNow = new Date();
    if (this.jobInformation && this.jobInformation.jobId) {
      this.jobInformationService
        .refreshNotificationFetchingTime(
          this.jobInformation.jobId,
          this.jobInformation?.totalApplications,
          dateNow
        )
        .subscribe((data: any) => {
          //success status code data.statusCode == 0
          // const redirectUrl = `https://corporate3.bdjobs.com/Applicant_Process.asp?from=recruiter&jobno=${this.jobInformation?.jobId}&ref=`;
          // window.location.href = redirectUrl;
        });
    }
  }

  generateNewApplicantsRedirectionURL(): string {
    const currentDomain = window.location.hostname;
    const jobId = this.jobInformation?.jobId;
    const notificationDate = this.jobInformation?.notificationDate;
    const baseUrl = currentDomain.includes('recruiter') 
      ? 'https://recruiter.bdjobs.com/recruitment-center/applicants'
      : 'https://gateway.bdjobs.com/recruitmentCenter/applicants';

    if (notificationDate) {
      const dataFetchDateObject = new Date(notificationDate);
      const convertedDateObject = dataFetchDateObject.toUTCString();
      return `${baseUrl}?jobno=${jobId}&ordTyp=DD&viewedtime=${convertedDateObject}`;
    } else {
      return `${baseUrl}?jobno=${jobId}&ordTyp=DD`;
    }
  }

  fetchUnreadMessageCount() {
    if (this.jobInformation) {
      this.jobInformationService
        .getJobMessages(this.jobInformation.jobId, this.encryptedCompanyId)
        .subscribe((data: any) => {
          if (data && data.MessageInfo && data.MessageInfo.length == 0) {
            this.shouldShowMessageList = false;
          } else if (data && data.MessageInfo && data.MessageInfo.length > 0) {
            this.shouldShowMessageList = true;
            this.allMessages = data.MessageInfo;
            this.unreadMessageResponse = data;
          }
        });
    }
  }

  fetchUnreadMessageCountDateTimeWise() {
    if (this.jobInformation) {
      this.jobInformationService
        .getJobWiseUnreadMessageCount(
          this.jobInformation.jobId,
          this.encryptedCompanyId,
          this.jobInformation?.messageDate
        )
        .subscribe((countData: any) => {
          this.unreadMessageCount = countData.TotalUnread;
          if (countData.TotalUnread >= 10) {
            this.unreadMessageCountTrim = '9+';
          } else {
            this.unreadMessageCountTrim = countData.TotalUnread.toString();
          }
        });
    }
  }

  refreshUnreadMesageFetchingTime() {
    this.isMessageButtonClicked = true;
    const dateNow = new Date();
    if (this.jobInformation && this.jobInformation.jobId) {
      this.jobInformationService
        .refreshUnreadMessageFetchingTime(this.jobInformation.jobId, dateNow)
        .subscribe((data: any) => {});
    }
  }

  onDeadlineDatePickerOpen() {
    let dateToAdd: number;

    //total will be dateToAdd+1 including today
    if (
      this.jobInformation?.serviceType.toLocaleLowerCase() === 'pnpl' &&
      this.jobInformation?.jobPaymentStatus === false
    ) {
      dateToAdd = 14;
    } else if (
      this.jobInformation?.serviceType.toLocaleLowerCase() === 'pnpl' &&
      this.jobInformation?.jobPaymentStatus === true
    ) {
      dateToAdd = 29;
    } else if (
      this.jobInformation?.serviceType?.toLocaleLowerCase()?.includes('free')
    ) {
      dateToAdd = 4;
    } else if (
      this.jobInformation?.serviceType
        ?.toLocaleLowerCase()
        ?.includes('internship announcement')
    ) {
      dateToAdd = 14;
    } else {
      dateToAdd = 29;
    }

    const baseDate = this.jobInformation?.isPublished
      ? new Date(this.jobInformation.publishDate)
      : new Date();

    this.minDateOfDeadline = {
      year: baseDate.getFullYear(),
      month: baseDate.getMonth() + 1,
      day: baseDate.getDate(),
    };

    const maxDate = new Date(baseDate);
    maxDate.setDate(maxDate.getDate() + dateToAdd);

    this.maxDateOfDeadline = {
      year: maxDate.getFullYear(),
      month: maxDate.getMonth() + 1,
      day: maxDate.getDate(),
    };
  }

  public onDeadlineChanged(date: NgbDate) {
    if (
      this.jobInformation &&
      this.jobInformation.jobId &&
      this.encryptedCompanyId
    ) {
      this.deadlineDate = new Date(date.year, date.month - 1, date.day);
      this.jobInformationService
        .changeJobDeadline(
          this.jobInformation.jobId,
          this.encryptedCompanyId,
          date
        )
        .subscribe((data: any) => {
          // console.log(data, 'deadline change sql');
          if (data == 1 && this.jobInformation) {
            this.lastAcceptedDeadline = date;
            this.jobInformationService
              .changeMongoJobDeadline_v2(this.jobInformation.jobId, date)
              .subscribe((value: any) => {
                // console.log(value, 'deadline change mongo');
              });
          } else {
            this.deadlineDatePickerModel = this.lastAcceptedDeadline;
            this.deadlineDate = new Date(
              this.lastAcceptedDeadline.year,
              this.lastAcceptedDeadline.month - 1,
              this.lastAcceptedDeadline.day
            );

            alert(data);
          }
        });
    }
  }

  openArchiveModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'Archive Job', centered: true })
      .result.then(
        (result: any) => {
          if (
            this.jobInformation &&
            this.jobInformation.jobId &&
            this.encryptedCompanyId
          ) {
            this.jobInformationService
              .archiveJob(this.jobInformation?.jobId, this.encryptedCompanyId)
              .subscribe((data) => {
                // if (data && data.includes('successfully')) {
                //   // this.jobInformationService
                //   //   .archiveJobToggleMongo(this.jobInformation?.jobId ?? 0)
                //   //   .subscribe(() => {
                //   // Remove card event
                //   this.archiveJobCardEvent.emit(this.jobInformation?.jobId);
                //   // });
                // }
                // Remove card event
                this.archiveJobCardEvent.emit(this.jobInformation?.jobId);
              });
          }
        },
        (reason: any) => {}
      );
  }

  openUserAccessModal(content: TemplateRef<any>) {
    this.userAccessFormArray = new FormArray([] as FormGroup[]);

    if (this.jobInformation && this.jobInformation.jobId) {
      this.jobInformationService
        .getUserAccessInfo(this.jobInformation.jobId, this.encryptedCompanyId)
        .subscribe((data: any) => {
          if (
            data.Error == '' &&
            data.UserDetails &&
            data.Message &&
            data.Message != 'No data found.'
          ) {
            for (const userDetail of data.UserDetails) {
              let accessTill =
                userDetail &&
                userDetail.UserInfo.length > 0 &&
                userDetail.UserInfo[2]
                  ? userDetail.UserInfo[2].split('/')
                  : null;
              if (accessTill && accessTill.length === 3) {
                accessTill = {
                  month: parseInt(accessTill[0]),
                  day: parseInt(accessTill[1]),
                  year: parseInt(accessTill[2]),
                };
              }

              this.userAccessFormArray.push(
                new FormGroup({
                  userId: new FormControl(userDetail.userid),
                  userName: new FormControl(userDetail.username),
                  hasAccess: new FormControl(
                    userDetail.UserInfo && userDetail.UserInfo.length > 0
                      ? true
                      : false
                  ),
                  hasUnlimitedAccess: new FormControl(
                    userDetail.UserInfo && userDetail.UserInfo.length > 0
                      ? userDetail.UserInfo[1]
                      : '1'
                  ),
                  accessExpiryDate: accessTill
                    ? new FormControl(accessTill as NgbDateStruct)
                    : new FormControl(null),
                })
              );
            }
          }

          this.modalService
            .open(content, {
              ariaLabelledBy: 'Access Control',
              centered: true,
              size: 'lg',
            })
            .result.then(
              (result: any) => {
                const userAccessData = this.userAccessFormArray.value;

                const checkedIds = userAccessData
                  .filter((u) => u.hasAccess)
                  .map((u) => {
                    if (u.hasUnlimitedAccess == '1') {
                      return `${u.userId}##1##`;
                    }
                    return `${u.userId}##0##${u.accessExpiryDate.month}/${u.accessExpiryDate.day}/${u.accessExpiryDate.year}`;
                  })
                  .join('***');

                const unckeckedIds = userAccessData
                  .filter((u) => !u.hasAccess)
                  .map((u) => u.userId)
                  .join('##');

                this.jobInformationService
                  .setUserAccessInfo(
                    this.jobInformation?.jobId ?? 0,
                    checkedIds,
                    unckeckedIds,
                    this.encryptedCompanyId,
                    this.encryptedUserId
                  )
                  .subscribe((data: any) => {
                    if (
                      data &&
                      data.Message &&
                      data.Message == 'Successfully saved.'
                    ) {
                      // const mongoJobUserAccessInfo: JobUserAccessMongoRequestModel =
                      //   {
                      //     jobId: String(this.jobInformation?.jobId ?? 0),
                      //     userAccesses: userAccessData
                      //       .filter((u) => u.hasAccess)
                      //       .map((u) => {
                      //         return {
                      //           userId: u.userId,
                      //           jobAccessExperiedDate:
                      //             u.hasUnlimitedAccess == '1'
                      //               ? '-1'
                      //               : `${u.accessExpiryDate.month}/${u.accessExpiryDate.day}/${u.accessExpiryDate.year}`,
                      //         };
                      //       }),
                      //   };
                      // this.jobInformationService
                      //   .setUserAccessInfoMongo(mongoJobUserAccessInfo)
                      //   .subscribe();
                    }
                  });
              },
              (reason: any) => {}
            );
        });
    }
  }

  onClickPayOnline() {
    if (
      this.jobInformation &&
      this.jobInformation.jobId &&
      this.jobInformation.jobTitle
    ) {
      const myform = document.createElement('form');
      myform.method = 'POST';
      myform.action =
        'https://corporate3.bdjobs.com/Job_Posting_PaymentDetails.asp?from=recruiter';
      myform.style.display = 'none';
      myform.append('Content-Type', 'application/x-www-form-urlencoded');
      myform.append(
        'Accept',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      );

      const mapInput1 = document.createElement('input');
      mapInput1.type = 'hidden';
      mapInput1.name = 'hdInvoiceOrJobId';
      mapInput1.value = String(this.jobInformation.jobId);
      myform.appendChild(mapInput1);

      const mapInput2 = document.createElement('input');
      mapInput2.type = 'hidden';
      mapInput2.name = 'hdInvoiceOrJobValue';
      mapInput2.value = this.jobInformation.jobTitle;
      myform.appendChild(mapInput2);

      const mapInput3 = document.createElement('input');
      mapInput3.type = 'hidden';
      mapInput3.name = 'domain';
      mapInput3.value = this.DOMAIN;
      myform.appendChild(mapInput3);

      const mapInput4 = document.createElement('input');
      mapInput4.type = 'hidden';
      mapInput4.name = 'comdata';
      mapInput4.value = this.encryptedCompanyId;
      myform.appendChild(mapInput4);

      const mapInput5 = document.createElement('input');
      mapInput5.type = 'hidden';
      mapInput5.name = 'JOB_POSTING_ACCESS';
      mapInput5.value = this.hasJobPostingAccess;
      myform.appendChild(mapInput5);

      const mapInput6 = document.createElement('input');
      mapInput6.type = 'hidden';
      mapInput6.name = 'CPCountry';
      mapInput6.value = this.companyCountry;
      myform.appendChild(mapInput6);

      const mapInput7 = document.createElement('input');
      mapInput7.type = 'hidden';
      mapInput7.name = 'EntrepreneurCompany';
      mapInput7.value = this.isEntrepreneurCompany;
      myform.appendChild(mapInput7);

      const mapInput8 = document.createElement('input');
      mapInput8.type = 'hidden';
      mapInput8.name = 'Payment_process';
      mapInput8.value = this.paymentProcess;
      myform.appendChild(mapInput8);

      const mapInput9 = document.createElement('input');
      mapInput9.type = 'hidden';
      mapInput9.name = 'VerificationStatus';
      mapInput9.value = this.verificationStatus;
      myform.appendChild(mapInput9);

      document.body.appendChild(myform);

      myform.submit();
    }
  }

  onclickUnreadMessageApplicant(applicationId: any, jobId: any) {
    return `<a href="https://corporate3.bdjobs.com/Applicant-Hiring-Activity-Process.asp?from=recruiter&jobno=${jobId}&aplemsg=${applicationId} </a>`;
  }

  getApplicantUrl(applicationNo: string, jobId: string): string {
    //return `https://corporate3.bdjobs.com/Applicant-Hiring-Activity-Process.asp?jobno=${jobId}&aplemsg=${applicationNo}`;
    return `${this.Unread_Message_Redirection_Base_Url}&comid=${this.encryptedCompanyId}&jobid=${jobId}&applyid=${applicationNo}`;
  }

  loadAllUnreadMessages(jobId?: number) {
    window.location.replace(
      `${this.Unread_Message_Redirection_Base_Url}&comid=${this.encryptedCompanyId}&jobid=${jobId}`
    );
  }

  openLivePauseConfirmationDialog() {
    let msgText = '';
    if (this.tempJobPostStatus == 2) {
      msgText = 'Pause';
    } else {
      msgText = 'Live';
    }
    this.confirmationDialogService
      .confirm('Attention!', 'Do you want to ' + msgText + ' this job ?')
      .then((confirmed) => {
        if (confirmed) {
          this.jobPostStatus = this.tempJobPostStatus;
          this.toggleLivePauseJob();
        } else {
          this.tempJobPostStatus = this.jobPostStatus;
        }
      })
      .catch(() =>
        console.log(
          'User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'
        )
      );
  }

  toggleLivePauseJob() {
    if (
      this.jobInformation &&
      this.jobInformation.jobId &&
      this.encryptedCompanyId
    ) {
      this.jobInformationService
        .togglePauseJob(
          this.jobInformation.jobId,
          this.encryptedCompanyId,
          this.jobPostStatus == this.JOB_POST_STATUS.PAUSED
        )
        .subscribe((data: any) => {
          if (data == 1 && this.jobInformation) {
            this.jobInformationService
              .toggleMongoPauseJob_v2(
                this.jobInformation.jobId,
                this.jobPostStatus == this.JOB_POST_STATUS.PAUSED
              )
              .subscribe();
          }
        });
    }
  }

  shouldShowDeadlineEditor(): boolean {
    if (this.jobInformation?.publishDate && this.jobInformation?.isPublished) {
      const publishDatePlus30 = new Date(this.jobInformation.publishDate);
      publishDatePlus30.setDate(publishDatePlus30.getDate() + 30);
      const today = new Date();
      return today < publishDatePlus30;
    } else {
      return true;
    }
  }

  getActivityDisplayName(activityName?: string): string {
    switch (activityName) {
      case 'written':
        return 'Written Test';
      case 'facetoface':
        return 'Face to Face';
      case 'video':
        return 'Live Interview';
      case 'other':
        return 'Other';
      case 'onlinetest':
        return 'Online Test';
      case 'record':
        return 'Video Interview';
      case 'aiasmnt':
        return 'Personality Test';
      default:
        return activityName || '';
    }
  }

  getEditJobUrl(): string {
    const redirectDateOnCompanyCreated = new Date('2024-01-11 17:00:00');
    const redirectDateOnJobPosting = new Date('2024-01-04');
    const redirectDateOnJobPosting2 = new Date('2024-01-22 15:50:00');
    let jobPostingDate;
    let companyCreatedDate;

    if (this.jobInformation?.jobPostingDate) {
      jobPostingDate = new Date(this.jobInformation?.jobPostingDate);
    }

    if (this.companyCreatedAt) {
      companyCreatedDate = new Date(this.companyCreatedAt);
    }

    let shouldRedirect = false;

    if (companyCreatedDate) {
      if (
        ['ZRUzZxG=', 'ZxZ1PiL=', 'PEG6ZRS='].includes(
          this.encryptedCompanyId
        ) ||
        companyCreatedDate > redirectDateOnCompanyCreated
      ) {
        if (jobPostingDate && jobPostingDate > redirectDateOnJobPosting) {
          shouldRedirect = true;
        }
      } else {
        if (jobPostingDate && jobPostingDate > redirectDateOnJobPosting2) {
          shouldRedirect = true;
        }
      }
    }

    return shouldRedirect
      ? `https://recruiter.bdjobs.com/jobposting/job-information?JobNo=${this.jobInformation?.jobId}&vtype=edit&rtype=`
      : // ? `https://recruiter.bdjobs.com/jobposting/job-information?JobNo=${this.jobInformation?.jobId}&vtype=edit&rtype=`
        `https://corporate3.bdjobs.com/job_posting_board.asp?from=recruiter&JobNo=${this.jobInformation?.jobId}&vtype=edit&rtype=`;
  }

  // Encrypted CompanyId 15131 = "ZRUzZxG=" 33762 = "ZxZ1PiL=" 41914 = "PEG6ZRS="

  getRepostJobUrl(): string {
    const redirectDateOnCompanyCreated = new Date('2024-01-11 17:00:00');
    const redirectDateOnJobPosting = new Date('2024-01-04');
    const redirectDateOnJobPosting2 = new Date('2024-01-22 15:50:00');
    let jobPostingDate;
    let companyCreatedDate;

    if (this.jobInformation?.jobPostingDate) {
      jobPostingDate = new Date(this.jobInformation?.jobPostingDate);
    }

    if (this.companyCreatedAt) {
      companyCreatedDate = new Date(this.companyCreatedAt);
    }

    let shouldRedirect = false;

    if (companyCreatedDate) {
      if (
        ['ZRUzZxG=', 'ZxZ1PiL=', 'PEG6ZRS='].includes(
          this.encryptedCompanyId
        ) ||
        companyCreatedDate > redirectDateOnCompanyCreated
      ) {
        if (jobPostingDate && jobPostingDate > redirectDateOnJobPosting) {
          shouldRedirect = true;
        }
      } else {
        if (jobPostingDate && jobPostingDate > redirectDateOnJobPosting2) {
          shouldRedirect = true;
        }
      }
    }

    return shouldRedirect
      ? `https://recruiter.bdjobs.com/jobposting/job-information?JobNo=${this.jobInformation?.jobId}&vtype=repost&rtype=`
      : // ? `https://recruiter.bdjobs.com/jobposting/job-information?JobNo=${this.jobInformation?.jobId}&vtype=repost&rtype=`
        `https://corporate3.bdjobs.com/job_posting_board.asp?from=recruiter&JobNo=${this.jobInformation?.jobId}&vtype=repost&rtype=`;
  }

  onClickChangeToApplyOnline() {
    this.confirmationDialogService
      .confirm('Attention!', 'Do you want to change this Apply process ?')
      .then((confirmed) => {
        if (confirmed) {
          const result = this.changeToApplyOnline();
          if (result == true) {
            this.applyProcessChangedEvent.emit(this.jobInformation?.jobId);
          } else {
            this.applyProcessChangedEvent.emit(this.jobInformation?.jobId);
          }
        } else {
          //User did not confirm
        }
      })
      .catch(() => console.log('User dismissed the dialog.'));
  }

  changeToApplyOnline(): boolean {
    this.jobInformationService
      .changeToApplyOnline(this.jobInformation?.jobId)
      .subscribe({
        next(value) {
          return true;
        },
        error(msg) {
          return false;
        },
      });
    return false;
  }

  shouldShowSalaryExpectationToolTip(): boolean {
    return (
      this.majorityApplicantGivenSalaryStartText === '0K' &&
      this.majorityApplicantGivenSalaryEndText === '0K'
    );
  }

  formatRangeValue(value: number): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (value >= 1000 && value < 1000000) {
      // Format in 'K' if the value is in thousands
      return (value / 1000).toFixed(0) + 'K';
    } else if (value >= 1000000) {
      // Format in 'M' if the value is in millions
      return (value / 1000000).toFixed(0) + 'M';
    } else {
      return value.toString();
    }
  }

  getApplicantsSalaryExpectationPercentage(applicantsCount: number): number {
    if (this.totalApplicantsMongoCount > 0) {
      return Math.round(
        (applicantsCount / this.totalApplicantsMongoCount) * 100
      );
    }
    return 0;
  }

  formatNumberWithCommas(number: number): string {
    return number.toLocaleString('en-IN');
  }

 

  getJobLink(): string {
    const currentDomain = window.location.hostname;
    const jobId = this.jobInformation?.jobId;  
    const newLink = this.jobInformation?.isForwardToNewLink;
  
    //console.log('Current Domain:', currentDomain); 
  
    if (!jobId) {
      return '#';  
    }

    if(newLink === 1)
    {
      return `https://recruiter.bdjobs.com/recruitment-center/applicants?jobno=${jobId}`;
    }

    if (currentDomain.includes('recruiter')) {
      return `https://corporate3.bdjobs.com/Applicant_Process.asp?from=recruiter&jobno=${jobId}&ref=`;
    } else if (currentDomain.includes('gateway')) {
      return `https://gateway.bdjobs.com/recruitmentCenter/applicants?jobno=${jobId}`;
    } else {
      return '#';  // Default fallback
    }
  }
  
  getApplicantLink(): string {
    const currentDomain = window.location.hostname;
    const jobId = this.jobInformation?.jobId; 
    const totalApplications = this.jobInformation?.totalApplications;
    const newLink = this.jobInformation?.isForwardToNewLink; 
  
  
    if (!jobId || !totalApplications) {
      return '#'; 
    }

    if(newLink===1)
    {
      return `https://recruiter.bdjobs.com/recruitment-center/applicants?jobno=${jobId}&pgtype=&tc=${totalApplications}&from=recruiter`;
    }
  
    if (currentDomain.includes('recruiter')) {
      return `https://corporate3.bdjobs.com/Applicant-Hiring-Activity-Process.asp?jobno=${jobId}&pgtype=&tc=${totalApplications}&from=recruiter`;
    } else if (currentDomain.includes('gateway')) {
      return `https://gateway.bdjobs.com/recruitmentCenter/applicants?jobno=${jobId}`; 
    } else {
      return '#'; 
    }
  }

  getApplicantHiringActivityLink(jobId: string, tc: number): string {
    const currentDomain = window.location.hostname;
    const newLink = this.jobInformation?.isForwardToNewLink;

    if(newLink===1)
    {
      return `https://recruiter.bdjobs.com/recruitment-center/applicants?jobno=${jobId}&pgtype=vwd&tc=${tc}`;
    }
  
    if (currentDomain.includes('recruiter')) {
      return `https://corporate3.bdjobs.com/Applicant-Hiring-Activity-Process.asp?from=recruiter&jobno=${jobId}&pgtype=vwd&tc=${tc}`;
    } else if (currentDomain.includes('gateway')) {
      return `https://gateway.bdjobs.com/recruitmentCenter/applicants?jobno=${jobId}&pgtype=vwd&tc=${tc}`; 
    } else {
      return '#'; 
    }
  }

  getApplicantHiringActivityYetToViewLink(jobId: string, tc: number): string {
    const currentDomain = window.location.hostname;
    const newLink = this.jobInformation?.isForwardToNewLink;
  
    if (newLink === 1) {
      return `https://recruiter.bdjobs.com/recruitment-center/applicants?jobno=${jobId}&pgtype=nvwd&tc=${tc}`;
    }
  
    if (currentDomain.includes('recruiter')) {
      return `https://corporate3.bdjobs.com/Applicant-Hiring-Activity-Process.asp?from=recruiter&jobno=${jobId}&pgtype=nvwd&tc=${tc}`;
    } else if (currentDomain.includes('gateway')) {
      return `https://gateway.bdjobs.com/recruitmentCenter/applicants?jobno=${jobId}&pgtype=nvwd&tc=${tc}`;
    } else {
      return '#'; 
    }
  }

  getApplicantHiringActivityShortlistedLink(jobId: string, tc: number): string {
    const currentDomain = window.location.hostname;
    const newLink = this.jobInformation?.isForwardToNewLink;
  
    if (newLink === 1) {
      return `https://recruiter.bdjobs.com/recruitment-center/applicants?jobno=${jobId}&pgtype=sl&tc=${tc}`;
    }
  
    if (currentDomain.includes('recruiter')) {
      return `https://corporate3.bdjobs.com/Applicant-Hiring-Activity-Process.asp?from=recruiter&jobno=${jobId}&pgtype=sl&tc=${tc}`;
    } else if (currentDomain.includes('gateway')) {
      return `https://gateway.bdjobs.com/recruitmentCenter/applicants?jobno=${jobId}&pgtype=sl&tc=${tc}`;
    } else {
      return '#'; 
    }
  }
}
