import { AreaOfExpertise, CompanyBusiness, EmploymentPeriod } from "./response/cv-details";

export interface ExperienceInformationWithTotal {
    _id:              string;
    EmploymentId:     number;
    CompanyName:      string;
    Designation:      string;
    Department:       string;
    CompanyBusiness:  CompanyBusiness;
    EmploymentPeriod: EmploymentPeriod;
    AreaOfExpertise:  AreaOfExpertise[];
    Responsibilities: string;
    Location:         string;
    IndividualTotalExperience:  string;
}