export interface CvDetails {
  _id: string;
  CreatedBy: number;
  CreatedOn: Date;
  UpdatedOn: Date;
  UpdatedBy: number;
  UpdatedOnSQL: Date;
  Versioning: null;
  ApplicantId: number;
  Name: Name;
  Address: Address[];
  Mobiles: Mobile[];
  Emails: Email[];
  FatherName: string;
  MotherName: string;
  DateOfBirth: Date;
  BirthPlace: string;
  Gender: CommonEnumObject;
  GlobalView: boolean;
  Attachment: Attachment;
  MaritalStatus: CommonEnumObject;
  Nationality: string;
  NationalIdentificationNumber: string;
  Religion: CommonEnumObject;
  BloodGroup: CommonEnumObject;
  CareerObjective: string;
  CareerSummary: string;
  SpecialQualification: string;
  TotalExperience: number;
  LookingForJobLevel: LookingForJobLevel;
  AvailableForJobNature: AvailableForJobNature;
  PresentSalary: number;
  ExpectedSalary: number;
  PreferredJobCategory: PreferredJobCategory[];
  PreferredDistrict: CommonEnumObject[];
  PreferredCountry: CommonEnumObject[];
  PreferredOrganizationTypes: PreferredOrganizationType[];
  ExtraCurricularActivities: string;
  Height: number;
  Weight: number;
  PassportIssueDate: Date;
  PassportNo: string;
  KeyWords: string;
  Disability: Disability;
  ExperiencesInformations: ExperiencesInformation[];
  AcademicQualifications: AcademicQualification[];
  SkillInformations: SkillInformation[];
  Trainings: Training[];
  ProfessionalQualifications: ProfessionalQualification[];
  LanguageProficiencies: LanguageProficiency[];
  References: Reference[];
  LinkAccounts: LinkAccount[];
  Accomplishments: Accomplishment[];
  SkillDescriptionDetails: string;
  PhotoUrl: string;
  ExperienceInformationsForRetiredArmy: ExperienceInformationsForRetiredArmy;
  ResumePrivacyPolicy: boolean;
}
export interface LookingForJobLevel {
  _id: string;
  Name: string;
}
export interface AvailableForJobNature {
  _id: string;
  Name: string;
}
export interface AcademicQualification {
  _id: string;
  EducationId: number;
  DegreeLevel: CommonEnumObject;
  DegreeName: string;
  EducationBoard: CommonEnumObject;
  Concentration: Concentration;
  Institute: string;
  IsForeignInstitute: boolean;
  CountryName: CommonEnumObject;
  Result: Result;
  PassingYear: number;
  Achievement: string;
  Duration: number;
  ShowInSummery: boolean;
}

export interface Concentration {
  ConcentrationName: string;
}

export interface CommonEnumObject {
  _id: number;
  Name: string;
}

export interface Result {
  ResultType: number;
  MarkOrCGPA: number;
  Scale: number;
}

export interface Address {
  AddressType: number;
  Country: CountryClass | null;
  District: District | null;
  Thana: Thana | null;
  PostOffice: PostOffice | null;
  IsOutsideInBangaldesh: boolean;
  Location: null | string;
  FullAddress: string;
}

export interface PostOffice {
  PostOfficeId: number;
  PostOfficeName: string;
}

export interface Thana {
  ThanaId: number;
  ThanaName: string;
}

export interface CountryClass {
  CountryId: number;
  CountryName: CountryEnum;
}

export enum CountryEnum {
  Bangladesh = 'Bangladesh',
  India = 'India',
  SANFranciscoCaliforniaUS = 'San Francisco California U.S.',
}

export interface District {
  DistrictId: number;
  DistrictName: string;
}

export interface Attachment {
  IsPersonalizedProfile: boolean;
  IsVideoProfile: boolean;
  PersonalizedProfileFileType: string;
}

export interface Email {
  EmailType: number;
  EmailAddress: string;
}

export interface ExperiencesInformation {
  _id: string;
  EmploymentId: number;
  CompanyName: string;
  Designation: string;
  Department: string;
  CompanyBusiness: CompanyBusiness;
  EmploymentPeriod: EmploymentPeriod;
  AreaOfExpertise: AreaOfExpertise[];
  Responsibilities: string;
  Location: string;
}

export interface AreaOfExpertise {
  ExpertiseName: Skills;
  Duration: number;
}

export interface Skills {
  SkillId: number;
  SkillName: string;
}

export interface CompanyBusiness {
  OrganizationTypeId: number;
  OrganizationTypeName: string;
}

export interface EmploymentPeriod {
  StartDate: Date;
  EndDate: Date;
  IsContinue: boolean;
}

export interface LinkAccount {
  _id: string;
  LinkId: number;
  Account: string;
  URL: string;
}

export interface Mobile {
  MobileNoType: number;
  MobileNo: string;
}

export interface Name {
  FullName: string;
  FirstName: string;
  LastName: string;
}

export interface PreferredJobCategory {
  _id: number;
  PreferredJobCategoryName: string;
}

export interface Reference {
  _id: string;
  ReferenceId: number;
  Name: string;
  Organization: string;
  Designation: string;
  Address: string;
  OfficePhone: string;
  ResidentPhone: string;
  PrimaryPhone: string;
  Email: string;
  Relations: string;
}

export interface SkillInformation {
  _id: string;
  Skills: Skills;
  SkillBy: SkillBy[];
  NTVQFDetails: CommonEnumObject;
}

export interface SkillBy {
  _id: number;
  name: string;
}

export interface Training {
  _id: string;
  TrainingId: number;
  TrainingName: string;
  TrainingDetails: string;
  Institute: string;
  Country: CountryEnum;
  Location: string;
  TrainingYear: number;
  Duration: string;
  BdjobdsTainingId: number;
  BdjobsTrainingType: string;
}

export interface LanguageProficiency {
  _id: string;
  LanguageId: number;
  LanguageName: string;
  ReadingSkill: string;
  WritingSkill: string;
  SpeakingSkill: string;
}

export interface Disability {
  NationalDisabilityId: boolean;
  ShowResume: boolean;
  DisabilityId: string;
  DisabilitySee: string;
  DisabilityHear: string;
  DisabilityRemember: string;
  DisabilitySit: string;
  DisabilityComm: string;
  DisabilityTC: string;
}

export interface ExperienceInformationsForRetiredArmy {
  BaTypeName: string;
  BaNoValue: string;
  TypeName: string;
  RanksName: string;
  ArmsName: string;
  TradeValue: string;
  CourseValue: string;
  DateOfCommissionDay: Date;
  DateOfRetirementDay: Date;
}

export interface ProfessionalQualification {
  _id: string;
  ProfessionalId: number;
  CertificationName: string;
  Institute: string;
  Location: string;
  StartDate: string;
  CompletionDate: string;
}

export interface PreferredOrganizationType {
  OrganizationTypeId: number;
  OrganizationTypeName: string;
}

export interface Accomplishment {
  _id: string;
  AccomplishmentId: number;
  AccomplishmentType: string;
  AccomplishmentTitle: string;
  SubmittedOn: string;
  Url: string;
  Description: string;
}
