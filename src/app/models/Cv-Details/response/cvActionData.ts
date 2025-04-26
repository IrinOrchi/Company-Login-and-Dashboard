export interface ApplicantData {
    haveAccess: string;
    companyviewedID: number;
    userViewId: number;
    isPurchased: number;
    wishlistID: number;
    wishlistName: string;
    haveVideoCV: number;
    haveAttachment: string;
    totalRating: number;
    totalUserRated: number;
  }

  export interface CommentDetails {
    viewedId: number;
    commentRating: number;
    commentText: string;
  }
  
  export interface ActionDataResponseModel {
    error: string;
    message: string;
    fortest: number;
    applicantData: ApplicantData;
    commentDetails: CommentDetails[]; 
  }
  

  export interface DownloadCVRequest {
    hidAppName: string;
    hidAppCVFormate: string;
    hidJid: number;
    hidApplIdn: string;
    hidAppId: number;
    
  }