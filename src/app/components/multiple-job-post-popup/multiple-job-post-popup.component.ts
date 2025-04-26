// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-multiple-job-post-popup',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './multiple-job-post-popup.component.html',
//   styleUrl: './multiple-job-post-popup.component.scss'
// })
// export class MultipleJobPostPopupComponent implements OnInit {
//   public companyCreatedAt: Date | undefined;
//   public companyCreatedAtString = '';
//   public encryptedCompanyId: string = '';

//   isPopupVisible: boolean = false;
//   jobListHeight: string = '300px';
//   selectedJob: any = null;
//   jobList: any[] = [];
//   rejionalJob: number = 0;

//   constructor(
//     private dashboardService: DashboardService,
//     private loginService: LoginService
//   ) {}

//   ngOnInit() {
//     const lastDismissedTimestamp = localStorage.getItem('jobPostPopupDismissedAt');
//     const currentTime = new Date().getTime();

//     // Check if the popup was dismissed within the last 24 hours
//     if (!lastDismissedTimestamp || currentTime - parseInt(lastDismissedTimestamp, 10) > 24 * 60 * 60 * 1000) {
//       //this.isPopupVisible = true;
//     } else {
//       this.isPopupVisible = false;
//     }

//     this.companyCreatedAtString =
//       window.localStorage.getItem(
//         this.loginService.LOCAL_STORAGE_KEYS.Company_Created_At
//       ) ?? '';
//     this.companyCreatedAt = new Date(this.companyCreatedAtString);

//     this.encryptedCompanyId =
//     window.localStorage.getItem(
//       this.loginService.LOCAL_STORAGE_KEYS.COMPANY_ID
//     ) ?? '';

//     this.fetchJobs();
//   }

//   // fetchJobs() {
//   //   this.dashboardService.getMultipleJobs().subscribe({
//   //     next: (response) => {
//   //       if (response.status === 200 && response.data) {
//   //         this.jobList = response.data.flatMap((item: any) => item.jobInformation);
//   //       }
//   //     },
//   //     error: (error) => {
//   //       console.error('Error fetching jobs:', error);
//   //     },
//   //   });
//   // }
//   fetchJobs() {
//     this.dashboardService.getMultipleJobs().subscribe({
//       next: (response) => {
//         console.log('Full API response:', response); // Debug log
//         if (response.status === 200 && response.data) {
//           this.jobList = response.data.flatMap((item: any) => item.jobInformation);
          
//           // Check if any item in data array has rejionalJob === 7
//           const hasRegionalJob7 = response.data.some((item: any) => item.rejionalJob === 7);
//           this.rejionalJob = hasRegionalJob7 ? 7 : 0;
          
//           console.log('Has regional job 7:', hasRegionalJob7); // Debug log
          
//           const lastDismissedTimestamp = localStorage.getItem('jobPostPopupDismissedAt');
//           const currentTime = new Date().getTime();
          
//           if (this.rejionalJob === 7 && 
//               (!lastDismissedTimestamp || currentTime - parseInt(lastDismissedTimestamp, 10) > 24 * 60 * 60 * 1000)) {
//             this.isPopupVisible = true;
//             console.log('Showing popup'); // Debug log
//           } else {
//             this.isPopupVisible = false;
//             console.log('Not showing popup. Reasons:', {
//               regionalJobIs7: this.rejionalJob === 7,
//               recentlyDismissed: lastDismissedTimestamp && 
//                                 currentTime - parseInt(lastDismissedTimestamp, 10) <= 24 * 60 * 60 * 1000
//             }); // Debug log
//           }
//         }
//       },
//       error: (error) => {
//         console.error('Error fetching jobs:', error);
//       },
//     });
//   }
//   selectJob(job: any) {
//     this.selectedJob = job;
//   }

//   closePopup() {
//     this.isPopupVisible = false;
//     // Store the current timestamp when the popup is closed
//     localStorage.setItem('jobPostPopupDismissedAt', new Date().getTime().toString());
//   }

//   getEditJobUrl(): string {
//     const redirectDateOnCompanyCreated = new Date('2024-01-11 17:00:00');
//     const redirectDateOnJobPosting = new Date('2024-01-04');
//     const redirectDateOnJobPosting2 = new Date('2024-01-22 15:50:00');

//     let jobPostingDate: Date | undefined;
//     let companyCreatedDate: Date | undefined;

//     if (this.selectedJob?.jobPostingDate) {
//       jobPostingDate = new Date(this.selectedJob.jobPostingDate);
//     }

//     if (this.companyCreatedAt) {
//       companyCreatedDate = new Date(this.companyCreatedAt);
//     }

//     let shouldRedirect = false;

//     if (companyCreatedDate) {
//       if (
//         ['ZRUzZxG=', 'ZxZ1PiL=', 'PEG6ZRS='].includes(this.encryptedCompanyId) ||
//         companyCreatedDate > redirectDateOnCompanyCreated
//       ) {
//         if (jobPostingDate && jobPostingDate > redirectDateOnJobPosting) {
//           shouldRedirect = true;
//         }
//       } else {
//         if (jobPostingDate && jobPostingDate > redirectDateOnJobPosting2) {
//           shouldRedirect = true;
//         }
//       }
//     }

//     return shouldRedirect
//       ? `https://recruiter.bdjobs.com/jobposting/job-information?JobNo=${this.selectedJob?.jobId}&vtype=edit&rtype=`
//       : `https://corporate3.bdjobs.com/job_posting_board.asp?from=recruiter&JobNo=${this.selectedJob?.jobId}&vtype=edit&rtype=`;
//   }

//   postJob() {
//     if (this.selectedJob) {
//       localStorage.setItem('multipleJobType', 'true');
//       console.log(localStorage.getItem('multipleJobType'));
//       window.location.href = this.getEditJobUrl();
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-multiple-job-post-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiple-job-post-popup.component.html',
  styleUrls: ['./multiple-job-post-popup.component.scss'],
})
export class MultipleJobPostPopupComponent implements OnInit {
  public companyCreatedAt: Date | undefined;
  public companyCreatedAtString = '';
  public encryptedCompanyId: string = '';

  isPopupVisible: boolean = false;
  jobListHeight: string = '300px';
  selectedJob: any = null;
  jobList: any[] = [];
  rejionalJob: number = 0; // Add this property to store the regionalJob value

  constructor(
    private dashboardService: DashboardService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    const lastDismissedTimestamp = localStorage.getItem('jobPostPopupDismissedAt');
    const currentTime = new Date().getTime();

    // Check if the popup was dismissed within the last 24 hours
    if (!lastDismissedTimestamp || currentTime - parseInt(lastDismissedTimestamp, 10) > 24 * 60 * 60 * 1000) {
      // We'll set visibility after fetching jobs based on regionalJob value
    } else {
      this.isPopupVisible = false;
    }

    this.companyCreatedAtString =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.Company_Created_At
      ) ?? '';
    this.companyCreatedAt = new Date(this.companyCreatedAtString);

    this.encryptedCompanyId =
    window.localStorage.getItem(
      this.loginService.LOCAL_STORAGE_KEYS.COMPANY_ID
    ) ?? '';

    this.fetchJobs();
  }

  fetchJobs() {
    this.dashboardService.getMultipleJobs().subscribe({
      next: (response) => {
        console.log('Full API response:', response); // Debug log
        if (response.status === 200 && response.data) {
          this.jobList = response.data.flatMap((item: any) => item.jobInformation);
          
          // Check if any item in data array has rejionalJob === 7
          const hasRegionalJob7 = response.data.some((item: any) => item.rejionalJob === 7);
          this.rejionalJob = hasRegionalJob7 ? 7 : 0;
          
          console.log('Has regional job 7:', hasRegionalJob7); // Debug log
          
          const lastDismissedTimestamp = localStorage.getItem('jobPostPopupDismissedAt');
          const currentTime = new Date().getTime();
          
          if (this.rejionalJob === 7 && 
              (!lastDismissedTimestamp || currentTime - parseInt(lastDismissedTimestamp, 10) > 24 * 60 * 60 * 1000)) {
            this.showPopup();
            console.log('Showing popup'); // Debug log
          } else {
            this.isPopupVisible = false;
            console.log('Not showing popup. Reasons:', {
              regionalJobIs7: this.rejionalJob === 7,
              recentlyDismissed: lastDismissedTimestamp && 
                                currentTime - parseInt(lastDismissedTimestamp, 10) <= 24 * 60 * 60 * 1000
            }); // Debug log
          }
        }
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
      },
    });
  }

  showPopup() {
    this.isPopupVisible = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  selectJob(job: any) {
    this.selectedJob = job;
  }

  closePopup() {
    this.isPopupVisible = false;
    document.body.style.overflow = ''; // Restore background scrolling
    // Store the current timestamp when the popup is closed
    localStorage.setItem('jobPostPopupDismissedAt', new Date().getTime().toString());
  }

  getEditJobUrl(): string {
    const redirectDateOnCompanyCreated = new Date('2024-01-11 17:00:00');
    const redirectDateOnJobPosting = new Date('2024-01-04');
    const redirectDateOnJobPosting2 = new Date('2024-01-22 15:50:00');

    let jobPostingDate: Date | undefined;
    let companyCreatedDate: Date | undefined;

    if (this.selectedJob?.jobPostingDate) {
      jobPostingDate = new Date(this.selectedJob.jobPostingDate);
    }

    if (this.companyCreatedAt) {
      companyCreatedDate = new Date(this.companyCreatedAt);
    }

    let shouldRedirect = false;

    if (companyCreatedDate) {
      if (
        ['ZRUzZxG=', 'ZxZ1PiL=', 'PEG6ZRS='].includes(this.encryptedCompanyId) ||
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
      ? 
      `https://recruiter.bdjobs.com/jobposting/job-information?JobNo=${this.selectedJob?.jobId}&vtype=edit&rtype=d&p=1`
      : `https://recruiter.bdjobs.com/jobposting/job-information?JobNo=${this.selectedJob?.jobId}&vtype=edit&rtype=d&p=1`;
  }

  postJob() {
    if (this.selectedJob) {
      //sessionStorage.setItem('paidMultipleJob', 'true');
      window.location.href = this.getEditJobUrl();
    }
  }
}