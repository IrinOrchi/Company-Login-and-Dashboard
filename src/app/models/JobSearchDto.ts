export interface JobSearchDto {
  pageNumber?: number;
  pageSize?: number;
  title?: string;
  jobPostingStartDate?: Date;
  jobPostingEndDate?: Date;
  reloadResults?: boolean;
}
