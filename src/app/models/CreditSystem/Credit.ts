export interface Credit {
  HaveTokenAccess: boolean;
  ValidityDate: string;
  TotalCredit: number;
  RemainingCredit: number;
  TokenStatus: string;
  TokenSubmitted: boolean;
}

export interface CreditSystemResponse {
  message: string;
  status: number;
  data: {
    CreditSystem: Credit[];
  };
}
