import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { JobInformation } from "../../models/JobInformation";
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service";
import { JobInformationService } from "../../services/job-information.service";
import { LoginService } from "../../services/login.service";
import { NgbDate, NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {  FormsModule } from '@angular/forms';
@Component({
  selector: 'app-draftedjob-card',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmationDialogComponent,
    NgbDatepickerModule,
    FormsModule
  ],
  providers: [
    ConfirmationDialogService
  ],
  templateUrl: './draftedjob-card.component.html',
  styleUrl: './draftedjob-card.component.scss'
})
export class DraftedjobCardComponent implements OnInit {
  @Input() jobInformation?: JobInformation;
  @Output() draftedJobDeleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() draftedJobReadyToProcess: EventEmitter<number> = new EventEmitter<number>();

  public encryptedCompanyId: string = '';
  public deadlineDate: Date = new Date();
  public deadlineDatePickerModel: NgbDateStruct = { year: 0, month: 0, day: 0 };
  public minDateOfDeadline: NgbDateStruct;
  public maxDateOfDeadline: NgbDateStruct;

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private jobInformationService: JobInformationService,
    private loginService: LoginService
    ){
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

  ngOnInit(){
    this.encryptedCompanyId =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.COMPANY_ID
      ) ?? '';

    
  }

  ngOnChanges(): void {

    this.deadlineDate = new Date(this.jobInformation?.deadlineDate ?? '');

    this.deadlineDatePickerModel = {
      year: this.deadlineDate.getFullYear(),
      month: this.deadlineDate.getMonth() + 1,
      day: this.deadlineDate.getDate(),
    };
  }

  openDeleteJobConfirmationDialog() {
    this.confirmationDialogService.confirm('Attention!', 'Do you want to delete this job ?')
    .then((confirmed) => {
        if (confirmed) {
            // console.log('User confirmed: ' + this.jobInformation?.jobId, confirmed);
            this.deleteDraftedJob();
        } else {
            console.log('User did not confirm');
        }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  deleteDraftedJob(){
    if (
      this.jobInformation &&
      this.jobInformation.jobId &&
      this.encryptedCompanyId
    ){
      this.jobInformationService
        .deleteDraftedJob(
          this.jobInformation.jobId,
          this.encryptedCompanyId
        )
        .subscribe((data: any) => {
          if (data != 'Error' && this.jobInformation) {
            this.jobInformationService
              .deleteMongoDraftedJob(
                this.jobInformation.jobId
              )
              .subscribe(() => {
                this.draftedJobDeleted.emit(this.jobInformation?.jobId);
              });
          }
        });
    }    
  }


  onClickEditJob(): void {
    //const editJobUrl = `https://corporate3.bdjobs.com/job_posting_board.asp?from=recruiter&JobNo=${this.jobInformation?.jobId}&vtype=edit&rtype=d`;
    const domain = window.location.hostname;
     let editJobUrl = '';
     if(domain.includes('recruiter')){
       //editJobUrl = `https://corporate3.bdjobs.com/job_posting_board.asp?from=recruiter&JobNo=${this.jobInformation?.jobId}&vtype=edit&rtype=d`;
       if(this.jobInformation?.jobPaymentStatus === true){
        editJobUrl = `https://recruiter.bdjobs.com/jobposting/job-information?JobNo=${this.jobInformation?.jobId}&vtype=edit&rtype=d&p=1`;
      } else {
        editJobUrl = `https://recruiter.bdjobs.com/jobposting/job-information?JobNo=${this.jobInformation?.jobId}&vtype=edit&rtype=d`;
      }
     }
     else{
      if(this.jobInformation?.jobPaymentStatus === true){
        editJobUrl = `https://gateway.bdjobs.com/jobposting/job-information?JobNo=${this.jobInformation?.jobId}&vtype=edit&rtype=d&p=1`;
      } else {
        editJobUrl = `https://gateway.bdjobs.com/jobposting/job-information?JobNo=${this.jobInformation?.jobId}&vtype=edit&rtype=d`;
      }
     }
    window.location.href = editJobUrl;
  }

  openReadyToProcessConfirmationDialog() {
    this.confirmationDialogService.confirm('Attention!', 'Do you want to Process this job?')
    .then((confirmed) => {
        if (confirmed) {
          this.readyToProcess();
        } else {
            console.log('User did not confirm');
        }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  
  readyToProcess(): void {
    this.jobInformationService.draftedJobReadyToProcess(this.jobInformation?.jobId).subscribe((data: any) => {
      if(data.message && data.message == 'success'){
        this.draftedJobReadyToProcess.emit(this.jobInformation?.jobId);
      }
      else{
        console.log('Ready to process error.');
      }
    });
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
          if (data == 1 && this.jobInformation) {
            this.jobInformationService
              .changeMongoJobDeadline_v2(this.jobInformation.jobId, date)
              .subscribe();
          } else {
            alert(data);
          }
        });
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
    }else if (
      this.jobInformation?.serviceType?.toLocaleLowerCase()?.includes('internship announcement')
    ) {
      dateToAdd = 14;
    } else {
      dateToAdd = 29;
    }

    const baseDate = new Date();

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

}
