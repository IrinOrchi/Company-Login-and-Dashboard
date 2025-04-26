export interface CheckValidityResponse {
  statusCode: number;
  message: string;
  common: null;
  data: ApplicantJobStatus;
}

export interface ApplicantJobStatus {
  ApplicantId: number;
  IsShortListed: boolean;
  IsRejected: boolean;
}
