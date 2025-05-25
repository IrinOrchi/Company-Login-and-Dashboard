import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AcademicQualification,
  CvDetails,
  Disability,
  ExperienceInformationsForRetiredArmy,
  ExperiencesInformation,
  PreferredOrganizationType,
  Reference,
} from '../../../models/Cv-Details/response/cv-details';
import { SharedDataService } from '../../../services/cv-details/shared-data.service';
import { PdfGenerateService } from '../../../services/shared/pdf-generate.service';
import { ExperienceInformationWithTotal } from '../../../models/Cv-Details/ExperienceInformationWithTotal';

@Component({
  selector: 'app-details-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-view.component.html',
  styleUrl: './details-view.component.scss',
})
export class DetailsViewComponent {
  cvDetails?: CvDetails;
  experiencesInformation?: ExperienceInformationWithTotal[];
  militaryInformation?: ExperienceInformationsForRetiredArmy;
  linkedInAccount?: string = '';
  githubAccount?: string = '';
  jobTitle?: string = '';
  presentFullAddress?: string = '';
  permanentFullAddress?: string = '';
  PhotoUrl?: string;
  calculatedTotalExperience?: string;
  preferredOrganization?: PreferredOrganizationType[];
  profileName?: string;
  @ViewChild('details_view_main_div')
  details_view_main_div_content?: ElementRef;
  currentLocation: string | undefined;
  academicQualifiacationSorted: AcademicQualification[] | undefined;
  skillDescriptions: string[] | undefined;
  facebookAccount?: string;
  dribbbleaccount?: string;
  youtubeAccount?: string;
  otherAccount?: string;
  
  myDisability?: Disability[];
  showDisability?: boolean = false;
  expectedSalary?: string = '';
  isLockedForPnpl: boolean = false;
 
  constructor(
    private pdfGenerateService: PdfGenerateService,
    public sharedDataService: SharedDataService
  ) {}
  references: any = [];
  AcademicAchievement: boolean | undefined;
  AcademicDuration?: boolean | undefined;
  ngAfterViewInit(): void {

    if (this.details_view_main_div_content) {
      const htmlContent = this.details_view_main_div_content.nativeElement;
      this.sharedDataService.setHtmlContentForSharing(htmlContent);
    }
  }

  ngOnInit(): void {
    this.sharedDataService.cvDetails$.subscribe((cvDetails) => {
      this.cvDetails = cvDetails;
      this.profileName = this.cvDetails?.Name.FullName.toUpperCase();
      this.setLinkedAccounts();
      if(this.cvDetails?.Disability != null){
        this.searchForDisability();
      }
      
      if (cvDetails) {
        if (cvDetails.SkillDescriptionDetails != null) {
          this.skillDescriptions = this.sharedDataService.splitByBrTags(
            cvDetails.SkillDescriptionDetails
          );
        }
        

        this.references = cvDetails.References;

        if (cvDetails.Address.length>0) {
          this.presentFullAddress = cvDetails.Address[0]?.FullAddress;
          this.permanentFullAddress = cvDetails.Address[1]?.FullAddress;
          if(cvDetails.Address[0].District?.DistrictId != 0){
            this.currentLocation = cvDetails.Address[0].District?.DistrictName;
          }
        }

        if(cvDetails.ExperienceInformationsForRetiredArmy){
          this.militaryInformation = cvDetails.ExperienceInformationsForRetiredArmy
        }


        if (cvDetails.PhotoUrl != null && cvDetails.PhotoUrl != '') {
          this.pdfGenerateService
          .getImage(cvDetails.PhotoUrl)
          .subscribe((blobUrl) => {
            this.PhotoUrl = blobUrl;
          });
        }

        const filteredAcademicQualifications =
          cvDetails.AcademicQualifications?.filter(
            (qualification) => qualification.Achievement !== null
          );
        if (filteredAcademicQualifications?.length > 0) {
          this.AcademicAchievement = true;
        }

        const filteredAcademicDuration =
          cvDetails.AcademicQualifications?.filter(
            (qualification) => qualification.Duration !== null
          );
        if (filteredAcademicDuration?.length > 0) {
          this.AcademicDuration = true;
        }
      }

      if (cvDetails?.AcademicQualifications) {
        this.academicQualifiacationSorted = [
          ...cvDetails.AcademicQualifications,
        ];
        if (this.academicQualifiacationSorted?.length > 1) {
          this.academicQualifiacationSorted.sort(
            (a, b) => b.PassingYear - a.PassingYear
          );
         
        }
        }

    });
    this.sharedDataService.jobTitle$.subscribe((jobTitle) => {
      this.jobTitle = jobTitle ?? '';
      this.setLinkedAccounts();
      
    });
    this.sharedDataService.experiencesInformationWithTotal$.subscribe(
      (experiencesInformation) => {
        this.experiencesInformation = experiencesInformation;
      }
    );
    this.sharedDataService.totalExperience$.subscribe((totalExperience) => {
      this.calculatedTotalExperience = totalExperience ?? '';
    });

    this.sharedDataService.urlParams$.subscribe((data) => {
      const jobId = data?.jobId ?? 0;
      if(jobId != 0){
        this.expectedSalary = data?.expsal ?? '';
      }
      // console.log('expectedSalary '+this.expectedSalary)
    });

    this.sharedDataService.isPnpl$.subscribe((data) => {
      this.isLockedForPnpl = data;
      console.log("this is pnpl job value "+this.isLockedForPnpl)
    });

  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  
  private searchForDisability(): void{
    
    var isDisable = this.cvDetails?.Disability.NationalDisabilityId
    if (isDisable) {
      var showDisability = this.cvDetails?.Disability.ShowResume
    }

    if (showDisability) {
      this.showDisability = true;
    }
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


  breakLineIfNecessary(responsibilities: string): string {
    // Check if responsibilities contain <BR> tag
    if (responsibilities.includes('<BR>')) {
      // Replace <BR> with line breaks
      return responsibilities.replace(/<BR>/gi, '<br>');
    } else {
      return responsibilities;
    }
  }

  convertBloodGroup(enumValue?: string): string {
    switch (enumValue) {
      case 'APositive':
        return 'A +';
      case 'ANegative':
        return 'A -';
      case 'BPositive':
        return 'B +';
      case 'BNegative':
        return 'B -';
      case 'OPositive':
        return 'O +';
      case 'ONegative':
        return 'O -';
      case 'ABPositive':
        return 'AB +';
      case 'ABNegative':
        return 'AB -';
      case 'Null':
        return '';
      default:
        return '';
    }
  }

  convertAccomplishmentType(typeId?: string): string {
    switch (typeId) {
      case '1':
        return 'Portfolio';
      case '2':
        return 'Publication ';
      case '3':
        return 'Award';
      case '4':
        return 'Project';
      case '5':
        return 'Other';
      case 'Null':
        return '';
      default:
        return '';
    }
  }

  formatAreaOfExpertiseDuration(duration: number): string {
    const calculatedDuration = duration / 12;
    const roundedDuration = Math.round(calculatedDuration * 10) / 10;
    const formattedDuration =
      roundedDuration % 1 === 0
        ? roundedDuration.toFixed(0)
        : roundedDuration.toFixed(1);
    if (roundedDuration > 1) {
      return '(' + formattedDuration + ' yrs)';
    } else if (roundedDuration == 0) {
      return '';
    }
    return '(' + formattedDuration + ' yr)';
  }
}
