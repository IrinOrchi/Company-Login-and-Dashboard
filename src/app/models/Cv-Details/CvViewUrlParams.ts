export interface CvViewUrlParams {
    jobId?: string;
    applyId?: string;
    applicantId?: string;
    jobTitle?: string;
    Idn?: string;
    expsal?: string;
    api?: string;
    rw?: string;
    pgtype?: string;
    viewType?: string;
    viewTypeStatus?: string;
    shortcv_view?: string;
    revamp?: string;
    purchedCV?: string;
    blueCollar?: string;
    LcToolShow?: boolean;
    
  }
  

   export interface CvDetailsAccessCheck {
      companyId: string;
      idn: string;
      companyName: string;
      isPurchased: boolean;
      verificationStatus: boolean;
      userId: string;
      serviceId: number;
      cvSearchAccess: boolean;
    }