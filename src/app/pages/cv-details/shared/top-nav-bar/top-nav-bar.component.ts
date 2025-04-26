import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedDataService } from '../../../../services/cv-details/shared-data.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';
import { DataServiceService } from '../../../../services/cv-details/data-service.service';
import { CvDetails } from '../../../../models/Cv-Details/response/cv-details';
import { CvDetailsComponent } from '../../cv-details.component';
import { GatewayDataSharingService } from '../../../../services/gateway-data-sharing.service';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-top-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-nav-bar.component.html',
  styleUrl: './top-nav-bar.component.scss',
})
export class TopNavBarComponent {
  profileName?: string | undefined;
  expectedSalary: string = '0';
  constructor(
    public router: Router,
    private sharedDataService: SharedDataService,
    private cvDetailsDataService: DataServiceService,
    private cvDetailsComponent: CvDetailsComponent
  ) {}
  cvDetails?: CvDetails | undefined;
  videoCv: boolean = false;
  customizedCv: boolean = false;
  customizedCvType: string = '';
  userData?: any | undefined;
  isShortListed: boolean = false;
  isRejected: boolean = false;
  currentViewType: string = 'detailed';
  jobTitle?: string = '';
  jobId?: number = 0;
  isLockedForPnpl: boolean = false;
  ngOnInit(): void {
    this.sharedDataService.cvDetails$.subscribe((cvDetails) => {
      this.cvDetails = cvDetails;

      this.profileName = this.cvDetails?.Name.FullName.toUpperCase();

      this.videoCv = this.cvDetails?.Attachment?.IsVideoProfile ?? false;
      this.customizedCv =
        this.cvDetails?.Attachment?.IsPersonalizedProfile ?? false;
      //this.currentViewType = this.cvDetails?.Attachment.PersonalizedProfileFileType ?? '';
      this.sharedDataService.applicantJobStatus$.subscribe({
        next: (response) => {
          // console.log(response, 'gettingIsShortList');
          this.isShortListed = response?.IsShortListed ?? false;
          this.isRejected = response?.IsRejected ?? false;
        },
      });
    });

    this.sharedDataService.userData$.subscribe((userData) => {
      // console.log(userData, 'getting');

      this.userData = userData;
    });

    this.sharedDataService.jobTitle$.subscribe((jobTitle) => {
      this.jobTitle = jobTitle ?? '';
    });

    this.sharedDataService.urlParams$.subscribe((data) => {
      const jobId = data?.jobId ?? 0;
      this.jobId = parseInt(data?.jobId ?? '0', 10);
      // console.log(this.jobId + 'jobid');
      if (jobId != 0) {
        this.expectedSalary = data?.expsal ?? '0';
      }
      // console.log('expectedSalary ' + this.expectedSalary);
    });

    this.sharedDataService.isPnpl$.subscribe((data) => {
      this.isLockedForPnpl = data;
      console.log("this is pnpl job value "+this.isLockedForPnpl)
    });
  }
  downloadCustomizedCv() {
    // console.log('downloadCv');
    if (
      this.cvDetails &&
      this.cvDetails?.Attachment?.PersonalizedProfileFileType
    ) {
      this.cvDetailsComponent.downloadCustomizedCv(
        this.cvDetails.Attachment?.PersonalizedProfileFileType
      );
    }
  }
  showVideoCV() {
    if (this.cvDetails && this.cvDetails.Attachment?.IsVideoProfile) {
      this.cvDetailsComponent.seeVideoCv();
    }
  }
  // currentViewType: string = 'detailed';
  // shortView() {
  //   this.currentViewType = 'short';
  //   this.sharedDataService.urlParams$.subscribe((params) => {
  //     if (params) {
  //       this.router.navigate(['/cv-details/short-view'], {
  //         queryParams: {
  //           Idn: params.Idn,
  //           jid: params.jobId,
  //           jobtitle: params.jobTitle,
  //           expsal: params.expsal,
  //           api: params.api,
  //           rw: params.rw,
  //           pgtype: params.pgtype,
  //           viewType: params.viewType,
  //           viewTypeStatus: params.viewTypeStatus,
  //           shortcv_view: params.shortcv_view,
  //           revamp: params.revamp,
  //         },
  //       });
  //     } else {
  //       this.router.navigate(['/cv-details/short-view']);
  //     }
  //   });
  // }

  // detailedView() {
  //   this.sharedDataService.urlParams$.subscribe((params) => {
  //     if (params) {
  //       this.router.navigate(['/cv-details/details-view'], {
  //         queryParams: {
  //           Idn: params.Idn,
  //           jid: params.jobId,
  //           jobtitle: params.jobTitle,
  //           expsal: params.expsal,
  //           api: params.api,
  //           rw: params.rw,
  //           pgtype: params.pgtype,
  //           viewType: params.viewType,
  //           viewTypeStatus: params.viewTypeStatus,
  //           shortcv_view: params.shortcv_view,
  //           revamp: params.revamp,
  //         },
  //       });
  //     } else {
  //       this.router.navigate(['/cv-details/details-view']);
  //     }
  //   });
  // }

  shortView() {
    this.currentViewType = 'short';
    this.navigateWithParams();
  }

  detailedView() {
    this.currentViewType = 'detailed';
    this.navigateWithParams();
  }

  navigateWithParams() {
    this.sharedDataService.urlParams$
      .subscribe((params) => {
        if (params) {
          const queryParams = {
            Idn: params.Idn,
            jid: params.jobId,
            jobtitle: params.jobTitle,
            expsal: params.expsal,
            api: params.api,
            rw: params.rw,
            pgtype: params.pgtype,
            viewType: params.viewType,
            viewTypeStatus: params.viewTypeStatus,
            shortcv_view: params.shortcv_view,
            revamp: params.revamp,
          };

          const route =
            this.currentViewType === 'short'
              ? '/cvdetails/short-view'
              : '/cvdetails/details-view';

          this.router.navigate([route], { queryParams });
        } else {
          const route =
            this.currentViewType === 'short'
              ? '/cvdetails/short-view'
              : '/cvdetails/details-view';
          this.router.navigate([route]);
        }
      })
      .unsubscribe(); // Unsubscribe to prevent memory leaks
  }

  shortList() {
    // console.log(this.currentViewType);
    let jobId = '';
    let applyId = '';
    this.sharedDataService.urlParams$.subscribe((params) => {
      jobId = params?.jobId ?? '';
      applyId = params?.api ?? '';
    });
    if (jobId && applyId) {
      this.cvDetailsDataService.shortlist(jobId, applyId).subscribe({
        next: (value) => {
          this.isShortListed = true;
          //console.log('Shortlisted.', value);
        },
        error(err) {
          console.error('Observable emitted an error: ' + err);
        },
      });
    }
  }

  rejectCV() {
    let jobId = '';
    let applyId = '';
    this.sharedDataService.urlParams$.subscribe((params) => {
      jobId = params?.jobId ?? '';
      applyId = params?.api ?? '';
    });
    if (jobId && applyId) {
      this.cvDetailsDataService.rejectCV(jobId, applyId, '1').subscribe({
        next: (value) => {
          this.isRejected = true;
          // console.log('Rejected.', value);
        },
        error(err) {
          console.error('Observable emitted an error: ' + err);
        },
      });
    }
  }
  restoreCV() {
    let jobId = '';
    let applyId = '';
    this.sharedDataService.urlParams$.subscribe((params) => {
      jobId = params?.jobId ?? '';
      applyId = params?.api ?? '';
    });
    if (jobId && applyId) {
      this.cvDetailsDataService.rejectCV(jobId, applyId, '0').subscribe({
        next: (value) => {
          this.isRejected = false;
          // console.log('Restored.', value);
        },
        error(err) {
          console.error('Observable emitted an error: ' + err);
        },
      });
    }
  }

  generatePdf() {
    this.sharedDataService.htmlContent$.subscribe((htmlContent) => {
      // console.log(htmlContent, 'htmlContent');
      // Define A4 paper size
      const a4Width = 595.28; // Width in points (1 point = 1/72 inch)
      const a4Height = 841.89; // Height in points

      if (htmlContent) {
        // Set the width of the HTML content to match the A4 paper width
        htmlContent.style.width = a4Width + 'pt'; // Set width in points

        const userNameSpan = htmlContent.querySelector('#user_name');
        const userName = userNameSpan
          ? userNameSpan.textContent
          : 'Unknown User';

        html2canvas(htmlContent, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        }).then((canvas: any) => {
          const imgWidth = 208;
          const pageHeight = 295;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;
          heightLeft -= pageHeight;
          const doc = new jsPDF('p', 'mm');
          doc.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            0,
            position,
            imgWidth,
            imgHeight
          );
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(
              canvas.toDataURL('image/png'),
              'PNG',
              0,
              position,
              imgWidth,
              imgHeight
            );
            heightLeft -= pageHeight;
          }
          doc.save(userName + '.pdf');

          // Reset the width of the HTML content after rendering PDF
          htmlContent.style.width = 'auto';
        });
      } else {
        alert('HTMLElement not found');
      }
    });
  }

  generateWord() {
    this.sharedDataService.htmlContent$.subscribe((htmlContent) => {
      if (htmlContent) {
        asBlob(htmlContent.innerHTML).then((data) => {
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });
          const userNameSpan = htmlContent.querySelector('#user_name');
          const userName = userNameSpan
            ? userNameSpan.textContent
            : 'Unknown User';
          const file = new File([blob], `${userName}.docx`, {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });
          saveAs(file);
        });
      } else {
        alert('HTMLElement not found');
      }
    });
  }

  printDocument() {
    this.sharedDataService.htmlContent$.subscribe((htmlContent) => {
      if (htmlContent) {
        // Open a new window with the HTML content
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          // Write the HTML content
          printWindow.document.open();
          printWindow.document.write(htmlContent.outerHTML);
          printWindow.document.close();
          // After the content is written, trigger printing
          printWindow.print();
        } else {
          alert('Failed to open print window');
        }
      } else {
        alert('HTMLElement not found');
      }
    });
  }

  convertSalaryToNumber(salaryString: string): number {
    return parseFloat(salaryString.replace(/,/g, ''));
  }

  pdfDownloadFunc(): void {
    if (this.isLockedForPnpl) {
      return
    } 
    let applyId = 0;
    this.sharedDataService.applicantJobStatus$.subscribe({
      next: (response) => {
        applyId = response?.ApplicantId ?? 0;
      },
    });

    this.cvDetailsDataService
      .cvPdfDownload({
        jobTitle: this.jobTitle,
        applicantIds: [+applyId],
        jobId: this.jobId,
        expectedSalary: this.convertSalaryToNumber(this.expectedSalary),
      })
      .subscribe((response: Blob) => {
        const filename = `${this.profileName}.pdf`;
        saveAs(response, filename);
      });
  }

  pdfPrintFunc(): void {
    if (this.isLockedForPnpl) {
      return
    }
    let applyId = 0;
    this.sharedDataService.applicantJobStatus$.subscribe({
      next: (response) => {
        applyId = response?.ApplicantId ?? 0;
      },
    });

    this.cvDetailsDataService
      .cvPdfDownload({
        jobId: this.jobId,
        jobTitle: this.jobTitle,
        applicantIds: [+applyId],
        expectedSalary: this.convertSalaryToNumber(this.expectedSalary),
      })
      .subscribe((response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
          newWindow.onload = () => {
            newWindow.print();
          };
        } else {
          console.error(
            'Popup was blocked, please allow popups and try again.'
          );
        }
      });
  }
}
