import { JobInformation } from "./JobInformation";

export interface JobInformationApiResponse {
  status: number;
  message: string;
  totalJobCount: number;
  draftedJobCount: number;
  postedCount: number;
  publishedCount: number;
  data: JobInformation[];
}
