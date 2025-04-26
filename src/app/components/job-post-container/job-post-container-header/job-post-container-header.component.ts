import {
  Component,
  ElementRef,
  Input,
  Output,
  OnInit,
  Renderer2,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import {
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { JobInformationService } from '../../../services/job-information.service';
import { JobSearchDto } from '../../../models/JobSearchDto';
import { LoginService } from '../../../services/login.service';
import { GlobalDataSharingService } from '../../../services/shared/global-data-sharing.service';

const now = new Date();
const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one &&
  two &&
  two.year === one.year &&
  two.month === one.month &&
  two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two
    ? false
    : one.year === two.year
    ? one.month === two.month
      ? one.day === two.day
        ? false
        : one.day < two.day
      : one.month < two.month
    : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two
    ? false
    : one.year === two.year
    ? one.month === two.month
      ? one.day === two.day
        ? false
        : one.day > two.day
      : one.month > two.month
    : one.year > two.year;

@Component({
  selector: 'app-job-post-container-header',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDatepickerModule],
  templateUrl: './job-post-container-header.component.html',
  styleUrl: './job-post-container-header.component.scss',
})
export class JobPostContainerHeaderComponent implements OnInit {
  startDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  minDate: NgbDateStruct;
  hoveredDate: NgbDateStruct | null = null;
  fromDate: any;
  toDate: any;
  model: any;
  jobTitle: string = '';

  @Input() totalJobCount: number = 0;
  @Input() draftedJobCount: number = 0;
  @Input() postedCount: number = 0;
  @Input() publishedCount: number = 0;
  @Input() jobTypeToView: string = 'all';

  @Output() loadJobDataEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() clearSearch = new EventEmitter<void>();

  activeTab: string = 'published';

  @ViewChild('d') input?: NgbInputDatepicker;
  @ViewChild(NgModel) datePick?: NgModel;
  @ViewChild('myRangeInput') myRangeInput?: ElementRef;

  isHovered = (date: any) =>
    this.fromDate &&
    !this.toDate &&
    this.hoveredDate &&
    after(date, this.fromDate) &&
    before(date, this.hoveredDate);

  isInside = (date: any) =>
    after(date, this.fromDate) && before(date, this.toDate);
  isFrom = (date: any) => equals(date, this.fromDate);
  isTo = (date: any) => equals(date, this.toDate);

  public jobFairJobCount = 0;

  constructor(
    element: ElementRef,
    private renderer: Renderer2,
    private _parserFormatter: NgbDateParserFormatter,
    private jobInformationService: JobInformationService,
    private loginService: LoginService,
    private sharedService: GlobalDataSharingService
  ) {
    this.startDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
    this.maxDate = {
      year: now.getFullYear() + 1,
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
    this.minDate = {
      year: now.getFullYear() - 1,
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  }

  ngOnInit(): void {
    this.startDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
    this.maxDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
    this.minDate = {
      year: now.getFullYear() - 24,
      month: now.getMonth() + 1,
      day: now.getDate(),
    };

    const stringCount =
      window.localStorage.getItem(
        this.loginService.LOCAL_STORAGE_KEYS.Job_Fair_Job_Count
      ) ?? '';

    this.jobFairJobCount = parseInt(stringCount);

  }

  onDateSelection(date: NgbDateStruct) {
    let parsed = '';
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
      this.input?.close();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate) {
      parsed += `${this.padZero(this.fromDate.month)}/${this.padZero(
        this.fromDate.day
      )}/${this.fromDate.year}`;
    }
    if (this.toDate) {
      parsed += ' - ';
      parsed += `${this.padZero(this.toDate.month)}/${this.padZero(
        this.toDate.day
      )}/${this.toDate.year}`;
    }

    this.renderer.setProperty(
      this.myRangeInput?.nativeElement,
      'value',
      parsed
    );
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  updateJobSearchDto() {
    let jobSearchCriteria: JobSearchDto = {};

    if (this.jobTitle) {
      jobSearchCriteria.title = this.jobTitle.trim();
    }

    if (this.fromDate) {
      jobSearchCriteria.jobPostingStartDate = new Date(
        this.fromDate.year,
        this.fromDate.month - 1,
        this.fromDate.day
      );
    }

    if (this.toDate) {
      jobSearchCriteria.jobPostingEndDate = new Date(
        this.toDate.year,
        this.toDate.month - 1,
        this.toDate.day
      );
    }

    jobSearchCriteria.reloadResults = true;

    this.jobInformationService.jobSearchCriteria.next(jobSearchCriteria);

    this.jobInformationService.getJobPosts(this.jobTypeToView);
  }

  onDatePickerInputKeyUp() {
    if (!this.model) {
      this.fromDate = undefined;
      this.toDate = undefined;
      this.updateJobSearchDto();
    }
  }

  clearDateRange() {
    this.model = null;
    this.fromDate = undefined;
    this.toDate = undefined;
    this.clearSearch.emit();
    this.updateJobSearchDto();
  }

  clearJobTitle() {
    this.jobTitle = '';
    this.clearSearch.emit();
    this.updateJobSearchDto();
  }

  setActiveTab(tab: string, event: Event): void {
    // this.loginService.getUserLoginData().subscribe((userData: any) => {
    //   if (userData && !userData.notLoggedIn) {
    //     this.loginService.setLegacyApiDataToLocalStoarge(userData);
    //   }
    // });
    event.preventDefault(); // Prevent LoadIng Whole Page
    this.activeTab = tab;
    this.loadJobData(tab);
  }

  loadJobData(jobType: string) {
    this.loadJobDataEvent.emit(jobType);
  }

  onDateRangePaste(event: ClipboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
