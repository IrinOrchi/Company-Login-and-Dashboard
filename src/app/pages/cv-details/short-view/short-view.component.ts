import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AcademicQualification,
  CvDetails,
  ExperiencesInformation,
} from '../../../models/Cv-Details/response/cv-details';
import { SharedDataService } from '../../../services/cv-details/shared-data.service';
import { PdfGenerateService } from '../../../services/shared/pdf-generate.service';
import { CvDetailsComponent } from '../cv-details.component';
import { ExperienceInformationWithTotal } from '../../../models/Cv-Details/ExperienceInformationWithTotal';

@Component({
  selector: 'app-short-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './short-view.component.html',
  styleUrl: './short-view.component.scss',
})
export class ShortViewComponent {
  cvDetails?: CvDetails | undefined;
  experiencesInformationE?: ExperienceInformationWithTotal[];
  experiencesInformation?: ExperiencesInformation[];
  // firstTwoExperiencesInformation?: ExperiencesInformation[];
  firstTwoExperiencesInformation?: ExperienceInformationWithTotal[];
  lastTwoTrainingSummary: any;
  firstTwoEducation?: AcademicQualification[];
  jobTitle?: string = '';
  presentFullAddress?: string = '';
  permanentFullAddress?: string = '';
  calculatedTotalExperience?: string;
  PhotoUrl?: string;
  academicQualifiacationSorted: AcademicQualification[] | undefined;
  passportIssueDate?: Date;

  linkedInAccount?: string = '';
  githubAccount?: string = '';
  facebookAccount?: string = '';
  dribbbleaccount?: string = '';
  youtubeAccount?: string = '';
  otherAccount?: string = '';
  isLockedForPnpl: boolean = false;

  @ViewChild('short_view_main_div') short_view_main_div_content?: ElementRef;
  isExprienceHas?: boolean;

  constructor(
    private pdfGenerateService: PdfGenerateService,
    public sharedDataService: SharedDataService
  ) {}

  ngAfterViewInit(): void {
    if (this.short_view_main_div_content) {
      const htmlContent = this.short_view_main_div_content.nativeElement;
      this.sharedDataService.setHtmlContentForSharing(htmlContent);
    }
  }

  ngOnInit(): void {
    this.sharedDataService.experiencesInformationWithTotal$.subscribe(
      (experiencesInformation) => {
        this.experiencesInformationE = experiencesInformation;
      }
    );
    this.sharedDataService.cvDetails$.subscribe((cvDetails) => {
      // console.log(cvDetails, 'this.cvDetails');

      this.cvDetails = cvDetails;
      this.setLinkedAccounts();
      if (cvDetails) {
        this.presentFullAddress = cvDetails.Address[0].FullAddress;
        this.permanentFullAddress = cvDetails.Address[1].FullAddress;

        if(cvDetails?.PhotoUrl != null && cvDetails?.PhotoUrl != ''){ 
          this.pdfGenerateService
          .getImage(cvDetails.PhotoUrl)
          .subscribe((blobUrl) => {
            this.PhotoUrl = blobUrl;
          });
        }

        // console.log(this.presentFullAddress+'presentAddress')
        if (cvDetails?.AcademicQualifications) {
          this.academicQualifiacationSorted = [
            ...cvDetails.AcademicQualifications,
          ];
          this.academicQualifiacationSorted.sort(
            (a, b) => b.PassingYear - a.PassingYear
          );
          // console.log(this.academicQualifiacationSorted);
        }
        if (cvDetails.ExperiencesInformations &&cvDetails?.ExperiencesInformations.length > 0) {
          this.isExprienceHas = true
        }

        this.passportIssueDate = this.sharedDataService.isDefaultDate(cvDetails?.PassportIssueDate)

      }
    });

    this.sharedDataService.jobTitle$.subscribe((jobTitle) => {
      this.jobTitle = jobTitle ?? '';
    });
    this.sharedDataService.experiencesInformation$.subscribe(
      (experiencesInformation) => {
        this.experiencesInformation = experiencesInformation;
      }
    );
    this.sharedDataService.totalExperience$.subscribe((totalExperience) => {
      this.calculatedTotalExperience = totalExperience ?? '';
    });
    
    this.DataSlicingForShortView();
    // console.log('fist to edu'+this.firstTwoEducation)

    this.sharedDataService.isPnpl$.subscribe((data) => {
      this.isLockedForPnpl = data;
      console.log("this is pnpl job value "+this.isLockedForPnpl)
    });

  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private setLinkedAccounts(): void {
    const linkedInAccount = this.cvDetails?.LinkAccounts?.find(
      (account) => account.Account.toLowerCase() === 'LinkedIn'.toLowerCase()
    );
    if (linkedInAccount) {
      this.linkedInAccount = linkedInAccount.URL;
    }

    const githubAccount = this.cvDetails?.LinkAccounts?.find(
      (account) => account.Account.toLowerCase() === 'GitHub'.toLowerCase()
    );
    if (githubAccount) {
      this.githubAccount = githubAccount.URL;
    }

    const facebookAccount = this.cvDetails?.LinkAccounts?.find(
      (account) => account.Account.toLowerCase() === 'Facebook'.toLowerCase()
    );
    if (facebookAccount) {
      this.facebookAccount = facebookAccount.URL;
    }

    const dribbbleaccount = this.cvDetails?.LinkAccounts?.find(
      (account) => account.Account.toLowerCase() === 'Dribbble'.toLowerCase()
    );
    if (dribbbleaccount) {
      this.dribbbleaccount = dribbbleaccount.URL;
    }

    const youtubeAccount = this.cvDetails?.LinkAccounts?.find(
      (account) => account.Account.toLowerCase() === 'YouTube'.toLowerCase()
    );
    if (youtubeAccount) {
      this.youtubeAccount = youtubeAccount.URL;
    }

    const otherAccount = this.cvDetails?.LinkAccounts?.find(
      (account) => account.Account.toLowerCase() === 'Others'.toLowerCase()
    );
    if (otherAccount) {
      this.otherAccount = otherAccount.URL;
    }
  }

  private DataSlicingForShortView(): void {
    // Assuming experiencesInformation is already populated
    if (this.experiencesInformationE && this.experiencesInformationE.length > 0
    ) {
      // this.firstTwoExperiencesInformation = this.experiencesInformation.slice(
      //   0,
      //   2
      // );
      this.firstTwoExperiencesInformation = this.experiencesInformationE.slice(
        0,
        2
      );
    }

    if (this.cvDetails?.Trainings && this.cvDetails?.Trainings.length >= 2) {
      const lastIndex = this.cvDetails?.Trainings.length - 1;
      const secondLastIndex = lastIndex - 1;

      this.lastTwoTrainingSummary = this.cvDetails?.Trainings.slice(
        secondLastIndex,
        lastIndex + 1
      );
    } else {
      this.lastTwoTrainingSummary = this.cvDetails?.Trainings;
    }

    if (
      this.cvDetails?.AcademicQualifications &&
      this.cvDetails?.AcademicQualifications.length >= 2
    ) {
      const lastIndex = this.cvDetails?.Trainings.length - 1;
      const secondLastIndex = lastIndex - 1;

      this.firstTwoEducation = this.cvDetails?.AcademicQualifications.slice(
        0,
        2
      );
    } else {
      this.firstTwoEducation = this.cvDetails?.AcademicQualifications;
    }
  }
  calculateYear(startDate: Date, endDate: Date): string {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();

    let yearDifference = endYear - startYear;

    if (
      endMonth < startMonth ||
      (endMonth === startMonth && endDate.getDate() < startDate.getDate())
    ) {
      yearDifference--;
    }

    const monthDifference = (endMonth - startMonth + 12) % 12;

    if (monthDifference === 0) {
      return yearDifference.toString();
    } else {
      return `${yearDifference}.${monthDifference}`;
    }
  }
}
