import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import {
  AcademicQualification,
  CommonEnumObject,
  CvDetails,
  ExperiencesInformation,
  PreferredOrganizationType,
} from '../../models/Cv-Details/response/cv-details';
import { CvViewUrlParams } from '../../models/Cv-Details/CvViewUrlParams';
import { ExperienceInformationWithTotal } from '../../models/Cv-Details/ExperienceInformationWithTotal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicantJobStatus } from '../../models/Cv-Details/response/CheckValidityResponse';
import { ActionDataResponseModel, ApplicantData } from '../../models/Cv-Details/response/cvActionData';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private videoCvUrl = 'https://corporate3.bdjobs.com/VideoResume_Watch-RV_mongo_api.asp';
  //For Sharing CvDetails Data
  private cvDetailsSubject = new BehaviorSubject<CvDetails | undefined>(
    undefined
  );
  public cvDetails$ = this.cvDetailsSubject.asObservable();

  private urlParams = new BehaviorSubject<CvViewUrlParams | undefined>(
    undefined
  );
  public urlParams$ = this.urlParams.asObservable();

  //For Sharing ExperiencesInformation Data
  private experiencesInformation = new BehaviorSubject<
    ExperiencesInformation[] | undefined
  >(undefined);
  public experiencesInformation$ = this.experiencesInformation.asObservable();

  //For Sharing ExperiencesInformation Data
  private experiencesInformationWithTotal = new BehaviorSubject<
    ExperienceInformationWithTotal[] | undefined
  >(undefined);
  public experiencesInformationWithTotal$ =
    this.experiencesInformationWithTotal.asObservable();

  // For Generating Pdf
  private htmlContentSource = new BehaviorSubject<HTMLElement | null>(null);
  htmlContent$ = this.htmlContentSource.asObservable();

  //For Generating Pdf
  private jobTitleContentSource = new BehaviorSubject<string | null>(null);
  jobTitle$ = this.jobTitleContentSource.asObservable();

  private userDataContentSource = new BehaviorSubject<any | null>(null);
  userData$ = this.userDataContentSource.asObservable();
  //For Generating Pdf
  private totalExperience = new BehaviorSubject<string | null>(null);
  totalExperience$ = this.totalExperience.asObservable();

  private isPnpl = new BehaviorSubject<boolean>(false);
  isPnpl$ = this.isPnpl.asObservable();

  private cvActionData = new BehaviorSubject<ActionDataResponseModel | null>(null);
  cvActionData$ = this.cvActionData.asObservable();

  setCVActionData(cvActionData: ActionDataResponseModel): void {
    this.cvActionData.next(cvActionData);
  }

  constructor(private httpClient: HttpClient) { }

  setCvDetailsToSharedService(cvDetails: CvDetails): void {
    this.cvDetailsSubject.next(cvDetails);
  }

  getCvDetailsFromSharedService(): CvDetails | undefined {
    return this.cvDetailsSubject.value;
  }

  setUrlParamsToSharedService(urlParams: CvViewUrlParams): void {
    this.urlParams.next(urlParams);
  }

  getUrlParamsFromSharedService(): CvViewUrlParams | undefined {
    return this.urlParams.value;
  }

  setExperienceInformationToSharedService(
    experiencesInformation: ExperiencesInformation[]
  ): void {
    this.experiencesInformation.next(experiencesInformation);
  }

  getExperienceInformationFromSharedService():
    | ExperiencesInformation[]
    | undefined {
    return this.experiencesInformation.value;
  }

  setExperienceInformationWTotalToSharedService(
    experiencesInformation: ExperienceInformationWithTotal[]
  ): void {
    this.experiencesInformationWithTotal.next(experiencesInformation);
  }

  getExperienceInformationWTotalFromSharedService():
    | ExperienceInformationWithTotal[]
    | undefined {
    return this.experiencesInformationWithTotal.value;
  }

  setJobTitleToSharedService(jobTitle: string | null): void {
    this.jobTitleContentSource.next(jobTitle);
  }

  getJobTitleFromSharedService(): string | null {
    return this.jobTitleContentSource.value;
  }
  setUserDataSharedService(userData: any): void {
    this.userDataContentSource.next(userData);
  }

  getUserDataSharedService(): any | null {
    return this.userDataContentSource.value;
  }

  setHtmlContentForSharing(htmlContent: HTMLElement | null): void {
    this.htmlContentSource.next(htmlContent);
  }

  getHtmlContentFromSharing(): HTMLElement | null {
    return this.htmlContentSource.getValue();
  }

  setTotalExperienceToSharedService(totalExperience: string | null): void {
    this.totalExperience.next(totalExperience);
  }

  setIsPnplToSharedService(value: boolean): void {
    this.isPnpl.next(value);
  }

  getTotalExperienceFromSharedService(): string | null {
    return this.totalExperience.value;
  }

  pushNotification(body: any) {
    return this.httpClient.post<any>(
      'https://testmongo.bdjobs.com/JobSeekerProfile/api/PersonalDetails/CvView',
      body,
      {
        withCredentials: true,
      }
    );
  }
  classDivision = [13, 14, 15];
  getGradeDescription(academicQualification: AcademicQualification): string {
    if (this.classDivision.includes(academicQualification.Result.ResultType)) {
      if (academicQualification.DegreeLevel._id > 4) {
        return academicQualification.Result.MarkOrCGPA > 0
          ? this.getGradeEnumValue(academicQualification.Result.ResultType) +
          ' Division,' +
          ' Marks: ' +
          academicQualification.Result.MarkOrCGPA +
          '%'
          : this.getGradeEnumValue(academicQualification.Result.ResultType) +
          ' Division';
      } else {
        return academicQualification.Result.MarkOrCGPA > 0
          ? this.getGradeEnumValue(academicQualification.Result.ResultType) +
          ' Class,' +
          ' Marks: ' +
          academicQualification.Result.MarkOrCGPA +
          '%'
          : this.getGradeEnumValue(academicQualification.Result.ResultType) +
          ' Class';
      }
    } else if (
      this.getGradeEnumValue(academicQualification.Result.ResultType) ===
      'Grade'
    ) {
      return academicQualification.Result.MarkOrCGPA > 0
        ? 'CGPA :' +
        academicQualification.Result.MarkOrCGPA +
        ' (out of ' +
        academicQualification.Result.Scale +
        ')'
        : '-';
    } else {
      return this.getGradeEnumValue(academicQualification.Result.ResultType);
    }
  }
  getGradeEnumValue(value: number): string {
    switch (value) {
      case GradeDescription.None:
        return '-';
      case GradeDescription.First:
        return 'First';
      case GradeDescription.Second:
        return 'Second';
      case GradeDescription.Third:
        return 'Third';
      case GradeDescription.Grade:
        return 'Grade';
      case GradeDescription.Appeared:
        return 'Appeared';
      case GradeDescription.Enrolled:
        return 'Enrolled';
      case GradeDescription.Awarded:
        return 'Awarded';
      case GradeDescription.DoNotMention:
        return '-';
      case GradeDescription.Pass:
        return 'Pass';
      default:
        return 'Unknown';
    }
  }
  private applicantJobStatus = new BehaviorSubject<ApplicantJobStatus | null>(
    null
  );
  public applicantJobStatus$ = this.applicantJobStatus.asObservable();

  setApplicantJobStatus(value: ApplicantJobStatus): void {
    this.applicantJobStatus.next(value);
  }
  getApplicantJobStatus(): ApplicantJobStatus | null {
    return this.applicantJobStatus.value ?? null;
  }
  compareByPassingYear(
    a: AcademicQualification,
    b: AcademicQualification
  ): number {
    return a.PassingYear - b.PassingYear;
  }

  calculateExperience(
    startingDate: Date,
    endingDate: Date,
    IsContinue?: boolean
  ): string {
    let totalExperienceMonths = 0;
    const startDate = new Date(startingDate);
    let endDate = new Date(endingDate);
    if (IsContinue) {
      endDate = new Date(); // Consider today's date as end date
    }
    if (startDate <= endDate) {
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth();
      let months = (endYear - startYear) * 12 + (endMonth - startMonth);
      if (endDate.getDate() < startDate.getDate()) {
        months--;
      }
      totalExperienceMonths += months;
    }
    const years = totalExperienceMonths / 12;
    const roundedYears = Math.ceil(years * 10) / 10;
    return roundedYears.toFixed(1).toString();
  }

  isDefaultDate(date: any): Date {
    const givenDate = date;
    var passportIssueDate;

    if (givenDate != null) {
      const defaultDate = '0001-01-01T00:00:00Z';

      if (givenDate.toString() !== defaultDate.toString()) {
        passportIssueDate = givenDate;
      } else {
        passportIssueDate = null;
      }
    }
    return passportIssueDate;
  }

  removeBrTags(input: string): string {
    return input.replace(/<br\s*\/?>/gi, '');
  }
  splitByBrTags(input: string): string[] {
    // Split the input string by <br> or <BR> tags and return the resulting array
    return input.split(/<br\s*\/?>/gi);
  }
  convertToTitleCase(str: string) {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  convertToYearsMonths(value: string) {
    let digits = value.split('.');
    let years = parseInt(digits[0]);
    let months = parseInt(digits[1]) || 0; // If no decimal part, default to 0 months
    return years + ' years ' + months + ' months';
  }

  downloadAttachedCV(
    hidAppViewInfo: string,
    hidAppName: string,
    hidAppCVFormate: string
  ): Observable<any> {
    const url =
      'https://corporate3.bdjobs.com/AttachedCVDownload-api.asp?domain=gateway';
    const body = `hidAppViewInfo=${hidAppViewInfo}&hidAppName=${encodeURIComponent(
      hidAppName
    )}&hidAppCVFormate=${hidAppCVFormate}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.httpClient.post(url, body, {
      headers: headers,
      withCredentials: true,
    });
  }

  getVideoResumeData(id: string, jid: string, jobtitle: string, expsal: string, api: string, rw: string, pgtype: string, viewType: string, viewTypeStatus: string, purchasedCV: string, blueCollarCV: string, lcToolShow: boolean, appID: string, revamp: string): Observable<any> {
    const params = {
      Idn: id,
      jid: jid,
      jobtitle: jobtitle,
      expsal: expsal,
      api: api,
      rw: rw,
      pgtype: pgtype,
      viewType: viewType,
      viewTypeStatus: viewTypeStatus,
      purchasedCV: purchasedCV,
      blueCollarCV: blueCollarCV,
      LcToolShow: lcToolShow,
      appID: appID,
      revamp: revamp
    };

    return this.httpClient.get(this.videoCvUrl, { params });
  }
  sortCountriesByName(countries: CommonEnumObject[]): CommonEnumObject[] {
    return countries.sort((a, b) => {
      const nameA = a.Name.toUpperCase();
      const nameB = b.Name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  sortOrganizationByName(countries: PreferredOrganizationType[]): PreferredOrganizationType[] {
    return countries.sort((a, b) => {
      const nameA = a.OrganizationTypeName.toUpperCase();
      const nameB = b.OrganizationTypeName.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  
}


enum GradeDescription {
  None = -1,
  First = 15,
  Second = 14,
  Third = 13,
  Grade = 11,
  Appeared = 12,
  Enrolled = 10,
  Awarded = 9,
  DoNotMention = 0,
  Pass = 8,
}
