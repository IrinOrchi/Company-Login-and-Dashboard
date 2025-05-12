import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostContainerHeaderComponent } from './job-post-container-header/job-post-container-header.component';
import { JobPostCardComponent } from './job-post-card/job-post-card.component';
import { JobInformation } from '../../models/JobInformation';
import { JobInformationService } from '../../services/job-information.service';
import { LoginPageCountService } from '../../services/login-page-count.service';
import { FeatureCarouselComponent } from '../feature-carousel/feature-carousel.component';
import { LoginService } from '../../services/login.service';
import { DraftedjobCardComponent } from '../draftedjob-card/draftedjob-card.component';
import { NojobFoundComponent } from '../nojob-found/nojob-found.component';
@Component({
  selector: 'app-job-post-container',
  standalone: true,
  imports: [
    CommonModule,
    JobPostContainerHeaderComponent,
    JobPostCardComponent,
    FeatureCarouselComponent,
    DraftedjobCardComponent,
    NojobFoundComponent,
  ],
  templateUrl: './job-post-container.component.html',
  styleUrl: './job-post-container.component.scss',
})
export class JobPostContainerComponent implements OnInit {
  public jobs: JobInformation[] = [];
  private currentPageNumber: number = 1;
  public cvBankCount: string = 'Loading...';
  public cvBankUpdatedCount: string = 'Loading...';
  public isAdminUser: boolean = false;
  public isDataLoading: boolean = true;
  public isLoadMoreButtonHidden: boolean = true;
  public totalJobPosted: number = 0; // TODO: Implement
  public supportPersonName = '';
  public supportPersonImageUrl = '';
  public supportPersonDesignation = '';
  public supportPersonContact = '';
  public supportPersonEmail = '';
  public totalJobCount: number = 0;
  public draftedJobCount: number = 0;
  public postedCount: number = 0;
  public publishedCount: number = 0;
  public jobTypeToView: string = 'published';

  constructor(
    public jobInformationService: JobInformationService,
    private loginPageCountService: LoginPageCountService,
    private loginService: LoginService
  ) {
    this.jobInformationService.jobSearchCriteria.next({
      ...this.jobInformationService.jobSearchCriteria.value,
      pageNumber: this.currentPageNumber,
    });
  }
  freeJob: string[] = [
    'Free Listing',
    'Selected Blue Collar Job',
    'Internship Announcement',
  ];
  isShowPayOnlineButton(serviceType?: string): boolean {
    var IsEntrepreneurCompany =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.IS_ENTREPRENEUR_COMPANY
      ) === 'true' || false;

    if (IsEntrepreneurCompany) {
      return true;
    }
    if (serviceType) {
      if (this.freeJob.includes(serviceType)) {
        return false;
      }
    }
    return true;
  }
  ngOnInit(): void {
    // this.handlePageReload();

    this.isAdminUser =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.IS_ADMIN_USER
      ) === 'true' || false;

    this.supportPersonName =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.SUPPORT_PERSON_NAME
      ) ?? '';

    this.supportPersonImageUrl =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.SUPPORT_PERSON_IMAGE
      ) ?? 'assets/images/support-person-placeholder.jpg';

    if (!this.supportPersonImageUrl.includes('placeholder')) {
      this.supportPersonImageUrl =
        'http://bdjobs.com/ContactSalesPerson/' + this.supportPersonImageUrl;
    }

    this.supportPersonDesignation =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.SUPPORT_PERSON_DESIGNATION
      ) ?? '';

    this.supportPersonContact =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.SUPPORT_PERSON_PHONE
      ) ?? '';

    this.supportPersonEmail =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.SUPPORT_PERSON_EMAIL
      ) ?? '';

    this.jobInformationService.jobSearchCriteria.subscribe(
      (jobSearchCriteria) => {
        if (jobSearchCriteria.reloadResults) {
          this.isDataLoading = true;
        }
        this.jobInformationService
          .getJobPosts(this.jobTypeToView)
          .subscribe((data) => {
            if (jobSearchCriteria.reloadResults) {
              this.jobs = data.data;
              this.totalJobCount = data.totalJobCount;
              this.draftedJobCount = data.draftedJobCount;
              this.postedCount = data.postedCount;
              this.publishedCount = data.publishedCount;

              window.localStorage.setItem(
                'lastJobDataFetchingTime',
                new Date().toISOString()
              );
            } else {
              this.jobs.push(...data.data);
              this.totalJobCount = data.totalJobCount;
              this.draftedJobCount = data.draftedJobCount;
              this.postedCount = data.postedCount;
              this.publishedCount = data.publishedCount;
            }

            this.isDataLoading = false;
            this.isLoadMoreButtonHidden = false;

            //to hide the Load more button
            if (
              this.jobTypeToView === 'posted' &&
              this.jobs.length >= this.postedCount
            ) {
              this.isLoadMoreButtonHidden = true;
            }
            if (
              this.jobTypeToView === 'drafted' &&
              this.jobs.length >= this.draftedJobCount
            ) {
              this.isLoadMoreButtonHidden = true;
            }
            if (
              this.jobTypeToView === 'published' &&
              this.jobs.length >= this.publishedCount
            ) {
              this.isLoadMoreButtonHidden = true;
            }
            if (
              this.jobTypeToView === 'all' &&
              this.jobs.length >= this.totalJobCount
            ) {
              this.isLoadMoreButtonHidden = true;
            }
          });
      }
    );

    this.loginPageCountService.getCvBankCount().subscribe((data: string) => {
      if (data) {
        const counts = data.split('###');

        //this.cvBankCount = counts[0];
        const cvBankCountValue = parseInt(counts[0].replace(/,/g, ''), 10); // Remove existing commas and parse as integer
        this.cvBankCount = cvBankCountValue.toString();
        const cvBankUpdatedCountValue = parseInt(
          counts[1].replace(/,/g, ''),
          10
        ); // Remove existing commas and parse as integer
        this.cvBankUpdatedCount = cvBankUpdatedCountValue.toString();
      }
    });
  }

  formatNumberWithCommas(numberString: string): string {
    const value = parseInt(numberString.replace(/,/g, ''), 10);
    const formattedValue = value.toLocaleString('en-IN'); // Use 'en-IN' for Indian number formatting
    return formattedValue;
  }

  onClickLoadMore() {
    this.isLoadMoreButtonHidden = true;

    this.jobInformationService.jobSearchCriteria.next({
      ...this.jobInformationService.jobSearchCriteria.value,
      pageNumber: ++this.currentPageNumber,
      reloadResults: false,
    });
  }

  onJobArchived(jobId?: number) {
    if (jobId) {
      this.jobs = this.jobs.filter((j) => j.jobId != jobId);
    }
  }

  handleLoadJobDataEvent(jobType: string) {
    this.jobTypeToView = jobType;
    this.currentPageNumber = 1;

    this.jobInformationService.jobSearchCriteria.next({
      ...this.jobInformationService.jobSearchCriteria.value,
      pageNumber: this.currentPageNumber,
      reloadResults: true,
    });
  }

  removeDraftedJob(jobId: number) {
    const index = this.jobs.findIndex((job) => job.jobId === jobId);
    if (index !== -1) {
      this.jobs.splice(index, 1);
    }
    this.draftedJobCount = this.draftedJobCount - 1;
  }

  draftedJobReadyToProcess(jobId: number) {
    const index = this.jobs.findIndex((job) => job.jobId === jobId);
    if (index !== -1) {
      this.jobs.splice(index, 1);
    }
    this.draftedJobCount = this.draftedJobCount - 1;
    //this.postedCount = this.postedCount + 1;
  }

  handlePageReload() {
    this.loginService.getSupportingInfo().subscribe(
      (data) => {
        if (data) {
          this.loginService.setLegacyApiDataToLocalStorage(data);
        }
      },
      (error) => {
        console.error('Error:', error);
      },
      () => {
      }
    );
  }

  onApplyProcessChanged(jobId?: number) {
    if (jobId) {
      this.jobs = this.jobs.map((job) => {
        if (job.jobId === jobId) {
          job.applyOptions = job.applyOptions + ',Apply Online';
        }
        return job;
      });
    }
  }

  handleClearSearchEvent() {
    this.currentPageNumber = 1;
  }
}
