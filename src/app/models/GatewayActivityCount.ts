interface ApplicantProcessData {
  All: number;
  Viewed: number;
  NotViewed: number;
  ShortListed: number;
}

interface SearchResult {
  TotalApplicant: number;
  ApplicantProcessData: ApplicantProcessData[];
}

interface GatewayActivityCount {
  Error: number;
  Message: string;
  searchResult: SearchResult;
}
