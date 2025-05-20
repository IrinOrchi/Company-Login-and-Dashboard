import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { JobInformation } from '../models/JobInformation';
import { JobSearchDto } from '../models/JobSearchDto';
import { ActivatedRoute } from '@angular/router';
import { JobInformationApiResponse } from '../models/JobInformationApiResponse';
import { JobUserAccessMongoRequestModel } from '../models/JobUserAccessMongoRequestModel';

@Injectable({
  providedIn: 'root',
})
export class JobInformationService {
  private readonly DOMAIN = window.location.href.includes('gateway')
    ? 'gateway'
    : 'recruiter';

  private readonly JOB_INFORMATION_ENDPOINT =
    // "https://testr.bdjobs.com/api/Gateway";
    'https://empgtapi.bdjobs.com/api/Gateway';
  private readonly JOB_INFORMATION_ENDPOINT_dev =
    'https://testr.bdjobs.com/devGateway/api/Gateway';
  private readonly JOB_ARCHIVE_ENDPOINT =
    'https://corporate3.bdjobs.com/archivejob.asp';
  private readonly JOB_UNARCHIVE_ENDPOINT =
    'https://corporate3.bdjobs.com/unarchivejob.asp';
  // private readonly JOB_PAY_ONLINE_ENDPOINT =
  //   "https://corporate3.bdjobs.com/paymentMethodCheck-new.asp";
  private readonly JOB_LIVE_OR_PAUSE_ENDPOINT =
    'https://corporate3.bdjobs.com/JobLiveOrPaused.asp';
  private readonly JOB_DEADLINE_CHANGE_ENDPOINT =
    'https://corporate3.bdjobs.com/jobupdatedate.asp';
  private readonly JOB_USER_ACCESS_READ_ENDPOINT =
    'https://corporate3.bdjobs.com/CompanyUserAccessManage.asp';
  private readonly JOB_USER_ACCESS_WRITE_ENDPOINT =
    'https://corporate3.bdjobs.com/UserAccessPanel_ajax.asp';
  private readonly JOB_MESSAGE_ENDPOINT =
    'https://corporate3.bdjobs.com/ApplicantMessage.asp';
  private readonly JOB_WISE_UNREAD_MESSAGE_COUNT_ENDPOINT =
    'https://corporate3.bdjobs.com/ApplicantMessageUnreadCount.asp';
  private readonly JOB_NEW_APPLICANT_COUNT_ENDPOINT =
    'https://testmongo.bdjobs.com/v1/api/Gateway/NewApplicantCount';
  private readonly JOB_MONGO_DEADLINE_CHANGE_ENDPOINT =
    'https://testmongo.bdjobs.com/v1/api/Gateway/deadlineUpdate';
  private readonly JOB_MONGO_LIVE_OR_PAUSE_ENDPOINT =
    'https://testmongo.bdjobs.com/v1/api/Gateway/jobStatus';
  private readonly JOB_MONGO_ARCHIVE_ENDPOINT =
    'https://recruiter.bdjobs.com/archive/api/job';
  private readonly JOB_MONGO_USER_ACCESS_WRITE_ENDPOINT =
    'https://testmongo.bdjobs.com/v1/api/Gateway/accesscontrol';
  private readonly JOB_DRAFTED_MONGO_DELETE_ENDPOINT =
    'https://testmongo.bdjobs.com/v1/api/Gateway/Remove';
  private readonly JOB_DRAFTED_DELETE_ENDPOINT =
    'https://corporate3.bdjobs.com/DeletedDraftedJob.asp';

  private readonly JOB_MONGO_Generic_CHANGE_ENDPOINT =
    'https://testmongo.bdjobs.com/v1/api/Gateway/update';

  private readonly JOB_WISE_COUNTS_FROM_MONGO_BASEURL =
    'https://testmongo.bdjobs.com/api/api/GatewayActivityCount';

  private readonly ReadyToProcess_Endpoint = 'https://api.bdjobs.com/EmployerApi/api/ReadytoProcess/ReadyToPost';

  public jobSearchCriteria: BehaviorSubject<JobSearchDto> = new BehaviorSubject(
    {
      pageNumber: 1,
      pageSize: 10,
    } as JobSearchDto
  );
  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute
  ) {}

  getJobPosts(jobType: string): Observable<JobInformationApiResponse> {
    let jobSearchCriteria = this.jobSearchCriteria.value;

    let errorCount = 0;

    let companyId = window.localStorage.getItem(
      this.loginService.LOCAL_STORAGE_KEYS.COMPANY_ID
    );
    //?? "ZxU0PRC=";
    let userId = window.localStorage.getItem(
      this.loginService.LOCAL_STORAGE_KEYS.USER_ID
    );
 
    if (
      (errorCount < 5 && companyId === null) ||
      companyId === undefined ||
      userId === null ||
      userId === undefined
    ) {
      companyId = window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.COMPANY_ID
      );
      userId = window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.USER_ID
      );
    }
   
    let url = `${this.JOB_INFORMATION_ENDPOINT}?companyId=${companyId}&UA=${userId}&JobType=${jobType}`;

    url += `&batchSize=${jobSearchCriteria.pageSize ?? 10}`;
    url += `&pageNumber=${jobSearchCriteria.pageNumber ?? 1}`;

    if (jobSearchCriteria.title) {
      url += `&jobTitle=${encodeURIComponent(jobSearchCriteria.title)}`;
    }

    if (jobSearchCriteria.jobPostingStartDate) {
      url += `&startDate=${encodeURIComponent(
        jobSearchCriteria.jobPostingStartDate.toLocaleDateString()
      )}`;
    }

    if (jobSearchCriteria.jobPostingEndDate) {
      url += `&endDate=${encodeURIComponent(
        jobSearchCriteria.jobPostingEndDate.toLocaleDateString()
      )}`;
    }

    return this.httpClient.get<JobInformationApiResponse>(url);
  }

  archiveJob(jobId: number, encryptedCompanyId: string) {
    return this.httpClient.get(`${this.JOB_ARCHIVE_ENDPOINT}?id=${jobId}&comdata=${encryptedCompanyId}`, {
      responseType: 'text',
    });
   
  }

  unArchiveJob(jobId: number, encryptedCompanyId: string) {
    return this.httpClient.get(`${this.JOB_UNARCHIVE_ENDPOINT}?id=${jobId}`, {
      responseType: 'text',
    });
  }

  // archiveJobToggleMongo(jobId: number, archive: boolean = true) {
  //   return this.httpClient.get(
  //     `${this.JOB_MONGO_ARCHIVE_ENDPOINT}?jobId=${jobId}&q=${
  //       archive ? "archive" : "unarchive"
  //     }`
  //   );
  // }

  // payOnline(
  //   jobId: number,
  //   jobTitle: string,
  //   encryptedCompanyId: string,
  //   companyCountry: string,
  //   isEntrepreneurCompany: string,
  //   hasJobPostingAccess: string,
  //   paymentProcess: string,
  //   verificationStatus: string
  // ) {
  //   const options = {
  //     headers: new HttpHeaders().set(
  //       "Content-Type",
  //       "application/x-www-form-urlencoded"
  //     ),
  //   };

  //   const body = new URLSearchParams();
  //   body.set("hdInvoiceOrJobId", String(jobId));
  //   body.set("hdInvoiceOrJobValue", jobTitle);
  //   body.set("domain", this.DOMAIN);
  //   body.set("comdata", encryptedCompanyId);
  //   body.set("JOB_POSTING_ACCESS", hasJobPostingAccess);
  //   body.set("CPCountry", companyCountry);
  //   body.set("EntrepreneurCompany", isEntrepreneurCompany);
  //   body.set("Payment_process", paymentProcess);
  //   body.set("VerificationStatus", verificationStatus);

  //   return this.httpClient.post(
  //     `${this.JOB_PAY_ONLINE_ENDPOINT}`,
  //     body.toString(),
  //     options
  //   );
  // }

  deleteDraftedJob(jobId: number, encryptedCompanyId: string) {
    return this.httpClient.get(
      `${this.JOB_DRAFTED_DELETE_ENDPOINT}?domain=${this.DOMAIN}&ID=${jobId}&comdata=${encryptedCompanyId}`,
      { responseType: 'text' }
    );
  }

  deleteMongoDraftedJob(jobId?: number) {
    const requestBody = {
      JobId: jobId?.toString(),
    };
    return this.httpClient.post(
      this.JOB_DRAFTED_MONGO_DELETE_ENDPOINT,
      requestBody
    );
  }

  togglePauseJob(
    jobId: number,
    encryptedCompanyId: string,
    pause: boolean = false
  ) {
    return this.httpClient.get(
      `${this.JOB_LIVE_OR_PAUSE_ENDPOINT}?domain=${
        this.DOMAIN
      }&comdata=${encryptedCompanyId}&Action=${
        pause ? 'Pasue' : 'Live' // The spelling mistake is intentional because this is how the legacy API was created.
      }&JobId=${jobId}`,
      { responseType: 'text' }
    );
  }

  toggleMongoPauseJob(jobId: number, pause: boolean = false) {
    return this.httpClient.get(
      `${this.JOB_MONGO_LIVE_OR_PAUSE_ENDPOINT}?JobId=${jobId}&Action=${
        pause ? 'pause' : 'live'
      }`
    );
  }

  toggleMongoPauseJob_v2(jobId: number, pause: boolean = false) {
    const requestBody = {
      gatewayUpdate: {
        IsPaused: pause,
      },
      JobId: jobId.toString(),
    };
    return this.httpClient.post(
      this.JOB_MONGO_Generic_CHANGE_ENDPOINT,
      requestBody
    );
  }

  changeJobDeadline(
    jobId: number,
    encryptedCompanyId: string,
    newDeadline: { year: number; month: number; day: number }
  ) {
    return this.httpClient.get(
      `${this.JOB_DEADLINE_CHANGE_ENDPOINT}?domain=${this.DOMAIN}&ID=${jobId}&comdata=${encryptedCompanyId}&udt=${newDeadline.month}/${newDeadline.day}/${newDeadline.year}`,
      { responseType: 'text' }
    );
  }

  changeMongoJobDeadline(
    jobId: number,
    newDeadline: { year: number; month: number; day: number }
  ) {
    return this.httpClient.get(
      `${this.JOB_MONGO_DEADLINE_CHANGE_ENDPOINT}?JobId=${jobId}&DeadLine=${newDeadline.month}/${newDeadline.day}/${newDeadline.year}`
    );
  }

  changeMongoJobDeadline_v2(
    jobId: number,
    newDeadline: { year: number; month: number; day: number }
  ): Observable<any> {
    const requestBody = {
      gatewayUpdate: {
        DeadlineDate: `${newDeadline.month}/${newDeadline.day}/${newDeadline.year}`,
      },
      JobId: jobId.toString(),
    };
    return this.httpClient.post(
      this.JOB_MONGO_Generic_CHANGE_ENDPOINT,
      requestBody
    );
  }

  changeToApplyOnline(jobId?: number) {
    const reqBody = {
      jpNo: jobId,
    };
    return this.httpClient.post(
      'https://api.bdjobs.com/EmployerApi/api/CvReceive/CvReceiveupdate',
      reqBody
    );
  }

  getNewApplicantCount(jobId: number) {
    //&requestDate=${lastJobDataFetchingTime}
    return this.httpClient.get(
      // `${this.JOB_NEW_APPLICANT_COUNT_ENDPOINT}?jobId=${jobId}`
      `${this.JOB_NEW_APPLICANT_COUNT_ENDPOINT}?jobId=${jobId}`
    );
  }

  getUserAccessInfo(jobId: number, encryptedCompanyId: string) {
    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      ),
    };

    const body = new URLSearchParams();
    body.set('domain', this.DOMAIN);
    body.set('comdata', encryptedCompanyId);
    body.set('jobid', String(jobId));

    return this.httpClient.post(
      `${this.JOB_USER_ACCESS_READ_ENDPOINT}?`,
      body,
      options
    );
  }

  setUserAccessInfo(
    jobId: number,
    checkedIds: string,
    unckeckedIds: string,
    encryptedCompanyId: string,
    encryptedUserId: string
  ) {
    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      ),
    };

    const body = new URLSearchParams();
    body.set('domain', this.DOMAIN);
    body.set('comdata', encryptedCompanyId);
    body.set('ComUsrAcc', encryptedUserId);
    body.set('jobno', String(jobId));
    body.set('UserDetails', checkedIds);
    body.set('UnCheckedIds', unckeckedIds);

    return this.httpClient.post(
      `${this.JOB_USER_ACCESS_WRITE_ENDPOINT}?`,
      body,
      options
    );
  }

  setUserAccessInfoMongo(
    mongoJobUserAccessInfo: JobUserAccessMongoRequestModel
  ) {
    return this.httpClient.post(
      this.JOB_MONGO_USER_ACCESS_WRITE_ENDPOINT,
      mongoJobUserAccessInfo
    );
  }

  getJobMessages(
    jobId: number,
    encryptedCompanyId: string,
    unread: boolean = true
  ) {
    return this.httpClient.get(
      `${this.JOB_MESSAGE_ENDPOINT}?JobNo=${jobId}&domain=${this.DOMAIN}&comdata=${encryptedCompanyId}`
    );
  }

  getJobWiseUnreadMessageCount(
    jobId: number,
    encryptedCompanyId: string,
    unreadMessageFetchingDate: Date
  ) {
    const formattedDate = this.formatDateForLegacyAPI(
      unreadMessageFetchingDate
    );
    return this.httpClient.get(
      `${this.JOB_WISE_UNREAD_MESSAGE_COUNT_ENDPOINT}?JobNo=${jobId}&domain=${this.DOMAIN}&comdata=${encryptedCompanyId}&chatAfter=${formattedDate}`
    );
  }

  draftedJobReadyToProcess(jpNo?: number) {

    let lng: string = 'EN';
    let postedjob: number = 0;
    let comid : string = window.localStorage.getItem('CompanyId') ?? '';
    let comUsrAcc: string = window.localStorage.getItem('UserId') ?? '';
    return this.httpClient.post(this.ReadyToProcess_Endpoint, {jpNo,lng,postedjob,comid,comUsrAcc}
    );
  }

  refreshNotificationFetchingTime(
    jobId: number,
    notificationCount: number,
    notificationFetchingDate: Date
  ) {
    const formattedDate = this.formatDate(notificationFetchingDate);
    const requestBody = {
      gatewayUpdate: {
        NotificationCount: notificationCount,
        NotificationDate: formattedDate,
      },
      JobId: jobId?.toString(),
    };
    return this.httpClient.post(
      this.JOB_MONGO_Generic_CHANGE_ENDPOINT,
      requestBody
    );
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours() % 12 || 12; 
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const meridiem = date.getHours() < 12 ? 'AM' : 'PM';

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${meridiem}`;
  }

  refreshUnreadMessageFetchingTime(
    jobId: number,
    unreadMessageFetchingDate: Date
  ) {
    const formattedDate = this.formatDate(unreadMessageFetchingDate);
    const requestBody = {
      gatewayUpdate: {
        MessageDate: formattedDate,
      },
      JobId: jobId?.toString(),
    };
    return this.httpClient.post(
      this.JOB_MONGO_Generic_CHANGE_ENDPOINT,
      requestBody
    );
  }

  formatDateForLegacyAPI(inputDate: Date) {
    var dateObject = new Date(inputDate);

    var formattedDate =
      dateObject.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }) +
      ' ' +
      dateObject.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

    return formattedDate;
  }

  getCountsForDashboardFromMongo(jobId?: number) {
    return this.httpClient.get(
      `${this.JOB_WISE_COUNTS_FROM_MONGO_BASEURL}?jobno=${jobId}`
    );
  }
}
