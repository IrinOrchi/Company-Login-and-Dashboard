export interface CheckValidityRequest {
    Data: Data
  }
  
  export interface Data {
    JobId?: string | ""
    ApplyId?: string | ""
    JobType?: string | ""
    idn? : string | ""
    companyId? : string | ""
  }
  